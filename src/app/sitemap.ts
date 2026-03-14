import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://restaurant-avis.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/dashboard/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic restaurant pages
  let restaurantPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("slug, created_at");

    if (restaurants) {
      restaurantPages = restaurants.flatMap((r) => [
        {
          url: `${SITE_URL}/r/${r.slug}`,
          lastModified: new Date(r.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        },
        {
          url: `${SITE_URL}/m/${r.slug}`,
          lastModified: new Date(r.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
      ]);
    }
  } catch {
    // Sitemap should not fail if DB is unavailable
  }

  return [...staticPages, ...restaurantPages];
}
