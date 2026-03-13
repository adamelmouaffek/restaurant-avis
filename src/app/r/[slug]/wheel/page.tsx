"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { SpinningWheel } from "@/modules/avis/components/SpinningWheel";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PageTransition } from "@/shared/components/animations";
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
        const restaurantRes = await fetch(
          `/api/avis/restaurants?slug=${encodeURIComponent(slug)}`
        );
        if (!restaurantRes.ok) {
          setError("Restaurant introuvable.");
          return;
        }
        const restaurant = await restaurantRes.json();
        setRestaurantId(restaurant.id);

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
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
          <Skeleton className="h-7 w-52 mx-auto bg-white/10" />
          <Skeleton className="w-full aspect-square max-w-[320px] rounded-full bg-white/10" />
          <Skeleton className="h-14 w-full max-w-[280px] rounded-2xl bg-white/10" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-amber-400"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Oups !</h2>
          <p className="text-sm text-white/60">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0F172A] overflow-hidden">
      <PageTransition className="min-h-dvh">
        {/* Mobile: full wheel centered */}
        <div className="flex lg:hidden flex-col items-center justify-center min-h-dvh px-4 py-8 gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Tentez votre chance !
            </h1>
            <p className="text-sm text-white/60">
              Tournez la roue pour decouvrir votre cadeau
            </p>
          </div>
          <SpinningWheel
            prizes={prizes}
            restaurantId={restaurantId!}
            participantId={participantId!}
            reviewId={reviewId!}
            onPrizeWon={handlePrizeWon}
          />
        </div>

        {/* Desktop: half-wheel at left edge + content right */}
        <div className="hidden lg:flex items-center min-h-dvh">
          {/* Left half — wheel clipped, center at left edge */}
          <div className="relative w-1/2 h-dvh overflow-hidden flex items-center">
            {/* Position wheel so its center sits at the left edge of this container */}
            <div
              className="absolute"
              style={{
                left: "0",
                top: "50%",
                transform: "translateX(-50%) translateY(-50%)",
              }}
            >
              <SpinningWheel
                prizes={prizes}
                restaurantId={restaurantId!}
                participantId={participantId!}
                reviewId={reviewId!}
                onPrizeWon={handlePrizeWon}
              />
            </div>
          </div>

          {/* Right half — text content */}
          <div className="w-1/2 flex items-center justify-start pl-12 pr-8">
            <div className="max-w-lg space-y-6">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Tentez votre{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">
                  chance !
                </span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed">
                Tournez la roue pour decouvrir votre cadeau. Chaque participant
                a droit a un tour unique.
              </p>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Le cadeau est revele instantanement</span>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
