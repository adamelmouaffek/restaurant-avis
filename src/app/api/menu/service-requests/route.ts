import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { rateLimit } from "@/shared/lib/rate-limit";
import { getClientIp } from "@/shared/lib/get-client-ip";

export const dynamic = "force-dynamic";

// POST: Create a service request (public - client calls waiter or requests bill)
export async function POST(req: NextRequest) {
  const { restaurant_id, table_number, table_session_id, type } = await req.json();

  if (!restaurant_id || !table_number || !type) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  if (!["call_waiter", "request_bill"].includes(type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  // Rate limit per restaurant + table
  const ip = getClientIp(req);
  const rl = rateLimit(`service:${restaurant_id}:${table_number}:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de demandes. Reessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  // Deduplication: return existing pending request instead of creating duplicate
  const { data: existing } = await supabaseAdmin
    .from("service_requests")
    .select("id")
    .eq("restaurant_id", restaurant_id)
    .eq("table_number", table_number)
    .eq("type", type)
    .eq("status", "pending")
    .limit(1)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  const { data, error } = await supabaseAdmin
    .from("service_requests")
    .insert({
      restaurant_id,
      table_number,
      table_session_id: table_session_id || null,
      type,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
