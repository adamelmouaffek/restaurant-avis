import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getServerSession } from "@/shared/lib/server-auth";

export const dynamic = "force-dynamic";

// GET: List pending service requests
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { slug } = await params;

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("service_requests")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .in("status", ["pending", "acknowledged"])
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// PATCH: Acknowledge or resolve a service request
export async function PATCH(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (!id || !["acknowledged", "resolved"].includes(status)) {
    return NextResponse.json({ error: "Parametres invalides" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { status };
  if (status === "resolved") {
    updates.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("service_requests")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
