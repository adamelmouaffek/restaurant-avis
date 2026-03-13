import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET: List all staff
export async function GET() {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("staff")
    .select("id, restaurant_id, name, role, is_active, created_at")
    .eq("restaurant_id", session.restaurantId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST: Create staff member
export async function POST(req: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { name, pin, role } = await req.json();

  if (!name || !pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: "Nom et PIN 4 chiffres requis" }, { status: 400 });
  }

  const hashedPin = await bcrypt.hash(pin, 10);

  const { data, error } = await supabaseAdmin
    .from("staff")
    .insert({
      restaurant_id: session.restaurantId,
      name,
      pin: hashedPin,
      role: role || "waiter",
    })
    .select("id, name, role, is_active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ce PIN est deja utilise" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
