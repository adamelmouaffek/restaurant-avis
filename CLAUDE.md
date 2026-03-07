# Restaurant Avis — CLAUDE.md

## Projet

Suite digitale SaaS HoReCa — Module MVP : Roue Cadeaux + Avis
Owner : Adam EL MOUAFFEK | Paris, Mars 2026

## Architecture

- **Stack** : Next.js 14 (App Router) + Tailwind CSS + Shadcn/UI + Supabase + NextAuth.js
- **Structure** : Modulaire par feature (`src/modules/avis/`, futur `menu/`, `site/`...)
- **DB** : Supabase JS client direct (pas de Prisma)
- **Auth client** : Google OAuth via NextAuth.js
- **Auth dashboard** : email/password bcrypt

## Structure du code

```
src/app/          → Routage uniquement (pages minces)
src/modules/      → Logique metier (1 dossier = 1 module)
src/shared/       → Composants UI et utilitaires partages
Backlogs/         → Gestion agile (user stories, burndown, sprints)
```

## Agent Team

5 agents specialises. L'orchestrateur coordonne et delegue.
En cas de desaccord → soumettre le choix a Adam.

### Adam-PO (Product Owner)
- Role : Cadre les sprints, redige les user stories, priorise le backlog
- Skills : brainstorming, writing-plans
- Met a jour : Backlogs/

### Dev-Core (Fullstack Developer)
- Role : Implemente Next.js, APIs, DB, integrations
- Skills : test-driven-development, systematic-debugging, verification-before-completion
- Code dans : src/modules/, src/app/api/, src/shared/lib/

### Designer-UI (UI/UX Designer)
- Role : Interfaces pro, mobile-first, animations, experience "wow"
- Skills : brainstorming, frontend-design
- Code dans : src/modules/*/components/, src/shared/components/

### QA-Guard (QA Engineer)
- Role : Teste chaque feature, responsive, performance, anti-abus
- Skills : systematic-debugging, verification-before-completion, simplify
- Met a jour : Backlogs/BurndownChart.md

### Ops-Deploy (DevOps)
- Role : Setup projet, config Supabase, deploiement Vercel, git
- Skills : using-git-worktrees, finishing-a-development-branch

## Conventions

- Pages dans app/ = minces, importent depuis modules/
- Composants specifiques a un module = dans modules/[nom]/components/
- Composants partages = dans shared/components/
- API routes groupees par module = api/avis/, futur api/menu/
- Types specifiques = modules/[nom]/types.ts
- Types partages = shared/types/index.ts

## Preferences Adam

- Niveau debutant : expliquer les choix techniques en langage clair
- Construire par etapes visibles et testables
- Arreter aux moments de decision cles — presenter les options
- Resultat pro, pas un projet de hackathon
- Budget infra : gratuit (free tier Vercel + Supabase)
