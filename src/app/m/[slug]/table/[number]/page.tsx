import { cache } from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import type { Restaurant } from "@/shared/types";
import type { Metadata } from "next";
import MenuPage from "@/modules/menu/components/MenuPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string; number: string };
}

const getRestaurant = cache(async (slug: string): Promise<Restaurant | null> => {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("getRestaurant error:", error.message, "slug:", slug);
  }
  return data;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) return { title: "Menu introuvable" };
  return {
    title: `${restaurant.name} — Menu Table ${params.number}`,
    description: `Consultez le menu de ${restaurant.name} et commandez directement depuis votre table.`,
  };
}

export default async function MenuTablePage({ params }: PageProps) {
  const restaurant = await getRestaurant(params.slug);

  if (!restaurant) {
    notFound();
  }

  return <MenuPage restaurant={restaurant} tableNumber={params.number} />;
}
