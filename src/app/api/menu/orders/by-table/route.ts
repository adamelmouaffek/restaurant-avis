import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const tableNumber = searchParams.get("table_number");

  if (!slug || !tableNumber) {
    return NextResponse.json(
      { error: "slug et table_number sont requis" },
      { status: 400 }
    );
  }

  // Get restaurant ID from slug
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant introuvable" },
      { status: 404 }
    );
  }

  // Fetch recent orders for this table (last 24h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items!order_items_order_id_fkey(*)")
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", tableNumber)
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
