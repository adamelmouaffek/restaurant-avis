# Sprint : Module 1 — Menu QR + Commande + KDS

**Goal** : Livrer un menu digital fonctionnel avec commande depuis table et ecran cuisine temps reel
**Debut** : 2026-03-11
**Epic** : Module Menu QR Code + Commande + KDS
**Agents actifs** : 🔨 Builder, 📐 Architect, 🚀 Operator

## User Stories

- US-M01 : En tant que client, je veux scanner un QR code et voir le menu du restaurant
- US-M02 : En tant que client, je veux ajouter des articles a un panier et passer commande
- US-M03 : En tant que cuisinier, je veux voir les commandes en temps reel sur un ecran cuisine
- US-M04 : En tant que gerant, je veux gerer mon menu (categories, articles, prix, allergenes)
- US-M05 : En tant que gerant, je veux voir et suivre les commandes depuis le dashboard

## Taches

| ID | Tache | Agent | Statut | Session |
|----|-------|-------|--------|---------|
| T-M01 | Schema DB 5 tables (restaurant_tables, menu_categories, menu_items, orders, order_items) | 🔨 | ✅ Done | 2026-03-11 |
| T-M02 | Types TypeScript (8 nouveaux types + CartItem) | 🔨 | ✅ Done | 2026-03-11 |
| T-M03 | Seed donnees demo (4 categories, 14 articles) | 🔨 | ✅ Done | 2026-03-11 |
| T-M04 | Pages publiques menu /m/[slug] + panier | 🔨 | ✅ Done | 2026-03-11 |
| T-M05 | API commandes (POST securise + GET protege) | 🔨 | ✅ Done | 2026-03-11 |
| T-M06 | KDS ecran cuisine avec Supabase Realtime | 🔨 | ✅ Done | 2026-03-11 |
| T-M07 | Dashboard menu manager + orders manager | 🔨 | ✅ Done | 2026-03-11 |
| T-M08 | Sidebar : ajouter Menu + Commandes | 🔨 | ✅ Done | 2026-03-11 |
| T-M09 | Fix KDS PATCH endpoint (slug auth au lieu de session) | 🔍 | ✅ Done | 2026-03-12 |
| T-M10 | Build + deploy Vercel | 🚀 | ✅ Done | 2026-03-12 |
| T-M11 | Verification end-to-end en production | 🔍 | 📋 Todo | |
| T-M12 | Generation QR codes tables menu | 🔨 | ✅ Done | 2026-03-13 |
| T-M13 | US-015 : Articles epuises grises (pas caches) | 🔨 | ✅ Done | 2026-03-13 |
| T-M14 | US-019 : Upload photo plat (Supabase Storage) | 🔨 | ✅ Done | 2026-03-13 |
| T-M15 | US-020 : Alerte sonore KDS nouvelle commande | 🔨 | ✅ Done | 2026-03-13 |
| T-M16 | Acces rapide landing page + dashboard quick links | 🔨 | ✅ Done | 2026-03-13 |

## Criteres d'acceptation

- [x] /m/la-belle-assiette?table=2 affiche le menu avec categories et articles
- [x] Ajout au panier + CartDrawer fonctionnel
- [x] POST /api/menu/orders cree la commande (prix re-fetch serveur)
- [x] /kds/la-belle-assiette affiche les commandes en temps reel
- [x] Changement de statut KDS fonctionne sans session dashboard
- [ ] Flow complet teste en production end-to-end
- [x] QR codes generables pour chaque table
- [x] Articles epuises affiches en grise avec badge "Epuise"
- [x] Upload photos plats via Supabase Storage
- [x] Alerte sonore/vibration KDS sur nouvelle commande
- [x] Acces rapide a tous les modules depuis page d'accueil et dashboard

## Notes de session

### Session 2026-03-11
- **Agent(s)** : 🔨 Builder (4 agents paralleles), 📐 Architect
- **Fait** : 35 fichiers crees, Module 1 complet, deploy Vercel
- **Prochaine etape** : Fix KDS PATCH auth

### Session 2026-03-12
- **Agent(s)** : 🔍 Investigator, 🚀 Operator
- **Fait** : Fix KDS PATCH (nouvel endpoint /api/kds/[slug]/orders/[id]), redeploy
- **Prochaine etape** : Verification end-to-end production

### Session 2026-03-13
- **Agent(s)** : 🔨 Builder
- **Fait** : 4 P0 stories (US-015, US-018, US-019, US-020), acces rapide landing + dashboard, 100 user stories backlog
- **Note** : Bucket Supabase Storage `menu-images` a creer manuellement pour US-019
- **Prochaine etape** : Deploy Vercel + test end-to-end production
