"use client";

import { useSearchParams } from "next/navigation";
import { PrizeReveal } from "@/modules/avis/components/PrizeReveal";
import { PageTransition, FadeIn } from "@/shared/components/animations";

export default function PrizePage() {
  const searchParams = useSearchParams();

  const prizeName = searchParams.get("name");
  const prizeIcon = searchParams.get("icon");
  const prizeDescription = searchParams.get("description") || null;

  if (!prizeName || !prizeIcon) {
    return (
      <main className="min-h-dvh bg-white flex items-center justify-center px-4">
        <PageTransition>
          <div className="text-center space-y-4 max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Aucun cadeau a afficher
            </h2>
            <p className="text-sm text-gray-500">
              Cette page est accessible apres avoir tourne la roue.
            </p>
          </div>
        </PageTransition>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-white to-amber-50/30 flex flex-col items-center justify-center px-4 py-12">
      <PageTransition>
        <FadeIn delay={0.1}>
          <PrizeReveal
            prizeName={prizeName}
            prizeIcon={prizeIcon}
            prizeDescription={prizeDescription}
          />
        </FadeIn>
      </PageTransition>
    </main>
  );
}
