"use client";

import { motion } from "motion/react";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  TextReveal,
  ParallaxSection,
  DarkGradientMesh,
  FadeIn,
} from "@/shared/components/animations";

export function HeroSection() {
  return (
    <section className="section-dark relative min-h-screen flex items-center overflow-hidden">
      {/* Animated background mesh */}
      <DarkGradientMesh />

      {/* Content */}
      <div className="relative z-10 w-full">
        <ParallaxSection speed={0.8} className="w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
            {/* Badge */}
            <FadeIn delay={0.1}>
              <div className="flex justify-center mb-8">
                <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm font-medium">
                  +50 avis Google en 60 jours — Garanti
                </Badge>
              </div>
            </FadeIn>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
              <TextReveal
                text="Multipliez vos avis Google"
                delay={0.2}
                highlightWords={["avis", "Google"]}
                highlightClassName="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80"
              />
              <br />
              <TextReveal
                text="par 6 en 30 jours"
                delay={0.6}
                highlightWords={["6"]}
                highlightClassName="text-gradient-emerald"
              />
            </h1>

            {/* Subtitle */}
            <FadeIn delay={0.8}>
              <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                La suite digitale tout-en-un pour les restaurants. Menu QR, avis
                Google, roue cadeaux, KDS — tout dans une seule plateforme.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={1.0}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/dashboard/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white border-0 hover:glow-emerald transition-all text-base px-8 h-12 gap-2"
                  >
                    Essai gratuit
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#fonctionnalites">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent text-base px-8 h-12"
                  >
                    Decouvrir les fonctionnalites
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Social proof */}
            <FadeIn delay={1.2}>
              <motion.div
                className="flex items-center justify-center gap-2 text-white/60 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <span>Utilise par 50+ restaurants</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </ParallaxSection>
      </div>
    </section>
  );
}
