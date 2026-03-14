"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, ClipboardList, Bell } from "lucide-react";
import ServiceNotificationBell from "./ServiceNotificationBell";
import { getLabels } from "@/shared/lib/labels";
import type { EstablishmentType } from "@/shared/types";

interface ServerLayoutProps {
  children: React.ReactNode;
  slug: string;
  staffName: string;
  restaurantName: string;
  notificationCount?: number;
  establishmentType?: EstablishmentType;
}

export default function ServerLayout({
  children,
  slug,
  staffName,
  restaurantName,
  establishmentType = "restaurant",
}: ServerLayoutProps) {
  const pathname = usePathname();
  const labels = getLabels(establishmentType);

  const TABS = [
    {
      key: "tables",
      label: labels.tables,
      icon: LayoutGrid,
      href: (s: string) => `/s/${s}/tables`,
      match: "/tables",
    },
    {
      key: "orders",
      label: "Commandes",
      icon: ClipboardList,
      href: (s: string) => `/s/${s}/orders`,
      match: "/orders",
    },
    {
      key: "notifications",
      label: "Alertes",
      icon: Bell,
      href: (s: string) => `/s/${s}/notifications`,
      match: "/notifications",
    },
  ];

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="min-w-0">
          <h1 className="text-base font-bold truncate">{restaurantName}</h1>
          <p className="text-xs text-blue-300 truncate">{staffName}</p>
        </div>
        <ServiceNotificationBell slug={slug} />
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-white/10 z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {TABS.map((tab) => {
            const isActive = pathname?.includes(tab.match) ?? false;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.key}
                href={tab.href(slug)}
                className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-400"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`}
                />
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
