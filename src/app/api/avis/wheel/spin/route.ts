import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { selectPrize, calculateWheelAngle } from "@/modules/avis/lib/wheel-logic";
import type { Prize } from "@/shared/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurant_id, participant_id, review_id } = body;

    if (!restaurant_id || !participant_id || !review_id) {
      return NextResponse.json(
        { error: "restaurant_id, participant_id et review_id sont requis" },
        { status: 400 }
      );
    }

    // Verifier que le participant n'a pas deja tourne la roue
    const { data: existingParticipation } = await supabaseAdmin
      .from("participations")
      .select("id")
      .eq("participant_id", participant_id)
      .eq("restaurant_id", restaurant_id)
      .single();

    if (existingParticipation) {
      return NextResponse.json(
        { error: "Vous avez deja tourne la roue" },
        { status: 409 }
      );
    }

    // Recuperer les cadeaux actifs
    const { data: prizes, error: prizesError } = await supabaseAdmin
      .from("prizes")
      .select("*")
      .eq("restaurant_id", restaurant_id)
      .eq("is_active", true)
      .order("created_at");

    if (prizesError || !prizes?.length) {
      return NextResponse.json(
        { error: "Aucun cadeau configure pour ce restaurant" },
        { status: 404 }
      );
    }

    // Selection ponderee cote serveur
    const { prize, segmentIndex } = selectPrize(prizes as Prize[]);
    const totalSegments = prizes.length;
    const angle = calculateWheelAngle(segmentIndex, totalSegments);

    // Enregistrer la participation
    const { error: participationError } = await supabaseAdmin
      .from("participations")
      .insert({
        participant_id,
        restaurant_id,
        review_id,
        prize_id: prize.id,
        prize_name: prize.name,
      });

    if (participationError) {
      return NextResponse.json({ error: participationError.message }, { status: 500 });
    }

    return NextResponse.json({
      prizeId: prize.id,
      prizeName: prize.name,
      prizeDescription: prize.description,
      prizeIcon: prize.icon,
      prizeColor: prize.color,
      segmentIndex,
      angle,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
