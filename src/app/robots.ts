import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/r/", "/m/", "/mentions-legales", "/confidentialite", "/dashboard/signup"],
        disallow: ["/dashboard/", "/s/", "/kds/", "/api/"],
      },
    ],
    sitemap: "https://restaurant-avis.vercel.app/sitemap.xml",
  };
}
