import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurant_id requis" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, rating, comment, created_at, participants(name, email)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurant_id, email, name, google_sub, rating, comment } = body;

    if (!restaurant_id || !email || !rating) {
      return NextResponse.json(
        { error: "restaurant_id, email et rating sont requis" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit etre entre 1 et 5" },
        { status: 400 }
      );
    }

    // Verifier si le participant a deja participe
    const { data: existingParticipant } = await supabaseAdmin
      .from("participants")
      .select("id")
      .eq("restaurant_id", restaurant_id)
      .eq("email", email)
      .single();

    if (existingParticipant) {
      return NextResponse.json(
        { error: "Vous avez deja participe pour ce restaurant", alreadyParticipated: true },
        { status: 409 }
      );
    }

    // Creer le participant
    const { data: participant, error: participantError } = await supabaseAdmin
      .from("participants")
      .insert({ restaurant_id, email, name, google_sub })
      .select()
      .single();

    if (participantError) {
      return NextResponse.json({ error: participantError.message }, { status: 500 });
    }

    // Creer l'avis
    const { data: review, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        restaurant_id,
        participant_id: participant.id,
        rating,
        comment,
      })
      .select()
      .single();

    if (reviewError) {
      return NextResponse.json({ error: reviewError.message }, { status: 500 });
    }

    return NextResponse.json({
      participantId: participant.id,
      reviewId: review.id,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
