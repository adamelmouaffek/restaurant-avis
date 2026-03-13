"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
