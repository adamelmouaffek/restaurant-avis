import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getServerSession } from "@/shared/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { slug } = await params;

  // Get restaurant
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  // Get tables — optionally filter by staff assignment
  let tablesQuery = supabaseAdmin
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("number");

  const onlyMyTables = req.nextUrl.searchParams.get("my_tables") === "true";
  if (onlyMyTables && session.staffId) {
    tablesQuery = tablesQuery.or(`assigned_staff_id.eq.${session.staffId},assigned_staff_id.is.null`);
  }

  const { data: tables } = await tablesQuery;

  // Get active sessions
  const { data: sessions } = await supabaseAdmin
    .from("table_sessions")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .in("status", ["active", "requesting_bill"]);

  // Get active orders
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id, table_number, status, total_amount, paid")
    .eq("restaurant_id", restaurant.id)
    .in("status", ["pending", "confirmed", "preparing", "ready"]);

  // Get pending service requests
  const { data: serviceRequests } = await supabaseAdmin
    .from("service_requests")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("status", "pending");

  // Compute table statuses
  const tablesWithStatus = (tables || []).map((table) => {
    const tableSession = (sessions || []).find(
      (s) => s.table_number === table.number
    );
    const tableOrders = (orders || []).filter(
      (o) => o.table_number === table.number
    );
    const tableRequests = (serviceRequests || []).filter(
      (sr) => sr.table_number === table.number
    );

    let computedStatus = "empty";
    const hasCallingWaiter = tableRequests.some((r) => r.type === "call_waiter");
    const hasRequestBill = tableRequests.some((r) => r.type === "request_bill");

    if (hasRequestBill || tableSession?.status === "requesting_bill") {
      computedStatus = "requesting_bill";
    } else if (tableOrders.some((o) => o.status === "ready")) {
      computedStatus = "eating";
    } else if (tableOrders.some((o) => ["preparing", "confirmed"].includes(o.status))) {
      computedStatus = "waiting_food";
    } else if (tableOrders.some((o) => o.status === "pending")) {
      computedStatus = "ordering";
    } else if (tableSession && tableSession.status === "active") {
      computedStatus = "occupied";
    }

    return {
      ...table,
      computed_status: computedStatus,
      calling_waiter: hasCallingWaiter,
      active_orders: tableOrders.length,
      total_amount: tableOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      session: tableSession || null,
    };
  });

  return NextResponse.json(tablesWithStatus);
}
