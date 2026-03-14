import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { validateTransition, type OrderStatusValue } from "@/shared/lib/order-rules";

export const dynamic = "force-dynamic";

/**
 * POST /api/menu/orders/[id]/cancel
 *
 * Public endpoint — allows a client to cancel their own order.
 * Only works if the order is in "pending" status.
 * Requires matching table_session_id for security.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let body: { table_session_id?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { table_session_id } = body;

  // Get the order
  const { data: order, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("id, status, table_session_id, table_number")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Security: verify the client owns this order via table_session_id
  if (!table_session_id || order.table_session_id !== table_session_id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Validate transition: client can only cancel from "pending"
  const error = validateTransition(
    order.status as OrderStatusValue,
    "cancelled",
    "client"
  );

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Cancel the order
  const { data: updated, error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
