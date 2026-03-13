"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UtensilsCrossed,
  ChefHat,
  MonitorSmartphone,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

// ─── Demo access links ──────────────────────────────────
// Login credentials (for demo):
//   Admin dashboard : admin@labelleassiette.fr / admin123
//   Menu client     : no login needed (public)
//   KDS cuisine     : no login needed (public, /kds/la-belle-assiette)
//   Serveur         : no login needed (public, /m/la-belle-assiette/table/1)
const demoLinks = [
  {
    label: "Menu",
    href: "/m/la-belle-assiette/table/1",
    icon: UtensilsCrossed,
    description: "Client scanne le QR",
  },
  {
    label: "Serveur",
    href: "/m/la-belle-assiette/table/1",
    icon: MonitorSmartphone,
    description: "Vue table serveur",
  },
  {
    label: "Cuisine",
    href: "/kds/la-belle-assiette",
    icon: ChefHat,
    description: "Ecran cuisine (KDS)",
  },
  {
    label: "Admin",
    href: "/dashboard/login",
    icon: LayoutDashboard,
    description: "Dashboard gerant",
  },
];

const navLinks = [
  { label: "Fonctionnalites", href: "#fonctionnalites" },
  { label: "Tarifs", href: "#tarifs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "bg-[#0F172A]/85 backdrop-blur-2xl border-b border-blue-500/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Restaurant Avis
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Page links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-underline text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Separator */}
            <div className="w-px h-5 bg-white/15" />

            {/* Demo access buttons */}
            {demoLinks.map((demo) => {
              const Icon = demo.icon;
              return (
                <Link key={demo.label} href={demo.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10 text-xs gap-1.5 h-8 px-2.5 transition-all"
                    title={demo.description}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {demo.label}
                  </Button>
                </Link>
              );
            })}

            {/* Separator */}
            <div className="w-px h-5 bg-white/15" />

            {/* Primary CTA */}
            <Link href="/r/la-belle-assiette">
              <Button
                className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm h-9 px-4"
                size="sm"
              >
                Demo Avis
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-[#0F172A]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-4">
              {/* Page links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white/70 hover:text-white text-sm font-medium transition-colors py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Separator */}
              <div className="border-t border-white/10" />

              {/* Demo access grid */}
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                Tester la plateforme
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoLinks.map((demo) => {
                  const Icon = demo.icon;
                  return (
                    <Link
                      key={demo.label}
                      href={demo.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {demo.label}
                        </p>
                        <p className="text-white/40 text-[10px]">
                          {demo.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                href="/r/la-belle-assiette"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 hover:opacity-90 transition-opacity mt-2">
                  Demo Avis
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
