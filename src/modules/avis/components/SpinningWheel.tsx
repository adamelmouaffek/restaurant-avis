"use client";

import { useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";
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

// ─── Geometry helpers ──────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, s: number, e: number) {
  const a = polar(cx, cy, r, e);
  const b = polar(cx, cy, r, s);
  const lg = e - s > 180 ? 1 : 0;
  return `M${cx},${cy} L${a.x},${a.y} A${r},${r} 0 ${lg} 0 ${b.x},${b.y} Z`;
}

// ─── Premium color palette (casino style) ──────────────────
const SEGMENT_COLORS = [
  "#e63946", // red
  "#1d3557", // navy
  "#f4a261", // warm orange
  "#2a9d8f", // teal
  "#e76f51", // coral
  "#264653", // dark teal
  "#f9c74f", // gold
  "#6a4c93", // purple
  "#43aa8b", // emerald
  "#f94144", // bright red
];

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
  const [bulbPhase, setBulbPhase] = useState(false);

  const seg = 360 / prizes.length;
  const CX = 200;
  const CY = 200;
  const R = 175;
  const BULB_R = 192;
  const NUM_BULBS = 20;

  // Bulb animation (alternating blink)
  useEffect(() => {
    const interval = setInterval(() => setBulbPhase((p) => !p), 500);
    return () => clearInterval(interval);
  }, []);

  // Fire confetti
  const fireConfetti = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#ef4444", "#10b981", "#3b82f6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#ef4444", "#10b981", "#3b82f6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

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
      setRotation((prev) => prev + targetAngle);

      setTimeout(() => {
        setIsSpinning(false);
        fireConfetti();
        // Small delay for confetti to start before redirect
        setTimeout(() => {
          onPrizeWon({
            prizeId: data.prizeId,
            prizeName: data.prizeName,
            prizeDescription: data.prizeDescription,
            prizeIcon: data.prizeIcon,
            prizeColor: data.prizeColor,
            segmentIndex: data.segmentIndex,
          });
        }, 1500);
      }, 4200);
    } catch {
      setError("Erreur de connexion. Veuillez reessayer.");
      setIsSpinning(false);
    }
  }, [isSpinning, restaurantId, participantId, reviewId, onPrizeWon, fireConfetti]);

  // Pick color per segment
  const getColor = (i: number) =>
    prizes[i].color && prizes[i].color !== "#000000"
      ? prizes[i].color
      : SEGMENT_COLORS[i % SEGMENT_COLORS.length];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[380px] mx-auto px-2">
      {/* ─── Wheel ─────────────────────────────────────── */}
      <div className="relative w-full aspect-square max-w-[360px]">
        {/* Pointer / Arrow */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30">
          <svg width="40" height="48" viewBox="0 0 40 48" className="drop-shadow-lg">
            <defs>
              <linearGradient id="ptr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <polygon points="20,46 3,8 37,8" fill="url(#ptr)" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="20,38 9,14 31,14" fill="#fbbf24" opacity="0.6" />
          </svg>
        </div>

        {/* Outer frame (dark metallic) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(145deg, #374151, #1f2937)",
            padding: "14px",
            boxShadow: "0 0 0 3px #f59e0b, 0 8px 32px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-full h-full rounded-full bg-transparent" />
        </div>

        {/* Light bulbs around the frame */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          {Array.from({ length: NUM_BULBS }).map((_, i) => {
            const angle = (360 / NUM_BULBS) * i;
            const p = polar(200, 200, BULB_R, angle - 90);
            const on = i % 2 === (bulbPhase ? 0 : 1);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="5"
                fill={on ? "#fbbf24" : "#78716c"}
                opacity={on ? 1 : 0.4}
                style={{
                  filter: on ? "drop-shadow(0 0 4px #fbbf24)" : "none",
                  transition: "fill 0.3s, opacity 0.3s",
                }}
              />
            );
          })}
        </svg>

        {/* SVG Wheel */}
        <div className="absolute inset-[14px]">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4s cubic-bezier(0.15, 0.60, 0.10, 1.0)"
                : "none",
            }}
          >
            <defs>
              <radialGradient id="depth" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                <stop offset="100%" stopColor="black" stopOpacity="0.12" />
              </radialGradient>
              <filter id="ts">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.6" />
              </filter>
              <clipPath id="wc">
                <circle cx={CX} cy={CY} r={R} />
              </clipPath>
            </defs>

            <g clipPath="url(#wc)">
              {prizes.map((prize, i) => {
                const s = seg * i;
                const e = seg * (i + 1);
                const mid = s + seg / 2;
                const color = getColor(i);

                const iconP = polar(CX, CY, R * 0.75, mid - 90);
                const textP = polar(CX, CY, R * 0.48, mid - 90);

                return (
                  <g key={prize.id}>
                    {/* Segment */}
                    <path d={arc(CX, CY, R, s, e)} fill={color} />
                    <path d={arc(CX, CY, R, s, e)} fill="url(#depth)" />
                    <path d={arc(CX, CY, R, s, e)} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />

                    {/* Icon */}
                    <text
                      x={iconP.x}
                      y={iconP.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="30"
                      filter="url(#ts)"
                      transform={`rotate(${mid},${iconP.x},${iconP.y})`}
                    >
                      {prize.icon}
                    </text>

                    {/* Name */}
                    <text
                      x={textP.x}
                      y={textP.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fontWeight="800"
                      fill="white"
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="3"
                      paintOrder="stroke"
                      transform={`rotate(${mid},${textP.x},${textP.y})`}
                    >
                      {prize.name.length > 14 ? prize.name.slice(0, 13) + "..." : prize.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Center hub - metallic rings */}
            <circle cx={CX} cy={CY} r="44" fill="#e5e7eb" />
            <circle cx={CX} cy={CY} r="40" fill="url(#hub-grad)" stroke="#d4d4d8" strokeWidth="1" />
            <circle cx={CX} cy={CY} r="32" fill="#1f2937" />
            <circle cx={CX} cy={CY} r="24" fill="#374151" />
            <circle cx={CX} cy={CY} r="16" fill="#4b5563" />
            <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="#fbbf24">
              ★
            </text>

            <defs>
              <linearGradient id="hub-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Glow when idle */}
        {!isSpinning && !alreadySpun && (
          <div
            className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
            style={{ boxShadow: "0 0 50px rgba(245,158,11,0.3), 0 0 100px rgba(245,158,11,0.1)" }}
          />
        )}
      </div>

      {/* ─── Messages ──────────────────────────────────── */}
      {alreadySpun && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center w-full space-y-3 shadow-sm">
          <div className="text-4xl">🎡</div>
          <p className="text-base font-semibold text-amber-800">
            Vous avez deja tourne la roue !
          </p>
          <p className="text-sm text-amber-600">
            Chaque participant ne peut tourner qu&apos;une seule fois.
          </p>
        </div>
      )}

      {error && !alreadySpun && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center w-full">
          {error}
        </div>
      )}

      {/* ─── Spin Button ───────────────────────────────── */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || alreadySpun}
        className="w-full max-w-[320px] h-16 text-xl font-extrabold rounded-2xl shadow-xl shadow-amber-500/30 transition-all duration-200 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.04] active:scale-[0.96] disabled:scale-100 disabled:shadow-none bg-gradient-to-b from-amber-400 via-amber-500 to-orange-600 hover:from-amber-500 hover:via-amber-600 hover:to-orange-700 text-white border-0 tracking-wide"
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
    </div>
  );
}
