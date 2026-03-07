"use client";

import { useEffect, useRef, useState } from "react";

interface CartBadgeProps {
  count: number;
  onClick: () => void;
}

export default function CartBadge({ count, onClick }: CartBadgeProps) {
  // Animation scale au changement du compteur
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count !== prevCountRef.current && count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = count;
  }, [count]);

  // Cache le badge quand le panier est vide
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50">
      <button
        onClick={onClick}
        className={[
          "flex items-center gap-2 h-14 px-5 rounded-full bg-gray-900 text-white shadow-lg",
          "transition-all duration-200 hover:bg-gray-700 hover:shadow-xl active:scale-95",
          isAnimating ? "scale-110" : "scale-100",
        ].join(" ")}
        aria-label={`Voir le panier — ${count} article${count > 1 ? "s" : ""}`}
      >
        {/* Icone panier */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 shrink-0"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
        </svg>

        {/* Nombre d'articles */}
        <span className="font-semibold text-base tabular-nums">
          {count} article{count > 1 ? "s" : ""}
        </span>
      </button>
    </div>
  );
}
