"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  Star,
  QrCode,
  BarChart3,
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
  ClipboardList,
  LayoutGrid,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getLabels } from "@/shared/lib/labels";
import type { EstablishmentType } from "@/shared/types";

interface SidebarProps {
  restaurantName: string;
  establishmentType?: EstablishmentType;
}

export function Sidebar({ restaurantName, establishmentType = "restaurant" }: SidebarProps) {
  const labels = getLabels(establishmentType);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Apercu", icon: LayoutDashboard },
    { href: "/dashboard/prizes", label: "Cadeaux", icon: Gift },
    { href: "/dashboard/reviews", label: "Avis", icon: Star },
    { href: "/dashboard/qr-codes", label: "QR Codes", icon: QrCode },
    { href: "/dashboard/menu", label: labels.menu, icon: UtensilsCrossed },
    { href: "/dashboard/orders", label: "Commandes", icon: ClipboardList },
    { href: "/dashboard/tables", label: labels.tables, icon: LayoutGrid },
    { href: "/dashboard/staff", label: "Equipe", icon: Users },
    { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Reglages", icon: Settings },
  ];

  const handleLogout = async () => {
    document.cookie =
      "dashboard_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/dashboard/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[var(--et-bg)] text-white">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-[var(--et-accent)] to-[var(--et-accent-light)]">
        <h2 className="text-lg font-bold text-white truncate">
          {restaurantName}
        </h2>
        <p className="text-xs text-white/70 mt-1">Back-office</p>
      </div>

      <div className="h-px bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--et-accent)] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-white/10" />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/60 hover:text-red-400 hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Deconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-[var(--et-bg)] text-white border-white/10 shadow-md"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--et-bg)] border-r border-white/10 transform transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[var(--et-bg)] border-r border-white/10">
        {navContent}
      </aside>
    </>
  );
}
