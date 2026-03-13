"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import PinPad from "@/modules/server/components/PinPad";
import { ChefHat } from "lucide-react";

export default function KDSLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/kds/${slug}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur de connexion");
          return;
        }

        router.push(`/kds/${slug}`);
      } catch {
        setError("Erreur de connexion au serveur");
      } finally {
        setIsLoading(false);
      }
    },
    [slug, router]
  );

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cuisine</h1>
          <p className="text-gray-400 text-sm text-center">
            Entrez votre PIN pour acceder au KDS
          </p>
        </div>

        <PinPad onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
