"use client";

import { FadeIn } from "@/shared/components/animations";
import { LogoCarousel } from "@/shared/components/animations";

const logos = [
  { name: "Le Comptoir" },
  { name: "Brasserie Victor Hugo" },
  { name: "Cafe de Flore" },
  { name: "La Rotonde" },
  { name: "Le Petit Cler" },
  { name: "Chez Marcel" },
  { name: "L'Ardoise" },
  { name: "Le Bouillon" },
];

export function LogoBar() {
  return (
    <section className="py-16 relative bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-center text-sm font-medium tracking-widest uppercase mb-10 text-white/50">
            Ils nous font confiance
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="text-white">
            <LogoCarousel logos={logos} speed={30} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
