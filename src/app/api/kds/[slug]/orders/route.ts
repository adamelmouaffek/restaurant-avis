import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import type { OrderWithItems } from "@/shared/types";

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "ready"];

/**
 * GET /api/kds/[slug]/orders
 *
 * Route publique dediee au KDS.
 * Authentification par slug (pas de session cookie).
 * Retourne uniquement les commandes "actives" (pending, confirmed, preparing, ready).
 *
 * Le slug est suffisant comme mecanisme de controle d'acces pour un ecran cuisine :
 * seul le personnel possedant le slug peut ouvrir la page /kds/[slug].
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "slug est requis" }, { status: 400 });
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
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurant.id)
    .in("status", ACTIVE_STATUSES)
    .order("created_at", { ascending: true }); // Les plus anciennes en premier pour la cuisine

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as OrderWithItems[]);
}
