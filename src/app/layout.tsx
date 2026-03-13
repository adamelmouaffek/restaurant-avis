import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Providers } from "@/shared/components/Providers";
import { CookieConsent } from "@/shared/components/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Restaurant Avis — Multipliez vos avis Google",
  description:
    "La roue cadeaux qui transforme chaque client en ambassadeur. Collectez des avis Google authentiques et fidelisez vos clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable)}>
      <body className="antialiased">
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
