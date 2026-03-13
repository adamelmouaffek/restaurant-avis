import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getKdsSession } from "@/shared/lib/kds-auth";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/kds/[slug]/orders/[id]/items/[itemId]
 *
 * Update item_status on a single order item.
 * Protected by KDS JWT session cookie.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; id: string; itemId: string } }
) {
  const { slug, id: orderId, itemId } = params;

  // Auth check
  const session = await getKdsSession();
  if (!session || session.slug !== slug) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  // Resolve slug -> restaurant
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

  // Verify the order belongs to this restaurant
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, restaurant_id")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }

  if (order.restaurant_id !== restaurant.id) {
    return NextResponse.json(
      { error: "Acces non autorise" },
      { status: 403 }
    );
  }

  let body: { item_status?: "pending" | "preparing" | "done" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps JSON invalide" },
      { status: 400 }
    );
  }

  const { item_status } = body;

  if (!item_status || !["pending", "preparing", "done"].includes(item_status)) {
    return NextResponse.json(
      { error: "item_status invalide (pending, preparing, done)" },
      { status: 400 }
    );
  }

  const { data: updatedItem, error: updateError } = await supabaseAdmin
    .from("order_items")
    .update({ item_status })
    .eq("id", itemId)
    .eq("order_id", orderId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedItem);
}
