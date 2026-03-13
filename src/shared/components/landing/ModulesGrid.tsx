"use client";

import { QrCode, Gift, Globe, MapPin, Share2, type LucideIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
} from "@/shared/components/animations";

interface ModuleData {
  title: string;
  icon: LucideIcon;
  color: string;
  glowColor: string;
  borderColor: string;
  features: string[];
  badge: { label: string; className: string };
}

const modules: ModuleData[] = [
  {
    title: "Menu QR + Commande",
    icon: QrCode,
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.4)",
    borderColor: "#3B82F6",
    features: [
      "Menu digital avec photos HD, allergenes, disponibilite temps reel",
      "Commande directe depuis le telephone du client",
      "Paiement Apple Pay / Google Pay integre",
      "Upsell automatique (+25% panier moyen)",
    ],
    badge: { label: "Deploye", className: "bg-blue-100 text-blue-700" },
  },
  {
    title: "Roue Cadeaux + Avis",
    icon: Gift,
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.4)",
    borderColor: "#3B82F6",
    features: [
      "Roue animee apres chaque avis Google",
      "Cadeaux personnalisables (cafe, dessert, reduction...)",
      "Anti-abus : 1 participation par client",
      "Conforme DGCCRF (cadeau non conditionne a la note)",
    ],
    badge: { label: "Deploye", className: "bg-blue-100 text-blue-700" },
  },
  {
    title: "Site Web SEO",
    icon: Globe,
    color: "#8B5CF6",
    glowColor: "rgba(139,92,246,0.4)",
    borderColor: "#8B5CF6",
    features: [
      "Landing page auto-generee, Schema.org",
      "Blog IA + Google Ads local",
      "+300% visibilite en ligne",
    ],
    badge: { label: "Bientot", className: "bg-amber-100 text-amber-700" },
  },
  {
    title: "Google Maps & GMB",
    icon: MapPin,
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.4)",
    borderColor: "#3B82F6",
    features: [
      "Fiche Google optimisee, posts automatiques",
      "Reponses IA aux avis clients",
      "Objectif : Top 3 recherche locale",
    ],
    badge: { label: "Bientot", className: "bg-amber-100 text-amber-700" },
  },
  {
    title: "Reseaux Sociaux",
    icon: Share2,
    color: "#EC4899",
    glowColor: "rgba(236,72,153,0.4)",
    borderColor: "#EC4899",
    features: [
      "Videos automatiques (photo → Reel vertical)",
      "Publications planifiees Instagram, Facebook, TikTok",
      "4 posts/semaine en pilote automatique",
    ],
    badge: { label: "Bientot", className: "bg-amber-100 text-amber-700" },
  },
];

function ModuleCard({ module }: { module: ModuleData }) {
  const Icon = module.icon;

  return (
    <GlowCard glowColor={module.glowColor} className="h-full">
      <div
        className="p-6 h-full flex flex-col"
        style={{ borderLeft: `4px solid ${module.borderColor}` }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${module.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: module.color }} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          {module.title}
        </h3>

        {/* Features */}
        <ul className="flex-1 space-y-2 mb-4">
          {module.features.map((feature, i) => (
            <li
              key={i}
              className="text-sm text-slate-600 flex items-start gap-2"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: module.color }}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* Badge */}
        <div className="flex justify-end">
          <Badge className={`${module.badge.className} border-0`}>
            {module.badge.label}
          </Badge>
        </div>
      </div>
    </GlowCard>
  );
}

export function ModulesGrid() {
  const largeModules = modules.slice(0, 2);
  const smallModules = modules.slice(2, 5);

  return (
    <section id="fonctionnalites" className="section-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              5 modules pour digitaliser votre restaurant
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une suite complete qui couvre tous vos besoins digitaux
            </p>
          </div>
        </FadeIn>

        {/* Bento grid */}
        <StaggerContainer stagger={0.12} className="space-y-6">
          {/* Top row: 2 large cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {largeModules.map((module) => (
              <StaggerItem key={module.title}>
                <ModuleCard module={module} />
              </StaggerItem>
            ))}
          </div>

          {/* Bottom row: 3 smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smallModules.map((module) => (
              <StaggerItem key={module.title}>
                <ModuleCard module={module} />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
