import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import type { MenuItemWithCategory } from "@/shared/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }

  const price = parseFloat(String(body.price));
  if (isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
  }

  const categoryId = typeof body.category_id === "string" ? body.category_id : null;
  if (!categoryId) {
    return NextResponse.json({ error: "La categorie est requise" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .insert({
      restaurant_id: session.restaurantId,
      category_id: categoryId,
      name,
      description: typeof body.description === "string" ? body.description.trim() || null : null,
      price,
      image_url: typeof body.image_url === "string" ? body.image_url.trim() || null : null,
      allergens: Array.isArray(body.allergens) ? body.allergens : [],
      is_available: typeof body.is_available === "boolean" ? body.is_available : true,
    })
    .select("*, menu_categories(id, name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");

  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurant_id est requis" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*, menu_categories(id, name)")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as MenuItemWithCategory[]);
}
