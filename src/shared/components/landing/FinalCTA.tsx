"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Button } from "@/shared/components/ui/button";
import { FadeIn, DarkGradientMesh } from "@/shared/components/animations";

function fireConfetti() {
  confetti({
    particleCount: 60,
    spread: 80,
    colors: ["#3B82F6", "#60A5FA", "#1D4ED8", "#818CF8", "#6366F1"],
    origin: { y: 0.7 },
  });
}

export function FinalCTA() {
  return (
    <>
      {/* Transition gradient */}
      <div className="h-24 bg-gradient-to-b from-[#f8fafc] to-[#0F172A]" />

      {/* CTA Section */}
      <section className="bg-[#0F172A] relative py-20 overflow-hidden">
        <DarkGradientMesh />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pret a transformer votre restaurant ?
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les restaurants qui multiplient leurs avis Google par 6.
            </p>
            <Link href="/dashboard/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 glow-emerald hover:glow-emerald-intense transition-all text-base px-8 h-12 gap-2"
                onClick={fireConfetti}
              >
                <Sparkles className="w-5 h-5" />
                Commencer maintenant
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
