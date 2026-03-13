"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Lock, Utensils } from "lucide-react";
import PinPad from "@/modules/server/components/PinPad";

export default function ServerLoginPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePinSubmit = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/server/${slug}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });

        if (res.ok) {
          router.push(`/s/${slug}/tables`);
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "PIN incorrect");
        }
      } catch {
        setError("Erreur de connexion. Verifiez votre reseau.");
      } finally {
        setIsLoading(false);
      }
    },
    [slug, router]
  );

  return (
    <div className="min-h-dvh bg-[#0F172A] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo / icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Espace Serveur</h1>
          <p className="text-sm text-gray-400 mt-1">
            Entrez votre code PIN a 4 chiffres
          </p>
        </div>

        {/* PIN card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Code PIN</span>
          </div>

          <PinPad
            onSubmit={handlePinSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </motion.div>
    </div>
  );
}
