import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";

export const dynamic = "force-dynamic";

// GET: Public (wheel needs prize list)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurant_id requis" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("prizes")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Dashboard auth required
export async function POST(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { restaurant_id, name, description, probability, color, icon, is_active } = body;

    if (restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Acces non autorise a ce restaurant" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("prizes")
      .insert({ restaurant_id, name, description, probability, color, icon, is_active })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT: Dashboard auth required
export async function PUT(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // Verify prize belongs to this restaurant
    const { data: prize } = await supabaseAdmin
      .from("prizes")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!prize || prize.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("prizes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE: Dashboard auth required
export async function DELETE(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  // Verify prize belongs to this restaurant
  const { data: prize } = await supabaseAdmin
    .from("prizes")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (!prize || prize.restaurant_id !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("prizes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
