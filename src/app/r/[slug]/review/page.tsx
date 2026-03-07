"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ReviewForm } from "@/modules/avis/components/ReviewForm";
import type { Restaurant } from "@/shared/types";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl: `/r/${slug}/review` });
    }
  }, [status, slug]);

  // Fetch restaurant data
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const response = await fetch(
          `/api/avis/restaurants?slug=${encodeURIComponent(slug)}`
        );
        if (!response.ok) {
          setError("Restaurant introuvable.");
          return;
        }
        const data = await response.json();
        setRestaurant(data);
      } catch {
        setError("Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchRestaurant();
  }, [slug]);

  // Handle successful review submission
  const handleSuccess = (participantId: string, reviewId: string) => {
    const searchParams = new URLSearchParams({
      participantId,
      reviewId,
    });
    router.push(`/r/${slug}/wheel?${searchParams.toString()}`);
  };

  // Loading states
  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-dvh bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Connexion en cours...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-dvh bg-white flex items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !restaurant) {
    return (
      <main className="min-h-dvh bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {error || "Restaurant introuvable"}
          </h2>
          <p className="text-sm text-gray-500">
            Verifiez le lien ou scannez a nouveau le QR code.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Restaurant header */}
      <div className="text-center mb-6">
        <h1 className="text-lg font-semibold text-gray-900">
          {restaurant.name}
        </h1>
      </div>

      <ReviewForm
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        googleMapsUrl={restaurant.google_maps_url}
        userEmail={session!.user.email!}
        userName={session!.user.name ?? null}
        googleSub={session!.user.id}
        onSuccess={handleSuccess}
      />

      {/* Connected as */}
      <p className="text-xs text-gray-400 mt-6">
        Connecte en tant que {session!.user.email}
      </p>
    </main>
  );
}
