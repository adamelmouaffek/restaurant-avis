"use client";

import { X, Check } from "lucide-react";
import { FadeIn, GlowCard } from "@/shared/components/animations";

interface ComparisonItem {
  text: string;
}

const withoutItems: ComparisonItem[] = [
  { text: "2-3 avis Google par mois" },
  { text: "Aucun controle sur la reputation" },
  { text: "Pas de motivation client" },
  { text: "Zero donnees exploitables" },
  { text: "Dependance aux plateformes" },
];

const withItems: ComparisonItem[] = [
  { text: "15-20 avis Google par mois" },
  { text: "Dashboard de suivi en temps reel" },
  { text: "Roue cadeaux = motivation naturelle" },
  { text: "Donnees clients exploitables" },
  { text: "Votre propre ecosysteme digital" },
];

export function BeforeAfter() {
  return (
    <>
      {/* Transition gradient from dark to light */}
      <div className="h-24 bg-gradient-to-b from-[#0F172A] to-white" />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <FadeIn direction="up" className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Avant vs. Avec Restaurant Avis
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              La difference est visible en quelques semaines
            </p>
          </FadeIn>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* WITHOUT card */}
            <FadeIn direction="left">
              <GlowCard
                glowColor="rgba(239,68,68,0.3)"
                className="border-l-4 border-red-500 p-6 sm:p-8 h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Sans Restaurant Avis
                  </h3>
                </div>

                <ul className="space-y-4">
                  {withoutItems.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </FadeIn>

            {/* WITH card */}
            <FadeIn direction="right">
              <GlowCard
                glowColor="rgba(59,130,246,0.3)"
                className="border-l-4 border-blue-500 p-6 sm:p-8 h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Avec Restaurant Avis
                  </h3>
                </div>

                <ul className="space-y-4">
                  {withItems.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
