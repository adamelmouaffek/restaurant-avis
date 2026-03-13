import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { PageTransition, FadeIn } from "@/shared/components/animations";
import type { Restaurant } from "@/shared/types";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

async function getRestaurant(slug: string): Promise<Restaurant | null> {
  const { data } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) return { title: "Restaurant introuvable" };
  return {
    title: `${restaurant.name} — Donnez votre avis`,
    description: `Laissez un avis pour ${restaurant.name} et tentez de gagner un cadeau !`,
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const restaurant = await getRestaurant(params.slug);

  if (!restaurant) {
    notFound();
  }

  const primaryColor = restaurant.primary_color || "#f59e0b";

  return (
    <main className="min-h-dvh bg-white flex flex-col items-center justify-center px-4 py-12">
      <PageTransition className="w-full max-w-md mx-auto flex flex-col items-center gap-8 text-center">
        {/* Logo / Restaurant identity */}
        <FadeIn direction="down" delay={0.1}>
          <div className="space-y-4">
            {restaurant.logo_url ? (
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={96}
                height={96}
                priority
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mx-auto shadow-lg"
              />
            ) : (
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto shadow-lg flex items-center justify-center text-white text-3xl sm:text-4xl font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                {restaurant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
          </div>
        </FadeIn>

        {/* Value proposition */}
        <FadeIn delay={0.2}>
          <div className="space-y-3">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Votre avis compte pour nous !
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Partagez votre experience et tentez de gagner un cadeau en tournant
              notre roue de la chance.
            </p>
          </div>
        </FadeIn>

        {/* Gift icon */}
        <FadeIn delay={0.3}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke={primaryColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 010-5A4.8 8 0 0112 8a4.8 8 0 014.5-5 2.5 2.5 0 010 5" />
            </svg>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.4}>
          <Link
            href={`/r/${restaurant.slug}/review`}
            className="w-full max-w-[280px] h-14 rounded-2xl font-semibold text-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            Donner mon avis
          </Link>
        </FadeIn>

        {/* Subtle footer */}
        <p className="text-xs text-gray-400 mt-4">
          Simple, rapide et gratuit
        </p>
      </PageTransition>
    </main>
  );
}
