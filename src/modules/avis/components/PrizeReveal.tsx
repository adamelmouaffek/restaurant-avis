"use client";

import { useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getLabels } from "@/shared/lib/labels";
import type { EstablishmentType } from "@/shared/types";

interface PrizeRevealProps {
  prizeName: string;
  prizeIcon: string;
  prizeDescription: string | null;
  slug: string;
  participationId?: string;
  establishmentType?: EstablishmentType;
}

export function PrizeReveal({
  prizeName,
  prizeIcon,
  prizeDescription,
  slug,
  participationId,
  establishmentType = "restaurant",
}: PrizeRevealProps) {
  const confettiFired = useRef(false);
  const labels = getLabels(establishmentType);

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
        colors: ["#3B82F6", "#60A5FA", "#1D4ED8", "#818CF8", "#6366F1"],
      });

      // Second burst after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#3B82F6", "#60A5FA", "#818CF8", "#6366F1"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#1D4ED8", "#3B82F6", "#60A5FA", "#818CF8"],
        });
      }, 300);
    });
  }, []);

  const handleDownloadQR = () => {
    const svg = document.getElementById("prize-qr");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 300, 300);
      const link = document.createElement("a");
      link.download = `cadeau-${prizeName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Prize icon */}
      <div className="relative">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 shadow-xl flex items-center justify-center border-4 border-blue-400/30 animate-bounce-slow">
          <span className="text-6xl sm:text-7xl" role="img" aria-label={prizeName}>
            {prizeIcon}
          </span>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl -z-10 scale-150" />
      </div>

      {/* Congratulations */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-blue-400 uppercase tracking-wider">
          Felicitations !
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Vous avez gagne
        </h1>
      </div>

      {/* Prize card */}
      <Card className="w-full bg-white/5 border border-white/10 shadow-none">
        <CardContent className="p-6 sm:p-8 text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {prizeName}
          </h2>
          {prizeDescription && (
            <p className="text-sm text-white/60 leading-relaxed">
              {prizeDescription}
            </p>
          )}
        </CardContent>
      </Card>

      {/* QR Code section — when participationId is available */}
      {participationId && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-2xl">
            <QRCode
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/r/${slug}/verify/${participationId}`}
              size={180}
              id="prize-qr"
            />
          </div>
          <p className="font-semibold text-sm text-white">
            Montrez ce QR code {labels.showTo}
          </p>
          <p className="text-xs text-white/40">
            pour recuperer votre cadeau
          </p>
          <button
            onClick={handleDownloadQR}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Telecharger le QR code
          </button>
        </div>
      )}

      {/* Fallback instructions — when no participationId */}
      {!participationId && (
        <div className="w-full rounded-2xl bg-white/5 border border-white/10 text-white p-5 sm:p-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-blue-400"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
            <p className="font-semibold text-sm sm:text-base">
              Presentez cet ecran {labels.showTo}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            pour recuperer votre cadeau
          </p>
        </div>
      )}

      {/* Rules link */}
      <a
        href={`/r/${slug}/reglement`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/30 hover:text-white/50 text-xs transition-colors"
      >
        Reglement du jeu-concours
      </a>

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
