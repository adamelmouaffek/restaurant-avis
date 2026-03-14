"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hovered || value);

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} etoile${star > 1 ? "s" : ""}`}
            className={cn(
              "relative p-1 transition-transform duration-150 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm",
              isActive ? "scale-110" : "scale-100",
              "active:scale-125"
            )}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onTouchStart={() => setHovered(star)}
            onTouchEnd={() => setHovered(0)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-200",
                isActive
                  ? "fill-amber-400 stroke-amber-500"
                  : "fill-white/10 stroke-white/20"
              )}
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
