"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { ReviewFormData } from "@/modules/avis/types";

interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  googleMapsUrl: string | null;
  userEmail: string;
  userName: string | null;
  googleSub: string;
  onSuccess: (participantId: string, reviewId: string) => void;
}

export function ReviewForm({
  restaurantId,
  restaurantName,
  googleMapsUrl,
  userEmail,
  userName,
  googleSub,
  onSuccess,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.rating === 0) {
      setError("Veuillez donner une note.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/avis/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          email: userEmail,
          name: userName,
          google_sub: googleSub,
          rating: formData.rating,
          comment: formData.comment || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyParticipated) {
          setError("Vous avez deja donne votre avis pour ce restaurant.");
        } else {
          setError(data.error || "Une erreur est survenue.");
        }
        return;
      }

      // Si le restaurant a un lien Google Maps et la note est >= 4,
      // proposer de laisser un avis Google aussi
      if (googleMapsUrl && formData.rating >= 4) {
        window.open(googleMapsUrl, "_blank");
      }

      onSuccess(data.participantId, data.reviewId);
    } catch {
      setError("Erreur de connexion. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Votre avis compte !
            </h2>
            <p className="text-sm text-gray-500">
              Comment etait votre experience chez{" "}
              <span className="font-medium text-gray-700">{restaurantName}</span> ?
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Votre note
            </label>
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
            />
            {formData.rating > 0 && (
              <span className="text-sm text-gray-500">
                {formData.rating === 1 && "Decevant"}
                {formData.rating === 2 && "Moyen"}
                {formData.rating === 3 && "Correct"}
                {formData.rating === 4 && "Tres bien"}
                {formData.rating === 5 && "Excellent !"}
              </span>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-medium text-gray-700"
            >
              Votre commentaire{" "}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <Textarea
              id="comment"
              placeholder="Partagez votre experience..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              rows={4}
              className="resize-none text-base"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || formData.rating === 0}
            className="w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              "Envoyer mon avis"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
