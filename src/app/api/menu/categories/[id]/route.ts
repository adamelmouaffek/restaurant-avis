import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";

// PATCH : Mettre a jour une categorie
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  // Verifier que la categorie appartient bien au restaurant de la session
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("menu_categories")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Categorie introuvable" }, { status: 404 });
  }

  if (existing.restaurant_id !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  // Champs modifiables
  const updatePayload: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) {
    updatePayload.name = body.name.trim();
  }
  if ("description" in body) {
    updatePayload.description = body.description ?? null;
  }
  if (typeof body.sort_order === "number") {
    updatePayload.sort_order = body.sort_order;
  }
  if (typeof body.is_active === "boolean") {
    updatePayload.is_active = body.is_active;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: "Aucun champ a mettre a jour" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("menu_categories")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE : Supprimer une categorie (et ses articles via cascade DB ou suppression manuelle)
export async function DELETE(
  _request: NextRequest,
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

  // Verifier ownership
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("menu_categories")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Categorie introuvable" }, { status: 404 });
  }

  if (existing.restaurant_id !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  // Soft delete des articles associes
  await supabaseAdmin
    .from("menu_items")
    .update({ is_active: false })
    .eq("category_id", id);

  // Soft delete de la categorie
  const { error } = await supabaseAdmin
    .from("menu_categories")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
