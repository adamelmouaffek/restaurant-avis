import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getKdsSession } from "@/shared/lib/kds-auth";
import type { OrderWithItems } from "@/shared/types";

export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "ready"];

/**
 * GET /api/kds/[slug]/orders
 *
 * KDS route protected by signed JWT session cookie.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

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
    return NextResponse.json(
      { error: "Restaurant introuvable" },
      { status: 404 }
    );
  }

  // Fetch commandes actives avec leurs articles
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items!order_items_order_id_fkey(*)")
    .eq("restaurant_id", restaurant.id)
    .in("status", ACTIVE_STATUSES)
    .order("created_at", { ascending: true }); // Les plus anciennes en premier pour la cuisine

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as OrderWithItems[]);
}
