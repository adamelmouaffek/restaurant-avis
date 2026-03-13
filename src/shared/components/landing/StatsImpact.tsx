"use client";

import { TrendingUp, Clock, Users, Zap, type LucideIcon } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  DarkGradientMesh,
} from "@/shared/components/animations";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: TrendingUp,
    value: 6,
    suffix: "x",
    label: "Plus d'avis Google",
  },
  {
    icon: Clock,
    value: 30,
    suffix: "j",
    label: "Pour voir les resultats",
  },
  {
    icon: Users,
    value: 98,
    suffix: "%",
    label: "Clients satisfaits",
  },
  {
    icon: Zap,
    value: 5,
    suffix: "min",
    label: "Pour s'installer",
  },
];

export function StatsImpact() {
  return (
    <>
      {/* Transition gradient from light to dark */}
      <div className="h-24 bg-gradient-to-b from-[#f8fafc] to-[#0F172A]" />

      <section className="bg-[#0F172A] relative py-20">
        {/* Animated background mesh */}
        <DarkGradientMesh />

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <StaggerContainer
            stagger={0.1}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={stat.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <Icon className="w-8 h-8 text-white/70" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold mb-2">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      className="text-white"
                    />
                  </div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
