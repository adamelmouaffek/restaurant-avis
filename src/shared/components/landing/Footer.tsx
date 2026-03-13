"use client";

import { Star, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/shared/components/animations";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/10 py-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Logo & subtitle */}
          <FadeIn direction="left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-6 h-6 text-white/80 fill-white/60" />
                <span className="text-xl font-bold text-white">
                  Restaurant Avis
                </span>
              </div>
              <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                La suite digitale tout-en-un pour les restaurants. Multipliez
                vos avis Google, gerez vos commandes et dominez votre marche
                local.
              </p>
            </div>
          </FadeIn>

          {/* Right: Link columns */}
          <FadeIn direction="right">
            <div className="grid grid-cols-3 gap-8">
              {/* Produit */}
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm">
                  Produit
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/r/la-belle-assiette"
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      Demo
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#tarifs"
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      Tarifs
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm">
                  Legal
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/mentions-legales"
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      Mentions legales
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/confidentialite"
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      Confidentialite
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm">
                  Contact
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="mailto:contact@restaurant-avis.fr"
                      className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      contact@restaurant-avis.fr
                    </a>
                  </li>
                  <li>
                    <span className="text-white/50 text-sm flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      Paris, France
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Copyright */}
        <p className="text-white/40 text-center text-sm">
          &copy; 2026 Restaurant Avis — Adam EL MOUAFFEK. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
}
