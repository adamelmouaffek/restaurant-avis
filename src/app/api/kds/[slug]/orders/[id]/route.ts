import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import type { OrderStatus } from "@/shared/types";

export const dynamic = "force-dynamic";

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready"],
  ready: ["delivered"],
  delivered: [],
  cancelled: [],
};

/**
 * PATCH /api/kds/[slug]/orders/[id]
 *
 * Endpoint dédié au KDS cuisine — authentification par slug (pas de session).
 * Permet au personnel de cuisine de changer le statut sans connexion dashboard.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  const { slug, id } = params;

  // Résoudre le slug → restaurant
  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  let body: { status?: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide" }, { status: 400 });
  }

  const { status: newStatus } = body;

  if (!newStatus) {
    return NextResponse.json({ error: "Le champ status est requis" }, { status: 400 });
  }

  // Récupérer la commande actuelle
  const { data: order, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("id, status, restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Vérifier que la commande appartient bien à ce restaurant (slug)
  if (order.restaurant_id !== restaurant.id) {
    return NextResponse.json({ error: "Accès non autorisé à cette commande" }, { status: 403 });
  }

  const currentStatus = order.status as OrderStatus;
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus];

  if (!allowedNext.includes(newStatus)) {
    return NextResponse.json(
      {
        error: `Transition invalide : "${currentStatus}" → "${newStatus}". Autorisées : ${
          allowedNext.length > 0 ? allowedNext.join(", ") : "aucune"
        }`,
      },
      { status: 400 }
    );
  }

  const { data: updatedOrder, error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updatedOrder);
}
