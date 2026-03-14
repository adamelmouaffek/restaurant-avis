import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getKdsSession } from "@/shared/lib/kds-auth";
import { validateTransition, type OrderStatusValue } from "@/shared/lib/order-rules";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/kds/[slug]/orders/[id]
 *
 * KDS route protected by signed JWT session cookie.
 * Role: "kitchen" — can confirm, prepare, mark ready. CANNOT deliver or handle payment.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  const { slug, id } = params;

  // Auth check
  const session = await getKdsSession();
  if (!session || session.slug !== slug) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  // Resoudre le slug → restaurant
  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  let body: { status?: string; rejection_reason?: string; estimated_prep_minutes?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete JSON invalide" }, { status: 400 });
  }

  const { status: newStatus, rejection_reason, estimated_prep_minutes } = body;

  if (!newStatus) {
    return NextResponse.json({ error: "Le champ status est requis" }, { status: 400 });
  }

  // Recuperer la commande actuelle
  const { data: order, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("id, status, restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Verifier que la commande appartient bien a ce restaurant
  if (order.restaurant_id !== restaurant.id) {
    return NextResponse.json({ error: "Acces non autorise a cette commande" }, { status: 403 });
  }

  // Validate transition with role-based permissions
  const error = validateTransition(
    order.status as OrderStatusValue,
    newStatus as OrderStatusValue,
    "kitchen"
  );

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  // Add rejection reason when rejecting
  if (newStatus === "rejected" && rejection_reason) {
    updatePayload.rejection_reason = rejection_reason;
  }

  // Add estimated prep time if provided
  if (estimated_prep_minutes !== undefined && estimated_prep_minutes !== null) {
    updatePayload.estimated_prep_minutes = estimated_prep_minutes;
  }

  const { data: updatedOrder, error: updateError } = await supabaseAdmin
    .from("orders")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updatedOrder);
}
