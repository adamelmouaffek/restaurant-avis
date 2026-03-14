import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET: fetch participation details (public — for QR code verification)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("participations")
    .select("*, participants(email, name), prizes(name, description, icon)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Participation introuvable" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH: mark as claimed
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.claimed === true) {
    const { data, error } = await supabaseAdmin
      .from("participations")
      .update({ claimed: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Action non supportee" }, { status: 400 });
}
