import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tableSessionId = searchParams.get("table_session_id");
  const countOnly = searchParams.get("count_only");

  if (!tableSessionId) {
    return NextResponse.json(
      { error: "table_session_id est requis" },
      { status: 400 }
    );
  }

  // Count-only mode for the cart badge
  if (countOnly === "true") {
    const { count, error } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("table_session_id", tableSessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count ?? 0 });
  }

  // Full orders with items
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items!order_items_order_id_fkey(*)")
    .eq("table_session_id", tableSessionId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
