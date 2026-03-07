"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import type { Prize } from "@/shared/types";
import type { SpinResult } from "@/modules/avis/types";

interface SpinningWheelProps {
  prizes: Prize[];
  restaurantId: string;
  participantId: string;
  reviewId: string;
  onPrizeWon: (result: SpinResult) => void;
}

export function SpinningWheel({
  prizes,
  restaurantId,
  participantId,
  reviewId,
  onPrizeWon,
}: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / prizes.length;

  // Build conic-gradient segments
  const conicGradient = prizes
    .map((prize, i) => {
      const start = (segmentAngle * i).toFixed(2);
      const end = (segmentAngle * (i + 1)).toFixed(2);
      return `${prize.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    setError(null);
    setIsSpinning(true);

    try {
      const response = await fetch("/api/avis/wheel/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          participant_id: participantId,
          review_id: reviewId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setAlreadySpun(true);
        } else {
          setError(data.error || "Erreur lors du tirage.");
        }
        setIsSpinning(false);
        return;
      }

      // Angle from API + current rotation to keep spinning forward
      const targetAngle = data.angle as number;
      const newRotation = rotation + targetAngle;
      setRotation(newRotation);

      // Wait for animation to complete (4s) then reveal prize
      setTimeout(() => {
        setIsSpinning(false);
        onPrizeWon({
          prizeId: data.prizeId,
          prizeName: data.prizeName,
          prizeDescription: data.prizeDescription,
          prizeIcon: data.prizeIcon,
          prizeColor: data.prizeColor,
          segmentIndex: data.segmentIndex,
        });
      }, 4200);
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
      setIsSpinning(false);
    }
  }, [isSpinning, rotation, restaurantId, participantId, reviewId, onPrizeWon]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4">
      {/* Wheel container */}
      <div className="relative w-full aspect-square max-w-[320px]">
        {/* Arrow indicator - top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div
            className="w-0 h-0 drop-shadow-md"
            style={{
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "28px solid #1f2937",
            }}
          />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full shadow-2xl border-4 border-gray-800 overflow-hidden"
          style={{
            background: `conic-gradient(${conicGradient})`,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          {/* Prize labels on each segment */}
          {prizes.map((prize, i) => {
            const midAngle = segmentAngle * i + segmentAngle / 2;
            return (
              <div
                key={prize.id}
                className="absolute top-0 left-1/2 h-1/2 origin-bottom"
                style={{
                  transform: `rotate(${midAngle}deg) translateX(-50%)`,
                  width: "2px",
                }}
              >
                <div
                  className="absolute top-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap"
                  style={{
                    transform: "rotate(0deg)",
                  }}
                >
                  <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] select-none">
                    {prize.icon}
                  </span>
                  <span className="block text-[8px] sm:text-[10px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] select-none max-w-[60px] truncate">
                    {prize.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border-4 border-gray-800 z-10 flex items-center justify-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full" />
        </div>
      </div>

      {/* Already spun message */}
      {alreadySpun && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 text-center w-full space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-amber-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-amber-800">
            Vous avez deja tourne la roue !
          </p>
          <p className="text-xs text-amber-600">
            Chaque participant ne peut tourner la roue qu&apos;une seule fois.
          </p>
        </div>
      )}

      {/* Error */}
      {error && !alreadySpun && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center w-full">
          {error}
        </div>
      )}

      {/* Spin button */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || alreadySpun}
        className="w-full max-w-[280px] h-14 text-lg font-bold rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:shadow-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            La roue tourne...
          </span>
        ) : (
          "Tournez la roue !"
        )}
      </Button>
    </div>
  );
}
