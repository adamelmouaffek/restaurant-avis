import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reglement du jeu-concours — Restaurant Avis",
  description: "Reglement complet du jeu-concours Roue Cadeaux.",
};

export const dynamic = "force-dynamic";

export default async function ReglementPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!restaurant) notFound();

  return (
    <div className="min-h-screen bg-[var(--et-bg)] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href={`/r/${slug}`}
          className="text-[var(--et-accent-light)] hover:text-blue-300 text-sm mb-8 inline-block"
        >
          &larr; Retour
        </Link>

        <h1 className="text-3xl font-bold mb-4">
          Reglement du jeu-concours
        </h1>
        <p className="text-white/50 text-sm mb-2">
          &laquo; Roue Cadeaux &raquo; — {restaurant.name}
        </p>
        <p className="text-white/50 text-sm mb-12">
          Derniere mise a jour : 14 mars 2026
        </p>

        <div className="space-y-10 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 1 — Organisation
            </h2>
            <p className="text-sm">
              Le jeu-concours &laquo; Roue Cadeaux &raquo; est organise par
              l&apos;etablissement <strong>{restaurant.name}</strong>, ci-apres
              denomme &laquo; l&apos;Organisateur &raquo;, via la plateforme
              Restaurant Avis (editee par Adam EL MOUAFFEK, micro-entreprise,
              Paris, France).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 2 — Conditions de participation
            </h2>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                Le jeu est ouvert a toute personne physique majeure (18 ans
                revolus) ou mineure accompagnee d&apos;un representant legal.
              </li>
              <li>
                La participation est gratuite et sans obligation d&apos;achat.
              </li>
              <li>
                Pour participer, le joueur doit avoir depose un avis via la
                plateforme Restaurant Avis, puis tourner la roue cadeaux.
              </li>
              <li>
                La participation est limitee a <strong>un (1) tour par
                personne</strong> et par visite.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 3 — Modalites du jeu
            </h2>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                Apres avoir depose un avis, le participant accede a une roue
                virtuelle presentant plusieurs lots.
              </li>
              <li>
                Le resultat du tirage est determine aleatoirement cote serveur
                selon les probabilites definies par l&apos;Organisateur pour
                chaque lot.
              </li>
              <li>
                Le lot attribue est affiche immediatement a l&apos;ecran.
              </li>
              <li>
                Aucune manipulation ou influence du participant ne peut modifier
                le resultat du tirage.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 4 — Lots
            </h2>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                Les lots sont definis et fournis exclusivement par
                l&apos;Organisateur ({restaurant.name}).
              </li>
              <li>
                Les lots ne sont ni echangeables, ni remboursables, ni
                convertibles en especes.
              </li>
              <li>
                Pour recuperer un lot, le gagnant doit presenter l&apos;ecran de
                confirmation au personnel du restaurant, lors de la meme visite
                ou selon les conditions specifiees par l&apos;Organisateur.
              </li>
              <li>
                L&apos;Organisateur se reserve le droit de modifier les lots
                disponibles a tout moment.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 5 — Protection des donnees
            </h2>
            <p className="text-sm">
              Les donnees collectees dans le cadre du jeu (prenom, email
              facultatif, contenu de l&apos;avis) sont traitees conformement au
              RGPD et a notre{" "}
              <Link
                href="/confidentialite"
                className="text-[var(--et-accent-light)] hover:underline"
              >
                Politique de confidentialite
              </Link>
              . Elles sont utilisees uniquement pour le fonctionnement du jeu et
              ne sont pas transmises a des tiers a des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 6 — Responsabilite
            </h2>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                L&apos;Organisateur ne saurait etre tenu responsable en cas de
                dysfonctionnement technique empechant le bon deroulement du jeu.
              </li>
              <li>
                En cas de fraude, tentative de triche ou comportement abusif
                (avis fictif, participations multiples), l&apos;Organisateur se
                reserve le droit d&apos;exclure le participant sans preavis.
              </li>
              <li>
                La plateforme Restaurant Avis met en place des mesures
                anti-fraude (limitation de frequence, verification
                d&apos;unicite) pour garantir l&apos;equite du jeu.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 7 — Duree
            </h2>
            <p className="text-sm">
              Le jeu-concours est valable tant que l&apos;Organisateur maintient
              la roue cadeaux active sur son espace Restaurant Avis.
              L&apos;Organisateur peut suspendre ou arreter le jeu a tout moment
              sans preavis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 8 — Litiges
            </h2>
            <p className="text-sm">
              Le present reglement est soumis au droit francais. Tout litige
              relatif a son interpretation ou son execution sera soumis aux
              tribunaux competents de Paris, apres tentative de resolution
              amiable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Article 9 — Contact
            </h2>
            <p className="text-sm">
              Pour toute question relative au jeu-concours, contactez :{" "}
              <a
                href="mailto:contact@restaurant-avis.fr"
                className="text-[var(--et-accent-light)] hover:underline"
              >
                contact@restaurant-avis.fr
              </a>
            </p>
          </section>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex justify-between items-center">
          <Link
            href={`/r/${slug}`}
            className="text-white/40 hover:text-white/60 text-sm"
          >
            &larr; Retour au restaurant
          </Link>
          <Link
            href="/mentions-legales"
            className="text-white/40 hover:text-white/60 text-sm"
          >
            Mentions legales
          </Link>
        </div>
      </div>
    </div>
  );
}
