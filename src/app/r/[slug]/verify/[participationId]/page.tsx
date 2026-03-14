"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageTransition, FadeIn } from "@/shared/components/animations";

interface ParticipationData {
  id: string;
  prize_name: string;
  claimed: boolean;
  created_at: string;
  participants: { email: string; name: string | null };
  prizes: { name: string; description: string | null; icon: string };
}

export default function VerifyPrizePage() {
  const params = useParams();
  const participationId = params.participationId as string;

  const [data, setData] = useState<ParticipationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetch(`/api/avis/participations/${participationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Participation introuvable");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [participationId]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch(`/api/avis/participations/${participationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimed: true }),
      });
      if (!res.ok) throw new Error("Erreur");
      const updated = await res.json();
      setData((prev) => prev ? { ...prev, claimed: updated.claimed } : prev);
    } catch {
      setError("Erreur lors de la validation");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-red-400">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">{error || "Participation introuvable"}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0F172A] flex flex-col items-center justify-center px-4 py-12">
      <PageTransition>
        <FadeIn delay={0.1}>
          <div className="w-full max-w-sm mx-auto space-y-6 text-center">
            {/* Prize icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-4 border-blue-400/30 flex items-center justify-center mx-auto">
              <span className="text-4xl">{data.prizes?.icon || "🎁"}</span>
            </div>

            {/* Prize info */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">{data.prizes?.name || data.prize_name}</h1>
              {data.prizes?.description && (
                <p className="text-sm text-white/60">{data.prizes.description}</p>
              )}
            </div>

            {/* Participant info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <p className="text-sm text-white/60">Client</p>
              <p className="text-white font-medium">{data.participants?.name || data.participants?.email}</p>
              <p className="text-xs text-white/40">{data.participants?.email}</p>
              <p className="text-xs text-white/30">
                {new Date(data.created_at).toLocaleString("fr-FR")}
              </p>
            </div>

            {/* Status + Action */}
            {data.claimed ? (
              <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-green-400 font-semibold">Deja utilise</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {claiming ? "Validation..." : "Marquer comme utilise"}
              </button>
            )}
          </div>
        </FadeIn>
      </PageTransition>
    </main>
  );
}
