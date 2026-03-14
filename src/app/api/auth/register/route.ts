import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signJWT } from "@/shared/lib/jwt";
import { rateLimit } from "@/shared/lib/rate-limit";
import { getClientIp } from "@/shared/lib/get-client-ip";
import { sanitizeString, EMAIL_REGEX, MIN_PASSWORD_LENGTH } from "@/shared/lib/validation";

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
    const { name, email, password, confirmPassword, tableCount, firstServer } = body;

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
      // 3 default menu categories
      await supabaseAdmin.from("menu_categories").insert([
        { restaurant_id: restaurant.id, name: "Entrees", sort_order: 0 },
        { restaurant_id: restaurant.id, name: "Plats", sort_order: 1 },
        { restaurant_id: restaurant.id, name: "Desserts", sort_order: 2 },
      ]);

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
