import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signJWT } from "@/shared/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Chercher le restaurant par email du gerant
    const { data: restaurant, error } = await supabaseAdmin
      .from("restaurants")
      .select("*")
      .eq("owner_email", email)
      .single();

    if (error || !restaurant) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Verifier le mot de passe
    const isValid = await bcrypt.compare(password, restaurant.owner_password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Creer un token JWT signe
    const token = await signJWT(
      { restaurantId: restaurant.id, email: restaurant.owner_email },
      "7d"
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("dashboard_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return NextResponse.json({
      restaurantId: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
