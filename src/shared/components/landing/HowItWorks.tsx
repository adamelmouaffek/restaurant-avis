"use client";

import { QrCode, Star, Gift, Sparkles, type LucideIcon } from "lucide-react";
import { FadeIn } from "@/shared/components/animations";

interface Step {
  number: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: QrCode,
    iconColor: "text-[#3B82F6]",
    iconBg: "bg-[#3B82F6]/10",
    title: "Le client scanne le QR code",
    description:
      "Un QR code sur chaque table. Le client scanne avec son telephone pour acceder au menu ou donner son avis.",
  },
  {
    number: 2,
    icon: Star,
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
    title: "Il laisse un avis Google",
    description:
      "Connexion Google OAuth securisee. L'avis est authentifie et publie directement sur Google Maps.",
  },
  {
    number: 3,
    icon: Gift,
    iconColor: "text-[#8B5CF6]",
    iconBg: "bg-[#8B5CF6]/10",
    title: "Il tourne la roue cadeaux",
    description:
      "Apres son avis, le client decouvre la roue animee et tente de gagner un cadeau personnalise.",
  },
  {
    number: 4,
    icon: Sparkles,
    iconColor: "text-[#3B82F6]",
    iconBg: "bg-[#3B82F6]/10",
    title: "Il recoit son cadeau",
    description:
      "Le client presente son ecran au serveur. Cafe offert, dessert, reduction... a vous de choisir les lots !",
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const isEven = index % 2 === 0;
  const direction = isEven ? "left" : "right";
  const Icon = step.icon;

  const iconBlock = (
    <div className="flex items-center justify-center">
      <div className={`${step.iconBg} rounded-2xl p-6`}>
        <Icon className={`w-12 h-12 ${step.iconColor}`} />
      </div>
    </div>
  );

  const textBlock = (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm shrink-0">
          {step.number}
        </div>
        <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed pl-[52px]">
        {step.description}
      </p>
    </div>
  );

  return (
    <FadeIn direction={direction} delay={index * 0.15}>
      {/* Mobile: single column */}
      <div className="flex flex-col gap-4 md:hidden">
        {iconBlock}
        {textBlock}
      </div>

      {/* Desktop: alternating layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 md:items-center">
        {isEven ? (
          <>
            <div className="flex justify-end">{iconBlock}</div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm">
                {step.number}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm">
                {step.number}
              </div>
            </div>
            <div className="flex justify-start">{iconBlock}</div>
          </>
        )}
      </div>
    </FadeIn>
  );
}

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn direction="up" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Comment ca marche ?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Un parcours simple en 4 etapes
          </p>
        </FadeIn>

        {/* Steps */}
        <div className="relative">
          {/* Vertical dashed line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l-2 border-dashed border-slate-300" />

          <div className="space-y-12 md:space-y-16 relative">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
