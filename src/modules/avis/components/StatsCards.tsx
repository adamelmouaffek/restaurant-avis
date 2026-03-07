"use client";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Star, MessageSquare, Users, Gift } from "lucide-react";

interface StatsCardsProps {
  totalReviews: number;
  avgRating: number;
  totalParticipations: number;
  totalPrizes: number;
}

const stats = [
  {
    key: "totalReviews" as const,
    label: "Total avis",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
    format: (v: number) => v.toString(),
  },
  {
    key: "avgRating" as const,
    label: "Note moyenne",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-50",
    format: (v: number) => (v > 0 ? `${v.toFixed(1)} / 5` : "--"),
  },
  {
    key: "totalParticipations" as const,
    label: "Participations",
    icon: Users,
    color: "text-green-600",
    bg: "bg-green-50",
    format: (v: number) => v.toString(),
  },
  {
    key: "totalPrizes" as const,
    label: "Cadeaux distribues",
    icon: Gift,
    color: "text-purple-600",
    bg: "bg-purple-50",
    format: (v: number) => v.toString(),
  },
];

export function StatsCards({
  totalReviews,
  avgRating,
  totalParticipations,
  totalPrizes,
}: StatsCardsProps) {
  const values = { totalReviews, avgRating, totalParticipations, totalPrizes };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.key} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stat.format(values[stat.key])}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
