# PHASE 1 -- Fondations Techniques

> **Objectif** : Mettre en place l'infrastructure technique du MVP (projet, base de donnees, authentification).
> **Sprint** : Sprint 1
> **Points totaux** : 13

---

### US-001 : Setup projet Next.js 14

| | |
|---|---|
| **Phase** | 1 |
| **Module** | Infrastructure |
| **Priorite** | HAUTE |
| **Estimation** | 2 points |
| **Statut** | [ ] A faire |

**Story** : En tant que developpeur, je veux initialiser le projet Next.js 14 avec TypeScript, Tailwind CSS, App Router et Shadcn/UI pour disposer d'une base de code moderne et maintenable.

**Criteres d'acceptation** :
- [ ] Le projet Next.js 14 est cree avec `create-next-app` en mode TypeScript
- [ ] Tailwind CSS est configure et fonctionne
- [ ] App Router (`/app`) est utilise (pas Pages Router)
- [ ] Shadcn/UI est installe avec les composants de base (Button, Card, Input)
- [ ] Le projet compile sans erreur et tourne en `dev` sur localhost:3000
- [ ] Structure modulaire creee : `src/app/`, `src/modules/`, `src/shared/`
- [ ] `.env.example` cree

---

### US-002 : Configurer Supabase

| | |
|---|---|
| **Phase** | 1 |
| **Module** | Infrastructure |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que developpeur, je veux configurer un projet Supabase (base de donnees PostgreSQL, cle anon, client JS) pour stocker les donnees de l'application.

**Criteres d'acceptation** :
- [ ] Les variables d'environnement sont configurees dans `.env.local`
- [ ] Le client Supabase JS est initialise dans `src/shared/lib/supabase/client.ts`
- [ ] Le client serveur est cree dans `src/shared/lib/supabase/server.ts`
- [ ] La connexion a la base fonctionne (test de lecture reussi)
- [ ] Le fichier `.env.local` est dans `.gitignore`
- [ ] Un fichier `.env.example` est fourni avec les cles a remplir

---

### US-003 : Schema DB 6 tables + seed demo

| | |
|---|---|
| **Phase** | 1 |
| **Module** | Base de donnees |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que developpeur, je veux creer le schema de base de donnees avec 6 tables et un jeu de donnees de demo pour alimenter le prototype.

**Criteres d'acceptation** :
- [ ] Table `restaurants` creee (id, name, slug, owner_email, owner_password_hash, google_maps_url, logo_url, primary_color)
- [ ] Table `prizes` creee (id, restaurant_id, name, description, probability, color, icon, is_active)
- [ ] Table `participants` creee (id, restaurant_id, email, name, google_sub, UNIQUE restaurant+email)
- [ ] Table `reviews` creee (id, restaurant_id, participant_id, rating 1-5, comment)
- [ ] Table `participations` creee (id, participant_id, restaurant_id, review_id, prize_id, prize_name, claimed)
- [ ] Table `qr_codes` creee (id, restaurant_id, table_number, url)
- [ ] Relations FK correctement definies entre les tables
- [ ] Seed : 1 restaurant "La Belle Assiette", 6 cadeaux, 15 avis fictifs
- [ ] Fichier `supabase/schema.sql` versionne

---

### US-004 : NextAuth.js Google OAuth pour le flow client

| | |
|---|---|
| **Phase** | 1 |
| **Module** | Authentification |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que client du restaurant, je veux me connecter avec mon compte Google pour que mon avis soit authentifie et lie a un vrai compte.

**Criteres d'acceptation** :
- [ ] NextAuth.js est installe et configure avec le provider Google
- [ ] Le bouton "Se connecter avec Google" fonctionne
- [ ] Apres connexion, l'email et le nom sont recuperes et stockes dans `participants`
- [ ] La session utilisateur est maintenue cote client
- [ ] Le callback OAuth redirige vers la page du restaurant d'origine
- [ ] Les credentials Google sont dans les variables d'environnement
- [ ] Config dans `src/shared/lib/auth.ts`

---

### US-005 : Login dashboard gerant (email/password bcrypt)

| | |
|---|---|
| **Phase** | 1 |
| **Module** | Authentification |
| **Priorite** | HAUTE |
| **Estimation** | 2 points |
| **Statut** | [ ] A faire |

**Story** : En tant que gerant de restaurant, je veux me connecter a mon dashboard avec email et mot de passe pour gerer mon etablissement en toute securite.

**Criteres d'acceptation** :
- [ ] Page de login `/dashboard/login` avec formulaire email + mot de passe
- [ ] Mot de passe hashe avec bcrypt en base de donnees
- [ ] Validation des identifiants cote serveur (API Route)
- [ ] Message d'erreur clair si identifiants incorrects
- [ ] Redirection vers `/dashboard` apres connexion reussie
- [ ] Session maintenue pendant 7 jours
- [ ] Route `/dashboard` protegee (redirect si non connecte)
- [ ] Compte demo cree dans le seed (email: demo@restaurant-avis.fr, mdp: demo1234)
