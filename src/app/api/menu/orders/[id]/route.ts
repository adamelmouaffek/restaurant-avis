import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import type { OrderStatus, OrderWithItems } from "@/shared/types";

export const dynamic = "force-dynamic";

// Transitions de statut autorisées
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "rejected", "cancelled"],
  confirmed: ["preparing", "rejected", "cancelled"],
  preparing: ["ready"],
  ready: ["delivered"],
  delivered: [],
  cancelled: [],
  rejected: ["pending"],
};

// PATCH : Changer le statut d'une commande (protégé dashboard)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getDashboardSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé — connexion au dashboard requise" },
      { status: 401 }
    );
  }

  const { id } = params;

  let body: { status?: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide" },
      { status: 400 }
    );
  }

  const { status: newStatus } = body;

  if (!newStatus) {
    return NextResponse.json(
      { error: "Le champ status est requis" },
      { status: 400 }
    );
  }

  // Récupérer la commande actuelle
  const { data: order, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }

  // Vérifier que le restaurant appartient à la session connectée
  if (session.restaurantId !== order.restaurant_id) {
    return NextResponse.json(
      { error: "Accès non autorisé à cette commande" },
      { status: 403 }
    );
  }

  const currentStatus = order.status as OrderStatus;
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus];

  if (!allowedNext.includes(newStatus)) {
    return NextResponse.json(
      {
        error: `Transition de statut invalide : "${currentStatus}" → "${newStatus}". Transitions autorisées depuis "${currentStatus}" : ${
          allowedNext.length > 0 ? allowedNext.join(", ") : "aucune"
        }`,
      },
      { status: 400 }
    );
  }

  // Appliquer la mise à jour
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

// GET : Retourner une commande avec ses items (requires auth or matching session)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items!order_items_order_id_fkey(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }

  // Auth check: dashboard session OR matching table_session_id
  const dashSession = await getDashboardSession();
  if (dashSession) {
    if (dashSession.restaurantId !== data.restaurant_id) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }
  } else {
    // Public access requires matching table_session_id
    const { searchParams } = new URL(request.url);
    const tableSessionId = searchParams.get("table_session_id");
    if (!tableSessionId || tableSessionId !== data.table_session_id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
  }

  return NextResponse.json(data as OrderWithItems);
}
