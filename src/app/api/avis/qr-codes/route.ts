import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";

export const dynamic = "force-dynamic";

// GET: Dashboard auth required (QR codes are managed in dashboard)
export async function GET(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurant_id requis" }, { status: 400 });
  }

  if (restaurantId !== session.restaurantId) {
    return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("table_number");

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
    const { restaurant_id, table_number, url } = body;

    if (restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("qr_codes")
      .insert({ restaurant_id, table_number, url })
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
