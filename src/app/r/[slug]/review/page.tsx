"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ReviewForm } from "@/modules/avis/components/ReviewForm";
import { EmailReviewForm } from "@/modules/avis/components/EmailReviewForm";
import { Button } from "@/shared/components/ui/button";
import type { Restaurant } from "@/shared/types";

type AuthMode = "choice" | "google" | "email";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("choice");

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

  // Redirect to Google sign-in if user selects Google mode
  useEffect(() => {
    if (authMode === "google" && status === "unauthenticated") {
      signIn("google", { callbackUrl: `/r/${slug}/review` });
    }
  }, [authMode, status, slug]);

  // Loading states
  if (status === "loading") {
    return (
      <main className="min-h-dvh bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Connexion en cours...</p>
        </div>
      </main>
    );
  }

  // Show choice screen if unauthenticated and in choice mode
  if (status === "unauthenticated" && authMode === "choice" && !loading && restaurant) {
    return (
      <main className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-gray-900">
            {restaurant.name}
          </h1>
        </div>

        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Donnez votre avis
              </h2>
              <p className="text-sm text-gray-500">
                Choisissez votre mode d&apos;authentification
              </p>
            </div>

            <Button
              onClick={() => setAuthMode("google")}
              className="w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continuer avec Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <Button
              onClick={() => setAuthMode("email")}
              variant="outline"
              className="w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg border border-gray-300 text-gray-900 hover:bg-gray-50"
            >
              Tester avec un email
            </Button>
          </div>
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

  // Email mode - no authentication needed
  if (authMode === "email") {
    return (
      <main className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            {restaurant.name}
          </h1>
        </div>

        <EmailReviewForm
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onSuccess={handleSuccess}
        />

        <button
          onClick={() => setAuthMode("choice")}
          className="text-xs text-gray-400 hover:text-gray-600 mt-6 transition-colors"
        >
          Retour au choix d&apos;authentification
        </button>
      </main>
    );
  }

  // Google OAuth mode - user must be authenticated
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
