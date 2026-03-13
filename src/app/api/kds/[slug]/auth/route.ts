import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/shared/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { pin } = await req.json();

  if (!pin || pin.length !== 4) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 400 });
  }

  // Get restaurant by slug
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  // Get active staff with kitchen or manager role
  const { data: staffList } = await supabaseAdmin
    .from("staff")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .in("role", ["kitchen", "manager"]);

  if (!staffList || staffList.length === 0) {
    return NextResponse.json(
      { error: "Aucun personnel cuisine configure. Ajoutez un membre avec le role 'cuisine' dans le dashboard." },
      { status: 404 }
    );
  }

  // Check PIN against each staff member
  const matchedStaff = staffList.find((s) => bcrypt.compareSync(pin, s.pin));

  if (!matchedStaff) {
    return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
  }

  const sessionData = {
    staffId: matchedStaff.id,
    staffName: matchedStaff.name,
    restaurantId: restaurant.id,
    slug,
    role: matchedStaff.role,
  };

  const token = await signJWT(sessionData, "24h");

  const response = NextResponse.json({
    success: true,
    staff: {
      id: matchedStaff.id,
      name: matchedStaff.name,
      role: matchedStaff.role,
    },
  });

  response.cookies.set("kds_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return response;
}
