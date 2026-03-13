import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/dashboard/tables/[id]
 * Update a table (number, capacity, is_active).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { id } = params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("restaurant_tables")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Table introuvable" }, { status: 404 });
  }

  if (existing.restaurant_id !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.number === "string" && body.number.trim()) {
    updates.number = body.number.trim();
  }
  if (typeof body.capacity === "number" && body.capacity >= 1) {
    updates.capacity = body.capacity;
  }
  if (typeof body.is_active === "boolean") {
    updates.is_active = body.is_active;
  }
  // Staff assignment (nullable — null means unassigned)
  if (body.assigned_staff_id !== undefined) {
    updates.assigned_staff_id = body.assigned_staff_id || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Aucun champ a mettre a jour" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("restaurant_tables")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/dashboard/tables/[id]
 * Soft delete a table (set is_active = false).
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { id } = params;

  // Verify ownership
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("restaurant_tables")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Table introuvable" }, { status: 404 });
  }

  if (existing.restaurant_id !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("restaurant_tables")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
