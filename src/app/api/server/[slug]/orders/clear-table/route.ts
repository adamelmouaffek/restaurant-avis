import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getServerSession } from "@/shared/lib/server-auth";

export const dynamic = "force-dynamic";

/**
 * POST: Clear a table's history by deleting delivered/cancelled/rejected orders
 * and closing any active table sessions.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { slug } = await params;
  const { table_number } = await req.json();

  if (!table_number) {
    return NextResponse.json({ error: "table_number requis" }, { status: 400 });
  }

  // Get restaurant
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  // 1. Delete order_items for delivered/cancelled/rejected orders on this table
  const { data: ordersToDelete } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", table_number)
    .in("status", ["delivered", "cancelled", "rejected"]);

  if (ordersToDelete && ordersToDelete.length > 0) {
    const orderIds = ordersToDelete.map((o) => o.id);

    // Delete order items first (FK constraint)
    await supabaseAdmin
      .from("order_items")
      .delete()
      .in("order_id", orderIds);

    // Delete the orders
    await supabaseAdmin
      .from("orders")
      .delete()
      .in("id", orderIds);
  }

  // 2. Close any active table sessions for this table
  await supabaseAdmin
    .from("table_sessions")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", table_number)
    .eq("status", "active");

  return NextResponse.json({
    cleared: ordersToDelete?.length ?? 0,
    message: `Table ${table_number} cloturee`,
  });
}
