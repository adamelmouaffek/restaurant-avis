# 🍽️ HoReCa Suite — Projet SaaS Tout-en-un

> Suite digitale complète pour restaurants, hôtels, cafés et bars.
> One-shot 1 490€ / 2 990€ HT + abonnements 49–249€/mois.

---

## 📌 Vision

Devenir le copilote digital de référence des établissements HoReCa
indépendants en Europe francophone. Un seul produit remplace 5 outils :
menu QR, avis authentifiés, site web SEO/SEA, Google Maps et social media.

---

## 🎯 Cible (ICP)

- Restaurants indépendants, brasseries, bars, cafés, petits hôtels
- 1 à 5 établissements, ticket moyen 20–40 €
- Zones urbaines : Île-de-France, PACA, Rhône-Alpes
- Sensibles au digital, sans équipe marketing dédiée

---

## 🧩 Modules Produit

### MODULE 1 — Menu QR Code + Commande + Paiement
- [ ] Génération de QR code unique par table
- [ ] Menu digital : catégories, items, photos HD, allergènes, disponibilité temps réel
- [ ] Commande depuis la table (sans inscription client)
- [ ] Envoi commande au serveur/cuisine (WebSocket / Supabase Realtime)
- [ ] Interface KDS (Kitchen Display System) web temps réel
- [ ] Paiement Apple Pay, Google Pay, carte (Stripe)
- [ ] Upsell automatique (suggestions produits complémentaires)
- [ ] Multilingue (i18n, détection langue navigateur, 10 langues)
- [ ] Mode Hôtel (numéro de chambre + facturation chambre)
- [ ] Statistiques par table (panier moyen, plats top, heures de pointe)

### MODULE 2 — Roue Cadeaux & Avis Authentifiés
- [ ] OAuth natif Google (redirige vers fiche Maps pour avis réel)
- [ ] OAuth natif Trustpilot (via Trustpilot Invitation API)
- [ ] Animation roue (Canvas HTML5)
- [ ] Lots configurables par le gérant (réduction, produit offert)
- [ ] Probabilités configurables par lot
- [ ] Anti-abus : 1 participation / numéro de téléphone, délai configurable
- [ ] SMS de rappel automatique (2h après visite) via n8n + Twilio
- [ ] Dashboard : avis collectés, cadeaux distribués, taux conversion
- [ ] Conformité DGCCRF : cadeau non conditionné à une note positive

### MODULE 3 — Site Web SEO + SEA
- [ ] Génération automatique depuis le profil établissement
- [ ] Pages : Accueil, Menu, Réservation, Galerie, Avis, Contact, Blog
- [ ] Schema.org type Restaurant / FoodEstablishment
- [ ] Balises meta dynamiques, sitemap.xml, robots.txt
- [ ] Core Web Vitals optimisés (WebP, lazy loading, SSR/ISR)
- [ ] Blog IA (articles recettes, événements via GPT-4o)
- [ ] Sous-domaine ou domaine personnalisé par client
- [ ] Setup campagnes Google Ads locales (structure + ciblage géo)
- [ ] Remarketing sur visiteurs menu QR

### MODULE 4 — Google Maps & GMB
- [ ] Connexion Google My Business API
- [ ] Affichage et édition des infos (horaires, description, photos)
- [ ] Publication automatique de posts GMB (hebdo via n8n)
- [ ] Suivi classement local Google Maps
- [ ] Réponses automatiques aux avis (GPT-4o, ton configurable)
- [ ] Lien direct vers menu QR depuis fiche GMB
- [ ] Rapport de visibilité mensuel

### MODULE 5 — Réseaux Sociaux
- [ ] Connexion Instagram Graph API, Facebook, TikTok
- [ ] Templates de posts et Reels configurables
- [ ] Publication automatisée IA via n8n :
  - Input : vidéo ou photo d'un plat
  - Output : Reel vertical, Story, Post avec caption GPT-4o
  - Validation manuelle optionnelle (webhook Telegram)
- [ ] Rapport mensuel engagement (reach, likes, abonnés)

### MODULE 6 — Dashboard Admin (Multi-tenant)
- [ ] Authentification gérant (email + mdp + 2FA)
- [ ] Sections : Commandes, Menu, Avis & Roue, Site Web, Social, Analytics, Facturation
- [ ] Super-admin : vue globale clients, gestion plans, métriques
- [ ] Onboarding guidé en 5 étapes (wizard)
- [ ] Notifications en temps réel (nouvelles commandes, nouveaux avis)

---

## 🏗️ Architecture Technique

### Stack
