"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/shared/components/ui/button";
import type { Prize } from "@/shared/types";
import type { SpinResult } from "@/modules/avis/types";

interface SpinningWheelProps {
  prizes: Prize[];
  restaurantId: string;
  participantId: string;
  reviewId: string;
  slug: string;
  onPrizeWon: (result: SpinResult) => void;
}

// ─── Geometry helpers ─────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const a = polar(cx, cy, r, endDeg);
  const b = polar(cx, cy, r, startDeg);
  const lg = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${a.x},${a.y} A${r},${r} 0 ${lg} 0 ${b.x},${b.y} Z`;
}

// ─── Colors — blue alternating ───────────────────
const C1 = "#1E40AF";
const C2 = "#60A5FA";
const GOLD = "#3B82F6";

export function SpinningWheel({
  prizes,
  restaurantId,
  participantId,
  reviewId,
  slug,
  onPrizeWon,
}: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [alreadySpun, setAlreadySpun] = useState(false);

  const n = prizes.length;
  const seg = 360 / n;
  const CX = 250;
  const CY = 250;
  const R = 220;

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ["#3B82F6", "#60A5FA", "#1D4ED8", "#818CF8", "#6366F1"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ["#3B82F6", "#60A5FA", "#1D4ED8", "#818CF8", "#6366F1"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    setError(null);
    setIsSpinning(true);
    try {
      const res = await fetch("/api/avis/wheel/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: restaurantId, participant_id: participantId, review_id: reviewId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) setAlreadySpun(true);
        else setError(data.error || "Erreur lors du tirage.");
        setIsSpinning(false);
        return;
      }
      setRotation((prev) => prev + (data.angle as number));
      setTimeout(() => {
        setIsSpinning(false);
        fireConfetti();
        setTimeout(() => {
          onPrizeWon({
            prizeId: data.prizeId,
            prizeName: data.prizeName,
            prizeDescription: data.prizeDescription,
            prizeIcon: data.prizeIcon,
            prizeColor: data.prizeColor,
            segmentIndex: data.segmentIndex,
            participationId: data.participationId,
          });
        }, 1500);
      }, 4200);
    } catch {
      setError("Erreur de connexion. Veuillez reessayer.");
      setIsSpinning(false);
    }
  }, [isSpinning, restaurantId, participantId, reviewId, onPrizeWon, fireConfetti]);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[520px] mx-auto px-1">
      <div className="relative w-full aspect-square max-w-[500px]">
        {/* Pointer — star/cursor style */}
        <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 z-30">
          <svg width="40" height="48" viewBox="0 0 40 48" className="drop-shadow-lg">
            <defs>
              <linearGradient id="ptr-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
            <polygon points="20,46 4,8 20,18 36,8" fill="url(#ptr-g)" stroke="#1E3A8A" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Gold outer border ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(145deg, ${GOLD}, #1D4ED8)`,
            padding: "5px",
            boxShadow: `0 0 0 2px #1E3A8A, 0 8px 30px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="w-full h-full rounded-full bg-[#1a1a2e]" />
        </div>

        {/* Wheel SVG */}
        <div className="absolute inset-[5px]">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.60, 0.10, 1.0)" : "none",
            }}
          >
            <defs>
              <filter id="ts">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.7" />
              </filter>
              <clipPath id="wclip">
                <circle cx={CX} cy={CY} r={R} />
              </clipPath>
            </defs>

            <g clipPath="url(#wclip)">
              {prizes.map((prize, i) => {
                const startAngle = seg * i;
                const endAngle = seg * (i + 1);
                const midAngle = startAngle + seg / 2;
                const color = i % 2 === 0 ? C1 : C2;

                // Text along the radius: exterior → center
                // Position text at 85% of radius, reading from outside toward center
                const textDist = R * 0.58;
                const tp = polar(CX, CY, textDist, midAngle);

                // Rotate text so it reads along the radius from exterior to center
                // For segments on the bottom half, flip 180 so text isn't upside down
                const isBottom = midAngle > 90 && midAngle < 270;
                const textRotation = isBottom ? midAngle + 180 : midAngle;

                const label = prize.name.length > 14 ? prize.name.slice(0, 13) + "\u2026" : prize.name;

                return (
                  <g key={prize.id}>
                    {/* Segment fill */}
                    <path d={slicePath(CX, CY, R, startAngle, endAngle)} fill={color} />

                    {/* Gold separator lines */}
                    <line
                      x1={CX}
                      y1={CY}
                      x2={polar(CX, CY, R, startAngle).x}
                      y2={polar(CX, CY, R, startAngle).y}
                      stroke={GOLD}
                      strokeWidth="2"
                      opacity="0.8"
                    />

                    {/* Prize name — bold white text along radius */}
                    <text
                      x={tp.x}
                      y={tp.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                      fontWeight="800"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fill="white"
                      filter="url(#ts)"
                      transform={`rotate(${textRotation}, ${tp.x}, ${tp.y})`}
                      letterSpacing="0.5"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Outer gold ring (inside SVG for clean look) */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={GOLD} strokeWidth="4" opacity="0.9" />

            {/* Center hub — small golden star */}
            <circle cx={CX} cy={CY} r="28" fill="url(#hub-gradient)" stroke={GOLD} strokeWidth="3" />
            <circle cx={CX} cy={CY} r="18" fill="#1a1a2e" />
            <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="central" fontSize="16" fill={GOLD}>
              &#x2605;
            </text>

            {/* Hub gradient definition */}
            <defs>
              <radialGradient id="hub-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#1f2937" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Idle glow pulse */}
        {!isSpinning && !alreadySpun && (
          <div
            className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
            style={{ boxShadow: `0 0 50px rgba(59,130,246,0.25), 0 0 100px rgba(96,165,250,0.1)` }}
          />
        )}
      </div>

      {alreadySpun && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center w-full space-y-3 shadow-sm">
          <p className="text-base font-semibold text-amber-800">Vous avez deja tourne la roue !</p>
          <p className="text-sm text-amber-600">Chaque participant ne peut tourner qu&apos;une seule fois.</p>
        </div>
      )}

      {error && !alreadySpun && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center w-full">{error}</div>
      )}

      <Button
        onClick={handleSpin}
        disabled={isSpinning || alreadySpun}
        className="w-full max-w-[360px] h-16 text-xl font-extrabold rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.04] active:scale-[0.96] disabled:scale-100 disabled:shadow-none text-white border-0 tracking-wide"
        style={{
          background: `linear-gradient(to bottom, #3B82F6, #1D4ED8)`,
        }}
      >
        {isSpinning ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            La roue tourne...
          </span>
        ) : alreadySpun ? (
          "Deja joue"
        ) : (
          "TOURNEZ LA ROUE !"
        )}
      </Button>

      <a
        href={`/r/${slug}/reglement`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/30 hover:text-white/50 text-xs transition-colors"
      >
        Voir le reglement du jeu-concours
      </a>
    </div>
  );
}
