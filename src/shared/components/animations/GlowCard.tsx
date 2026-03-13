"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  glowColor?: string;
  className?: string;
  hoverScale?: number;
  dark?: boolean;
}

export function GlowCard({
  children,
  glowColor = "rgba(255,107,53,0.4)",
  className = "",
  hoverScale = 1.02,
  dark = false,
}: GlowCardProps) {
  const dimGlow = glowColor.replace(/[\d.]+\)$/, "0.1)");
  return (
    <motion.div
      className={`rounded-xl border transition-shadow duration-300 ${
        dark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
      } ${className}`}
      whileHover={{
        scale: hoverScale,
        y: -4,
        boxShadow: `0 0 20px ${glowColor}, 0 0 60px ${dimGlow}`,
      }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
