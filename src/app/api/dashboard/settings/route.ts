import { NextRequest, NextResponse } from "next/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

const VALID_TYPES = ["restaurant", "hotel", "cafe", "bar"];

export async function GET() {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("id, name, establishment_type, google_maps_url, logo_url, primary_color")
    .eq("id", session.restaurantId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.name && typeof body.name === "string" && body.name.trim().length >= 2) {
    updates.name = body.name.trim().slice(0, 100);
  }

  if (body.establishment_type && VALID_TYPES.includes(body.establishment_type)) {
    updates.establishment_type = body.establishment_type;
  }

  if (body.google_maps_url !== undefined) {
    updates.google_maps_url = body.google_maps_url || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .update(updates)
    .eq("id", session.restaurantId)
    .select("id, name, establishment_type, google_maps_url, logo_url, primary_color")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
