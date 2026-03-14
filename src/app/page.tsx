"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { Navbar } from "@/shared/components/landing/Navbar";
import { HeroSection } from "@/shared/components/landing/HeroSection";

// Lazy load below-the-fold sections for better LCP
const LogoBar = dynamic(() => import("@/shared/components/landing/LogoBar").then((m) => m.LogoBar));
const ModulesGrid = dynamic(() => import("@/shared/components/landing/ModulesGrid").then((m) => m.ModulesGrid));
const HowItWorks = dynamic(() => import("@/shared/components/landing/HowItWorks").then((m) => m.HowItWorks));
const StatsImpact = dynamic(() => import("@/shared/components/landing/StatsImpact").then((m) => m.StatsImpact));
const BeforeAfter = dynamic(() => import("@/shared/components/landing/BeforeAfter").then((m) => m.BeforeAfter));
const Testimonials = dynamic(() => import("@/shared/components/landing/Testimonials").then((m) => m.Testimonials));
const PricingSection = dynamic(() => import("@/shared/components/landing/PricingSection").then((m) => m.PricingSection));
const FAQSection = dynamic(() => import("@/shared/components/landing/FAQSection").then((m) => m.FAQSection));
const FinalCTA = dynamic(() => import("@/shared/components/landing/FinalCTA").then((m) => m.FinalCTA));
const Footer = dynamic(() => import("@/shared/components/landing/Footer").then((m) => m.Footer));

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

      {/* 1. Hero (dark) — loaded immediately for LCP */}
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

      {/* 10. Final CTA (dark) */}
      <FinalCTA />

      {/* 11. Footer (dark) */}
      <Footer />
    </div>
  );
}
