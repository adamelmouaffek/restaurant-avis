import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");

  if (!slug && !id) {
    return NextResponse.json(
      { error: "slug ou id requis" },
      { status: 400 }
    );
  }

  let query = supabaseAdmin.from("restaurants").select("id, name, slug, google_maps_url, google_place_id, logo_url, primary_color, created_at");

  if (slug) {
    query = query.eq("slug", slug);
  } else if (id) {
    query = query.eq("id", id);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Restaurant introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
