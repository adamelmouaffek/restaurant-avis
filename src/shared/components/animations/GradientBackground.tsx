"use client";

import { motion } from "motion/react";

export function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f59e0b, #ea580c)" }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #f97316, #dc2626)" }}
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #fbbf24, #f59e0b)" }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
