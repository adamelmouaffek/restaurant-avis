"use client";

import { motion } from "motion/react";

export function DarkGradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #3B82F6, #6366F1)" }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #6366F1, #818CF8)" }}
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, #3B82F6, #818CF8)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
