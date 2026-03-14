"use client";

import { useState, useEffect, useCallback } from "react";
import {
  recordDeparture,
  clearSession,
  calculateTrustLevel,
  type GoogleMapsSession,
} from "@/modules/avis/lib/google-maps-session";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

interface GoogleMapsConfirmProps {
  restaurantName: string;
  googleMapsUrl: string;
  slug: string;
  session: GoogleMapsSession;
  userEmail: string;
  userName: string | null;
  googleSub: string;
  onSuccess: (participantId: string, reviewId: string) => void;
}

const COOLDOWN_SECONDS = 30;

export function GoogleMapsConfirm({
  restaurantName,
  googleMapsUrl,
  slug,
  session,
  userEmail,
  userName,
  googleSub,
  onSuccess,
}: GoogleMapsConfirmProps) {
  const [countdown, setCountdown] = useState(COOLDOWN_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeAway = Math.floor((Date.now() - session.departureTimestamp) / 1000);
  const tooFast = timeAway < 15;

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    const returnTimestamp = Date.now();
    const trust = calculateTrustLevel(session.departureTimestamp, returnTimestamp);

    try {
      const response = await fetch("/api/avis/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: session.restaurantId,
          email: userEmail,
          name: userName,
          google_sub: googleSub,
          google_maps_flow: true,
          rating: null,
          comment: null,
          google_maps_departure_at: new Date(session.departureTimestamp).toISOString(),
          google_maps_return_at: new Date(returnTimestamp).toISOString(),
          google_review_trust: trust,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyParticipated) {
          setError("Vous avez deja participe pour cet etablissement.");
        } else {
          setError(data.error || "Une erreur est survenue.");
        }
        return;
      }

      clearSession(slug);
      onSuccess(data.participantId, data.reviewId);
    } catch {
      setError("Erreur de connexion. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }, [session, slug, onSuccess]);

  const handleNotYet = () => {
    recordDeparture(slug);
    window.location.href = googleMapsUrl;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/[0.08] border border-white/15 shadow-none">
      <CardContent className="p-8 sm:p-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-yellow-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Avez-vous laisse votre avis Google ?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Confirmez que vous avez laisse un avis pour{" "}
              <span className="font-medium text-white/80">{restaurantName}</span>{" "}
              sur Google Maps pour debloquer la roue.
            </p>
          </div>

          {/* Too fast warning */}
          {tooFast && (
            <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3 text-sm text-orange-400 text-center">
              Vous etes revenu tres rapidement. Prenez le temps de laisser un vrai avis !
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Confirm button with countdown */}
          <Button
            onClick={handleConfirm}
            disabled={countdown > 0 || isSubmitting}
            className="w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verification...
              </span>
            ) : countdown > 0 ? (
              `Verification en cours... ${countdown}s`
            ) : (
              "Oui, j'ai laisse mon avis !"
            )}
          </Button>

          {/* Not yet button */}
          <button
            onClick={handleNotYet}
            className="text-sm text-white/50 hover:text-white/80 transition-colors min-h-[44px] px-4 underline underline-offset-2"
          >
            Pas encore — retourner sur Google Maps
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
