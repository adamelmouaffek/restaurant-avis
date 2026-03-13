import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard/tables
 * List all tables for the restaurant.
 */
export async function GET() {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", session.restaurantId)
    .order("number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

/**
 * POST /api/dashboard/tables
 * Create a new table.
 */
export async function POST(req: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  let body: { number?: string; capacity?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const { number, capacity } = body;

  if (!number || !number.trim()) {
    return NextResponse.json(
      { error: "Le numero de table est requis" },
      { status: 400 }
    );
  }

  // Check if table number already exists for this restaurant
  const { data: existing } = await supabaseAdmin
    .from("restaurant_tables")
    .select("id")
    .eq("restaurant_id", session.restaurantId)
    .eq("number", number.trim())
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Ce numero de table existe deja" },
      { status: 409 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("restaurant_tables")
    .insert({
      restaurant_id: session.restaurantId,
      number: number.trim(),
      capacity: capacity || null,
      is_active: true,
      position_x: 0,
      position_y: 0,
      shape: "square",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
