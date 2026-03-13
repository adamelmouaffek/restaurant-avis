"use client";

import { motion } from "motion/react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  highlightWords = [],
  highlightClassName = "bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent",
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        return (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${isHighlighted ? highlightClassName : ""}`}
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: delay + i * 0.06,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </span>
  );
}
