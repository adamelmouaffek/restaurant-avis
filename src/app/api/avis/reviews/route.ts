import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { sanitizeString, MAX_LENGTHS } from "@/shared/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Dashboard auth required — reviews list is admin-only
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
    const { restaurant_id, email, google_sub, rating, google_maps_flow } = body;
    const name = sanitizeString(body.name, MAX_LENGTHS.name);
    const comment = sanitizeString(body.comment, MAX_LENGTHS.comment);

    // google_maps_flow = true → rating is optional (review is on Google Maps)
    if (!restaurant_id || !email) {
      return NextResponse.json(
        { error: "restaurant_id et email sont requis" },
        { status: 400 }
      );
    }

    if (!google_maps_flow && !rating) {
      return NextResponse.json(
        { error: "rating est requis pour les avis internes" },
        { status: 400 }
      );
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "La note doit etre entre 1 et 5" },
        { status: 400 }
      );
    }

    // Verifier si le participant a deja participe (par email OU google_sub)
    const { data: existingByEmail } = await supabaseAdmin
      .from("participants")
      .select("id")
      .eq("restaurant_id", restaurant_id)
      .eq("email", email)
      .single();

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Vous avez deja participe pour ce restaurant", alreadyParticipated: true },
        { status: 409 }
      );
    }

    if (google_sub) {
      const { data: existingBySub } = await supabaseAdmin
        .from("participants")
        .select("id")
        .eq("restaurant_id", restaurant_id)
        .eq("google_sub", google_sub)
        .single();

      if (existingBySub) {
        return NextResponse.json(
          { error: "Vous avez deja participe pour ce restaurant", alreadyParticipated: true },
          { status: 409 }
        );
      }
    }

    // Creer le participant (google_sub omis si absent pour eviter erreur null)
    const participantData: Record<string, unknown> = { restaurant_id, email, name };
    if (google_sub) participantData.google_sub = google_sub;

    const { data: participant, error: participantError } = await supabaseAdmin
      .from("participants")
      .insert(participantData)
      .select()
      .single();

    if (participantError) {
      return NextResponse.json({ error: participantError.message }, { status: 500 });
    }

    // Creer l'avis
    const reviewData: Record<string, unknown> = {
      restaurant_id,
      participant_id: participant.id,
      rating: rating || null,
      comment,
    };

    // Google Maps flow: ajouter les champs de tracking
    if (google_maps_flow) {
      reviewData.google_maps_flow = true;
      if (body.google_maps_departure_at) {
        reviewData.google_maps_departure_at = body.google_maps_departure_at;
      }
      if (body.google_maps_return_at) {
        reviewData.google_maps_return_at = body.google_maps_return_at;
      }
      // Trust level: calcule cote serveur si timestamps fournis
      if (body.google_maps_departure_at && body.google_maps_return_at) {
        const departure = new Date(body.google_maps_departure_at).getTime();
        const returnAt = new Date(body.google_maps_return_at).getTime();
        const deltaSeconds = (returnAt - departure) / 1000;
        if (deltaSeconds < 15) reviewData.google_review_trust = "low";
        else if (deltaSeconds < 60) reviewData.google_review_trust = "medium";
        else reviewData.google_review_trust = "high";
      }
    }

    const { data: review, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert(reviewData)
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
