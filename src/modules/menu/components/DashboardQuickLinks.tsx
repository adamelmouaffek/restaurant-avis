"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  ClipboardList,
  QrCode,
  MonitorSmartphone,
  Gift,
  Star,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { getLabels } from "@/shared/lib/labels";
import type { EstablishmentType } from "@/shared/types";

interface DashboardQuickLinksProps {
  slug: string;
  establishmentType?: EstablishmentType;
}

const links = [
  {
    href: "/dashboard/menu",
    icon: UtensilsCrossed,
    label: "Gerer le menu",
    desc: "Categories, plats, photos, prix",
    color: "text-orange-600",
    bg: "bg-orange-50 hover:bg-orange-100",
    external: false,
  },
  {
    href: "/dashboard/orders",
    icon: ClipboardList,
    label: "Commandes",
    desc: "Suivi des commandes en cours",
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100",
    external: false,
  },
  {
    href: "/dashboard/qr-codes",
    icon: QrCode,
    label: "QR Codes",
    desc: "Menu + Avis par table",
    color: "text-indigo-600",
    bg: "bg-indigo-50 hover:bg-indigo-100",
    external: false,
  },
  {
    href: "/dashboard/prizes",
    icon: Gift,
    label: "Cadeaux",
    desc: "Configurer la roue",
    color: "text-purple-600",
    bg: "bg-purple-50 hover:bg-purple-100",
    external: false,
  },
  {
    href: "/dashboard/reviews",
    icon: Star,
    label: "Avis",
    desc: "Consulter les avis recus",
    color: "text-amber-600",
    bg: "bg-amber-50 hover:bg-amber-100",
    external: false,
  },
  {
    href: "/dashboard/stats",
    icon: BarChart3,
    label: "Statistiques",
    desc: "Performance et analytics",
    color: "text-green-600",
    bg: "bg-green-50 hover:bg-green-100",
    external: false,
  },
];

export function DashboardQuickLinks({ slug, establishmentType = "restaurant" }: DashboardQuickLinksProps) {
  const labels = getLabels(establishmentType);
  const externalLinks = [
    {
      href: `/m/${slug}/table/1`,
      icon: UtensilsCrossed,
      label: "Menu client",
      desc: "Voir le menu comme un client",
      color: "text-orange-600",
      bg: "bg-orange-50 hover:bg-orange-100",
    },
    {
      href: `/s/${slug}`,
      icon: ClipboardList,
      label: labels.serverSpace,
      desc: "Gestion des tables et commandes",
      color: "text-emerald-600",
      bg: "bg-emerald-50 hover:bg-emerald-100",
    },
    {
      href: `/kds/${slug}`,
      icon: MonitorSmartphone,
      label: labels.kitchenScreen,
      desc: "KDS temps reel",
      color: "text-sky-600",
      bg: "bg-sky-50 hover:bg-sky-100",
    },
    {
      href: `/r/${slug}`,
      icon: Gift,
      label: "Parcours avis",
      desc: "Tester le flow client",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Acces rapide</h2>

      {/* Liens dashboard internes */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-colors ${link.bg}`}
            >
              <Icon className={`w-6 h-6 ${link.color}`} />
              <span className="text-sm font-medium">{link.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{link.desc}</span>
            </Link>
          );
        })}
      </div>

      {/* Liens externes (vue client) */}
      {slug && (
        <>
          <h3 className="text-sm font-medium text-muted-foreground mt-4">Vue client (liens publics)</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {externalLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  className={`rounded-xl border p-3 flex items-center gap-3 transition-colors ${link.bg}`}
                >
                  <Icon className={`w-5 h-5 ${link.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block">{link.label}</span>
                    <span className="text-[10px] text-muted-foreground">{link.desc}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
