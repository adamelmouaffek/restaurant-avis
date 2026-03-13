import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialite — Restaurant Avis",
  description: "Comment Restaurant Avis collecte, utilise et protege vos donnees personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block"
        >
          &larr; Retour a l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold mb-8">Politique de confidentialite</h1>
        <p className="text-white/50 text-sm mb-12">
          Derniere mise a jour : 14 mars 2026
        </p>

        <div className="space-y-10 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable du traitement</h2>
            <p className="text-sm">
              Le responsable du traitement des donnees personnelles est :<br />
              <strong>Adam EL MOUAFFEK</strong> — Restaurant Avis<br />
              Email :{" "}
              <a href="mailto:contact@restaurant-avis.fr" className="text-blue-400 hover:underline">
                contact@restaurant-avis.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Donnees collectees</h2>
            <p className="text-sm mb-3">
              Nous collectons les categories de donnees suivantes selon votre utilisation du service :
            </p>

            <h3 className="text-base font-medium text-white/90 mb-2">Clients du restaurant (visiteurs)</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              <li>Prenom (facultatif, lors du depot d&apos;avis)</li>
              <li>Adresse email (facultatif, pour la roue cadeaux)</li>
              <li>Contenu de l&apos;avis depose</li>
              <li>Adresse IP (pour la securite et le rate limiting)</li>
            </ul>

            <h3 className="text-base font-medium text-white/90 mb-2">Restaurateurs (utilisateurs du dashboard)</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              <li>Adresse email (connexion Google OAuth ou email/mot de passe)</li>
              <li>Nom du restaurant et informations de configuration</li>
              <li>Donnees de menu (categories, articles, prix)</li>
            </ul>

            <h3 className="text-base font-medium text-white/90 mb-2">Personnel (serveurs, cuisine)</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Nom d&apos;affichage</li>
              <li>Code PIN (stocke hashe avec bcrypt, jamais en clair)</li>
              <li>Role (serveur, cuisine, manager)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalites du traitement</h2>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><strong>Fourniture du service :</strong> gestion des avis, commandes, affichage KDS</li>
              <li><strong>Securite :</strong> authentification, prevention des abus (rate limiting), protection CSRF</li>
              <li><strong>Amelioration du service :</strong> statistiques anonymisees d&apos;utilisation</li>
              <li><strong>Communication :</strong> envoi de codes cadeaux par email (uniquement si adresse fournie)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base legale</h2>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><strong>Execution du contrat :</strong> traitement necessaire a la fourniture du service SaaS</li>
              <li><strong>Interet legitime :</strong> securite, prevention de la fraude</li>
              <li><strong>Consentement :</strong> depot d&apos;avis, participation a la roue cadeaux</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Duree de conservation</h2>
            <div className="overflow-x-auto">
              <table className="text-sm w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-4 text-white">Donnee</th>
                    <th className="text-left py-2 text-white">Duree</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">Compte restaurateur</td>
                    <td className="py-2">Duree du contrat + 3 ans</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">Avis clients</td>
                    <td className="py-2">3 ans apres le depot</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">Commandes</td>
                    <td className="py-2">1 an (archivage comptable)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">Logs de securite (IP)</td>
                    <td className="py-2">6 mois</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Sessions (JWT)</td>
                    <td className="py-2">7 jours (dashboard), 12h (serveur), 24h (KDS)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Destinataires des donnees</h2>
            <p className="text-sm mb-3">
              Vos donnees sont traitees par les sous-traitants suivants :
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Vercel Inc.</strong> — hebergement de l&apos;application (USA, clauses contractuelles types)</li>
              <li><strong>Supabase Inc.</strong> — base de donnees (region EU)</li>
              <li><strong>Google</strong> — authentification OAuth (si utilisee par le restaurateur)</li>
            </ul>
            <p className="text-sm mt-3">
              Aucune donnee n&apos;est vendue ou partagee a des tiers a des fins publicitaires.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p className="text-sm mb-3">
              Ce site utilise uniquement des <strong>cookies strictement necessaires</strong> au
              fonctionnement du service :
            </p>
            <div className="overflow-x-auto">
              <table className="text-sm w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-4 text-white">Cookie</th>
                    <th className="text-left py-2 pr-4 text-white">Finalite</th>
                    <th className="text-left py-2 text-white">Duree</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4 font-mono text-xs">next-auth.session-token</td>
                    <td className="py-2 pr-4">Authentification Google OAuth</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4 font-mono text-xs">dashboard_session</td>
                    <td className="py-2 pr-4">Session dashboard restaurateur</td>
                    <td className="py-2">7 jours</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4 font-mono text-xs">server_session</td>
                    <td className="py-2 pr-4">Session serveur/personnel</td>
                    <td className="py-2">12 heures</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4 font-mono text-xs">kds_session</td>
                    <td className="py-2 pr-4">Session KDS cuisine</td>
                    <td className="py-2">24 heures</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
                    <td className="py-2 pr-4">Choix consentement cookies</td>
                    <td className="py-2">1 an</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3">
              Aucun cookie de tracking, d&apos;analytics tiers ou publicitaire n&apos;est utilise.
              Conformement a la reglementation CNIL, les cookies strictement necessaires ne requierent
              pas de consentement prealable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Vos droits (RGPD)</h2>
            <p className="text-sm mb-3">
              Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Droit d&apos;acces :</strong> obtenir une copie de vos donnees personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des donnees inexactes</li>
              <li><strong>Droit a l&apos;effacement :</strong> demander la suppression de vos donnees</li>
              <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos donnees</li>
              <li><strong>Droit a la limitation :</strong> restreindre le traitement dans certains cas</li>
            </ul>
            <p className="text-sm mt-3">
              Pour exercer ces droits, contactez-nous a :{" "}
              <a href="mailto:contact@restaurant-avis.fr" className="text-blue-400 hover:underline">
                contact@restaurant-avis.fr
              </a>
              <br />
              Nous repondrons dans un delai de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Securite</h2>
            <p className="text-sm">
              Nous mettons en oeuvre des mesures techniques et organisationnelles pour proteger vos donnees :
              chiffrement des sessions (JWT signe HS256), hashage bcrypt des mots de passe et codes PIN,
              limitation de debit (rate limiting), protection CSRF, en-tetes de securite HTTP,
              et validation systematique des entrees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Reclamation</h2>
            <p className="text-sm">
              Si vous estimez que le traitement de vos donnees personnelles constitue une violation
              du RGPD, vous pouvez introduire une reclamation aupres de la{" "}
              <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertes) :<br />
              3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br />
              Site web : cnil.fr
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
