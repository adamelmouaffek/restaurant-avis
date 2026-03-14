"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ReviewForm } from "@/modules/avis/components/ReviewForm";
import { EmailReviewForm } from "@/modules/avis/components/EmailReviewForm";
import { Button } from "@/shared/components/ui/button";
import { PageTransition, FadeIn } from "@/shared/components/animations";
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

  // Redirect to Google sign-in only when user explicitly chooses Google
  useEffect(() => {
    if (authMode === "google" && status === "unauthenticated") {
      signIn("google", { callbackUrl: `/r/${slug}/review?auth=google` });
    }
  }, [authMode, status, slug]);

  // If returning from Google OAuth callback, go directly to google mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "google" && status === "authenticated") {
      setAuthMode("google");
    }
  }, [status]);

  // Loading restaurant data
  if (loading) {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin" />
      </main>
    );
  }

  // Error state
  if (error || !restaurant) {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">
            {error || "Restaurant introuvable"}
          </h2>
          <p className="text-sm text-white/60">
            Verifiez le lien ou scannez a nouveau le QR code.
          </p>
        </div>
      </main>
    );
  }

  // ─── CHOICE SCREEN (always shown first) ───────────────
  if (authMode === "choice") {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex flex-col items-center justify-center px-4 py-8">
        <PageTransition>
          <div className="text-center mb-8">
            <h1 className="text-lg font-semibold text-white">
              {restaurant.name}
            </h1>
          </div>

          <div className="w-full max-w-md mx-auto space-y-4">
            <FadeIn delay={0.1}>
              <div className="bg-white/[0.08] rounded-xl border border-white/15 shadow-none p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    Donnez votre avis
                  </h2>
                  <p className="text-sm text-white/60">
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
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#0F172A] text-white/40">ou</span>
                  </div>
                </div>

                <Button
                  onClick={() => setAuthMode("email")}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg border-2 border-white/40 text-white bg-white/10 hover:bg-white/20"
                >
                  Continuer avec un email
                </Button>
              </div>
            </FadeIn>
          </div>
        </PageTransition>
      </main>
    );
  }

  // ─── EMAIL MODE ───────────────────────────────────────
  if (authMode === "email") {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex flex-col items-center justify-center px-4 py-8">
        <PageTransition>
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-white">
              {restaurant.name}
            </h1>
          </div>

          <FadeIn delay={0.1}>
            <EmailReviewForm
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              onSuccess={handleSuccess}
            />
          </FadeIn>

          <button
            onClick={() => setAuthMode("choice")}
            className="text-sm text-white/50 hover:text-white/80 mt-6 transition-colors min-h-[44px] px-4 underline underline-offset-2"
          >
            Retour au choix d&apos;authentification
          </button>
        </PageTransition>
      </main>
    );
  }

  // ─── GOOGLE MODE - waiting for auth ───────────────────
  if (authMode === "google" && status !== "authenticated") {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/60">Redirection vers Google...</p>
        </div>
      </main>
    );
  }

  // ─── GOOGLE MODE - authenticated ──────────────────────
  return (
    <main className="min-h-dvh bg-[#0F172A] flex flex-col items-center justify-center px-4 py-8">
      <PageTransition>
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold text-white">
            {restaurant.name}
          </h1>
        </div>

        <FadeIn delay={0.1}>
          <ReviewForm
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            googleMapsUrl={restaurant.google_maps_url}
            userEmail={session!.user.email!}
            userName={session!.user.name ?? null}
            googleSub={session!.user.id}
            onSuccess={handleSuccess}
          />
        </FadeIn>

        <button
          onClick={() => setAuthMode("choice")}
          className="text-sm text-white/50 hover:text-white/80 mt-6 transition-colors min-h-[44px] px-4 underline underline-offset-2"
        >
          Retour au choix d&apos;authentification
        </button>

        <p className="text-xs text-white/30 mt-2">
          Connecte en tant que {session!.user.email}
        </p>
      </PageTransition>
    </main>
  );
}
