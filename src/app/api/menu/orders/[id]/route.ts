import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { validateTransition, type OrderStatusValue } from "@/shared/lib/order-rules";
import type { OrderWithItems } from "@/shared/types";

export const dynamic = "force-dynamic";

// PATCH : Changer le statut d'une commande (protege dashboard — role "dashboard")
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getDashboardSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non autorise — connexion au dashboard requise" },
      { status: 401 }
    );
  }

  const { id } = params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requete JSON invalide" },
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

  // Recuperer la commande actuelle
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

  // Verifier que le restaurant appartient a la session connectee
  if (session.restaurantId !== order.restaurant_id) {
    return NextResponse.json(
      { error: "Acces non autorise a cette commande" },
      { status: 403 }
    );
  }

  // Validate transition with role-based permissions
  const error = validateTransition(
    order.status as OrderStatusValue,
    newStatus as OrderStatusValue,
    "dashboard"
  );

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Appliquer la mise a jour
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
