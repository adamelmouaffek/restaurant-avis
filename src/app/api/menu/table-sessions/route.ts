import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

// POST: Create or get active table session
export async function POST(req: NextRequest) {
  const { restaurant_id, table_number } = await req.json();

  if (!restaurant_id || !table_number) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  // Check for existing active session at this table
  const { data: existing } = await supabaseAdmin
    .from("table_sessions")
    .select("*")
    .eq("restaurant_id", restaurant_id)
    .eq("table_number", table_number)
    .eq("status", "active")
    .order("opened_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  // Create new session
  const { data, error } = await supabaseAdmin
    .from("table_sessions")
    .insert({ restaurant_id, table_number })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
