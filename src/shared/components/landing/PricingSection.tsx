"use client";

import { Check, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
} from "@/shared/components/animations";
import Link from "next/link";

const essentialFeatures = [
  "Menu QR + Commande + Paiement",
  "Site web SEO (5 pages)",
  "Google Maps GMB optimise",
  "Formation gerant 1h (Zoom)",
];

const allInOneFeatures = [
  "Tout l'Essentiel +",
  "Roue Cadeaux + Avis (OAuth Google)",
  "Campagnes Google Ads (SEA)",
  "Reseaux Sociaux (Instagram, Facebook, TikTok)",
  "Maintenance 3 mois incluse",
  "Site SEO 10 pages",
];

const subscriptions = [
  {
    name: "Maintenance",
    price: "49",
    description: "Mises a jour + support technique",
  },
  {
    name: "Growth",
    price: "149",
    description: "Maintenance + automation reseaux sociaux",
  },
  {
    name: "Full Pilotage",
    price: "249",
    description: "Growth + gestion Google Ads",
  },
];

export function PricingSection() {
  return (
    <section id="tarifs" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nos offres
            </h2>
            <p className="text-lg text-slate-600">
              Investissement unique + abonnement mensuel optionnel
            </p>
          </div>
        </FadeIn>

        {/* One-Shot Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Essentiel */}
          <StaggerItem>
            <GlowCard className="p-0 h-full">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Essentiel
                </h3>
                <p className="text-slate-600 mb-6">
                  L&apos;indispensable pour demarrer
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-slate-900">
                    1 490
                  </span>
                  <span className="text-slate-600 ml-2">EUR HT</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {essentialFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#contact">
                  <Button variant="outline" className="w-full">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </GlowCard>
          </StaggerItem>

          {/* Tout-en-un */}
          <StaggerItem>
            <GlowCard
              glowColor="rgba(59,130,246,0.4)"
              className="p-0 h-full border-2 border-[#3B82F6] relative"
            >
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 px-4 py-1">
                Recommande
              </Badge>
              <div className="p-8 pt-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Tout-en-un
                </h3>
                <p className="text-slate-600 mb-6">
                  La suite complete pour dominer Google
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-slate-900">
                    2 990
                  </span>
                  <span className="text-slate-600 ml-2">EUR HT</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {allInOneFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#3B82F6] mt-0.5 shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#contact">
                  <Button className="w-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 hover:opacity-90">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </GlowCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Subscriptions */}
        <FadeIn>
          <h3 className="text-lg font-semibold text-center mt-12 mb-6 text-slate-900">
            Abonnements mensuels
          </h3>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <StaggerItem key={sub.name}>
              <GlowCard className="p-6 text-center h-full">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {sub.name}
                </h4>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {sub.price}
                  </span>
                  <span className="text-slate-500 ml-1">EUR/mois</span>
                </div>
                <p className="text-sm text-slate-600">{sub.description}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Guarantee Banner */}
        <FadeIn delay={0.3}>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8 flex items-center gap-4">
            <Shield className="w-8 h-8 text-blue-600 shrink-0" />
            <p className="text-blue-800 font-medium">
              Garantie : 50 avis Google en 60 jours ou on continue gratuitement
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
