"use client";

import { useState, useCallback } from "react";
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

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
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

  const segmentAngle = 360 / prizes.length;
  const cx = 200;
  const cy = 200;
  const radius = 185;

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

      const targetAngle = data.angle as number;
      const newRotation = rotation + targetAngle;
      setRotation(newRotation);

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
      setError("Erreur de connexion. Veuillez reessayer.");
      setIsSpinning(false);
    }
  }, [isSpinning, rotation, restaurantId, participantId, reviewId, onPrizeWon]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto px-2">
      {/* Wheel */}
      <div className="relative w-full aspect-square max-w-[340px]">
        {/* Arrow indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" style={{ marginTop: "-4px" }}>
          <svg width="36" height="44" viewBox="0 0 36 44">
            <defs>
              <filter id="arrow-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
              </filter>
              <linearGradient id="arrow-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <polygon
              points="18,42 3,6 33,6"
              fill="url(#arrow-grad)"
              stroke="#b45309"
              strokeWidth="1.5"
              filter="url(#arrow-shadow)"
            />
          </svg>
        </div>

        {/* Outer decorative ring */}
        <div className="absolute inset-0 rounded-full border-[6px] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]" />

        {/* Inner dotted ring */}
        <div className="absolute inset-[6px] rounded-full border-[3px] border-amber-800/20" />

        {/* SVG Wheel */}
        <div className="absolute inset-[8px]">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            <defs>
              <radialGradient id="seg-overlay" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                <stop offset="80%" stopColor="black" stopOpacity="0.08" />
              </radialGradient>
              <filter id="txt-shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Clip to circle */}
            <clipPath id="wheel-clip">
              <circle cx={cx} cy={cy} r={radius} />
            </clipPath>

            <g clipPath="url(#wheel-clip)">
              {prizes.map((prize, i) => {
                const startAngle = segmentAngle * i;
                const endAngle = segmentAngle * (i + 1);
                const midAngle = startAngle + segmentAngle / 2;

                // Icon near the outer edge
                const iconR = radius * 0.78;
                const iconPos = polarToCartesian(cx, cy, iconR, midAngle - 90);

                // Text at mid-radius
                const textR = radius * 0.52;
                const textPos = polarToCartesian(cx, cy, textR, midAngle - 90);

                return (
                  <g key={prize.id}>
                    {/* Colored segment */}
                    <path
                      d={describeArc(cx, cy, radius, startAngle, endAngle)}
                      fill={prize.color}
                    />
                    {/* Depth overlay */}
                    <path
                      d={describeArc(cx, cy, radius, startAngle, endAngle)}
                      fill="url(#seg-overlay)"
                    />
                    {/* Segment border */}
                    <path
                      d={describeArc(cx, cy, radius, startAngle, endAngle)}
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.5"
                    />

                    {/* Icon */}
                    <text
                      x={iconPos.x}
                      y={iconPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="28"
                      filter="url(#txt-shadow)"
                      transform={`rotate(${midAngle}, ${iconPos.x}, ${iconPos.y})`}
                    >
                      {prize.icon}
                    </text>

                    {/* Prize name */}
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fontWeight="700"
                      fill="white"
                      filter="url(#txt-shadow)"
                      transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                    >
                      {prize.name.length > 15 ? prize.name.slice(0, 14) + "..." : prize.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Center hub */}
            <circle cx={cx} cy={cy} r="42" fill="white" stroke="#d4d4d8" strokeWidth="2" />
            <circle cx={cx} cy={cy} r="34" fill="#1f2937" />
            <circle cx={cx} cy={cy} r="26" fill="#374151" />
            <circle cx={cx} cy={cy} r="18" fill="#4b5563" />
            <text
              x={cx}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="18"
              fill="#fbbf24"
              fontWeight="bold"
            >
              ★
            </text>
          </svg>
        </div>

        {/* Idle glow pulse */}
        {!isSpinning && !alreadySpun && (
          <div
            className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
            style={{
              boxShadow: "0 0 40px rgba(245, 158, 11, 0.25), 0 0 80px rgba(245, 158, 11, 0.08)",
            }}
          />
        )}
      </div>

      {/* Already spun */}
      {alreadySpun && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center w-full space-y-3">
          <div className="text-4xl">🎡</div>
          <p className="text-base font-semibold text-amber-800">
            Vous avez deja tourne la roue !
          </p>
          <p className="text-sm text-amber-600">
            Chaque participant ne peut tourner qu&apos;une seule fois.
          </p>
        </div>
      )}

      {/* Error */}
      {error && !alreadySpun && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center w-full">
          {error}
        </div>
      )}

      {/* Spin button */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || alreadySpun}
        className="w-full max-w-[300px] h-16 text-xl font-bold rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.97] disabled:scale-100 disabled:shadow-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
      >
        {isSpinning ? (
          <span className="flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            La roue tourne...
          </span>
        ) : alreadySpun ? (
          "Deja joue"
        ) : (
          "Tournez la roue !"
        )}
      </Button>
    </div>
  );
}
