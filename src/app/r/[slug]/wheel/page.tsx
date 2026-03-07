"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { SpinningWheel } from "@/modules/avis/components/SpinningWheel";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { Prize } from "@/shared/types";
import type { SpinResult } from "@/modules/avis/types";

export default function WheelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;

  const participantId = searchParams.get("participantId");
  const reviewId = searchParams.get("reviewId");

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate required params
  useEffect(() => {
    if (!participantId || !reviewId) {
      setError("Paramètres manquants. Veuillez recommencer le processus.");
      setLoading(false);
    }
  }, [participantId, reviewId]);

  // Fetch restaurant + prizes
  useEffect(() => {
    async function fetchData() {
      try {
        // Get restaurant ID from slug
        const restaurantRes = await fetch(
          `/api/avis/restaurants?slug=${encodeURIComponent(slug)}`
        );
        if (!restaurantRes.ok) {
          setError("Restaurant introuvable.");
          return;
        }
        const restaurant = await restaurantRes.json();
        setRestaurantId(restaurant.id);

        // Get active prizes
        const prizesRes = await fetch(
          `/api/avis/prizes?restaurant_id=${restaurant.id}`
        );
        if (!prizesRes.ok) {
          setError("Impossible de charger les cadeaux.");
          return;
        }
        const prizesData: Prize[] = await prizesRes.json();
        const activePrizes = prizesData.filter((p) => p.is_active);

        if (activePrizes.length === 0) {
          setError("Aucun cadeau disponible pour le moment.");
          return;
        }

        setPrizes(activePrizes);
      } catch {
        setError("Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }

    if (participantId && reviewId) fetchData();
  }, [slug, participantId, reviewId]);

  // Handle prize won
  const handlePrizeWon = (result: SpinResult) => {
    const prizeParams = new URLSearchParams({
      name: result.prizeName,
      icon: result.prizeIcon,
      description: result.prizeDescription || "",
    });
    router.push(`/r/${slug}/prize?${prizeParams.toString()}`);
  };

  if (loading) {
    return (
      <main className="min-h-dvh bg-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
          {/* Header skeleton */}
          <div className="text-center space-y-2 w-full">
            <Skeleton className="h-7 w-52 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* Wheel skeleton */}
          <Skeleton className="w-full aspect-square max-w-[320px] rounded-full" />

          {/* Button skeleton */}
          <Skeleton className="h-14 w-full max-w-[280px] rounded-2xl" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-dvh bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-amber-500"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Oups !</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Tentez votre chance !
          </h1>
          <p className="text-sm text-gray-500">
            Tournez la roue pour découvrir votre cadeau
          </p>
        </div>

        {/* Wheel */}
        <SpinningWheel
          prizes={prizes}
          restaurantId={restaurantId!}
          participantId={participantId!}
          reviewId={reviewId!}
          onPrizeWon={handlePrizeWon}
        />
      </div>
    </main>
  );
}
