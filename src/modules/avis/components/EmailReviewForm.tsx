"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { StarRating } from "./StarRating";
import { Textarea } from "@/shared/components/ui/textarea";
import type { ReviewFormData } from "@/modules/avis/types";

interface EmailReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  onSuccess: (participantId: string, reviewId: string) => void;
}

export function EmailReviewForm({
  restaurantId,
  restaurantName,
  onSuccess,
}: EmailReviewFormProps) {
  const params = useParams();
  const slug = params.slug as string;
  const [formData, setFormData] = useState<ReviewFormData & { email: string; name: string }>({
    rating: 0,
    comment: "",
    email: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.rating === 0) {
      setError("Veuillez donner une note.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Veuillez entrer votre email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/avis/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          email: formData.email,
          name: formData.name || formData.email.split("@")[0],
          rating: formData.rating,
          comment: formData.comment || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyParticipated) {
          setAlreadyParticipated(true);
        } else {
          setError(data.error || "Une erreur est survenue.");
        }
        return;
      }

      onSuccess(data.participantId, data.reviewId);
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (alreadyParticipated) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/[0.08] border border-white/15 shadow-none">
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Check icon */}
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Vous avez deja donne votre avis !
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Merci pour votre participation. Votre avis pour{" "}
                <span className="font-medium text-white/80">{restaurantName}</span>{" "}
                a bien ete pris en compte.
              </p>
            </div>

            {/* CTA */}
            <Link
              href={`/r/${slug}`}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Retour au restaurant
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/[0.08] border border-white/15 shadow-none">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-white">
              Tester rapidement
            </h2>
            <p className="text-sm text-white/60">
              Donnez votre avis pour{" "}
              <span className="font-medium text-white/80">{restaurantName}</span>
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/70">
              Votre email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400"
            />
          </div>

          {/* Name (optional) */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-white/70">
              Votre nom{" "}
              <span className="text-white/40 font-normal">(optionnel)</span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400"
            />
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-white/70">
              Votre note
            </label>
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
            />
            {formData.rating > 0 && (
              <span className="text-sm text-white/60">
                {formData.rating === 1 && "Décevant"}
                {formData.rating === 2 && "Moyen"}
                {formData.rating === 3 && "Correct"}
                {formData.rating === 4 && "Très bien"}
                {formData.rating === 5 && "Excellent !"}
              </span>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-medium text-white/70"
            >
              Votre commentaire{" "}
              <span className="text-white/40 font-normal">(optionnel)</span>
            </label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              rows={4}
              className="resize-none text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
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
