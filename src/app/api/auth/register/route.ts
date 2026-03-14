import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signJWT } from "@/shared/lib/jwt";
import { rateLimit } from "@/shared/lib/rate-limit";
import { getClientIp } from "@/shared/lib/get-client-ip";
import { sanitizeString, EMAIL_REGEX, MIN_PASSWORD_LENGTH } from "@/shared/lib/validation";
import { getLabels, getDemoMenuItems, getDemoPrizes } from "@/shared/lib/labels";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const rl = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Reessayez dans une heure." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { name, email, password, confirmPassword, tableCount, firstServer, establishmentType, seedDemoData, googleMapsUrl } = body;

    // Validate establishment type
    const VALID_TYPES = ["restaurant", "hotel", "cafe", "bar"];
    const validType = VALID_TYPES.includes(establishmentType) ? establishmentType : "restaurant";

    // Validate Google Maps URL (optional)
    let cleanGoogleMapsUrl: string | null = null;
    if (googleMapsUrl && typeof googleMapsUrl === "string") {
      const trimmed = googleMapsUrl.trim();
      if (trimmed && (trimmed.startsWith("https://") || trimmed.startsWith("http://"))) {
        cleanGoogleMapsUrl = trimmed.slice(0, 500);
      }
    }

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validate name
    const cleanName = sanitizeString(name, 100);
    if (cleanName.length < 2) {
      return NextResponse.json(
        { error: "Le nom du restaurant doit faire au moins 2 caracteres" },
        { status: 400 }
      );
    }

    // Validate email
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caracteres` },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const { data: existing } = await supabaseAdmin
      .from("restaurants")
      .select("id")
      .eq("owner_email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe deja avec cet email" },
        { status: 409 }
      );
    }

    // Generate unique slug
    let slug = slugify(cleanName);
    if (!slug) slug = "restaurant";

    const { data: slugExists } = await supabaseAdmin
      .from("restaurants")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (slugExists) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert restaurant
    const { data: restaurant, error: insertError } = await supabaseAdmin
      .from("restaurants")
      .insert({
        name: cleanName,
        slug,
        owner_email: email.toLowerCase().trim(),
        owner_password_hash: passwordHash,
        establishment_type: validType,
        google_maps_url: cleanGoogleMapsUrl,
      })
      .select("id, name, slug, owner_email")
      .single();

    if (insertError || !restaurant) {
      return NextResponse.json(
        { error: "Erreur lors de la creation du restaurant" },
        { status: 500 }
      );
    }

    // Seed initial data (non-blocking — failures don't affect registration)
    try {
      // Default menu categories based on establishment type
      const typeLabels = getLabels(validType);
      const categoryInserts = typeLabels.defaultCategories.map((catName, i) => ({
        restaurant_id: restaurant.id,
        name: catName,
        sort_order: i,
      }));
      await supabaseAdmin.from("menu_categories").insert(categoryInserts);

      // Dynamic tables based on user input
      const validTableCount = Math.min(Math.max(parseInt(tableCount) || 6, 1), 50);
      const tableInserts = Array.from({ length: validTableCount }, (_, i) => ({
        restaurant_id: restaurant.id,
        number: String(i + 1),
        capacity: i < 4 ? 4 : 2,
      }));
      await supabaseAdmin.from("restaurant_tables").insert(tableInserts);

      // Optional first staff member (waiter)
      if (firstServer?.name && firstServer?.pin && /^\d{4}$/.test(firstServer.pin)) {
        const hashedPin = await bcrypt.hash(firstServer.pin, 10);
        await supabaseAdmin.from("staff").insert({
          restaurant_id: restaurant.id,
          name: sanitizeString(firstServer.name, 50),
          pin: hashedPin,
          role: "waiter",
        });
      }

      // Seed demo data (menu items + prizes) if user opted in
      if (seedDemoData) {
        // Fetch the created categories to get their IDs
        const { data: createdCategories } = await supabaseAdmin
          .from("menu_categories")
          .select("id, sort_order")
          .eq("restaurant_id", restaurant.id)
          .order("sort_order");

        if (createdCategories && createdCategories.length > 0) {
          const demoItems = getDemoMenuItems(validType);
          const menuInserts = demoItems
            .filter((item) => item.categoryIndex < createdCategories.length)
            .map((item, i) => ({
              restaurant_id: restaurant.id,
              category_id: createdCategories[item.categoryIndex].id,
              name: item.name,
              description: item.description,
              price: item.price,
              sort_order: i,
            }));
          if (menuInserts.length > 0) {
            await supabaseAdmin.from("menu_items").insert(menuInserts);
          }
        }

        // Seed demo prizes
        const demoPrizes = getDemoPrizes(validType);
        const prizeInserts = demoPrizes.map((p) => ({
          restaurant_id: restaurant.id,
          name: p.name,
          description: p.description,
          probability: p.probability,
          color: p.color,
          icon: p.icon,
          is_active: true,
        }));
        await supabaseAdmin.from("prizes").insert(prizeInserts);
      }
    } catch {
      // Seed failure is not critical
    }

    // Create JWT + set cookie (same pattern as login)
    const token = await signJWT(
      { restaurantId: restaurant.id, email: restaurant.owner_email },
      "7d"
    );

    const cookieStore = await cookies();
    cookieStore.set("dashboard_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      restaurantId: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
