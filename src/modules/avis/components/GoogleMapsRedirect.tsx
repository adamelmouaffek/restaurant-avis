"use client";

import { startSession } from "@/modules/avis/lib/google-maps-session";
import { Card, CardContent } from "@/shared/components/ui/card";

interface GoogleMapsRedirectProps {
  restaurantName: string;
  googleMapsUrl: string;
  slug: string;
  restaurantId: string;
  onFallback: () => void;
}

export function GoogleMapsRedirect({
  restaurantName,
  googleMapsUrl,
  slug,
  restaurantId,
  onFallback,
}: GoogleMapsRedirectProps) {
  const handleGoToGoogleMaps = () => {
    startSession({
      slug,
      googleMapsUrl,
      restaurantId,
    });
    window.location.href = googleMapsUrl;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/[0.08] border border-white/15 shadow-none">
      <CardContent className="p-8 sm:p-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Google Maps icon */}
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-blue-400"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Aidez {restaurantName} sur Google !
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Laissez un avis sur Google Maps, puis revenez ici pour tourner la
              roue et gagner un cadeau.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGoToGoogleMaps}
            className="inline-flex items-center justify-center gap-2 w-full h-14 px-8 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Laisser mon avis Google
          </button>

          {/* Fallback link */}
          <button
            onClick={onFallback}
            className="text-sm text-white/40 hover:text-white/70 transition-colors min-h-[44px] px-4 underline underline-offset-2"
          >
            Je n&apos;ai pas de compte Google Maps
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
