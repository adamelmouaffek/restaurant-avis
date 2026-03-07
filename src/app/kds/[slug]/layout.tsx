import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `KDS — ${params.slug}`,
  };
}

/**
 * Layout independant pour la route /kds/.
 * PAS de Sidebar, PAS de SessionProvider, PAS d'heritage du layout racine.
 * Fond sombre optimise pour un ecran de cuisine.
 */
export default function KDSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-900 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
