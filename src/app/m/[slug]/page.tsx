import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import type { Restaurant } from "@/shared/types";
import type { Metadata } from "next";
import MenuPage from "@/modules/menu/components/MenuPage";

interface PageProps {
  params: { slug: string };
  searchParams: { table?: string };
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
  if (!restaurant) return { title: "Menu introuvable" };
  return {
    title: `${restaurant.name} — Menu`,
    description: `Consultez le menu de ${restaurant.name} et commandez directement depuis votre table.`,
  };
}

export default async function MenuPublicPage({ params, searchParams }: PageProps) {
  const restaurant = await getRestaurant(params.slug);

  if (!restaurant) {
    notFound();
  }

  const tableNumber = searchParams.table ?? "1";

  return <MenuPage restaurant={restaurant} tableNumber={tableNumber} />;
}
