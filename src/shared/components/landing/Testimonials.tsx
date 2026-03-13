"use client";

import { Star } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
} from "@/shared/components/animations";

interface Testimonial {
  name: string;
  restaurant: string;
  initials: string;
  quote: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie Dubois",
    restaurant: "Le Petit Comptoir",
    initials: "MD",
    quote:
      "En 3 semaines, on est passe de 45 a 120 avis Google. La roue cadeaux est geniale, les clients adorent !",
    stars: 5,
  },
  {
    name: "Thomas Martin",
    restaurant: "Brasserie du Marche",
    initials: "TM",
    quote:
      "Le systeme est ultra-simple. Nos serveurs n'ont rien a faire, tout est automatise via le QR code.",
    stars: 5,
  },
  {
    name: "Sophie Laurent",
    restaurant: "Cafe de la Place",
    initials: "SL",
    quote:
      "Le dashboard me permet de suivre tout en temps reel. Et le menu digital a augmente notre panier moyen de 20%.",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn direction="up" className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ce que disent nos restaurateurs
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Des resultats concrets, mesurables
          </p>
        </FadeIn>

        {/* Testimonial cards */}
        <StaggerContainer
          stagger={0.15}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <GlowCard className="p-6 h-full">
                <div className="flex flex-col h-full">
                  {/* Avatar and info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-white font-bold text-sm shrink-0">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {testimonial.restaurant}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="mb-4">
                    <StarRating count={testimonial.stars} />
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 italic leading-relaxed flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
