import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Providers } from "@/shared/components/Providers";
import { CookieConsent } from "@/shared/components/CookieConsent";
import { GoogleAnalytics } from "@/shared/components/GoogleAnalytics";
import { JsonLd, organizationSchema, softwareSchema } from "@/shared/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = "https://restaurant-avis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Restaurant Avis — Multipliez vos avis Google",
    template: "%s | Restaurant Avis",
  },
  description:
    "La roue cadeaux qui transforme chaque client en ambassadeur. Collectez des avis Google authentiques et fidelisez vos clients.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Restaurant Avis",
    title: "Restaurant Avis — Multipliez vos avis Google",
    description:
      "Suite digitale SaaS pour la restauration : roue cadeaux, menu QR, commandes, KDS. Boostez vos avis Google gratuitement.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Restaurant Avis — Suite digitale HoReCa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Avis — Multipliez vos avis Google",
    description:
      "Suite digitale SaaS pour la restauration : roue cadeaux, menu QR, commandes, KDS.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable)}>
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={softwareSchema} />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
