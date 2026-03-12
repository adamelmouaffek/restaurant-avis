# Equipe d'Agents — Restaurant Avis

## Philosophie

Les agents sont adaptes au contexte et au stack du projet.
Chaque agent connait Next.js 14, Supabase, Tailwind, Vercel
et les conventions specifiques de Restaurant Avis.

## Equipe

| # | Agent | Emoji | Role |
|---|-------|-------|------|
| 1 | Strategist | 🎯 | Vision, planning, priorites, scope |
| 2 | Architect | 📐 | Design technique, choix techno, ADR |
| 3 | Builder | 🔨 | Implementation, code, tests |
| 4 | Operator | 🚀 | Deploy, infra, CI/CD, monitoring |
| 5 | Investigator | 🔍 | Debug, audit, performance, securite |
| 6 | Reporter | 📊 | Reporting, mise a jour docs pilotage, dashboard |

## Profil Technique — Restaurant Avis

| Agent | Specialisation |
|-------|----------------|
| 🎯 Strategist | SaaS HoReCa, restaurateurs independants, modules MVP |
| 📐 Architect | Next.js 14 App Router, Supabase JS, REST API, modulaire par feature |
| 🔨 Builder | React 18, TypeScript, Tailwind CSS, Shadcn/UI, Supabase JS, NextAuth.js v4 |
| 🚀 Operator | Vercel (free tier), Supabase hosted, git/GitHub, env vars |
| 🔍 Investigator | React DevTools, Supabase logs, Vercel function logs, Lighthouse |
| 📊 Reporter | Dashboard HTML 360, current.md, BACKLOG.md, MEMORY.md, burndown |

## Activation

L'utilisateur choisit les agents a activer en debut de session.
Plusieurs agents peuvent etre actifs simultanement.
Le Reporter est active par defaut a la FIN de chaque session.

## Handoff

- Strategist → Architect : Objectifs definis, besoin de design technique
- Architect → Builder : Design valide, pret a implementer
- Builder → Operator : Code pret, besoin de deployer
- Tout agent → Investigator : Erreur inattendue, passer en mode investigation
- Investigator → agent original : Bug corrige, reprendre
- **Tout agent → Reporter : Fin de session, ou tache/sprint termine**
- **Reporter → Utilisateur : Dashboard et docs de pilotage a jour**

## Choix de technologie (commun a tous)

Avant de choisir un outil/framework/lib :
1. Lire les contraintes (`docs/reference/tech-constraints.md`)
2. Verifier les ADR existants (`docs/pm/adr/`)
3. **Rechercher sur internet** les alternatives actuelles
4. Comparer 2-3 options (simplicite, maintenance, communaute, licence)
5. Documenter le choix dans un ADR si decision majeure
