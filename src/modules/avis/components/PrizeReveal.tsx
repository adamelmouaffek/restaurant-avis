"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface PrizeRevealProps {
  prizeName: string;
  prizeIcon: string;
  prizeDescription: string | null;
}

export function PrizeReveal({
  prizeName,
  prizeIcon,
  prizeDescription,
}: PrizeRevealProps) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    // Dynamic import of canvas-confetti
    import("canvas-confetti").then((confettiModule) => {
      const confetti = confettiModule.default;

      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#10b981"],
      });

      // Second burst after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#fbbf24", "#f59e0b", "#ef4444", "#8b5cf6"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        });
      }, 300);
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Prize icon */}
      <div className="relative">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 shadow-xl flex items-center justify-center border-4 border-amber-200 animate-bounce-slow">
          <span className="text-6xl sm:text-7xl" role="img" aria-label={prizeName}>
            {prizeIcon}
          </span>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl -z-10 scale-150" />
      </div>

      {/* Congratulations */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">
          Felicitations !
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Vous avez gagne
        </h1>
      </div>

      {/* Prize card */}
      <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white to-amber-50/50">
        <CardContent className="p-6 sm:p-8 text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {prizeName}
          </h2>
          {prizeDescription && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {prizeDescription}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="w-full rounded-2xl bg-gray-900 text-white p-5 sm:p-6 text-center space-y-2 shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-amber-400"
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          <p className="font-semibold text-sm sm:text-base">
            Presentez cet ecran au serveur
          </p>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          pour recuperer votre cadeau
        </p>
      </div>

      {/* Custom animation keyframes via style tag */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
