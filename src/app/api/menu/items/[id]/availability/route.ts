import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/menu/items/[id]/availability
 *
 * Lightweight endpoint to toggle is_available on a menu item.
 * Used by the Quick 86 toggle in the MenuManager.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json(
      { error: "Non autorise" },
      { status: 401 }
    );
  }

  const { id } = params;

  let body: { is_available?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  if (typeof body.is_available !== "boolean") {
    return NextResponse.json(
      { error: "is_available (boolean) est requis" },
      { status: 400 }
    );
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  if (existing.restaurant_id !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update({ is_available: body.is_available })
    .eq("id", id)
    .select("id, is_available")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
