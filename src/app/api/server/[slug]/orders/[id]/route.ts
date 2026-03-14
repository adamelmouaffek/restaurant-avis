import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getServerSession } from "@/shared/lib/server-auth";
import { validateTransition, type OrderStatusValue } from "@/shared/lib/order-rules";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/server/[slug]/orders/[id]
 *
 * Server/waiter route protected by signed JWT session cookie.
 * Role: "server" — can serve, handle payment, request modifications, cancel.
 * CANNOT start preparation (that's the kitchen's job).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Get current order
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};

  // Status change — validated with role-based permissions
  if (body.status) {
    const error = validateTransition(
      order.status as OrderStatusValue,
      body.status as OrderStatusValue,
      "server"
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    updates.status = body.status;
  }

  // Priority
  if (body.priority && ["normal", "rush", "vip"].includes(body.priority)) {
    updates.priority = body.priority;
  }

  // Discount
  if (body.discount_amount !== undefined) {
    updates.discount_amount = body.discount_amount;
    updates.discount_reason = body.discount_reason || null;
  }

  // Table transfer — check for conflicts
  if (body.table_number && body.table_number !== order.table_number) {
    const { count } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", order.restaurant_id)
      .eq("table_number", body.table_number)
      .in("status", ["pending", "confirmed", "preparing", "ready"]);

    if ((count ?? 0) > 0 && !body.force_transfer) {
      return NextResponse.json(
        { error: `La table ${body.table_number} a deja des commandes actives. Envoyez force_transfer: true pour confirmer.` },
        { status: 409 }
      );
    }

    updates.table_number = body.table_number;
    if (body.table_session_id) {
      updates.table_session_id = body.table_session_id;
    }
  }

  // Mark as paid — use status transition instead of boolean
  if (body.paid !== undefined) {
    updates.paid = body.paid;
    if (body.payment_method) {
      updates.payment_method = body.payment_method;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
