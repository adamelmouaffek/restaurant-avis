# Vision — Restaurant Avis (Suite SaaS HoReCa)

## Mission

Devenir la suite digitale de reference pour les restaurants independants en France,
en commencant par la fonctionnalite qui a le plus d'impact immediat :
la collecte d'avis Google authentifies via une roue de cadeaux gamifiee,
puis en elargissant vers le menu digital, la commande, le paiement, le site web et les reseaux sociaux.

## Objectifs 2026

1. **MVP Roue Cadeaux + Avis** — Demo pro pour demarcher les premiers clients — TERMINE
2. **Module Menu QR + Commande + KDS** — Menu digital, commande, ecran cuisine — TERMINE
3. **Completer Module 1** — Photos, QR codes, paiement Stripe, multilingue
4. **Module Site Web SEO** — Site vitrine genere pour chaque restaurant
5. **Module Google Maps & GMB** — Reponses IA, publications auto, analytics
6. **5 premiers clients signes** — Valider le product-market fit

## Modules — 100 User Stories

| # | Module | Stories | Statut | Dossier |
|---|--------|---------|--------|---------|
| 1 | Menu QR + Commande + Paiement | US-001 → US-020 | 10/20 done | `src/modules/menu/` |
| 2 | Roue Cadeaux + Avis | US-021 → US-040 | 13/20 done | `src/modules/avis/` |
| 3 | Site Web + SEO | US-041 → US-060 | 0/20 backlog | — |
| 4 | Google Maps & GMB | US-061 → US-075 | 0/15 backlog | — |
| 5 | Social Media Automation | US-076 → US-090 | 0/15 backlog | — |
| T | Billing, Admin, Compliance | US-091 → US-100 | 0/10 backlog | — |

**Total : 100 stories — 23 done, 1 in-progress, 76 backlog**

## Plans de pricing

| Plan | Prix | Modules inclus |
|------|------|----------------|
| Essential | 1 490 EUR setup | 1 + 2 |
| All-in-One | 2 990 EUR setup | 1 + 2 + 3 + 4 |
| Growth | 149 EUR/mois | All-in-One + 5 |
| Full Pilotage | 249 EUR/mois | Tout + service manage |

## Contraintes

- **Budget** : Gratuit (free tier Vercel + Supabase)
- **Equipe** : Adam (PO debutant) + Claude Code (dev)
- **Temps** : Iteration rapide, sprints courts
- **Tech** : Next.js 14, Supabase, Vercel — pas de changement de stack prevu
- **Reference** : [BACKLOG-100.md](BACKLOG-100.md) pour le detail des 100 stories
