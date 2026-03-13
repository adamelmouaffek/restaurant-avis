import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions legales — Restaurant Avis",
  description: "Mentions legales de Restaurant Avis, suite digitale SaaS pour la restauration.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block"
        >
          &larr; Retour a l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold mb-8">Mentions legales</h1>
        <p className="text-white/50 text-sm mb-12">
          Derniere mise a jour : 14 mars 2026
        </p>

        <div className="space-y-10 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Editeur du site</h2>
            <ul className="space-y-1 text-sm">
              <li><strong>Raison sociale :</strong> Restaurant Avis</li>
              <li><strong>Forme juridique :</strong> Micro-entreprise</li>
              <li><strong>Responsable de la publication :</strong> Adam EL MOUAFFEK</li>
              <li><strong>Adresse :</strong> Paris, France</li>
              <li><strong>Email :</strong>{" "}
                <a href="mailto:contact@restaurant-avis.fr" className="text-blue-400 hover:underline">
                  contact@restaurant-avis.fr
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Hebergement</h2>
            <ul className="space-y-1 text-sm">
              <li><strong>Hebergeur :</strong> Vercel Inc.</li>
              <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
              <li><strong>Site web :</strong> vercel.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Base de donnees</h2>
            <ul className="space-y-1 text-sm">
              <li><strong>Fournisseur :</strong> Supabase Inc.</li>
              <li><strong>Localisation des donnees :</strong> Union europeenne (region eu-west)</li>
              <li><strong>Site web :</strong> supabase.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Propriete intellectuelle</h2>
            <p className="text-sm">
              L&apos;ensemble du contenu de ce site (textes, images, logos, code source) est la propriete
              exclusive de Restaurant Avis, sauf mention contraire. Toute reproduction, meme partielle,
              est interdite sans autorisation prealable ecrite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Donnees personnelles</h2>
            <p className="text-sm">
              Pour connaitre nos pratiques en matiere de collecte et de traitement des donnees personnelles,
              veuillez consulter notre{" "}
              <Link href="/confidentialite" className="text-blue-400 hover:underline">
                Politique de confidentialite
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
            <p className="text-sm">
              Ce site utilise des cookies strictement necessaires au fonctionnement du service
              (authentification, sessions). Aucun cookie de tracking publicitaire n&apos;est utilise.
              Pour plus d&apos;informations, consultez notre{" "}
              <Link href="/confidentialite#cookies" className="text-blue-400 hover:underline">
                politique relative aux cookies
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation de responsabilite</h2>
            <p className="text-sm">
              Restaurant Avis s&apos;efforce de fournir des informations exactes et a jour.
              Toutefois, nous ne pouvons garantir l&apos;exactitude, la completude ou l&apos;actualite
              des informations diffusees sur ce site. L&apos;utilisation des informations et services
              est faite sous la seule responsabilite de l&apos;utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Droit applicable</h2>
            <p className="text-sm">
              Les presentes mentions legales sont regies par le droit francais.
              En cas de litige, les tribunaux de Paris seront seuls competents.
            </p>
          </section>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <Link
            href="/"
            className="text-white/40 hover:text-white/60 text-sm"
          >
            &copy; 2026 Restaurant Avis
          </Link>
        </div>
      </div>
    </div>
  );
}
