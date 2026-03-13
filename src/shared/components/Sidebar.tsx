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
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Apercu", icon: LayoutDashboard },
  { href: "/dashboard/prizes", label: "Cadeaux", icon: Gift },
  { href: "/dashboard/reviews", label: "Avis", icon: Star },
  { href: "/dashboard/qr-codes", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/orders", label: "Commandes", icon: ClipboardList },
  { href: "/dashboard/tables", label: "Tables", icon: LayoutGrid },
  { href: "/dashboard/staff", label: "Equipe", icon: Users },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
];

interface SidebarProps {
  restaurantName: string;
}

export function Sidebar({ restaurantName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-foreground truncate">
          {restaurantName}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Back-office</p>
      </div>

      <Separator />

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
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
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
          className="bg-white shadow-md"
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
        {navContent}
      </aside>
    </>
  );
}
