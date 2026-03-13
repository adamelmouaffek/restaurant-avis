"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Navbar } from "@/shared/components/landing/Navbar";
import { HeroSection } from "@/shared/components/landing/HeroSection";
import { LogoBar } from "@/shared/components/landing/LogoBar";
import { ModulesGrid } from "@/shared/components/landing/ModulesGrid";
import { HowItWorks } from "@/shared/components/landing/HowItWorks";
import { StatsImpact } from "@/shared/components/landing/StatsImpact";
import { BeforeAfter } from "@/shared/components/landing/BeforeAfter";
import { Testimonials } from "@/shared/components/landing/Testimonials";
import { PricingSection } from "@/shared/components/landing/PricingSection";
import { FAQSection } from "@/shared/components/landing/FAQSection";
import { FinalCTA } from "@/shared/components/landing/FinalCTA";
import { Footer } from "@/shared/components/landing/Footer";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] z-[70] origin-left"
        style={{ scaleX: scaleProgress }}
      />

      {/* Navigation */}
      <Navbar />

      {/* 1. Hero (dark) */}
      <HeroSection />

      {/* 2. Logo Bar (dark → light transition) */}
      <LogoBar />

      {/* 3. 5 Modules (light) */}
      <ModulesGrid />

      {/* 4. How It Works (light) */}
      <HowItWorks />

      {/* 5. Stats Impact (dark) */}
      <StatsImpact />

      {/* 6. Before / After (light) */}
      <BeforeAfter />

      {/* 7. Testimonials (light) */}
      <Testimonials />

      {/* 8. Pricing (light) */}
      <PricingSection />

      {/* 9. FAQ (light) */}
      <FAQSection />

      {/* 10. Final CTA (dark) — includes transition gradient */}
      <FinalCTA />

      {/* 11. Footer (dark) */}
      <Footer />
    </div>
  );
}
