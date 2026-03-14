"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  CheckCircle2,
  Circle,
  UtensilsCrossed,
  Users,
  LayoutGrid,
  ExternalLink,
  X,
  Rocket,
} from "lucide-react";
import { getLabels } from "@/shared/lib/labels";
import type { EstablishmentType } from "@/shared/types";

interface OnboardingChecklistProps {
  slug: string;
  staffCount: number;
  menuItemCount: number;
  tableCount: number;
  establishmentType?: EstablishmentType;
}

const DISMISS_KEY = "onboarding_dismissed";

export function OnboardingChecklist({
  slug,
  staffCount,
  menuItemCount,
  tableCount,
  establishmentType = "restaurant",
}: OnboardingChecklistProps) {
  const labels = getLabels(establishmentType);
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const steps = [
    {
      label: `Ajouter des articles ${labels.menu === "Menu" ? "au menu" : "a la carte"}`,
      href: "/dashboard/menu",
      done: menuItemCount > 0,
      icon: UtensilsCrossed,
    },
    {
      label: `Creer votre equipe (${labels.staffLabel}, ${labels.kitchen.toLowerCase()})`,
      href: "/dashboard/staff",
      done: staffCount > 0,
      icon: Users,
    },
    {
      label: `Configurer vos ${labels.tables.toLowerCase()}`,
      href: "/dashboard/tables",
      done: tableCount > 2,
      icon: LayoutGrid,
    },
    {
      label: `Tester ${labels.menu === "Menu" ? "le menu" : "la carte"} client`,
      href: `/m/${slug}/table/1`,
      done: false,
      icon: ExternalLink,
      external: true,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount >= 3; // 3 actionable steps (4th is always unchecked)

  if (dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Rocket className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {allDone ? `Votre ${labels.establishment} est pret !` : `Bienvenue ! Configurez votre ${labels.establishment}`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {completedCount}/3 etapes completees
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-blue-100 mb-4 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const Check = step.done ? CheckCircle2 : Circle;
            return (
              <Link
                key={step.label}
                href={step.href}
                target={step.external ? "_blank" : undefined}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.done
                    ? "bg-green-50 text-green-700"
                    : "bg-white hover:bg-blue-50 text-foreground"
                }`}
              >
                <Check
                  className={`w-5 h-5 flex-shrink-0 ${
                    step.done ? "text-green-500" : "text-muted-foreground"
                  }`}
                />
                <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">{step.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
