
╔══════════════════════════════════════════════════════════════════╗
║              AD_PROJECT — PLAN COMPLET DE LANCEMENT             ║
║         Suite Digitale SaaS HoReCa — Adam EL MOUAFFEK           ║
║                        Paris, Mars 2026                          ║
╚══════════════════════════════════════════════════════════════════╝


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. VISION DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AD_Project est une suite digitale tout-en-un destinée aux restaurants,
hôtels, cafés et bars (secteur HoReCa). Elle remplace 5 outils séparés
par une seule plateforme cohérente, vendue en paiement unique + abonnement.

Problème résolu :
  → Les restaurateurs utilisent 5+ outils fragmentés (menu QR, avis,
    site web, Google Ads, réseaux sociaux), coûteux et incohérents.
  → 73% des clients consultent Google avant de choisir un restaurant.
  → Les établissements avec peu d'avis sont invisibles sur Maps.
  → Pénurie de serveurs = besoin d'automatiser les commandes.

Proposition de valeur :
  → 1 seul partenaire pour tout digitaliser
  → Résultats rapides : +50 avis Google en 60 jours
  → Prix unique accessible : 1 490€ ou 2 990€ HT
  → Automatisation IA (n8n) pour les tâches répétitives


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. MARCHÉ CIBLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Secteur HoReCa France :
  → 221 521 restaurants
  → 42 000 cafés / bars
  → 18 000 hôtels avec restauration
  → CA total : ~165 milliards €/an

ICP (client idéal) :
  → Restaurant indépendant, brasserie, bar, café, petit hôtel
  → 1 à 5 établissements
  → Ticket moyen client : 20–40 €
  → Zone urbaine : Île-de-France, PACA, Rhône-Alpes
  → Sensible au digital, sans équipe marketing dédiée

TAM → 840 M€ (France HoReCa)
SAM → 56 M€ (20% indépendants urbains)
SOM → 560 K€ (1% première année)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. LES 5 MODULES DU PRODUIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODULE 1 — MENU QR CODE + COMMANDE + PAIEMENT
-----------------------------------------------
  → QR code unique par table généré automatiquement
  → Menu digital : catégories, photos HD, allergènes,
    disponibilité temps réel, multilingue (10 langues)
  → Commande directe depuis le téléphone du client
  → Envoi commande au serveur/cuisine (temps réel)
  → Interface KDS (Kitchen Display System) pour la cuisine
  → Paiement Apple Pay, Google Pay, carte (Stripe)
  → Upsell automatique : +25% panier moyen
  → Mode Hôtel : numéro de chambre + room service
  → Statistiques par table (panier moyen, heures de pointe)

MODULE 2 — ROUE CADEAUX & AVIS AUTHENTIFIÉS (KILLER FEATURE)
--------------------------------------------------------------
  → Après le repas : QR sur table/ticket → accès à la roue
  → Connexion OAuth obligatoire (vrai compte Google ou Trustpilot)
  → L'avis est posté sur la vraie plateforme = zéro faux avis
  → Animation roue (Canvas HTML5) avec lots configurables
  → Cadeaux paramétrables : réduction, café, dessert, boisson...
  → Probabilités par lot réglables dans le back-office
  → Anti-abus : 1 participation / numéro de téléphone
  → SMS automatique de rappel (2h après visite, via n8n + Twilio)
  → Résultat : x6 avis en 30 jours (données terrain)
  → Conformité DGCCRF : cadeau non conditionné à une note positive

MODULE 3 — SITE WEB SEO + SEA
-------------------------------
  → Site vitrine généré depuis le profil de l'établissement
  → Pages : Accueil, Menu, Réservation, Galerie, Avis, Contact, Blog
  → SEO technique : Schema.org Restaurant, meta dynamiques,
    sitemap.xml, robots.txt, Core Web Vitals optimisés
  → Blog IA automatisé (GPT-4o) : recettes, actus, événements
  → Domaine personnalisé ou sous-domaine par client
  → Campagnes Google Ads locales configurées (ciblage géo)
  → Remarketing sur visiteurs du menu QR

MODULE 4 — GOOGLE MAPS & GMB
------------------------------
  → Connexion API Google My Business (GMB)
  → Fiche complète à 100% : horaires, photos, description
  → Posts automatiques hebdomadaires (workflow n8n)
  → Réponses automatiques aux avis (GPT-4o, ton configurable)
  → Lien direct vers le menu QR depuis la fiche GMB
  → Suivi du classement local Google Maps
  → Rapport de visibilité mensuel

MODULE 5 — RÉSEAUX SOCIAUX
----------------------------
  → Connexion Instagram (Graph API), Facebook, TikTok
  → Templates de posts et Reels configurables
  → Pipeline automatisé (n8n + FFmpeg) :
      Input : vidéo ou photo d'un plat
      Output : Reel vertical + Story + Post avec caption IA
  → Validation manuelle optionnelle (webhook Telegram)
  → Rapport mensuel : reach, likes, nouveaux abonnés


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. MODÈLE COMMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OFFRES ONE-SHOT (paiement unique)
----------------------------------
  [ESSENTIEL]  1 490 € HT
    → Menu QR + Commande + Paiement Apple/Google Pay
    → Site web SEO (5 pages)
    → Google Maps GMB optimisé
    → Formation gérant 1h (Zoom)

  [TOUT-EN-UN] 2 990 € HT  ★ RECOMMANDÉ
    → Tout l'Essentiel +
    → Roue Cadeaux (OAuth Google + Trustpilot)
    → Setup campagnes Google Ads (SEA)
    → Réseaux Sociaux (Instagram, Facebook, TikTok)
    → Maintenance 3 mois incluse
    → Site SEO 10 pages

ABONNEMENTS MENSUELS (récurrence)
-----------------------------------
  [MAINTENANCE]    49 €/mois
    → Hébergement sécurisé
    → Mises à jour menu illimitées
    → Support technique prioritaire
    → Sauvegardes hebdomadaires

  [GROWTH]        149 €/mois
    → Tout Maintenance +
    → Publication automatisée IA (Reels, Stories, Posts)
    → Rapport mensuel engagement social

  [FULL PILOTAGE] 249 €/mois
    → Tout Growth +
    → Gestion active Google Ads
    → Optimisation SEO mensuelle
    → Rapport ROI complet + recommandations

GARANTIE COMMERCIALE
---------------------
  → 50 avis Google en 60 jours après activation de la roue
  → Sinon : on continue gratuitement jusqu'à l'objectif atteint

PROJECTIONS FINANCIÈRES
-------------------------
  An 1 (2026) : 30 clients   → CA  140 000 €
  An 2 (2027) : 120 clients  → CA  610 000 €
  An 3 (2028) : 300 clients  → CA 1 650 000 €

  CAC cible : ~400 €/client
  LTV 3 ans  : ~8 500 €/client
  Point mort : ~15–20 clients Tout-en-un + abonnés


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. ARCHITECTURE TECHNIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stack :
  Frontend        → Next.js 14 (App Router) + Tailwind CSS + Shadcn/UI
  Backend         → Next.js API Routes + Node.js
  Base de données → PostgreSQL via Supabase (RLS multi-tenant)
  ORM             → Prisma
  Auth            → NextAuth.js (Google OAuth, Trustpilot, Credentials)
  Paiement        → Stripe (abonnements) + Stripe Terminal (Apple Pay)
  Automatisation  → n8n self-hosted
  IA              → OpenAI GPT-4o
  QR Code         → react-qr-code
  Temps réel      → Supabase Realtime (WebSocket commandes)
  SMS             → Twilio (via n8n)
  Hébergement     → Vercel (frontend) + Railway (backend/DB)

Dossier racine : ad-project/
  ├── apps/
  │   ├── web/         (dashboard admin + pages publiques)
  │   └── kds/         (interface cuisine)
  ├── packages/
  │   ├── db/          (schéma Prisma partagé)
  │   └── utils/       (fonctions communes)
  ├── n8n-workflows/   (JSON des automatisations)
  └── docs/            (documentation)

Multi-tenant :
  → 1 compte par établissement
  → Isolation des données (Supabase Row Level Security)
  → Sous-domaine propre par client (menu.restaurant.fr)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. ROADMAP MVP (DRIVEN-TO-MVP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1 — Semaines 1–2 : FONDATIONS
  [ ] Setup monorepo Turborepo
  [ ] Init Next.js 14 + Tailwind + Shadcn
  [ ] Setup Supabase (DB + Auth + Realtime)
  [ ] Schéma Prisma + premières migrations
  [ ] Auth gérant (NextAuth.js + Google OAuth)
  [ ] Dashboard skeleton (layout + navigation)

PHASE 2 — Semaines 3–5 : MODULE QR + COMMANDE (MVP)
  [ ] Back-office menu (CRUD catégories, produits, photos)
  [ ] Génération QR code par table
  [ ] Page menu public (mobile-first, sans auth)
  [ ] Panier + checkout Stripe
  [ ] Apple Pay / Google Pay intégré
  [ ] WebSocket commandes (Supabase Realtime)
  [ ] Interface KDS cuisine

PHASE 3 — Semaines 6–8 : MODULE ROUE + AVIS
  [ ] Parcours post-commande (QR → avis → roue)
  [ ] OAuth Google (flow avis Maps)
  [ ] OAuth Trustpilot (Invitation API)
  [ ] Animation roue Canvas HTML5
  [ ] Configuration cadeaux + probabilités
  [ ] Anti-abus (1 participation/téléphone)
  [ ] Workflow n8n : SMS rappel 2h après visite

PHASE 4 — Semaines 9–11 : SITE WEB + GMB
  [ ] Générateur site vitrine (templates)
  [ ] SEO : Schema.org, meta dynamiques, sitemap
  [ ] Sous-domaine automatique par client
  [ ] Connexion GMB API
  [ ] Posts GMB automatisés (n8n)
  [ ] Réponses avis IA (GPT-4o)

PHASE 5 — Semaines 12–14 : SOCIAL + FACTURATION
  [ ] Connexion Instagram / Facebook / TikTok
  [ ] Pipeline vidéo → Reel (n8n + FFmpeg)
  [ ] Validation Telegram avant publication
  [ ] Stripe abonnements (49€ / 149€ / 249€)
  [ ] Portail client (factures, plan, résiliation)
  [ ] Super-admin dashboard (vue globale clients)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. GO-TO-MARKET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1 — Validation locale (Paris/IDF)
  → 30 clients la première année
  → Approche terrain : porte-à-porte, démo live sur place
  → Montrer un avant/après Google Maps concret
  → Île-de-France = 20–25% des restaurants français

Phase 2 — Expansion nationale
  → Partenariats experts-comptables, fournisseurs HoReCa
  → Contenus "avant/après" pour convaincre les gérants
  → Réplication ville par ville (Lyon, Marseille, Bordeaux)
  → Canal contenu : LinkedIn + blog + newsletter

Canaux d'acquisition :
  → Terrain direct (phase 1)
  → Bouche-à-oreille + témoignages clients
  → Contenu SEO (blog, YouTube, LinkedIn)
  → Partenariats revendeurs / prescripteurs


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. ANALYSE SWOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORCES
  → Suite 5-en-1 : aucun concurrent ne propose tout ça
  → Automatisation n8n = coûts opérationnels très bas
  → Avis OAuth = différenciateur éthique et légal fort
  → Revenus récurrents via abonnements
  → Expertise personnelle en automatisation IA

FAIBLESSES
  → Concurrents établis (Sunday, HeyPongo, Fydl)
  → Résistance des gérants "old school"
  → SAV chronophage en phase de lancement
  → Dépendance aux API Google / Trustpilot

OPPORTUNITÉS
  → 200 000+ restaurants en France sous-digitalisés
  → 36 746 fermetures en 2025 = urgence de digitaliser
  → Tourisme Paris = besoin multilingue fort
  → Pénurie main-d'oeuvre = QR code = solution naturelle

RISQUES
  → Changement CGU Google sur avis incentivés
  → Churn élevé si onboarding mal géré
  → Coût acquisition client B2B élevé
  → Maintenance technique multi-clients complexe


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. CONFORMITÉ & LÉGAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [ ] RGPD : consentement cookies, politique vie privée,
             suppression données sur demande
  [ ] DGCCRF : cadeau non conditionné à une note positive
  [ ] Mentions légales sur chaque site client
  [ ] CGU roue cadeaux (transparence lots + probabilités)
  [ ] Stripe PCI-DSS pour les paiements
  [ ] Données hébergées en Europe (UE)
  [ ] Conformité CGU Google (OAuth officiel uniquement)
  [ ] Conformité Trustpilot Invitation API


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. DEFINITION OF DONE (par feature)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [ ] Tests unitaires passent (Jest)
  [ ] Mobile responsive validé (iPhone SE minimum)
  [ ] Chargement < 3s sur 4G (Lighthouse > 85)
  [ ] Données isolées par tenant (RLS vérifié)
  [ ] Gestion erreur utilisateur (toast + log Sentry)
  [ ] Documenté dans /docs


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. VARIABLES D'ENVIRONNEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TRUSTPILOT_CLIENT_ID=
TRUSTPILOT_CLIENT_SECRET=
TRUSTPILOT_BUSINESS_UNIT_ID=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
N8N_WEBHOOK_URL=
N8N_API_KEY=
GMB_CLIENT_ID=
GMB_CLIENT_SECRET=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12. COMMANDES DE DÉMARRAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  git clone https://github.com/ton-user/ad-project.git
  cd ad-project
  npm install
  cp .env.example .env.local
  npx prisma migrate dev --name init
  npx prisma db seed
  npm run dev

  # Lancer n8n (Docker)
  docker run -it --rm \
    --name n8n \
    -p 5678:5678 \
    -v ~/.n8n:/home/node/.n8n \
    n8nio/n8n


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  AD_Project — Adam EL MOUAFFEK — Paris, Mars 2026
  Next.js 14 · Supabase · Prisma · n8n · Stripe · GPT-4o

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
