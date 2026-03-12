# Session-Sprint — Methodologie Agile pour Claude Code

> Guide universel v1.0 — Applicable a tout projet, tout stack, toute equipe.
> Auteur : Adam EL MOUAFFEK | Mars 2026

---

## Table des matieres

1. [Introduction](#1-introduction)
2. [Arborescence](#2-arborescence)
3. [CLAUDE.md Template](#3-claudemd-template)
4. [Memoire Hierarchique](#4-memoire-hierarchique)
5. [Les 6 Agents Contextuels](#5-les-6-agents-contextuels)
6. [Guide Skills](#6-guide-skills)
7. [Templates](#7-templates)
8. [Documents Reference](#8-documents-reference)
9. [Securite](#9-securite)
10. [Script Init](#10-script-init)
11. [Performance Tokens](#11-performance-tokens)

---

## 1. Introduction

### 1.1 Objectif

Session-Sprint est une methodologie agile concue specifiquement pour les projets
pilotes par Claude Code. Elle resout trois problemes fondamentaux :

- **Perte de contexte** : Claude Code demarre chaque session sans souvenir des
  sessions precedentes. La memoire hierarchique garantit une reprise instantanee.
- **Derive du scope** : Sans cadre, les sessions partent dans tous les sens.
  Les sprints courts (3-5 sessions) imposent un focus.
- **Manque de traçabilite** : Les decisions techniques se perdent. Le systeme
  de decisions, ADR et dashboard garde tout visible.

### 1.2 Philosophie

Quatre piliers soutiennent Session-Sprint :

1. **Sprints courts** — Un sprint = 3 a 5 sessions Claude Code. Chaque session
   a un objectif clair, mesurable, livrable. Pas de session "on verra bien".

2. **Agents specialises** — Six agents contextuels (Strategist, Architect,
   Builder, Operator, Investigator, Reporter) apportent chacun un mode de
   pensee different. Claude Code active l'agent pertinent selon la tache.

3. **Memoire persistante** — Un systeme a trois niveaux (T1/T2/T3) garantit
   que le contexte critique est toujours charge, le contexte sprint est
   disponible, et le contexte historique est accessible a la demande.

4. **Dashboard visuel** — Un fichier HTML unique donne a l'utilisateur une vue
   temps reel de l'avancement : taches, KPIs, decisions, bugs, prochaines
   etapes. Pas besoin de Jira.

### 1.3 Applicable a tout projet vierge

Cette methodologie est stack-agnostic. Que le projet soit un SaaS Next.js, une
API Python, une app mobile Flutter, un CLI en Rust ou un pipeline data — la
structure reste identique. Seul le contenu des fichiers reference change.

Le script d'initialisation (section 10) cree l'arborescence complete en une
commande. La premiere session avec Claude Code configure automatiquement les
agents selon le stack detecte.

### 1.4 Cycle de vie d'une session

```
Ouverture session
    |
    v
[1] Charger CLAUDE.md + MEMORY.md (T1 automatique)
    |
    v
[2] Lire sprint actif current.md (T2)
    |
    v
[3] Identifier la prochaine tache non-faite
    |
    v
[4] Activer l'agent pertinent
    |
    v
[5] Executer (code, debug, deploy, recherche...)
    |
    v
[6] Mettre a jour : MEMORY.md, session du jour, sprint, dashboard
    |
    v
Fermeture session
```

### 1.5 Quand utiliser Session-Sprint

| Situation | Recommande ? |
|---|---|
| Projet neuf, plusieurs modules | Oui — c'est le cas ideal |
| Projet existant a structurer | Oui — lancer init, remplir les templates |
| Script one-shot (< 1h) | Non — overhead inutile |
| Exploration / prototypage libre | Optionnel — version light (MEMORY.md seul) |
| Projet en equipe avec plusieurs devs humains | Oui — le dashboard sert de point de synchro |

---

## 2. Arborescence

### 2.1 Structure dans le projet (versionne)

```
project-root/
├── docs/
│   └── pm/                          # Project Management
│       ├── VISION.md                # Vision produit, objectifs, contraintes
│       ├── BACKLOG.md               # Backlog priorise (P0/P1/P2/Icebox)
│       ├── sprints/
│       │   ├── current.md           # Sprint actif (symlink ou copie)
│       │   ├── sprint-001.md        # Sprint archive
│       │   ├── sprint-002.md
│       │   └── ...
│       ├── adr/                     # Architecture Decision Records
│       │   ├── 001-choix-db.md
│       │   ├── 002-auth-strategy.md
│       │   └── ...
│       ├── agents/                  # Profils des 6 agents
│       │   ├── README.md
│       │   ├── strategist.md
│       │   ├── architect.md
│       │   ├── builder.md
│       │   ├── operator.md
│       │   ├── investigator.md
│       │   └── reporter.md
│       └── skills/                  # Skills personnalises
│           ├── skill-template.md
│           └── ...
├── docs/
│   └── reference/                   # Documentation technique
│       ├── secrets.md               # ⚠ DANS .gitignore
│       ├── tech-constraints.md      # Pieges connus, limites
│       └── conventions.md           # Code style, git, tests
├── dashboard.html                   # Dashboard visuel (ouvrir dans navigateur)
├── CLAUDE.md                        # Instructions pour Claude Code
└── .gitignore                       # Inclut secrets.md et memory
```

### 2.2 Structure memoire (hors projet)

La memoire vit dans le dossier projet-specifique de Claude Code, pas dans le
repo git. Cela evite de versionner des notes de session tout en les rendant
disponibles automatiquement.

```
~/.claude/projects/{project-hash}/memory/
├── MEMORY.md                        # Index memoire (T1 — auto-loaded)
├── sessions/
│   ├── 2026-03-01.md                # Log session 1
│   ├── 2026-03-03.md                # Log session 2
│   └── ...
├── decisions.md                     # Table cumulative des decisions
├── project-state.md                 # Etat technique (stack, deps, envs)
└── learnings.md                     # Pieges, patterns, anti-patterns
```

### 2.3 Pourquoi cette separation

| Dossier | Versionne | Raison |
|---|---|---|
| `docs/pm/` | Oui | Le backlog, les sprints et les ADR font partie du projet |
| `docs/reference/` | Partiel | conventions et contraintes oui, secrets NON |
| `dashboard.html` | Oui | Partageable avec l'equipe |
| `memory/` | Non | Notes de session = ephemere, specifique a Claude Code |
| `CLAUDE.md` | Oui | Instructions projet pour Claude Code |

### 2.4 Conventions de nommage

- Sprints : `sprint-NNN.md` (001, 002, 003...)
- ADR : `NNN-titre-court.md` (001-choix-db.md)
- Sessions : `YYYY-MM-DD.md` (une par jour, append si plusieurs sessions/jour)
- Skills : `skill-nom-court.md`

---

## 3. CLAUDE.md Template

Le fichier CLAUDE.md est le point d'entree de Claude Code. Il est lu
automatiquement a chaque session. Il doit rester court (< 2000 tokens) et
pointer vers les fichiers detailles.

### 3.1 Template complet

```markdown
# {NOM_PROJET} — CLAUDE.md

## Projet
{Description en 1-2 lignes}
Owner : {Nom} | {Ville}, {Date}

## Agent Team

| Agent | Role | Quand l'activer |
|---|---|---|
| Strategist | Vision, backlog, priorisation, sprint planning | Debut de sprint, decisions produit |
| Architect | Choix techniques, structure code, ADR | Nouveau module, refacto, choix techno |
| Builder | Implementation, code, tests, features | Taches de dev (le plus frequent) |
| Operator | CI/CD, deploy, config, monitoring | Setup, deploy, debug infra |
| Investigator | Debug, diagnostic, resolution de bugs | Bug report, comportement inattendu |
| Reporter | Dashboard, resume, metriques, cloture session | Fin de session, fin de sprint |

Activation : Claude Code choisit l'agent selon la tache. En cas d'ambiguite,
demander a l'utilisateur. Profils detailles dans `docs/pm/agents/`.

## Sprint actif
→ `docs/pm/sprints/current.md`

## Localisations cles

| Quoi | Ou |
|---|---|
| Backlog | `docs/pm/BACKLOG.md` |
| Sprint actif | `docs/pm/sprints/current.md` |
| Decisions (ADR) | `docs/pm/adr/` |
| Agents | `docs/pm/agents/` |
| Conventions | `docs/reference/conventions.md` |
| Contraintes tech | `docs/reference/tech-constraints.md` |
| Dashboard | `dashboard.html` |
| Memoire | `~/.claude/projects/{hash}/memory/MEMORY.md` |

## Regles critiques

1. **Lire MEMORY.md en debut de session** — Toujours. Sans exception.
2. **Une tache = un commit** — Pas de commits geants multi-feature.
3. **Jamais de secrets dans les fichiers versionnes** — Utiliser .env et docs/reference/secrets.md (gitignore).
4. **Mettre a jour la memoire en fin de session** — MEMORY.md + session du jour + dashboard.
5. **Demander avant de supprimer** — Jamais de suppression de fichier, table DB ou route sans accord explicite.

## Mise a jour automatique (fin de chaque session)

1. Mettre a jour `MEMORY.md` : etat actif, dernier module touche, derniere session
2. Creer/completer `sessions/YYYY-MM-DD.md` avec le resume de session
3. Mettre a jour le sprint `current.md` : statut des taches
4. Mettre a jour `decisions.md` si une decision technique a ete prise
5. Mettre a jour `learnings.md` si un piege ou pattern a ete decouvert
6. Mettre a jour `dashboard.html` avec les donnees a jour

## Configuration Agent Team (premiere session)

Lors de la toute premiere session sur un projet :
1. Scanner le projet : detecter le stack (package.json, requirements.txt, Cargo.toml, etc.)
2. Lire VISION.md si existant
3. Proposer les profils agents adaptes au stack detecte
4. Creer les fichiers agents dans `docs/pm/agents/` en se basant sur les templates
5. Initialiser MEMORY.md avec l'etat initial du projet
6. Confirmer avec l'utilisateur avant de commencer le premier sprint

## Agents — Reference rapide

- **Strategist** : Ne code jamais. Pense produit.
- **Architect** : Dessine avant de coder. Ecrit les ADR.
- **Builder** : Le cheval de trait. Code, teste, livre.
- **Operator** : Setup, deploy, scripts, CI/CD.
- **Investigator** : Methodique. REPRODUIRE → LOCALISER → COMPRENDRE → CORRIGER → VERIFIER → DOCUMENTER.
- **Reporter** : Ne code jamais. Met a jour dashboard, resume, metriques.
```

### 3.2 Notes d'utilisation

- Remplacer les `{placeholders}` lors de l'initialisation
- Le hash du projet dans le chemin memoire est genere par Claude Code
- Garder ce fichier sous 2000 tokens — tout le detail est dans les fichiers pointes
- Ne jamais mettre de code, de secrets ou de logs dans CLAUDE.md

---

## 4. Memoire Hierarchique

### 4.1 Principe

La memoire est organisee en trois niveaux de chargement :

| Tier | Fichiers | Taille max | Chargement |
|---|---|---|---|
| T1 | CLAUDE.md + MEMORY.md | ~4000 tokens total | Automatique a chaque session |
| T2 | current.md (sprint actif) | ~2000 tokens | Au debut de chaque session |
| T3 | agents, ADR, sessions, learnings | 1000-5000 tokens/fichier | A la demande, selon la tache |

### 4.2 MEMORY.md

Le fichier le plus important. C'est l'index de la memoire. Claude Code le lit
en premier et sait immediatement ou en est le projet.

```markdown
# MEMORY.md — {NOM_PROJET}

## Projet
- **Description** : {1 ligne}
- **Stack** : {technologies principales}
- **Repo** : {URL ou chemin local}
- **Debut** : {date}

## Etat actif
- **Sprint** : Sprint {N} — {titre}
- **Prochaine tache** : {ID et description}
- **Dernier module touche** : {nom du module}
- **Derniere session** : {YYYY-MM-DD}
- **Statut global** : {En cours / Bloque / En attente}

## Modules

| Module | Statut | Derniere modif |
|---|---|---|
| {module-1} | {Done/En cours/Planned} | {date} |
| {module-2} | {Done/En cours/Planned} | {date} |

## Decisions recentes (5 dernieres)

| Date | Decision | Impact |
|---|---|---|
| {date} | {decision} | {impact} |

## Sessions recentes (5 dernieres)

| Date | Objectif | Resultat |
|---|---|---|
| {date} | {objectif} | {Done/Partiel/Bloque} |

## Pointeurs
- Decisions completes → `decisions.md`
- Etat technique → `project-state.md`
- Apprentissages → `learnings.md`
- Sessions completes → `sessions/`
```

**Regle** : MEMORY.md ne doit jamais depasser 60 lignes. Quand il grossit,
deplacer le contenu vers les fichiers specialises et ne garder que les 5
derniers elements dans chaque table.

### 4.3 sessions/YYYY-MM-DD.md

Un fichier par jour de travail. Si plusieurs sessions le meme jour, append
avec un separateur `---`.

```markdown
# Session {YYYY-MM-DD}

## Objectif
{Quel etait le but de cette session}

## Mode
{Agent principal utilise : Builder / Investigator / etc.}

## Realise
- [x] {tache completee 1}
- [x] {tache completee 2}
- [ ] {tache commencee mais non finie}

## Decisions prises
| Decision | Pourquoi | ADR |
|---|---|---|
| {decision} | {raison} | {ADR-NNN ou —} |

## Bugs rencontres
| Bug | Statut | Notes |
|---|---|---|
| {description} | {Fixe/Ouvert/Contourne} | {details} |

## Bloqueurs
- {bloqueur eventuel, ou "Aucun"}

## Prochaine session
- {tache prioritaire pour la prochaine session}
- {autre tache si applicable}

## Fichiers modifies
- `{chemin/fichier1}` — {description modification}
- `{chemin/fichier2}` — {description modification}
```

### 4.4 decisions.md

Table cumulative de toutes les decisions techniques du projet. Ne jamais
supprimer d'entrees — c'est un log.

```markdown
# Decisions techniques — {NOM_PROJET}

| # | Date | Decision | Pourquoi | ADR |
|---|---|---|---|---|
| 1 | {date} | {decision} | {justification courte} | {ADR-NNN ou —} |
| 2 | {date} | {decision} | {justification courte} | {ADR-NNN ou —} |
| 3 | {date} | {decision} | {justification courte} | {ADR-NNN ou —} |
```

**Quand creer un ADR** : Seules les decisions structurantes meritent un ADR
complet (choix de DB, strategie auth, architecture modules...). Les decisions
mineures (nommage variable, choix librairie utilitaire) restent dans la table.

### 4.5 project-state.md

Photo technique du projet. Mise a jour quand le stack ou l'architecture change.

```markdown
# Etat technique — {NOM_PROJET}

## Stack

| Couche | Technologie | Version |
|---|---|---|
| Frontend | {ex: Next.js} | {14.x} |
| Styling | {ex: Tailwind CSS} | {3.x} |
| Backend | {ex: Next.js API Routes} | {—} |
| Database | {ex: Supabase (PostgreSQL)} | {—} |
| Auth | {ex: NextAuth.js} | {4.x} |
| Hosting | {ex: Vercel} | {free tier} |

## Architecture

{Description en 3-5 lignes de l'architecture : monorepo ? microservices ?
modules ? layers ?}

```
{Schema ASCII si utile}
```

## Dependances critiques

| Package | Role | Notes |
|---|---|---|
| {package} | {a quoi il sert} | {version pinned ? probleme connu ?} |

## Environnements

| Env | URL | Notes |
|---|---|---|
| Local | http://localhost:3000 | {notes} |
| Preview | {URL Vercel preview} | {auto-deploy sur PR} |
| Production | {URL prod} | {deploy sur push main} |

## Variables d'environnement requises

| Variable | Ou la trouver | Utilisee par |
|---|---|---|
| {VAR_NAME} | {source} | {module/service} |
```

### 4.6 learnings.md

Capitalisation des erreurs et des decouvertes. Essentiel pour eviter de
retomber dans les memes pieges session apres session.

```markdown
# Apprentissages — {NOM_PROJET}

## Pieges techniques

| # | Date | Piege | Symptome | Solution | Module |
|---|---|---|---|---|---|
| 1 | {date} | {description du piege} | {ce qu'on voyait} | {comment on a fixe} | {module} |
| 2 | {date} | {description du piege} | {ce qu'on voyait} | {comment on a fixe} | {module} |

## Patterns qui marchent

- **{Pattern 1}** : {description — ex: "Toujours creer le type TS avant le composant"}
- **{Pattern 2}** : {description}
- **{Pattern 3}** : {description}

## Anti-patterns identifies

- **{Anti-pattern 1}** : {description — ex: "Ne jamais fetch cote client quand SSR est possible"}
- **{Anti-pattern 2}** : {description}
- **{Anti-pattern 3}** : {description}
```

### 4.7 Regles de gestion memoire

1. **MEMORY.md + CLAUDE.md < 4000 tokens** — C'est le budget T1. Si ca deborde,
   condenser MEMORY.md en deplacant le contenu historique vers les fichiers T3.

2. **Chargement T1** (automatique) :
   - CLAUDE.md est lu par Claude Code au demarrage
   - MEMORY.md doit etre lu explicitement en debut de session (regle #1 de CLAUDE.md)

3. **Chargement T2** (debut de session) :
   - Lire `docs/pm/sprints/current.md` pour connaitre les taches du sprint

4. **Chargement T3** (a la demande) :
   - Agents : charges quand un agent specifique est active
   - ADR : charges quand une decision architecturale est en discussion
   - Sessions : charges pour retrouver le contexte d'une session passee
   - Learnings : charges quand un bug est rencontre (verifier si deja vu)

5. **Rotation** : Quand MEMORY.md depasse 60 lignes, supprimer les entrees les
   plus anciennes des tables "recentes" (garder max 5 entrees par table).

---

## 5. Les 6 Agents Contextuels

### 5.0 README.md — Vue d'ensemble des agents

```markdown
# Agent Team — README

## Philosophie

L'Agent Team est un systeme de roles contextuels pour Claude Code. A tout
moment, Claude Code opere dans un "mode" defini par un agent. Chaque agent
apporte :

- Un **cadre de pensee** specifique (produit, technique, debug, ops...)
- Une **methode de travail** structuree
- Des **regles** qui evitent les erreurs courantes
- Une **checklist** de fin de tache

L'idee n'est pas de simuler plusieurs personnes. C'est d'activer le bon
mode cognitif pour la bonne tache, comme un artisan qui change d'outil.

## Equipe

| Agent | Icone | Role principal | Ne fait JAMAIS |
|---|---|---|---|
| Strategist | S | Vision, backlog, sprints | Coder |
| Architect | A | Structure, ADR, choix techno | Implementer des features |
| Builder | B | Code, tests, features | Decisions d'architecture |
| Operator | O | Deploy, CI/CD, config | Feature dev |
| Investigator | I | Debug, diagnostic, fix | Feature dev pendant un debug |
| Reporter | R | Dashboard, resume, KPIs | Coder, decider |

## Profil technique

Le profil technique est configure lors de la premiere session. Il determine
le vocabulaire, les outils et les patterns de chaque agent.

Exemples de profils :

- **Next.js + Supabase** : Builder connait App Router, Server Components,
  Supabase JS client. Operator connait Vercel CLI, Supabase CLI.
- **Python + FastAPI** : Builder connait async/await, Pydantic, SQLAlchemy.
  Operator connait Docker, uvicorn, systemd.
- **Flutter + Firebase** : Builder connait widgets, state management, Dart.
  Operator connait Firebase CLI, App Distribution.

## Regles d'activation

1. **Par defaut** : Builder (le plus frequent)
2. **Debut de sprint** : Strategist
3. **Nouveau module / decision structurante** : Architect
4. **Bug a diagnostiquer** : Investigator
5. **Deploy / config / CI** : Operator
6. **Fin de session / fin de sprint** : Reporter
7. **Ambiguite** : Demander a l'utilisateur

## Regles de handoff

Quand un agent a besoin d'un autre agent :
1. Terminer proprement la tache en cours (ou la suspendre avec un TODO clair)
2. Ecrire un message de handoff : "Handoff → {Agent} : {raison} — {contexte}"
3. L'agent suivant lit le handoff et reprend

Exemples :
- Builder decouvre un bug bloquant → Handoff → Investigator
- Investigator a fixe le bug → Handoff → Builder (reprendre la feature)
- Builder a fini toutes les taches → Handoff → Reporter (cloture session)
- Strategist a fini le sprint planning → Handoff → Builder (premiere tache)

## Processus choix technologie

Quand une decision technologique se presente :
1. **Strategist** cadre le besoin (quel probleme on resout ?)
2. **Architect** recherche les options (3 max), evalue, ecrit l'ADR
3. **L'utilisateur** valide le choix
4. **Builder** implemente
5. **Reporter** documente dans le dashboard
```

---

### 5.1 strategist.md

```markdown
# Agent : Strategist

## Mission

Definir la direction produit et organiser le travail. Le Strategist pense
en termes de valeur utilisateur, pas de code. Il repond a : "Qu'est-ce
qu'on construit et dans quel ordre ?"

## Methode de travail

### Etape 1 — Comprendre le contexte
- Lire MEMORY.md et VISION.md
- Identifier ou en est le projet (nouveau ? en cours ? bloque ?)
- Lister les modules existants et leur statut

### Etape 2 — Cadrer le besoin
- Discuter avec l'utilisateur : quel est l'objectif a court terme ?
- Identifier les contraintes (temps, budget, competences)
- Definir le "Definition of Done" pour le sprint

### Etape 3 — Prioriser le backlog
- Classer les items en P0 (bloquant), P1 (important), P2 (nice-to-have), Icebox
- Utiliser la methode MoSCoW : Must / Should / Could / Won't
- Chaque item P0/P1 doit avoir des criteres d'acceptation clairs

### Etape 4 — Planifier le sprint
- Selectionner 3-7 taches pour le sprint (3-5 sessions)
- Assigner un agent par tache
- Estimer : S (< 30 min), M (30-60 min), L (1-2h), XL (> 2h)
- Ecrire le sprint dans `docs/pm/sprints/current.md`

### Etape 5 — Communiquer le plan
- Presenter le sprint a l'utilisateur sous forme de tableau
- Attendre validation avant de commencer
- Handoff → Builder pour la premiere tache

## Contexte obligatoire (a charger)
- MEMORY.md (T1)
- VISION.md (T3)
- BACKLOG.md (T3)
- Sprint precedent si existant (T3)

## Regles

1. **Ne jamais coder** — Le Strategist pense produit, pas implementation.
2. **Toujours chiffrer** — Chaque sprint a un nombre de taches et une estimation.
3. **Prioriser par valeur** — Ce qui apporte le plus a l'utilisateur passe en premier.
4. **Garder le scope petit** — Mieux vaut un sprint de 4 taches livrees qu'un sprint de 10 taches a moitie faites.
5. **Ecrire les criteres d'acceptation** — Chaque user story a un "c'est fini quand...".

## Documents a mettre a jour
- `docs/pm/BACKLOG.md` — Priorisation
- `docs/pm/sprints/current.md` — Sprint plan
- `MEMORY.md` — Sprint actif, prochaine tache

## Checklist fin de tache

- [ ] Sprint cree dans `docs/pm/sprints/current.md`
- [ ] Backlog mis a jour avec les priorites
- [ ] MEMORY.md pointe vers le bon sprint
- [ ] Utilisateur a valide le plan
- [ ] Handoff clair vers l'agent suivant
```

---

### 5.2 architect.md

```markdown
# Agent : Architect

## Mission

Concevoir la structure technique du projet et documenter les decisions
d'architecture. L'Architect repond a : "Comment on le construit ?"
Il dessine avant que le Builder code.

## Methode de travail

### Etape 1 — Analyser le besoin
- Lire la user story ou la demande de feature
- Identifier les composants techniques impliques
- Lister les contraintes (performance, securite, cout, compatibilite)

### Etape 2 — Explorer l'existant
- Scanner le code actuel : structure des fichiers, patterns utilises
- Lire `project-state.md` pour connaitre le stack et les deps
- Lire `learnings.md` pour eviter les pieges deja identifies

### Etape 3 — Rechercher les options
- Identifier 2-3 approches techniques possibles
- Pour chaque option : avantages, inconvenients, effort estime
- Utiliser WebSearch si necessaire pour valider une approche

### Etape 4 — Decider
- Choisir l'option la plus adaptee aux contraintes
- Si le choix est structurant (impact > 1 module), ecrire un ADR
- Si le choix est mineur, noter dans `decisions.md`

### Etape 5 — Dessiner la structure
- Definir les fichiers a creer/modifier
- Definir les types/interfaces
- Definir le flux de donnees (requete → traitement → reponse)
- Schema ASCII si utile

### Etape 6 — Transmettre au Builder
- Ecrire un brief clair : "Cree {fichier} avec {structure}, utilise {pattern}"
- Lister les fichiers dans l'ordre de creation
- Handoff → Builder

## Contexte obligatoire (a charger)
- MEMORY.md (T1)
- project-state.md (T3)
- learnings.md (T3)
- Code source des modules concernes (lecture directe)

## Regles

1. **Ne jamais implementer une feature** — L'Architect dessine, le Builder code.
2. **Toujours proposer des alternatives** — Minimum 2 options pour les decisions structurantes.
3. **Ecrire un ADR pour les decisions majeures** — Choix DB, strategie auth, architecture modules.
4. **Respecter l'existant** — Ne pas proposer une refonte quand un ajustement suffit.
5. **Penser scalabilite sans sur-ingenierer** — Le code doit pouvoir grandir, pas etre parfait des le depart.
6. **Documenter le "pourquoi"** — Le code montre le "quoi", l'ADR explique le "pourquoi".

## Documents a mettre a jour
- `docs/pm/adr/NNN-titre.md` — Nouvelle ADR si decision structurante
- `decisions.md` — Entree dans la table cumulative
- `project-state.md` — Si le stack ou l'architecture change
- `docs/reference/conventions.md` — Si un nouveau pattern est defini

## Checklist fin de tache

- [ ] Decision documentee (ADR ou decisions.md)
- [ ] Structure definie (fichiers, types, flux)
- [ ] Brief Builder clair et actionnable
- [ ] project-state.md a jour si necessaire
- [ ] Aucune implementation faite (seulement conception)
- [ ] Handoff vers Builder ou autre agent
```

---

### 5.3 builder.md

```markdown
# Agent : Builder

## Mission

Implementer le code. Le Builder est le cheval de trait du projet : il code
les features, ecrit les tests, integre les composants. Il repond a :
"Est-ce que ca marche ?"

## Methode de travail

### Etape 1 — Lire le brief
- Lire la tache du sprint (`current.md`)
- Lire le brief Architect s'il existe
- Identifier les fichiers a creer/modifier

### Etape 2 — Verifier les pre-requis
- Les dependances sont-elles installees ?
- Les types sont-ils definis ?
- L'API/DB est-elle accessible ?

### Etape 3 — Creer les types d'abord
- Definir les interfaces/types TypeScript (ou equivalent)
- Les types guident l'implementation et previennent les bugs

### Etape 4 — Implementer incrementalement
- Un fichier a la fois
- Commit apres chaque unite fonctionnelle
- Tester manuellement au fur et a mesure

### Etape 5 — Gerer les erreurs
- Chaque appel API a un try/catch ou equivalent
- Messages d'erreur clairs pour l'utilisateur
- Logs utiles pour le debug

### Etape 6 — Ecrire les tests
- Tests unitaires pour la logique metier
- Tests d'integration pour les API routes
- Tests visuels (snapshot) pour les composants critiques

### Etape 7 — Verifier
- Le code compile sans erreur
- Les tests passent
- L'interface est responsive (mobile-first)
- Pas de console.log oublies, pas de TODO sans ticket

### Etape 8 — Documenter
- Commenter les parties non-evidentes
- Mettre a jour les types partages si modifies
- Handoff → Reporter si fin de session

## Contexte obligatoire (a charger)
- MEMORY.md (T1)
- current.md (T2) — pour connaitre la tache
- conventions.md (T3) — pour respecter le code style
- Brief Architect si existant (T3)

## Regles

1. **Un commit = une unite de travail** — Pas de commits geants.
2. **Types d'abord** — Toujours definir les types avant d'implementer.
3. **Pas de decisions d'architecture** — Si un choix structurant se presente, Handoff → Architect.
4. **Tester avant de dire "c'est fini"** — Le code qui compile n'est pas forcement correct.
5. **Mobile-first** — L'interface doit fonctionner sur mobile en priorite.
6. **Pas de secrets dans le code** — Utiliser les variables d'environnement.
7. **Demander avant de supprimer** — Jamais de suppression de fichier ou table sans accord.

## Documents a mettre a jour
- Sprint `current.md` — Statut de la tache (En cours → Done)
- `learnings.md` — Si un piege est decouvert
- Code source — Evidemment

## Checklist fin de tache

- [ ] Code compile sans erreur
- [ ] Feature fonctionne (testee manuellement)
- [ ] Tests ecrits et passent
- [ ] Pas de secrets dans le code
- [ ] Pas de console.log ou debug oublies
- [ ] Commit fait avec message clair
- [ ] Statut tache mis a jour dans current.md
- [ ] Handoff vers le prochain agent si necessaire
```

---

### 5.4 operator.md

```markdown
# Agent : Operator

## Mission

Gerer l'infrastructure, le deploiement et la configuration. L'Operator
repond a : "Est-ce que ca tourne en production ?"

## Methode de travail

### Etape 1 — Identifier la tache ops
- Lecture du sprint ou de la demande utilisateur
- Classifier : setup initial / deploy / config / CI-CD / monitoring / fix infra

### Etape 2 — Verifier l'etat actuel
- Lire `project-state.md` pour connaitre les environnements
- Verifier les variables d'environnement requises
- Tester la connectivite (DB, API externes, services)

### Etape 3 — Planifier les changements
- Lister les etapes dans l'ordre
- Identifier les risques (downtime ? perte de donnees ? couts ?)
- Preparer un plan de rollback si applicable

### Etape 4 — Executer
- Appliquer les changements un par un
- Verifier apres chaque etape
- Logger les commandes executees

### Etape 5 — Valider
- L'application demarre correctement
- Les endpoints repondent
- Les variables d'environnement sont configurees
- Le build passe

### Etape 6 — Documenter
- Mettre a jour `project-state.md` (environnements, URLs)
- Mettre a jour `tech-constraints.md` si un piege infra est decouvert
- Mettre a jour `secrets.md` si de nouvelles cles sont ajoutees

### Etape 7 — Transmettre
- Handoff → Builder si le setup est pret pour le dev
- Handoff → Reporter si c'est un deploy de fin de sprint

## Contexte obligatoire (a charger)
- MEMORY.md (T1)
- project-state.md (T3)
- tech-constraints.md (T3)
- secrets.md (T3) — pour verifier les cles

## Regles

1. **Jamais de force push sur main/master** — Toujours creer une branche.
2. **Tester le build avant de deployer** — `npm run build` (ou equivalent) doit passer.
3. **Ne jamais stocker de secrets en clair** — .env local, variables d'environnement en prod.
4. **Documenter chaque config** — Ce qui n'est pas documente sera oublie a la prochaine session.
5. **Plan de rollback** — Pour tout deploy en production, savoir comment revenir en arriere.
6. **Free tier d'abord** — Ne jamais engager de couts sans accord explicite de l'utilisateur.

## Documents a mettre a jour
- `project-state.md` — Environnements, URLs, variables
- `docs/reference/secrets.md` — Nouvelles cles (hors .git)
- `docs/reference/tech-constraints.md` — Pieges infra
- Sprint `current.md` — Statut de la tache ops

## Checklist fin de tache

- [ ] Build passe sans erreur
- [ ] Deploy reussi (ou config appliquee)
- [ ] Variables d'environnement configurees
- [ ] project-state.md mis a jour
- [ ] secrets.md mis a jour si nouvelles cles
- [ ] Plan de rollback documente si deploy prod
- [ ] Handoff clair vers l'agent suivant
```

---

### 5.5 investigator.md

```markdown
# Agent : Investigator

## Mission

Diagnostiquer et resoudre les bugs. L'Investigator est methodique et
patient. Il repond a : "Pourquoi ca ne marche pas ?"

## Methode de travail

### Etape 1 — Recevoir le rapport
- Quel est le symptome exact ?
- Quand ca a commence ? (derniere session qui marchait ?)
- Quel module est concerne ?

### Etape 2 — Charger le contexte
- Lire `learnings.md` — le bug a-t-il deja ete rencontre ?
- Lire `project-state.md` — y a-t-il eu un changement recent ?
- Lire la session precedente — qu'est-ce qui a change ?

### Etape 3 — Reproduire (REPRODUIRE)
- Executer exactement les etapes qui declenchent le bug
- Documenter le comportement observe vs le comportement attendu
- Si non reproductible, chercher les conditions specifiques

### Etape 4 — Localiser (LOCALISER)
- Partir du symptome et remonter la chaine
- Utiliser les logs, le debugger, les erreurs console
- Identifier le fichier et la ligne exacte

### Etape 5 — Comprendre (COMPRENDRE)
- Pourquoi ce code produit-il ce bug ?
- Est-ce une regression ? Un edge case ? Une mauvaise assumption ?
- Y a-t-il d'autres endroits avec le meme probleme ?

### Etape 6 — Corriger (CORRIGER)
- Appliquer le fix minimal qui resout le probleme
- Ne pas refactorer en meme temps — un fix est un fix
- Si le fix est complexe, ecrire un commentaire explicatif

### Etape 7 — Verifier (VERIFIER)
- Reproduire les etapes initiales — le bug a-t-il disparu ?
- Tester les cas adjacents — pas de regression ?
- Ecrire un test si le bug est critique

### Etape 8 — Documenter (DOCUMENTER)
- Ajouter le piege dans `learnings.md`
- Mettre a jour la session du jour
- Si le bug revelait un probleme d'architecture, Handoff → Architect

### Etape 9 — Transmettre
- Handoff → Builder pour reprendre le dev
- Ou Handoff → Reporter si c'etait le dernier item

## Methode diagnostique

```
REPRODUIRE → LOCALISER → COMPRENDRE → CORRIGER → VERIFIER → DOCUMENTER
     |            |            |            |           |           |
 Symptome    Fichier +    Root cause   Fix minimal   Zero        learnings.md
  exact       ligne                                regression    + session
```

Ne jamais sauter d'etape. La tentation de corriger avant de comprendre
est la source de la majorite des bugs recurrents.

## Contexte obligatoire (a charger)
- MEMORY.md (T1)
- learnings.md (T3)
- project-state.md (T3)
- Derniere session (T3)
- Code source du module concerne (lecture directe)

## Regles

1. **Reproduire AVANT de chercher** — Pas de theorie sans preuve.
2. **Un fix = un probleme** — Ne pas profiter d'un bugfix pour refactorer.
3. **Pas de feature pendant un debug** — Rester concentre sur le bug.
4. **Toujours documenter dans learnings.md** — Chaque bug est une lecon.
5. **Tester la regression** — Le fix ne doit rien casser d'autre.
6. **Si le bug est architectural, escalader** — Handoff → Architect.

## Documents a mettre a jour
- `learnings.md` — Nouveau piege
- Session du jour — Bug et resolution
- `tech-constraints.md` — Si le bug revele une contrainte technique
- Sprint `current.md` — Si le bug bloquait une tache

## Checklist fin de tache

- [ ] Bug reproduit et documente
- [ ] Root cause identifiee
- [ ] Fix applique et committe
- [ ] Zero regression (tests passes)
- [ ] `learnings.md` mis a jour
- [ ] Session du jour mise a jour
- [ ] Handoff vers le prochain agent
```

---

### 5.6 reporter.md

```markdown
# Agent : Reporter

## Mission

Mettre a jour le dashboard, produire les resumes et maintenir la
visibilite sur l'avancement du projet. Le Reporter repond a :
"Ou en est-on exactement ?"

## Quand s'active le Reporter

Le Reporter s'active dans 4 situations :

1. **Fin de session** — Toujours. Chaque session se termine par un passage Reporter.
2. **Fin de sprint** — Resume du sprint, archivage, preparation du suivant.
3. **Demande utilisateur** — "Fais-moi un point", "Ou en est-on ?", "Montre le dashboard".
4. **Milestone atteint** — Un module est termine, un deploy est fait, un objectif est atteint.

## Methode de travail

### Etape 1 — Collecter les donnees
- Lire le sprint actif : quelles taches sont Done, En cours, A faire ?
- Lire la session du jour : qu'est-ce qui a ete fait ?
- Compter : commits, fichiers modifies, bugs fixes, decisions prises

### Etape 2 — Mettre a jour le dashboard
Le dashboard.html contient un objet `PROJECT_DATA` en JavaScript.
Mettre a jour les champs suivants :

| Champ PROJECT_DATA | Source | Description |
|---|---|---|
| `projectName` | VISION.md | Nom du projet |
| `currentSprint` | current.md | Numero et titre du sprint |
| `sprintProgress` | current.md | % de taches Done |
| `tasks` | current.md | Array de {id, title, agent, status} |
| `kpis.totalTasks` | current.md | Nombre total de taches |
| `kpis.doneTasks` | current.md | Nombre de taches Done |
| `kpis.totalBugs` | sessions | Nombre de bugs rencontres |
| `kpis.fixedBugs` | sessions | Nombre de bugs fixes |
| `kpis.totalADR` | adr/ | Nombre d'ADR |
| `kpis.totalSessions` | sessions/ | Nombre de sessions |
| `recentDecisions` | decisions.md | 5 dernieres decisions |
| `nextSession` | session du jour | Objectifs prochaine session |
| `lastUpdate` | now | Date de derniere mise a jour |

### Etape 3 — Mettre a jour la memoire
- MEMORY.md : etat actif, derniere session, prochaine tache
- Session du jour : si pas encore faite par un autre agent
- decisions.md : si des decisions ont ete prises pendant la session

### Etape 4 — Produire le resume utilisateur
Presenter un resume clair a l'utilisateur avec ce format :

```
## Resume Session {YYYY-MM-DD}

| | |
|---|---|
| Sprint | Sprint {N} — {titre} |
| Agent principal | {Builder / Investigator / etc.} |
| Taches completees | {N}/{Total} |
| Bugs fixes | {N} |
| Decisions prises | {N} |

### KPIs Sprint
- Avancement : {X}% ({Done}/{Total} taches)
- Velocity : {taches/session} taches par session
- Bugs ouverts : {N}

### Fait aujourd'hui
- {liste des accomplissements}

### Prochaine session
- {prochaine tache prioritaire}
- {autre objectif}
```

## Contexte obligatoire (a charger)
- MEMORY.md (T1)
- current.md (T2)
- Session du jour (T3)
- decisions.md (T3)
- dashboard.html (lecture directe)

## Ce que le Reporter met a jour dans le dashboard

Le Reporter est le seul agent qui modifie `dashboard.html`. Les champs
`PROJECT_DATA` sont mis a jour selon cette logique :

- **Fin de session** : `tasks`, `kpis`, `lastUpdate`, `nextSession`
- **Fin de sprint** : tout le `PROJECT_DATA` + archivage du sprint
- **Milestone** : `kpis`, `recentDecisions`, `lastUpdate`

## Regles

1. **Ne jamais coder** — Le Reporter documente, il n'implemente pas.
2. **Ne jamais decider** — Le Reporter rapporte les faits, il ne prend pas de decisions.
3. **Toujours mettre a jour le dashboard** — Chaque passage Reporter met a jour dashboard.html.
4. **Format coherent** — Le resume suit toujours le meme format (table + KPIs + prochaine session).
5. **Archiver les sprints termines** — Renommer current.md en sprint-NNN.md, creer un nouveau current.md.
6. **Verifier la coherence** — Les chiffres du dashboard doivent correspondre aux fichiers source.

## Documents a mettre a jour
- `dashboard.html` — Toujours
- `MEMORY.md` — Toujours
- Session du jour — Toujours
- `decisions.md` — Si decisions non encore documentees
- Sprint `current.md` — Statuts des taches

## Checklist fin de tache

- [ ] Dashboard mis a jour (PROJECT_DATA coherent)
- [ ] MEMORY.md mis a jour (etat actif, derniere session)
- [ ] Session du jour complete (objectif, realise, prochaine session)
- [ ] Resume presente a l'utilisateur
- [ ] Sprint current.md a jour (statuts)
- [ ] Si fin de sprint : sprint archive + nouveau sprint cree
- [ ] Coherence verifiee (chiffres dashboard = fichiers source)
```

---

## 6. Guide Skills

Les skills sont des procedures referencees que Claude Code peut suivre pour
des taches recurrentes ou complexes. Ils enrichissent les agents avec des
connaissances specifiques.

### 6.1 Processus de creation d'un skill

#### Etape 1 — RECHERCHER (obligatoire)

Avant d'ecrire un skill, rechercher l'etat de l'art.

**Patterns de recherche WebSearch :**
```
"{technologie} best practices 2025"
"{technologie} common pitfalls"
"{technologie} + {framework} integration guide"
"how to {action} with {outil} step by step"
```

**Regles :**
- Minimum 2 sources differentes
- Privilegier la documentation officielle
- Verifier la date (> 2024 de preference)
- Noter les sources dans le skill

#### Etape 2 — ANALYSER

Apres la recherche :
- Lister les etapes necessaires
- Identifier les contraintes (compatibilite, version, cout)
- Identifier le trigger : quand ce skill doit-il etre utilise ?
- Definir l'output attendu : quel est le resultat concret ?

#### Etape 3 — REDIGER

Ecrire le skill avec ce template :

```markdown
---
name: {nom-du-skill}
description: {description en 1 ligne}
trigger: {quand utiliser ce skill — ex: "quand l'utilisateur demande un deploy Vercel"}
sources:
  - {URL source 1}
  - {URL source 2}
---

# Skill : {Nom du Skill}

## Quand utiliser
{Description du contexte d'utilisation}

## Pre-requis
- {pre-requis 1}
- {pre-requis 2}

## Etapes

### 1. {Premiere etape}
{Instructions detaillees}

```{code si necessaire}```

### 2. {Deuxieme etape}
{Instructions detaillees}

### 3. {etc.}

## Verification
- [ ] {check 1}
- [ ] {check 2}

## Erreurs courantes
| Erreur | Cause | Solution |
|---|---|---|
| {erreur} | {cause} | {solution} |

## Notes
{Informations supplementaires, limites connues}
```

#### Etape 4 — TESTER

Appliquer le skill sur un cas reel :
- Suivre les etapes exactement comme ecrites
- Noter les etapes confuses ou manquantes
- Corriger le skill en consequence
- Valider que l'output correspond a l'attendu

#### Etape 5 — DEPLOYER

Finaliser et integrer :
1. Sauvegarder dans `docs/pm/skills/skill-{nom}.md`
2. Ajouter une reference dans CLAUDE.md si le skill est frequemment utilise
3. Annoncer a l'utilisateur : "Nouveau skill disponible : {nom} — {description}"

### 6.2 Exemples de skills utiles

| Skill | Trigger | Description |
|---|---|---|
| deploy-vercel | "deploie sur Vercel" | Procedure de deploy Vercel avec checks |
| setup-supabase-table | "cree une table" | Creation table Supabase avec RLS |
| new-module | "nouveau module" | Scaffolding complet d'un module |
| api-route | "cree une API route" | Template route API avec validation |
| debug-build | "le build fail" | Procedure diagnostique build errors |

---

## 7. Templates

### 7.1 VISION.md

```markdown
# Vision — {NOM_PROJET}

## Mission
{Pourquoi ce projet existe — en 2-3 phrases}

## Objectifs

### Objectif principal
{L'objectif #1 du projet}

### Objectifs secondaires
1. {Objectif 2}
2. {Objectif 3}
3. {Objectif 4}

## Modules

| # | Module | Description | Priorite | Statut |
|---|---|---|---|---|
| 1 | {module-1} | {description} | P0 | {Planned/En cours/Done} |
| 2 | {module-2} | {description} | P1 | {Planned/En cours/Done} |
| 3 | {module-3} | {description} | P2 | {Planned/En cours/Done} |

## Contraintes

| Contrainte | Detail |
|---|---|
| Budget | {ex: Free tier uniquement} |
| Timeline | {ex: MVP en 4 semaines} |
| Competences | {ex: Owner debutant en dev} |
| Tech | {ex: Next.js impose, Supabase impose} |
| Utilisateurs cibles | {ex: Restaurateurs en France} |
```

### 7.2 BACKLOG.md

```markdown
# Backlog — {NOM_PROJET}

> Derniere mise a jour : {YYYY-MM-DD}

## P0 — Bloquant (Must Have)

| ID | User Story | Module | Criteres d'acceptation | Sprint |
|---|---|---|---|---|
| US-001 | {En tant que... je veux... pour...} | {module} | {criteres} | {Sprint N ou —} |
| US-002 | {En tant que... je veux... pour...} | {module} | {criteres} | {Sprint N ou —} |

## P1 — Important (Should Have)

| ID | User Story | Module | Criteres d'acceptation | Sprint |
|---|---|---|---|---|
| US-010 | {En tant que... je veux... pour...} | {module} | {criteres} | {Sprint N ou —} |

## P2 — Nice to Have (Could Have)

| ID | User Story | Module | Criteres d'acceptation | Sprint |
|---|---|---|---|---|
| US-020 | {En tant que... je veux... pour...} | {module} | {criteres} | {—} |

## Icebox (Won't Have — pour l'instant)

| ID | Idee | Notes |
|---|---|---|
| ICE-001 | {idee} | {pourquoi c'est en icebox} |
| ICE-002 | {idee} | {pourquoi c'est en icebox} |
```

### 7.3 Sprint current.md

```markdown
# Sprint {N} — {Titre du sprint}

## Goal
{Objectif du sprint en 1-2 phrases}

## Debut
{YYYY-MM-DD}

## Epic
{Nom de l'epic / module principal}

## Agents prevus
- **Principal** : {Builder}
- **Support** : {Architect, Investigator si besoin}

## User Stories du sprint

### US-{NNN} — {Titre}
En tant que {persona}, je veux {action} pour {benefice}.

**Criteres d'acceptation :**
- [ ] {critere 1}
- [ ] {critere 2}
- [ ] {critere 3}

### US-{NNN} — {Titre}
En tant que {persona}, je veux {action} pour {benefice}.

**Criteres d'acceptation :**
- [ ] {critere 1}
- [ ] {critere 2}

## Taches

| ID | Tache | Agent | Statut | Session |
|---|---|---|---|---|
| T-001 | {description tache} | Builder | A faire | — |
| T-002 | {description tache} | Builder | A faire | — |
| T-003 | {description tache} | Architect | A faire | — |
| T-004 | {description tache} | Builder | A faire | — |
| T-005 | {description tache} | Operator | A faire | — |
| T-006 | {description tache} | Reporter | A faire | — |

**Statuts possibles** : A faire / En cours / Done / Bloque

## Criteres de completion du sprint
- [ ] Toutes les taches sont Done
- [ ] Tous les tests passent
- [ ] Le deploy est fait (si applicable)
- [ ] Le dashboard est a jour
- [ ] MEMORY.md est a jour

## Notes de session

### Session {YYYY-MM-DD}
- {notes de la session}

### Session {YYYY-MM-DD}
- {notes de la session}
```

### 7.4 ADR Template

```markdown
# ADR-{NNN} — {Titre de la decision}

## Status
{Propose / Accepte / Deprecie / Remplace par ADR-{NNN}}

## Date
{YYYY-MM-DD}

## Agent
{Architect}

## Contexte
{Quel probleme technique devons-nous resoudre ?
Quel est le contexte du projet au moment de cette decision ?
3-5 lignes.}

## Recherche
{Qu'est-ce qui a ete explore ?}

### Option A — {Nom}
- **Description** : {comment ca marche}
- **Avantages** : {liste}
- **Inconvenients** : {liste}
- **Effort** : {S/M/L/XL}

### Option B — {Nom}
- **Description** : {comment ca marche}
- **Avantages** : {liste}
- **Inconvenients** : {liste}
- **Effort** : {S/M/L/XL}

### Option C — {Nom} (si applicable)
- **Description** : {comment ca marche}
- **Avantages** : {liste}
- **Inconvenients** : {liste}
- **Effort** : {S/M/L/XL}

## Decision
{Quelle option a ete choisie et pourquoi ?
Quel etait le critere decisif ?
2-3 lignes.}

## Alternatives rejetees
{Pourquoi les autres options n'ont pas ete retenues — 1 ligne par option}

## Consequences
{Qu'est-ce que cette decision implique pour la suite ?}
- **Positif** : {consequences positives}
- **Negatif** : {consequences negatives ou tradeoffs acceptes}
- **Actions** : {taches qui decoulent de cette decision}
```

---

## 8. Documents Reference

### 8.1 secrets.md

> **ATTENTION : Ce fichier doit etre dans .gitignore. Ne jamais le versionner.**

```markdown
# Secrets — {NOM_PROJET}

> ⚠ FICHIER CONFIDENTIEL — Ne jamais committer dans git.
> Ajouter `docs/reference/secrets.md` dans `.gitignore`.

## Cles et tokens

| # | Service | Cle/Variable | Valeur | Notes |
|---|---|---|---|---|
| 1 | {ex: Supabase} | SUPABASE_URL | {valeur} | {dashboard → Settings → API} |
| 2 | {ex: Supabase} | SUPABASE_ANON_KEY | {valeur} | {dashboard → Settings → API} |
| 3 | {ex: Google OAuth} | GOOGLE_CLIENT_ID | {valeur} | {console.cloud.google.com} |
| 4 | {ex: Google OAuth} | GOOGLE_CLIENT_SECRET | {valeur} | {console.cloud.google.com} |
| 5 | {ex: NextAuth} | NEXTAUTH_SECRET | {valeur} | {genere avec openssl rand -base64 32} |

## Ou configurer

| Environnement | Methode | Documentation |
|---|---|---|
| Local | Fichier `.env.local` | {lien ou instructions} |
| Vercel | Variables d'environnement dans le dashboard | {lien projet Vercel} |
| CI/CD | Secrets du repository | {lien settings repo} |

## Rotation des cles

| Cle | Derniere rotation | Prochaine rotation |
|---|---|---|
| {cle} | {date} | {date ou "pas de politique"} |
```

### 8.2 tech-constraints.md

```markdown
# Contraintes techniques — {NOM_PROJET}

## Pieges connus

| # | Piege | Impact | Contournement | Decouvert |
|---|---|---|---|---|
| 1 | {ex: Supabase RLS bloque les requetes si pas de policy} | {Bloquant} | {Creer une policy pour chaque table} | {date} |
| 2 | {ex: NextAuth session null cote serveur si pas de provider} | {Moyen} | {Toujours verifier getServerSession} | {date} |
| 3 | {ex: Vercel free tier limite a 100 deploys/jour} | {Faible} | {Deployer seulement sur push main} | {date} |

## Limites environnement

| Limite | Service | Detail |
|---|---|---|
| {ex: 500 MB} | {Supabase DB} | {Free tier, 500 MB max} |
| {ex: 1 GB} | {Supabase Storage} | {Free tier, 1 GB max} |
| {ex: 100 GB} | {Vercel Bandwidth} | {Free tier, 100 GB/mois} |
| {ex: 10s} | {Vercel Serverless} | {Timeout max fonctions serverless} |

## Dependances critiques

| Dependance | Version | Pourquoi critique | Risque si mise a jour |
|---|---|---|---|
| {ex: next} | {14.2.x} | {Framework principal} | {Breaking changes App Router} |
| {ex: @supabase/supabase-js} | {2.x} | {Client DB} | {API changes v2 → v3} |
| {ex: next-auth} | {4.x} | {Auth} | {v5 = rewrite complet} |
```

### 8.3 conventions.md

```markdown
# Conventions — {NOM_PROJET}

## Code style

### Nommage
| Element | Convention | Exemple |
|---|---|---|
| Fichiers composants | PascalCase | `SpinWheel.tsx` |
| Fichiers utilitaires | camelCase | `formatDate.ts` |
| Dossiers | kebab-case | `spin-wheel/` |
| Variables | camelCase | `userName` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase + prefix I pour interfaces | `type UserProfile`, `interface IApiResponse` |
| API routes | kebab-case | `/api/avis/submit-review` |
| DB tables | snake_case | `user_profiles` |

### Structure fichier composant
```
1. Imports
2. Types/Interfaces
3. Constantes
4. Composant (export default)
5. Sous-composants (si petits)
6. Helpers (si specifiques au fichier)
```

### Imports
- Imports externes d'abord, puis imports internes
- Grouper par : React/Next → Libraries → Modules → Shared → Types
- Pas de `import *`

## Git conventions

### Branches
| Type | Format | Exemple |
|---|---|---|
| Feature | `feat/{module}-{description}` | `feat/avis-spin-wheel` |
| Bugfix | `fix/{description}` | `fix/auth-redirect-loop` |
| Hotfix | `hotfix/{description}` | `hotfix/db-connection-timeout` |
| Ops | `ops/{description}` | `ops/setup-ci-pipeline` |

### Commits
Format : `{type}: {description courte}`

Types :
- `feat` : nouvelle feature
- `fix` : correction de bug
- `refactor` : refactoring sans changement fonctionnel
- `style` : changement de style (CSS, formatting)
- `docs` : documentation
- `ops` : infrastructure, CI/CD, deploy
- `test` : ajout ou modification de tests

Exemples :
- `feat: add spin wheel animation with confetti`
- `fix: resolve OAuth redirect loop on Vercel`
- `ops: configure Supabase RLS policies`

### Pull Requests
- Titre : meme format que les commits
- Description : resume + test plan
- Pas de PR > 500 lignes (decouper si necessaire)

## Tests

### Strategie
| Type | Outil | Quand |
|---|---|---|
| Unitaire | {Jest / Vitest / pytest} | Logique metier, utils |
| Integration | {Testing Library / Supertest} | API routes, DB queries |
| E2E | {Playwright / Cypress} | Parcours utilisateur critiques |

### Nommage des tests
- Fichier : `{fichier}.test.{ext}` (ex: `SpinWheel.test.tsx`)
- Description : "should {comportement attendu} when {condition}"
- Exemple : `it("should display prize name when spin completes")`

### Couverture minimale
- Logique metier : 80%
- API routes : 70%
- Composants UI : 50% (tests critiques seulement)
```

---

## 9. Securite

### 9.1 Ajouts .gitignore

Ajouter ces lignes au `.gitignore` du projet :

```gitignore
# Session-Sprint - Secrets
docs/reference/secrets.md

# Environment
.env
.env.local
.env.production
.env.*.local

# Claude Code memory (si accidentellement dans le repo)
memory/
**/memory/MEMORY.md
**/memory/sessions/
**/memory/decisions.md
**/memory/project-state.md
**/memory/learnings.md
```

### 9.2 Regles de securite

1. **Jamais de tokens dans CLAUDE.md** — CLAUDE.md est versionne et potentiellement public.
2. **Jamais de tokens dans MEMORY.md** — Meme si non-versionne, c'est une mauvaise habitude.
3. **Jamais de tokens dans les sprints** — Les fichiers sprint sont versionnes.
4. **Jamais de tokens dans le dashboard** — dashboard.html est versionne.
5. **Tokens uniquement dans** : `.env.local` (local) et variables d'environnement (prod).
6. **`docs/reference/secrets.md`** sert de reference documentaire (ou trouver les cles), pas de stockage. Les valeurs y sont notees pour reference personnelle mais le fichier est gitignore.

### 9.3 Checklist securite (avant premier commit)

- [ ] `.gitignore` contient `docs/reference/secrets.md`
- [ ] `.gitignore` contient `.env`, `.env.local`, `.env.*.local`
- [ ] Aucun fichier `.env` n'est tracke par git (`git status` propre)
- [ ] CLAUDE.md ne contient aucun token ou mot de passe
- [ ] MEMORY.md ne contient aucun token ou mot de passe
- [ ] `dashboard.html` ne contient aucun token
- [ ] Les fichiers sprint ne contiennent aucun token

### 9.4 En cas de fuite

Si un secret a ete committe par erreur :
1. **Revoquer immediatement** le token/cle chez le fournisseur
2. **Generer un nouveau** token/cle
3. **Nettoyer l'historique git** avec `git filter-branch` ou BFG Repo Cleaner
4. **Forcer le push** (seul cas ou force push est acceptable)
5. **Documenter l'incident** dans `learnings.md`

---

## 10. Script Init

### 10.1 Script complet : `init-session-sprint.sh`

```bash
#!/bin/bash

# ============================================================================
# init-session-sprint.sh
# Initialise la structure Session-Sprint pour un projet Claude Code
# Usage : bash init-session-sprint.sh "MonProjet"
# ============================================================================

set -e

# --- Validation des arguments ---
if [ -z "$1" ]; then
    echo "Usage: bash init-session-sprint.sh \"NomDuProjet\""
    echo "Example: bash init-session-sprint.sh \"RestaurantApp\""
    exit 1
fi

PROJECT_NAME="$1"
DATE=$(date +%Y-%m-%d)

echo "============================================"
echo "  Session-Sprint Init"
echo "  Projet : $PROJECT_NAME"
echo "  Date   : $DATE"
echo "============================================"
echo ""

# --- Creation des repertoires ---
echo "[1/6] Creation de l'arborescence..."

mkdir -p docs/pm/sprints
mkdir -p docs/pm/adr
mkdir -p docs/pm/agents
mkdir -p docs/pm/skills
mkdir -p docs/reference

echo "  ✓ docs/pm/ (sprints, adr, agents, skills)"
echo "  ✓ docs/reference/"

# --- VISION.md ---
echo "[2/6] Creation des fichiers PM..."

cat > docs/pm/VISION.md << VISION_EOF
# Vision — $PROJECT_NAME

## Mission
{Pourquoi ce projet existe — en 2-3 phrases}

## Objectifs

### Objectif principal
{L'objectif #1 du projet}

### Objectifs secondaires
1. {Objectif 2}
2. {Objectif 3}

## Modules

| # | Module | Description | Priorite | Statut |
|---|---|---|---|---|
| 1 | {module-1} | {description} | P0 | Planned |

## Contraintes

| Contrainte | Detail |
|---|---|
| Budget | {ex: Free tier uniquement} |
| Timeline | {ex: MVP en 4 semaines} |
| Competences | {ex: Owner debutant en dev} |
VISION_EOF

# --- BACKLOG.md ---
cat > docs/pm/BACKLOG.md << BACKLOG_EOF
# Backlog — $PROJECT_NAME

> Derniere mise a jour : $DATE

## P0 — Bloquant (Must Have)

| ID | User Story | Module | Criteres d'acceptation | Sprint |
|---|---|---|---|---|
| US-001 | {En tant que... je veux... pour...} | {module} | {criteres} | — |

## P1 — Important (Should Have)

| ID | User Story | Module | Criteres d'acceptation | Sprint |
|---|---|---|---|---|

## P2 — Nice to Have (Could Have)

| ID | User Story | Module | Criteres d'acceptation | Sprint |
|---|---|---|---|---|

## Icebox (Won't Have — pour l'instant)

| ID | Idee | Notes |
|---|---|---|
BACKLOG_EOF

# --- Sprint current.md ---
cat > docs/pm/sprints/current.md << SPRINT_EOF
# Sprint 1 — Setup & Foundation

## Goal
Initialiser le projet, configurer le stack, livrer le premier module fonctionnel.

## Debut
$DATE

## Epic
Foundation

## Agents prevus
- **Principal** : Builder
- **Support** : Architect, Operator

## Taches

| ID | Tache | Agent | Statut | Session |
|---|---|---|---|---|
| T-001 | Configurer le stack technique | Operator | A faire | — |
| T-002 | Definir l'architecture modules | Architect | A faire | — |
| T-003 | Implementer le premier module | Builder | A faire | — |

## Criteres de completion du sprint
- [ ] Stack configure et fonctionnel
- [ ] Architecture definie et documentee
- [ ] Premier module operationnel
- [ ] Dashboard a jour

## Notes de session

SPRINT_EOF

# --- Agent files ---
echo "[3/6] Creation des profils agents..."

cat > docs/pm/agents/README.md << AGENTS_EOF
# Agent Team — $PROJECT_NAME

## Equipe

| Agent | Role principal | Quand l'activer |
|---|---|---|
| Strategist | Vision, backlog, priorisation | Debut de sprint, decisions produit |
| Architect | Structure, ADR, choix techno | Nouveau module, refacto |
| Builder | Code, tests, features | Taches de dev |
| Operator | Deploy, CI/CD, config | Setup, deploy |
| Investigator | Debug, diagnostic, fix | Bugs |
| Reporter | Dashboard, resume, KPIs | Fin de session |

## Activation
Claude Code choisit l'agent selon la tache.
Profils detailles dans les fichiers individuels.
AGENTS_EOF

cat > docs/pm/agents/strategist.md << 'STRAT_EOF'
# Agent : Strategist

## Mission
Definir la direction produit et organiser le travail.

## Methode
1. Comprendre le contexte (MEMORY.md, VISION.md)
2. Cadrer le besoin avec l'utilisateur
3. Prioriser le backlog (P0/P1/P2/Icebox)
4. Planifier le sprint (3-7 taches)
5. Communiquer le plan et obtenir validation

## Regles
1. Ne jamais coder
2. Toujours chiffrer (nombre de taches, estimation)
3. Prioriser par valeur utilisateur
4. Garder le scope petit
5. Ecrire les criteres d'acceptation
STRAT_EOF

cat > docs/pm/agents/architect.md << 'ARCH_EOF'
# Agent : Architect

## Mission
Concevoir la structure technique et documenter les decisions.

## Methode
1. Analyser le besoin
2. Explorer l'existant
3. Rechercher les options (2-3 alternatives)
4. Decider et ecrire l'ADR si structurant
5. Dessiner la structure (fichiers, types, flux)
6. Transmettre au Builder

## Regles
1. Ne jamais implementer une feature
2. Toujours proposer des alternatives
3. Ecrire un ADR pour les decisions majeures
4. Respecter l'existant
5. Penser scalabilite sans sur-ingenierer
6. Documenter le "pourquoi"
ARCH_EOF

cat > docs/pm/agents/builder.md << 'BUILD_EOF'
# Agent : Builder

## Mission
Implementer le code : features, tests, integration.

## Methode
1. Lire le brief (sprint + brief Architect)
2. Verifier les pre-requis
3. Creer les types d'abord
4. Implementer incrementalement
5. Gerer les erreurs
6. Ecrire les tests
7. Verifier (compile, tests, responsive)
8. Documenter et handoff

## Regles
1. Un commit = une unite de travail
2. Types d'abord
3. Pas de decisions d'architecture
4. Tester avant de dire "c'est fini"
5. Mobile-first
6. Pas de secrets dans le code
7. Demander avant de supprimer
BUILD_EOF

cat > docs/pm/agents/operator.md << 'OPS_EOF'
# Agent : Operator

## Mission
Gerer l'infrastructure, le deploiement et la configuration.

## Methode
1. Identifier la tache ops
2. Verifier l'etat actuel (project-state.md)
3. Planifier les changements
4. Executer un par un
5. Valider (endpoints, build, env vars)
6. Documenter (project-state.md, secrets.md)
7. Transmettre

## Regles
1. Jamais de force push sur main/master
2. Tester le build avant de deployer
3. Ne jamais stocker de secrets en clair
4. Documenter chaque config
5. Plan de rollback pour la prod
6. Free tier d'abord
OPS_EOF

cat > docs/pm/agents/investigator.md << 'INV_EOF'
# Agent : Investigator

## Mission
Diagnostiquer et resoudre les bugs. Methodique et patient.

## Methode diagnostique
REPRODUIRE → LOCALISER → COMPRENDRE → CORRIGER → VERIFIER → DOCUMENTER

1. Recevoir le rapport (symptome, quand, quel module)
2. Charger le contexte (learnings.md, project-state.md)
3. REPRODUIRE — Executer les etapes qui declenchent le bug
4. LOCALISER — Remonter du symptome a la ligne de code
5. COMPRENDRE — Identifier la root cause
6. CORRIGER — Fix minimal, pas de refactoring
7. VERIFIER — Le bug a disparu, zero regression
8. DOCUMENTER — learnings.md + session
9. Transmettre — Handoff Builder ou Reporter

## Regles
1. Reproduire AVANT de chercher
2. Un fix = un probleme
3. Pas de feature pendant un debug
4. Toujours documenter dans learnings.md
5. Tester la regression
6. Si bug architectural, escalader vers Architect
INV_EOF

cat > docs/pm/agents/reporter.md << 'REP_EOF'
# Agent : Reporter

## Mission
Mettre a jour le dashboard, produire les resumes, maintenir la visibilite.

## Quand s'active
1. Fin de session (toujours)
2. Fin de sprint
3. Demande utilisateur
4. Milestone atteint

## Methode
1. Collecter les donnees (sprint, session, commits)
2. Mettre a jour dashboard.html (PROJECT_DATA)
3. Mettre a jour la memoire (MEMORY.md, session, decisions)
4. Presenter le resume a l'utilisateur

## Regles
1. Ne jamais coder
2. Ne jamais decider
3. Toujours mettre a jour le dashboard
4. Format coherent (table + KPIs + prochaine session)
5. Archiver les sprints termines
6. Verifier la coherence des chiffres
REP_EOF

# --- ADR template ---
cat > docs/pm/adr/000-template.md << 'ADR_EOF'
# ADR-{NNN} — {Titre}

## Status
{Propose / Accepte / Deprecie}

## Date
{YYYY-MM-DD}

## Agent
Architect

## Contexte
{Quel probleme technique ?}

## Recherche

### Option A — {Nom}
- Description : {comment ca marche}
- Avantages : {liste}
- Inconvenients : {liste}
- Effort : {S/M/L/XL}

### Option B — {Nom}
- Description : {comment ca marche}
- Avantages : {liste}
- Inconvenients : {liste}
- Effort : {S/M/L/XL}

## Decision
{Option choisie et pourquoi}

## Consequences
- Positif : {consequences positives}
- Negatif : {tradeoffs acceptes}
- Actions : {taches qui decoulent}
ADR_EOF

# --- Reference docs ---
echo "[4/6] Creation des documents reference..."

cat > docs/reference/secrets.md << SECRETS_EOF
# Secrets — $PROJECT_NAME

> ⚠ FICHIER CONFIDENTIEL — Ne jamais committer dans git.

## Cles et tokens

| # | Service | Cle/Variable | Valeur | Notes |
|---|---|---|---|---|
| 1 | {service} | {VAR_NAME} | {valeur} | {ou la trouver} |

## Ou configurer

| Environnement | Methode |
|---|---|
| Local | .env.local |
| Production | Variables d'environnement hosting |
SECRETS_EOF

cat > docs/reference/tech-constraints.md << TECH_EOF
# Contraintes techniques — $PROJECT_NAME

## Pieges connus

| # | Piege | Impact | Contournement | Decouvert |
|---|---|---|---|---|
| — | Aucun piege identifie pour l'instant | — | — | — |

## Limites environnement

| Limite | Service | Detail |
|---|---|---|
| {ex: 500 MB} | {DB} | {detail} |

## Dependances critiques

| Dependance | Version | Pourquoi critique | Risque mise a jour |
|---|---|---|---|
| {package} | {version} | {role} | {risque} |
TECH_EOF

cat > docs/reference/conventions.md << 'CONV_EOF'
# Conventions — {NOM_PROJET}

## Code style

| Element | Convention | Exemple |
|---|---|---|
| Fichiers composants | PascalCase | SpinWheel.tsx |
| Fichiers utilitaires | camelCase | formatDate.ts |
| Dossiers | kebab-case | spin-wheel/ |
| Variables | camelCase | userName |
| Constantes | UPPER_SNAKE | MAX_RETRIES |

## Git conventions

### Commits
Format : {type}: {description}
Types : feat, fix, refactor, style, docs, ops, test

### Branches
Format : {type}/{description}
Types : feat/, fix/, hotfix/, ops/

## Tests
- Fichier : {fichier}.test.{ext}
- Description : "should {comportement} when {condition}"
CONV_EOF

# --- Dashboard ---
echo "[5/6] Creation du dashboard..."

cat > dashboard.html << DASH_EOF
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$PROJECT_NAME — Dashboard Session-Sprint</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 1.8rem; color: #f8fafc; }
        .header .subtitle { color: #94a3b8; margin-top: 5px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .card { background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
        .card h2 { font-size: 1rem; color: #94a3b8; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.05em; }
        .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .kpi { text-align: center; padding: 15px; background: #0f172a; border-radius: 8px; }
        .kpi .value { font-size: 2rem; font-weight: 700; color: #38bdf8; }
        .kpi .label { font-size: 0.75rem; color: #94a3b8; margin-top: 5px; }
        .progress-bar { background: #334155; border-radius: 8px; height: 12px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 8px; transition: width 0.3s; }
        .task-list { list-style: none; }
        .task-item { padding: 8px 0; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .task-item:last-child { border-bottom: none; }
        .badge { padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; }
        .badge-done { background: #065f46; color: #6ee7b7; }
        .badge-progress { background: #1e3a5f; color: #38bdf8; }
        .badge-todo { background: #334155; color: #94a3b8; }
        .badge-blocked { background: #7f1d1d; color: #fca5a5; }
        .decision-item { padding: 8px 0; border-bottom: 1px solid #334155; }
        .decision-item:last-child { border-bottom: none; }
        .decision-date { font-size: 0.75rem; color: #64748b; }
        .next-session { background: #1a2332; border-left: 3px solid #38bdf8; padding: 15px; border-radius: 0 8px 8px 0; margin-top: 10px; }
        .update-time { text-align: center; color: #475569; font-size: 0.75rem; margin-top: 20px; }
    </style>
</head>
<body>

<div class="header">
    <h1 id="projectName">$PROJECT_NAME</h1>
    <div class="subtitle" id="currentSprint">Sprint 1 — Setup & Foundation</div>
</div>

<div class="grid">
    <div class="card">
        <h2>Avancement Sprint</h2>
        <div class="progress-bar">
            <div class="progress-fill" id="progressBar" style="width: 0%"></div>
        </div>
        <div style="text-align: center; color: #94a3b8;" id="progressText">0% (0/0 taches)</div>
        <div class="kpi-grid" style="margin-top: 15px;">
            <div class="kpi"><div class="value" id="kpiTasks">0</div><div class="label">Taches totales</div></div>
            <div class="kpi"><div class="value" id="kpiDone">0</div><div class="label">Terminees</div></div>
            <div class="kpi"><div class="value" id="kpiBugs">0</div><div class="label">Bugs fixes</div></div>
            <div class="kpi"><div class="value" id="kpiADR">0</div><div class="label">ADR</div></div>
        </div>
    </div>

    <div class="card">
        <h2>Taches</h2>
        <ul class="task-list" id="taskList">
            <li class="task-item"><span>Aucune tache pour l'instant</span></li>
        </ul>
    </div>

    <div class="card">
        <h2>Decisions recentes</h2>
        <div id="decisionList">
            <div class="decision-item">Aucune decision pour l'instant</div>
        </div>
    </div>

    <div class="card">
        <h2>Prochaine session</h2>
        <div class="next-session" id="nextSession">
            Configurer la premiere session avec Claude Code.
        </div>
    </div>
</div>

<div class="update-time">Derniere mise a jour : <span id="lastUpdate">$DATE</span></div>

<script>
// === PROJECT_DATA — Mis a jour par l'agent Reporter ===
const PROJECT_DATA = {
    projectName: "$PROJECT_NAME",
    currentSprint: "Sprint 1 — Setup & Foundation",
    sprintProgress: 0,
    tasks: [
        // { id: "T-001", title: "Configurer le stack", agent: "Operator", status: "todo" }
    ],
    kpis: {
        totalTasks: 0,
        doneTasks: 0,
        totalBugs: 0,
        fixedBugs: 0,
        totalADR: 0,
        totalSessions: 0
    },
    recentDecisions: [
        // { date: "2026-03-12", text: "Choix de Supabase comme DB" }
    ],
    nextSession: "Configurer la premiere session avec Claude Code.",
    lastUpdate: "$DATE"
};

// === Render functions ===
function render() {
    document.getElementById('projectName').textContent = PROJECT_DATA.projectName;
    document.getElementById('currentSprint').textContent = PROJECT_DATA.currentSprint;

    const progress = PROJECT_DATA.sprintProgress;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent =
        progress + '% (' + PROJECT_DATA.kpis.doneTasks + '/' + PROJECT_DATA.kpis.totalTasks + ' taches)';

    document.getElementById('kpiTasks').textContent = PROJECT_DATA.kpis.totalTasks;
    document.getElementById('kpiDone').textContent = PROJECT_DATA.kpis.doneTasks;
    document.getElementById('kpiBugs').textContent = PROJECT_DATA.kpis.fixedBugs + '/' + PROJECT_DATA.kpis.totalBugs;
    document.getElementById('kpiADR').textContent = PROJECT_DATA.kpis.totalADR;

    // Tasks
    const taskList = document.getElementById('taskList');
    if (PROJECT_DATA.tasks.length > 0) {
        taskList.innerHTML = PROJECT_DATA.tasks.map(t => {
            const badgeClass = t.status === 'done' ? 'badge-done' :
                              t.status === 'progress' ? 'badge-progress' :
                              t.status === 'blocked' ? 'badge-blocked' : 'badge-todo';
            const label = t.status === 'done' ? 'Done' :
                         t.status === 'progress' ? 'En cours' :
                         t.status === 'blocked' ? 'Bloque' : 'A faire';
            return '<li class="task-item"><span>' + t.id + ' — ' + t.title +
                   '</span><span class="badge ' + badgeClass + '">' + label + '</span></li>';
        }).join('');
    }

    // Decisions
    const decList = document.getElementById('decisionList');
    if (PROJECT_DATA.recentDecisions.length > 0) {
        decList.innerHTML = PROJECT_DATA.recentDecisions.map(d =>
            '<div class="decision-item"><div class="decision-date">' + d.date +
            '</div><div>' + d.text + '</div></div>'
        ).join('');
    }

    // Next session
    document.getElementById('nextSession').textContent = PROJECT_DATA.nextSession;
    document.getElementById('lastUpdate').textContent = PROJECT_DATA.lastUpdate;
}

render();
</script>

</body>
</html>
DASH_EOF

# --- .gitignore update ---
echo "[6/6] Mise a jour .gitignore..."

GITIGNORE_ADDITIONS="
# Session-Sprint - Secrets
docs/reference/secrets.md

# Environment
.env
.env.local
.env.production
.env.*.local
"

if [ -f .gitignore ]; then
    if ! grep -q "Session-Sprint" .gitignore; then
        echo "$GITIGNORE_ADDITIONS" >> .gitignore
        echo "  ✓ .gitignore mis a jour"
    else
        echo "  ✓ .gitignore deja configure"
    fi
else
    echo "$GITIGNORE_ADDITIONS" > .gitignore
    echo "  ✓ .gitignore cree"
fi

# --- CLAUDE.md creation ---
if [ ! -f CLAUDE.md ]; then
    cat > CLAUDE.md << CLAUDE_EOF
# $PROJECT_NAME — CLAUDE.md

## Projet
{Description en 1-2 lignes}
Owner : {Nom} | {Ville}, {Date}

## Agent Team

| Agent | Role | Quand l'activer |
|---|---|---|
| Strategist | Vision, backlog, priorisation | Debut de sprint |
| Architect | Choix techniques, structure, ADR | Nouveau module |
| Builder | Implementation, code, tests | Taches de dev |
| Operator | CI/CD, deploy, config | Setup, deploy |
| Investigator | Debug, diagnostic, resolution | Bugs |
| Reporter | Dashboard, resume, metriques | Fin de session |

## Sprint actif
→ docs/pm/sprints/current.md

## Regles critiques
1. Lire MEMORY.md en debut de session
2. Une tache = un commit
3. Jamais de secrets dans les fichiers versionnes
4. Mettre a jour la memoire en fin de session
5. Demander avant de supprimer
CLAUDE_EOF
    echo "  ✓ CLAUDE.md cree"
else
    echo "  ⚠ CLAUDE.md existe deja — pas de modification"
fi

# --- Resume final ---
echo ""
echo "============================================"
echo "  Session-Sprint initialise avec succes !"
echo "============================================"
echo ""
echo "Fichiers crees :"
echo "  - docs/pm/VISION.md"
echo "  - docs/pm/BACKLOG.md"
echo "  - docs/pm/sprints/current.md"
echo "  - docs/pm/adr/000-template.md"
echo "  - docs/pm/agents/ (6 profils + README)"
echo "  - docs/pm/skills/ (dossier pret)"
echo "  - docs/reference/secrets.md"
echo "  - docs/reference/tech-constraints.md"
echo "  - docs/reference/conventions.md"
echo "  - dashboard.html"
echo "  - .gitignore (mis a jour)"
echo ""
echo "Prochaines etapes :"
echo "  1. Remplir docs/pm/VISION.md avec la vision du projet"
echo "  2. Ouvrir Claude Code et lancer la premiere session"
echo "  3. Claude Code detectera le stack et configurera les agents"
echo "  4. Planifier le Sprint 1 avec l'agent Strategist"
echo ""
echo "Conseil : Ouvrir dashboard.html dans un navigateur pour"
echo "suivre l'avancement en temps reel."
echo ""
```

### 10.2 Utilisation

```bash
# Depuis la racine du projet
curl -O https://raw.githubusercontent.com/.../init-session-sprint.sh
bash init-session-sprint.sh "MonProjet"
```

Ou copier le script manuellement et l'executer :

```bash
bash init-session-sprint.sh "RestaurantApp"
```

Le script est idempotent pour `.gitignore` et `CLAUDE.md` : il ne les ecrase
pas s'ils existent deja.

### 10.3 Structure memoire (manuelle)

La structure memoire (MEMORY.md, sessions/, etc.) n'est pas creee par le script
car elle vit en dehors du projet. Elle est creee automatiquement par Claude Code
lors de la premiere session :

```bash
# Claude Code cree automatiquement :
~/.claude/projects/{hash}/memory/MEMORY.md
~/.claude/projects/{hash}/memory/sessions/
~/.claude/projects/{hash}/memory/decisions.md
~/.claude/projects/{hash}/memory/project-state.md
~/.claude/projects/{hash}/memory/learnings.md
```

---

## 11. Performance Tokens

### 11.1 Budget par tier

| Tier | Fichiers | Tokens max | Chargement | Frequence |
|---|---|---|---|---|
| **T1** | CLAUDE.md + MEMORY.md | ~4000 tokens | Automatique | Chaque session |
| **T2** | current.md (sprint actif) | ~2000 tokens | Debut de session | Chaque session |
| **T3** | Agents, ADR, sessions, learnings | 1000-5000 /fichier | A la demande | Quand necessaire |

### 11.2 Detail par fichier

| Fichier | Tier | Tokens estimes | Notes |
|---|---|---|---|
| CLAUDE.md | T1 | ~1500 | Compact, pointe vers les details |
| MEMORY.md | T1 | ~2500 | Max 60 lignes, tables courtes |
| current.md | T2 | ~2000 | Sprint actif uniquement |
| strategist.md | T3 | ~1500 | Charge si mode Strategist |
| architect.md | T3 | ~1800 | Charge si mode Architect |
| builder.md | T3 | ~1800 | Charge si mode Builder |
| operator.md | T3 | ~1500 | Charge si mode Operator |
| investigator.md | T3 | ~2000 | Charge si mode Investigator |
| reporter.md | T3 | ~2000 | Charge si mode Reporter |
| ADR (chaque) | T3 | ~1000 | Charge si decision en discussion |
| Session (chaque) | T3 | ~1000 | Charge si besoin d'historique |
| decisions.md | T3 | ~500-3000 | Grossit avec le temps |
| project-state.md | T3 | ~1000 | Charge si question stack |
| learnings.md | T3 | ~500-5000 | Grossit avec le temps |

### 11.3 Strategies d'optimisation

1. **Garder T1 serree** — Si CLAUDE.md + MEMORY.md depasse 4000 tokens,
   condenser. Deplacer les details vers les fichiers T3.

2. **Rotation MEMORY.md** — Ne garder que les 5 dernieres entrees dans chaque
   table. L'historique complet est dans les fichiers T3.

3. **Un seul agent a la fois** — Ne pas charger tous les profils agents.
   Charger uniquement celui qui est actif.

4. **Archiver les sprints** — Le sprint termine passe de `current.md` a
   `sprint-NNN.md` et n'est plus charge en T2.

5. **Charger learnings.md selectivement** — En cas de bug, charger learnings.md
   pour verifier si le piege est deja connu. Ne pas le charger systematiquement.

6. **Dashboard en ecriture seule** — Le dashboard est mis a jour par le Reporter
   mais rarement lu par Claude Code. Il est destine a l'utilisateur.

### 11.4 Scenario type — consommation tokens par session

```
Debut de session :
  T1 : CLAUDE.md (1500) + MEMORY.md (2500)        = 4000 tokens
  T2 : current.md (2000)                           = 2000 tokens
                                          Sous-total = 6000 tokens

Pendant la session (Builder) :
  T3 : builder.md (1800)                            = 1800 tokens
  T3 : conventions.md (1000)                         = 1000 tokens
                                          Sous-total = 2800 tokens

Si bug rencontre :
  T3 : investigator.md (2000)                        = 2000 tokens
  T3 : learnings.md (1000)                           = 1000 tokens
                                          Sous-total = 3000 tokens

                                          TOTAL MAX = ~11800 tokens
```

Ce budget est largement dans les limites de la context window de Claude Code
(200K tokens), laissant l'essentiel de l'espace pour le code source et les
echanges.

### 11.5 Quand un fichier grossit trop

| Fichier | Seuil d'alerte | Action |
|---|---|---|
| MEMORY.md | > 60 lignes | Supprimer les anciennes entrees, garder 5 dernieres |
| decisions.md | > 50 entrees | Archiver les anciennes dans `decisions-archive.md` |
| learnings.md | > 30 pieges | Regrouper par categorie, supprimer les obsoletes |
| current.md | > 80 lignes | Verifier que le sprint n'est pas trop ambitieux |
| Session du jour | > 60 lignes | Condenser, garder l'essentiel |

---

## Annexe A — Glossaire

| Terme | Definition |
|---|---|
| **Session** | Une conversation avec Claude Code (ouverture → fermeture) |
| **Sprint** | Groupe de 3-5 sessions avec un objectif commun |
| **Agent** | Mode de fonctionnement contextuel de Claude Code |
| **Handoff** | Passage d'un agent a un autre avec contexte |
| **ADR** | Architecture Decision Record — document de decision technique |
| **T1/T2/T3** | Niveaux de chargement memoire (toujours/sprint/demande) |
| **Skill** | Procedure referencee pour une tache recurrente |
| **Dashboard** | Fichier HTML de suivi visuel du projet |
| **PROJECT_DATA** | Objet JavaScript dans dashboard.html avec les donnees projet |
| **Backlog** | Liste priorisee de toutes les user stories |
| **Epic** | Regroupement de user stories par theme/module |
| **Definition of Done** | Criteres pour considerer une tache terminee |

## Annexe B — Checklist premiere session

- [ ] Script init execute (`bash init-session-sprint.sh "NomProjet"`)
- [ ] VISION.md rempli
- [ ] CLAUDE.md verifie (pas de secrets)
- [ ] .gitignore verifie (secrets.md exclu)
- [ ] Stack detecte par Claude Code
- [ ] Agents configures
- [ ] MEMORY.md initialise
- [ ] Sprint 1 planifie
- [ ] Dashboard ouvert dans le navigateur
- [ ] Premiere tache commencee

## Annexe C — Checklist fin de session

- [ ] Code committe
- [ ] Tests passent
- [ ] MEMORY.md mis a jour
- [ ] Session du jour ecrite
- [ ] Sprint current.md mis a jour
- [ ] Dashboard mis a jour
- [ ] decisions.md mis a jour (si applicable)
- [ ] learnings.md mis a jour (si applicable)
- [ ] Prochaine session definie

## Annexe D — Checklist fin de sprint

- [ ] Toutes les taches Done ou reportees au sprint suivant
- [ ] Sprint archive (current.md → sprint-NNN.md)
- [ ] Nouveau sprint cree (nouveau current.md)
- [ ] Backlog mis a jour (items restants repriorises)
- [ ] Dashboard mis a jour avec le resume du sprint
- [ ] MEMORY.md mis a jour (nouveau sprint actif)
- [ ] Retrospective : qu'est-ce qui a bien marche / mal marche ?
- [ ] Learnings mis a jour si necessaire
- [ ] Utilisateur informe du bilan

---

*Fin du guide Session-Sprint. Pour toute question, ouvrir une session Claude Code et demander a l'agent Strategist.*
