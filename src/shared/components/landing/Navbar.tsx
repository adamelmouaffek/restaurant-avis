"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              Restaurant Avis
            </span>
          </Link>

          {/* Desktop nav — visible from md (768px) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-underline text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/dashboard/login"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              Se connecter
            </Link>

            <div className="w-px h-5 bg-white/15" />

            <Link href="/dashboard/signup">
              <Button
                className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm h-9 px-4"
                size="sm"
              >
                S&apos;inscrire gratuitement
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger — hidden from md */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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

      {/* Mobile menu — hidden from md */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#0F172A]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white/70 hover:text-white text-base font-medium transition-colors py-2.5 min-h-[44px] flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/10 my-2" />

              <Link
                href="/dashboard/login"
                className="block text-white/70 hover:text-white text-base font-medium py-2.5 min-h-[44px] flex items-center justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Se connecter
              </Link>

              <Link
                href="/dashboard/signup"
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <Button className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 hover:opacity-90 transition-opacity text-base font-semibold">
                  S&apos;inscrire gratuitement
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
