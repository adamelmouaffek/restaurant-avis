# Liens du Projet — Restaurant Avis

> Tous les liens pour acceder au projet en local et en production.

## Production (Vercel)

| Page | URL | Description |
|------|-----|-------------|
| Landing page | https://restaurant-avis.vercel.app | Page d'accueil avec acces rapide |
| Dashboard gerant | https://restaurant-avis.vercel.app/dashboard | Tableau de bord du restaurateur |
| Login dashboard | https://restaurant-avis.vercel.app/dashboard/login | Connexion gerant |
| Gestion menu | https://restaurant-avis.vercel.app/dashboard/menu | CRUD categories et plats |
| Commandes | https://restaurant-avis.vercel.app/dashboard/orders | Suivi des commandes |
| QR Codes | https://restaurant-avis.vercel.app/dashboard/qr-codes | Generateur QR menu + avis |
| Cadeaux/Roue | https://restaurant-avis.vercel.app/dashboard/prizes | Configuration roue cadeaux |
| Avis | https://restaurant-avis.vercel.app/dashboard/reviews | Consulter les avis recus |
| Statistiques | https://restaurant-avis.vercel.app/dashboard/stats | Analytics et performance |

## Liens Clients (demo : la-belle-assiette)

| Page | URL | Description |
|------|-----|-------------|
| Menu digital | https://restaurant-avis.vercel.app/m/la-belle-assiette/table/1 | Menu client table 1 |
| Ecran cuisine (KDS) | https://restaurant-avis.vercel.app/kds/la-belle-assiette | Kitchen Display System temps reel |
| Parcours avis | https://restaurant-avis.vercel.app/r/la-belle-assiette | Flow client : note + roue cadeaux |
| Roue cadeaux | https://restaurant-avis.vercel.app/r/la-belle-assiette/wheel | Roue de la fortune |
| Laisser un avis | https://restaurant-avis.vercel.app/r/la-belle-assiette/review | Formulaire d'avis |

## Local (developpement)

| Page | URL |
|------|-----|
| Landing page | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| Menu client table 1 | http://localhost:3000/m/la-belle-assiette/table/1 |
| KDS cuisine | http://localhost:3000/kds/la-belle-assiette |
| Parcours avis | http://localhost:3000/r/la-belle-assiette |

## API Endpoints

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/auth/dashboard` | POST | Login dashboard (email/password) |
| `/api/auth/[...nextauth]` | GET/POST | Google OAuth NextAuth |
| `/api/menu/categories` | GET/POST | Categories du menu |
| `/api/menu/categories/[id]` | PATCH/DELETE | Modifier/supprimer categorie |
| `/api/menu/items` | GET/POST | Articles du menu |
| `/api/menu/items/[id]` | PATCH/DELETE | Modifier/supprimer article |
| `/api/menu/orders` | GET/POST | Commandes menu |
| `/api/menu/orders/[id]` | PATCH | Mettre a jour statut commande |
| `/api/menu/upload` | POST | Upload photo plat (FormData) |
| `/api/kds/[slug]/orders` | GET | Commandes KDS (auth par slug) |
| `/api/kds/[slug]/orders/[id]` | PATCH | Changer statut commande KDS |
| `/api/avis/qr-codes` | GET/POST | QR codes avis |
| `/api/avis/reviews` | GET/POST | Avis clients |
| `/api/avis/prizes` | GET/POST | Cadeaux roue |
| `/api/avis/restaurants` | GET | Info restaurant |
| `/api/avis/wheel/spin` | POST | Tourner la roue |

## Infra & Outils

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard/project/xxqgkglevrkjndwvtnfp |
| GitHub Repo | *(a ajouter si push sur GitHub)* |

## Commandes utiles

```bash
# Demarrer en local
npm run dev

# Build de production
npx next build

# Deploy (auto via git push si connecte a Vercel)
git push
```
