# Restaurant Avis — Suite Digitale SaaS HoReCa

Next.js 14 (App Router) + Tailwind CSS + Shadcn/UI + Supabase + NextAuth.js | Vercel

## Mode de travail

Au debut de chaque session, proposer a l'utilisateur :

> **Mode de travail pour cette session ?**
>
> 1. **Solo** — Je travaille directement sur la tache
> 2. **Agent Team** — J'active des roles specialises
>
> **Equipe disponible :**
> | # | Agent | Role | Activer ? |
> |---|-------|------|-----------|
> | 1 | Strategist | Vision, planning, priorites | |
> | 2 | Architect | Design technique, choix techno, ADR | |
> | 3 | Builder | Implementation, code, tests | |
> | 4 | Operator | Deploy, infra, CI/CD, monitoring | |
> | 5 | Investigator | Debug, audit, performance, securite | |
> | 6 | Reporter | Reporting, dashboard, mise a jour docs pilotage | Auto |
>
> *Le Reporter s'active automatiquement en fin de session.*
> Roles detailles dans `docs/pm/agents/`

## Sprint Actif

Lire `docs/pm/sprints/current.md` pour les taches et l'objectif en cours.

## Localisations Cles

| Quoi | Ou |
|------|-----|
| Sprint & Backlog | `docs/pm/` |
| Vision & Roadmap | `docs/pm/VISION.md` |
| Roles d'agents | `docs/pm/agents/` |
| Skills custom | `docs/pm/skills/` |
| Decisions archi | `docs/pm/adr/` |
| Reference technique | `docs/reference/` |
| Dashboard 360 | `dashboard.html` |
| Code source | `src/modules/`, `src/app/`, `src/shared/` |

## Regles Critiques (toutes sessions)

1. **Secrets** : Ne JAMAIS committer de secrets. Voir `docs/reference/secrets.md`
2. **Conventions** : Suivre `docs/reference/conventions.md`
3. **Contraintes** : Lire `docs/reference/tech-constraints.md` avant de coder
4. **Choix techno** : Toujours rechercher sur internet avant de choisir un outil/lib
5. **Dashboard** : Mettre a jour `dashboard.html` (section PROJECT_DATA) apres chaque sprint

## Mise a jour automatique (chaque session)

1. Cocher les taches terminees dans `docs/pm/sprints/current.md`
2. Ecrire un resume dans `memory/sessions/YYYY-MM-DD.md`
3. Mettre a jour MEMORY.md si changement significatif
4. Creer un ADR si decision architecturale majeure
5. Ajouter les pieges decouverts dans `docs/reference/tech-constraints.md`
6. Mettre a jour `dashboard.html` PROJECT_DATA si sprint/taches changent

## Preferences Adam

- Niveau debutant : expliquer les choix techniques en langage clair
- Construire par etapes visibles et testables
- Arreter aux moments de decision cles — presenter les options
- Resultat pro, pas un projet de hackathon
- Budget infra : gratuit (free tier Vercel + Supabase)

## Architecture

- **Structure** : Modulaire par feature (`src/modules/avis/`, `src/modules/menu/`)
- **DB** : Supabase JS client direct (pas de Prisma)
- **Auth client** : Google OAuth via NextAuth.js v4
- **Auth dashboard** : email/password bcrypt
- Pages dans app/ = minces, importent depuis modules/
- Composants specifiques = dans modules/[nom]/components/
- Composants partages = dans shared/components/
- API routes groupees par module = api/avis/, api/menu/
