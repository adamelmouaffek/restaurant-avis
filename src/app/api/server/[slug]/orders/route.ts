import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getServerSession } from "@/shared/lib/server-auth";

export const dynamic = "force-dynamic";

// GET: All active orders for the restaurant (waiter view)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { slug } = await params;

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  let query = supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Filter by table number if provided
  const tableNumber = url.searchParams.get("table");
  if (tableNumber) {
    query = query.eq("table_number", tableNumber);
  }

  if (status === "all") {
    // No status filter — return everything
  } else if (status) {
    query = query.eq("status", status);
  } else {
    query = query.in("status", ["pending", "confirmed", "preparing", "ready"]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST: Create order as waiter
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { slug } = await params;
  const { table_number, notes, items, priority, table_session_id } = await req.json();

  if (!table_number || !items || items.length === 0) {
    return NextResponse.json({ error: "Table et articles requis" }, { status: 400 });
  }

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  // Validate prices server-side
  const itemIds = items.map((i: { menu_item_id: string }) => i.menu_item_id);
  const { data: menuItems } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, price, is_available")
    .in("id", itemIds);

  if (!menuItems) {
    return NextResponse.json({ error: "Articles introuvables" }, { status: 400 });
  }

  const priceMap = new Map(menuItems.map((mi) => [mi.id, mi]));
  let totalAmount = 0;
  const orderItems = items.map((item: { menu_item_id: string; quantity: number; notes?: string }) => {
    const mi = priceMap.get(item.menu_item_id);
    if (!mi) throw new Error(`Article ${item.menu_item_id} introuvable`);
    totalAmount += mi.price * item.quantity;
    return {
      menu_item_id: item.menu_item_id,
      name: mi.name,
      price: mi.price,
      quantity: item.quantity,
      notes: item.notes || null,
    };
  });

  // Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      restaurant_id: restaurant.id,
      table_number,
      notes: notes || null,
      total_amount: totalAmount,
      source: "waiter",
      staff_id: session.staffId,
      priority: priority || "normal",
      table_session_id: table_session_id || null,
      status: "confirmed", // Waiter orders skip "pending", go straight to confirmed
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // Create order items
  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems.map((oi: { menu_item_id: string; name: string; price: number; quantity: number; notes: string | null }) => ({ ...oi, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    tableNumber: table_number,
    totalAmount: totalAmount,
  }, { status: 201 });
}
