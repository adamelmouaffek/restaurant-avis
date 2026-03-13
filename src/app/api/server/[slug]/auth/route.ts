import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/shared/lib/jwt";
import { checkLockout, recordFailedPin, clearLockout } from "@/shared/lib/rate-limit";

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
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  // Check account lockout
  const lockout = checkLockout(restaurant.id);
  if (lockout.locked) {
    const minutes = Math.ceil(lockout.remainingMs / 60000);
    return NextResponse.json(
      { error: `Trop de tentatives. Reessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.` },
      { status: 423 }
    );
  }

  // Get all active staff for this restaurant
  const { data: staffList } = await supabaseAdmin
    .from("staff")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true);

  if (!staffList || staffList.length === 0) {
    return NextResponse.json({ error: "Aucun serveur configure" }, { status: 404 });
  }

  // Check PIN against each staff member
  const matchedStaff = staffList.find((s) => bcrypt.compareSync(pin, s.pin));

  if (!matchedStaff) {
    recordFailedPin(restaurant.id);
    return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
  }

  // Successful login — clear lockout counter
  clearLockout(restaurant.id);

  // Set cookie for server session
  const sessionData = {
    staffId: matchedStaff.id,
    staffName: matchedStaff.name,
    restaurantId: restaurant.id,
    slug,
    role: matchedStaff.role,
  };

  const response = NextResponse.json({
    success: true,
    staff: {
      id: matchedStaff.id,
      name: matchedStaff.name,
      role: matchedStaff.role,
    },
  });

  const token = await signJWT(sessionData, "12h");
  response.cookies.set("server_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours
    path: "/",
  });

  return response;
}
