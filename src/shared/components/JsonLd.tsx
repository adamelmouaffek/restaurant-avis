interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Restaurant Avis",
  url: "https://restaurant-avis.vercel.app",
  description:
    "Suite digitale SaaS pour la restauration : roue cadeaux, menu QR code, commandes en ligne, kitchen display system.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@restaurant-avis.fr",
    contactType: "customer service",
    availableLanguage: "French",
  },
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Restaurant Avis",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Gratuit — free tier Vercel + Supabase",
  },
  description:
    "Plateforme SaaS gratuite pour restaurants, hotels, cafes et bars. Collectez des avis Google, gerez votre menu QR et vos commandes.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
  },
};

export function generateFaqSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
