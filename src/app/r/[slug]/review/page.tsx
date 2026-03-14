"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ReviewForm } from "@/modules/avis/components/ReviewForm";
import { EmailReviewForm } from "@/modules/avis/components/EmailReviewForm";
import { GoogleMapsRedirect } from "@/modules/avis/components/GoogleMapsRedirect";
import { GoogleMapsConfirm } from "@/modules/avis/components/GoogleMapsConfirm";
import { getSession as getGMapsSession } from "@/modules/avis/lib/google-maps-session";
import { Button } from "@/shared/components/ui/button";
import { PageTransition, FadeIn } from "@/shared/components/animations";
import type { Restaurant } from "@/shared/types";

type Step =
  | "choice"
  | "google-redirect"
  | "google-confirm"
  | "google-fallback"
  | "email";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("choice");

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

  // Handle successful review — redirect to wheel
  const handleSuccess = useCallback(
    (participantId: string, reviewId: string) => {
      const searchParams = new URLSearchParams({ participantId, reviewId });
      router.push(`/r/${slug}/wheel?${searchParams.toString()}`);
    },
    [router, slug]
  );

  // Redirect to Google sign-in when user chooses Google
  useEffect(() => {
    if (step === "choice") return; // Don't auto-redirect on choice
    if (
      (step === "google-redirect" || step === "google-fallback") &&
      status === "unauthenticated"
    ) {
      signIn("google", { callbackUrl: `/r/${slug}/review?auth=google` });
    }
  }, [step, status, slug]);

  // If returning from Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "google" && status === "authenticated") {
      // Check if there's an existing Google Maps session (user returning from Maps)
      const gmapsSession = getGMapsSession(slug);
      if (gmapsSession) {
        setStep("google-confirm");
      } else if (restaurant?.google_maps_url) {
        setStep("google-redirect");
      } else {
        setStep("google-fallback");
      }
    }
  }, [status, slug, restaurant]);

  // Detect return from Google Maps via visibilitychange
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const gmapsSession = getGMapsSession(slug);
        if (gmapsSession && step === "google-redirect") {
          setStep("google-confirm");
        }
      }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const gmapsSession = getGMapsSession(slug);
        if (gmapsSession) {
          setStep("google-confirm");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [slug, step]);

  // On mount: check if there's a pending Google Maps session
  useEffect(() => {
    const gmapsSession = getGMapsSession(slug);
    if (gmapsSession && status === "authenticated") {
      setStep("google-confirm");
    }
  }, [slug, status]);

  // Handle Google button click
  const handleGoogleClick = () => {
    if (status === "authenticated") {
      // Already logged in — go directly to redirect or fallback
      if (restaurant?.google_maps_url) {
        setStep("google-redirect");
      } else {
        setStep("google-fallback");
      }
    } else {
      // Need to authenticate first
      setStep("google-redirect"); // Will trigger signIn in the useEffect above
    }
  };

  // ─── LOADING ─────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-dvh bg-[var(--et-bg)] flex items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[var(--et-accent-light)] rounded-full animate-spin" />
      </main>
    );
  }

  // ─── ERROR ───────────────────────────────────────────
  if (error || !restaurant) {
    return (
      <main className="min-h-dvh bg-[var(--et-bg)] flex items-center justify-center px-4">
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

  // ─── CHOICE SCREEN ───────────────────────────────────
  if (step === "choice") {
    return (
      <main className="min-h-dvh bg-[var(--et-bg)] flex flex-col items-center justify-center px-4 py-8">
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
                  onClick={handleGoogleClick}
                  className="w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg bg-[var(--et-accent)] hover:bg-[var(--et-accent)] text-white"
                >
                  Continuer avec Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--et-bg)] text-white/40">
                      ou
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setStep("email")}
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

  // ─── EMAIL MODE ──────────────────────────────────────
  if (step === "email") {
    return (
      <main className="min-h-dvh bg-[var(--et-bg)] flex flex-col items-center justify-center px-4 py-8">
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
            onClick={() => setStep("choice")}
            className="text-sm text-white/50 hover:text-white/80 mt-6 transition-colors min-h-[44px] px-4 underline underline-offset-2"
          >
            Retour au choix d&apos;authentification
          </button>
        </PageTransition>
      </main>
    );
  }

  // ─── GOOGLE: waiting for auth ────────────────────────
  if (
    (step === "google-redirect" || step === "google-fallback") &&
    status !== "authenticated"
  ) {
    return (
      <main className="min-h-dvh bg-[var(--et-bg)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[var(--et-accent-light)] rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/60">Redirection vers Google...</p>
        </div>
      </main>
    );
  }

  // ─── GOOGLE: redirect to Google Maps ─────────────────
  if (step === "google-redirect" && restaurant.google_maps_url) {
    return (
      <main className="min-h-dvh bg-[var(--et-bg)] flex flex-col items-center justify-center px-4 py-8">
        <PageTransition>
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-white">
              {restaurant.name}
            </h1>
          </div>

          <FadeIn delay={0.1}>
            <GoogleMapsRedirect
              restaurantName={restaurant.name}
              googleMapsUrl={restaurant.google_maps_url}
              slug={slug}
              restaurantId={restaurant.id}
              onFallback={() => setStep("google-fallback")}
            />
          </FadeIn>

          <button
            onClick={() => setStep("choice")}
            className="text-sm text-white/50 hover:text-white/80 mt-6 transition-colors min-h-[44px] px-4 underline underline-offset-2"
          >
            Retour au choix d&apos;authentification
          </button>
        </PageTransition>
      </main>
    );
  }

  // ─── GOOGLE: confirm review was left ─────────────────
  if (step === "google-confirm") {
    const gmapsSession = getGMapsSession(slug);
    if (gmapsSession && restaurant.google_maps_url) {
      return (
        <main className="min-h-dvh bg-[var(--et-bg)] flex flex-col items-center justify-center px-4 py-8">
          <PageTransition>
            <div className="text-center mb-6">
              <h1 className="text-lg font-semibold text-white">
                {restaurant.name}
              </h1>
            </div>

            <FadeIn delay={0.1}>
              <GoogleMapsConfirm
                restaurantName={restaurant.name}
                googleMapsUrl={restaurant.google_maps_url}
                slug={slug}
                session={gmapsSession}
                userEmail={session!.user.email!}
                userName={session!.user.name ?? null}
                googleSub={session!.user.id}
                onSuccess={handleSuccess}
              />
            </FadeIn>
          </PageTransition>
        </main>
      );
    }
    // No session found — fall back to redirect
    setStep("google-redirect");
    return null;
  }

  // ─── GOOGLE: fallback (no google_maps_url) ───────────
  return (
    <main className="min-h-dvh bg-[var(--et-bg)] flex flex-col items-center justify-center px-4 py-8">
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
            userEmail={session!.user.email!}
            userName={session!.user.name ?? null}
            googleSub={session!.user.id}
            onSuccess={handleSuccess}
          />
        </FadeIn>

        <button
          onClick={() => setStep("choice")}
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
