import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// PATCH: Update staff
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.name) updates.name = body.name;
  if (body.role) updates.role = body.role;
  if (body.is_active !== undefined) updates.is_active = body.is_active;
  if (body.pin && /^\d{4}$/.test(body.pin)) {
    updates.pin = await bcrypt.hash(body.pin, 10);
  }

  const { data, error } = await supabaseAdmin
    .from("staff")
    .update(updates)
    .eq("id", id)
    .eq("restaurant_id", session.restaurantId)
    .select("id, name, role, is_active, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Deactivate staff (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("staff")
    .update({ is_active: false })
    .eq("id", id)
    .eq("restaurant_id", session.restaurantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
