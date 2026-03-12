# Plan : Methodologie Session-Sprint Universelle v2 — Full 360

## Context

Ce plan cree une methodologie complete de gestion de projet pour Claude Code, applicable a **n'importe quel projet vierge**. Ameliorations par rapport a la v1 implementee sur Opus_N8N :

1. **Memoire hierarchique** — pas juste un MEMORY.md plat, mais un systeme de fichiers avec journal de sessions, decisions, et learnings consultables a la demande
2. **Agents auto-decisionnels** — 5 roles generiques qui choisissent eux-memes les technos/outils au lieu d'etre lies a un framework
3. **Skills parfaits** — guide de creation de skills avec recherche internet obligatoire
4. **Prompt Agent Team** — a chaque session, proposition d'activer l'equipe d'agents
5. **Dashboard HTML 360** — fichier HTML autonome (style RestoTech dark UI) avec Kanban, Burndown, KPIs, User Stories, Timeline

**Deliverables** :
- `C:\tmp\ClaudeCode_Agile.md` — Le guide complet (~800 lignes)
- `C:\tmp\dashboard-session-sprint.html` — Le dashboard interactif (~1200 lignes)

---

## Etape 1 : Creer l'arborescence (dans le guide)

Le guide explique comment creer cette structure pour tout projet :

```bash
#!/bin/bash
# init-session-sprint.sh
PROJECT_NAME="${1:-Mon Projet}"

mkdir -p docs/pm/sprints/archive docs/pm/adr docs/pm/agents docs/pm/skills docs/reference
# + creer tous les fichiers templates (details dans les etapes suivantes)
```

### Structure cible
```
mon-projet/
├── CLAUDE.md                          # AUTO-CHARGE — routeur + prompt Agent Team
├── docs/
│   ├── pm/
│   │   ├── VISION.md                  # Mission, objectifs, roadmap
│   │   ├── BACKLOG.md                 # Features/idees priorisees (P0-Icebox)
│   │   ├── sprints/
│   │   │   ├── current.md             # Sprint actif
│   │   │   └── archive/
│   │   ├── adr/                       # Architecture Decision Records
│   │   ├── agents/                    # 5 roles d'agents
│   │   │   ├── README.md
│   │   │   ├── strategist.md
│   │   │   ├── architect.md
│   │   │   ├── builder.md
│   │   │   ├── operator.md
│   │   │   ├── investigator.md
│   │   │   └── reporter.md
│   │   └── skills/                    # Skills custom du projet
│   │       └── skill-template.md
│   └── reference/
│       ├── secrets.md                 # GITIGNORE!
│       ├── tech-constraints.md
│       └── conventions.md
├── dashboard.html                     # Dashboard 360 (copie du template)
```

Memoire Claude (hors projet) :
```
~/.claude/projects/{hash}/memory/
├── MEMORY.md              # Index court (~60 lignes) — charge auto
├── sessions/              # Journal de chaque session
│   ├── 2026-03-12.md
│   └── ...
├── decisions.md           # Historique decisions cumulees
├── project-state.md       # Etat technique detaille
└── learnings.md           # Lecons, pieges, patterns
```

---

## Etape 2 : Creer CLAUDE.md avec Agent Team Prompt

Le CLAUDE.md inclut maintenant le prompt Agent Team qui se declenche a chaque session.

```markdown
# {NOM DU PROJET} — {description 1 ligne}

{Stack technique en 1-2 lignes}

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
> | 1 | 🎯 Strategist | Vision, planning, priorites | |
> | 2 | 📐 Architect | Design technique, choix techno, ADR | |
> | 3 | 🔨 Builder | Implementation, code, tests | |
> | 4 | 🚀 Operator | Deploy, infra, CI/CD, monitoring | |
> | 5 | 🔍 Investigator | Debug, audit, performance, securite | |
> | 6 | 📊 Reporter | Reporting, dashboard, mise a jour docs pilotage | Auto |
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

## Agents
Avant toute tache complexe, lire le role dans `docs/pm/agents/`.
- 🎯 Strategist : `docs/pm/agents/strategist.md`
- 📐 Architect : `docs/pm/agents/architect.md`
- 🔨 Builder : `docs/pm/agents/builder.md`
- 🚀 Operator : `docs/pm/agents/operator.md`
- 🔍 Investigator : `docs/pm/agents/investigator.md`
- 📊 Reporter : `docs/pm/agents/reporter.md` (auto en fin de session)
```

---

## Etape 3 : Systeme de Memoire Hierarchique

### 3a. MEMORY.md (index — charge auto, ~60 lignes max)

```markdown
# {Nom du Projet} — Memory Index

## Projet
- **Location** : `{chemin}`
- **Stack** : {stack 1 ligne}
- **Lancer** : `{commande}`

## Etat actif
- **Sprint** : {nom} (docs/pm/sprints/current.md)
- **Dernier travail** : {resume 1 ligne}
- **Prochaine etape** : {priorite}

## Modules
| Nom | Statut |
|-----|--------|
| {Module A} | {Production / En cours / Backlog} |

## Decisions recentes
1. {Decision} ({date})
2. {Decision} ({date})

## Sessions recentes
- {date} : {resume 1 ligne} → `memory/sessions/{date}.md`
- {date} : {resume 1 ligne} → `memory/sessions/{date}.md`

## Ou trouver le reste
- **Details techniques** : `memory/project-state.md`
- **Toutes les decisions** : `memory/decisions.md`
- **Lecons apprises** : `memory/learnings.md`
- **Journal sessions** : `memory/sessions/`
- **Sprint & backlog** : `docs/pm/`
- **Roles d'agents** : `docs/pm/agents/`

## Memories
{Pointeurs vers fichiers memoire individuels}
```

### 3b. Sessions journal (`memory/sessions/YYYY-MM-DD.md`)

Claude ecrit ce fichier a CHAQUE fin de session :

```markdown
# Session {YYYY-MM-DD}

## Objectif
{Ce qu'on voulait faire}

## Mode
{Solo / Agent Team (agents actifs : Builder, Architect)}

## Realise
- {Tache 1}
- {Tache 2}

## Decisions prises
- {Decision et pourquoi}

## Bugs / Pieges decouverts
- {Si applicable — aussi ajoute dans learnings.md}

## Bloqueurs
- {Si applicable}

## Prochaine session
- {Quoi faire en priorite}

## Fichiers modifies
- `{fichier1}` — {description modification}
- `{fichier2}` — {description}
```

### 3c. Decisions cumulees (`memory/decisions.md`)

```markdown
# Decisions — {Projet}

| Date | Decision | Pourquoi | ADR |
|------|----------|----------|-----|
| {date} | {quoi} | {raison} | {ADR-NNN ou —} |
```

### 3d. Etat technique (`memory/project-state.md`)

```markdown
# Etat Technique — {Projet}

## Stack
- **Language** : {X}
- **Framework** : {Y}
- **DB** : {Z}
- **Infra** : {W}

## Architecture
{Description haut niveau de l'architecture actuelle}

## Dependances critiques
| Package | Version | Notes |
|---------|---------|-------|
| {pkg} | {ver} | {notes} |

## Environnements
| Env | URL | Notes |
|-----|-----|-------|
| Local | localhost:3000 | {notes} |
| Prod | {url} | {notes} |
```

### 3e. Lecons apprises (`memory/learnings.md`)

```markdown
# Lecons Apprises — {Projet}

## Pieges techniques
| Piege | Decouvert | Solution |
|-------|-----------|----------|
| {piege} | {date} | {workaround} |

## Patterns qui marchent
- {Pattern 1} — {pourquoi ca marche}

## A ne plus jamais faire
- {Anti-pattern 1} — {ce qui s'est passe}
```

### Regles memoire

| Dans MEMORY.md (auto-charge) | Dans memory/ (a la demande) |
|------------------------------|---------------------------|
| Identite projet (3 lignes) | Journal sessions detaille |
| Sprint actif (5 lignes) | Historique complet decisions |
| 3 dernières sessions (3 lignes) | Architecture technique |
| 5 decisions recentes (5 lignes) | Lecons/pieges detailles |
| Pointeurs (10 lignes) | Etat des dependances |

**Budget** : MEMORY.md + CLAUDE.md < 4,000 tokens. Le reste est T3 (a la demande).

---

## Etape 4 : Les 6 agents contextuels

### Principe : Agents lies au contexte du projet

Les agents ne sont pas generiques abstraits — ils sont **configures dynamiquement**
selon le stack et le contexte du projet. Au debut de la PREMIERE session, Claude :

1. Analyse le projet (stack, structure, outils)
2. Propose un **profil technique** pour chaque agent adapte au projet
3. L'utilisateur valide ou ajuste
4. Le profil est sauvegarde dans chaque fichier agent

**Exemple** : Sur un projet Next.js + Supabase + Docker :
- Builder connait React, Next.js App Router, Prisma, Tailwind
- Operator connait Docker Compose, Vercel, Supabase CLI
- Investigator connait React DevTools, Supabase logs, Sentry

**Exemple** : Sur un projet Python ML + FastAPI :
- Builder connait PyTorch, FastAPI, Pydantic, pytest
- Operator connait Docker, MLflow, GPU allocation
- Investigator connait tensor shapes, memory profiling, CUDA errors

### Prompt de configuration initiale (premiere session seulement)

Inclus dans CLAUDE.md, declenche une seule fois :

```markdown
## Configuration Agent Team (premiere session)
Si les fichiers `docs/pm/agents/*.md` ne contiennent pas encore de section
"## Profil Technique", Claude DOIT :

1. Analyser le projet : lire package.json/requirements.txt/go.mod/docker-compose.yml/etc.
2. Identifier le stack : languages, frameworks, DB, infra, outils
3. Proposer a l'utilisateur un profil technique par agent :

> **J'ai detecte votre stack : {stack detecte}**
>
> Voici le profil technique que je propose pour chaque agent :
>
> | Agent | Specialisation proposee |
> |-------|------------------------|
> | 🎯 Strategist | {domaine metier du projet} |
> | 📐 Architect | {patterns du stack : REST/GraphQL, monolith/micro, etc.} |
> | 🔨 Builder | {frameworks + libs detectes} |
> | 🚀 Operator | {outils infra detectes} |
> | 🔍 Investigator | {outils debug adaptes au stack} |
> | 📊 Reporter | Dashboard, current.md, BACKLOG.md, MEMORY.md, burndown |
>
> Ca vous convient ? Ajustements ?

4. Sauvegarder le profil valide dans chaque fichier agent (section "## Profil Technique")
```

### 4a. `docs/pm/agents/README.md`

```markdown
# Equipe d'Agents — Session-Sprint

## Philosophie
Les agents sont adaptes au contexte et au stack du projet.
Lors de la premiere session, Claude detecte le stack et propose
un profil technique par agent. Les agents choisissent ensuite
les meilleurs outils dans leur domaine de specialisation.

## Equipe
| # | Agent | Emoji | Role |
|---|-------|-------|------|
| 1 | Strategist | 🎯 | Vision, planning, priorites, scope |
| 2 | Architect | 📐 | Design technique, choix techno, ADR |
| 3 | Builder | 🔨 | Implementation, code, tests |
| 4 | Operator | 🚀 | Deploy, infra, CI/CD, monitoring |
| 5 | Investigator | 🔍 | Debug, audit, performance, securite |
| 6 | Reporter | 📊 | Reporting, mise a jour docs pilotage, dashboard |

## Profil Technique
{Genere automatiquement a la premiere session — voir CLAUDE.md}

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
```

### 4b. `docs/pm/agents/strategist.md`

```markdown
# 🎯 Role : Strategist

## Mission
Definir la vision, planifier les sprints, prioriser le backlog,
arbitrer le scope et valider les objectifs.

## Methode de travail
1. Lire VISION.md — comprendre ou va le projet
2. Lire BACKLOG.md — connaitre toutes les idees en attente
3. Lire current.md — savoir ou on en est
4. Lire `memory/sessions/` recentes — comprendre la dynamique
5. Proposer le prochain sprint (goal + taches + criteres d'acceptation)
6. Arbitrer si conflit de priorites

## Contexte obligatoire
- `docs/pm/VISION.md`
- `docs/pm/BACKLOG.md`
- `docs/pm/sprints/current.md`
- `memory/sessions/` (2-3 dernieres)

## Regles
1. Un sprint = 1 objectif clair (pas 5 objectifs vagues)
2. Les taches doivent etre de 5-30 min de travail Claude
3. Maximum 15 taches par sprint
4. Toujours definir des criteres d'acceptation mesurables
5. Ne pas ajouter de taches mid-sprint sauf urgence P0

## Documents a mettre a jour
- `docs/pm/BACKLOG.md` — reprioriser
- `docs/pm/sprints/current.md` — definir le sprint
- `docs/pm/VISION.md` — si les objectifs evoluent

## Checklist de sortie
- [ ] Sprint goal clair et mesurable
- [ ] Taches decomposees (5-30 min chacune)
- [ ] Criteres d'acceptation definis
- [ ] Backlog mis a jour
- [ ] Pas de conflit avec la vision
```

### 4c. `docs/pm/agents/architect.md`

```markdown
# 📐 Role : Architect

## Mission
Concevoir l'architecture technique, choisir les technologies,
documenter les decisions dans des ADR.

## Methode de travail
1. Comprendre le besoin (lire le sprint goal + user stories)
2. Explorer le code existant (structure, patterns, dependances)
3. **Rechercher sur internet** les solutions et best practices actuelles
4. Comparer 2-3 approches (trade-offs documentes)
5. Choisir et documenter dans un ADR
6. Decomposer en taches pour le Builder

## Contexte obligatoire
- `docs/pm/adr/` — decisions passees
- `docs/reference/tech-constraints.md` — limites connues
- `docs/reference/conventions.md` — patterns existants
- `memory/project-state.md` — stack actuelle

## Regles
1. Toute decision architecturale majeure = nouvel ADR
2. TOUJOURS rechercher sur internet avant de choisir une techno
3. Privilegier simplicite > cleverness
4. Ne pas contredire les ADR existants sans les deprecier explicitement
5. Valider la faisabilite (contraintes tech, budget, temps)
6. Penser maintenance long terme, pas juste le MVP

## Documents a mettre a jour
- `docs/pm/adr/` — nouvel ADR
- `docs/reference/conventions.md` — si nouveaux patterns
- `docs/pm/sprints/current.md` — taches pour le Builder

## Checklist de sortie
- [ ] ADR cree si decision majeure
- [ ] Trade-offs documentes
- [ ] Plan decompose en taches Builder
- [ ] Pas de conflit avec ADR existants
- [ ] Recherche internet effectuee si nouveau choix techno
```

### 4d. `docs/pm/agents/builder.md`

```markdown
# 🔨 Role : Builder

## Mission
Implementer le code, ecrire les tests, livrer les features.

## Methode de travail
1. Lire la tache dans current.md
2. Lire le code existant dans la zone concernee
3. Verifier les conventions (`docs/reference/conventions.md`)
4. Verifier les contraintes (`docs/reference/tech-constraints.md`)
5. Si nouveau framework/lib necessaire → rechercher sur internet d'abord
6. Implementer le code
7. Ecrire les tests
8. Verifier que tout passe

## Contexte obligatoire
- `docs/pm/sprints/current.md` — tache a faire
- `docs/reference/conventions.md` — style de code
- `docs/reference/tech-constraints.md` — pieges a eviter

## Regles
1. Lire le code existant AVANT de modifier
2. Respecter les conventions du projet
3. Ecrire des tests pour le nouveau code
4. Un commit = une tache logique (pas un mega-commit)
5. Ne pas sur-ingenierer — minimum viable d'abord
6. Ne jamais committer de secrets
7. Si un choix technique est necessaire, escalader a l'Architect

## Documents a mettre a jour
- `docs/pm/sprints/current.md` — cocher les taches
- `docs/pm/BACKLOG.md` — si on decouvre du travail supplementaire
- `docs/reference/tech-constraints.md` — si nouveau piege decouvert

## Checklist de sortie
- [ ] Code fonctionnel
- [ ] Tests ecrits et passants
- [ ] Conventions respectees
- [ ] Tache cochee dans current.md
- [ ] Pas de secrets commites
- [ ] Pas de code mort / debug laisse
```

### 4e. `docs/pm/agents/operator.md`

```markdown
# 🚀 Role : Operator

## Mission
Deployer, configurer l'infrastructure, mettre en place CI/CD,
monitoring et alerting.

## Methode de travail
1. Lire la tache de deploiement dans current.md
2. Verifier l'etat de l'infrastructure actuelle
3. Lire les secrets necessaires (`docs/reference/secrets.md`)
4. Si nouvel outil DevOps necessaire → rechercher sur internet d'abord
5. Deployer de maniere idempotente
6. Verifier que tout est operationnel (healthchecks, smoke tests)
7. Documenter les changements

## Contexte obligatoire
- Configuration infra (docker-compose, Dockerfile, CI config, etc.)
- `docs/reference/secrets.md` — credentials
- `memory/project-state.md` — environnements existants

## Regles
1. JAMAIS committer de secrets (.env, tokens, passwords)
2. Deploiement idempotent (re-executable sans casser)
3. Tester en local/staging avant prod
4. Verifier les healthchecks apres deploiement
5. Si changement d'infra majeur → ADR + validation Architect
6. Garder les scripts de deploy simples et documentes

## Documents a mettre a jour
- `docs/pm/sprints/current.md` — taches de deploy
- `docs/reference/secrets.md` — si nouveaux credentials
- `memory/project-state.md` — si changement d'environnement

## Checklist de sortie
- [ ] Services deployes et operationnels
- [ ] Healthchecks / smoke tests passes
- [ ] Pas de secrets exposes
- [ ] Documentation infra a jour
- [ ] Rollback possible si probleme
```

### 4f. `docs/pm/agents/investigator.md`

```markdown
# 🔍 Role : Investigator

## Mission
Debugger, auditer, analyser les performances, identifier les
vulnerabilites de securite.

## Methode de travail
1. Collecter les symptomes (logs, erreurs, comportement observe)
2. Lire les pieges connus (`docs/reference/tech-constraints.md`)
3. Lire les lecons apprises (`memory/learnings.md`)
4. Reproduire le probleme de maniere fiable
5. Localiser la cause racine (binaire : diviser pour regner)
6. Si probleme inconnu → **rechercher sur internet** l'erreur/symptome
7. Appliquer le fix minimal
8. Verifier le fix (pas de regression)
9. Documenter le piege

## Contexte obligatoire
- `docs/reference/tech-constraints.md` — pieges connus
- `memory/learnings.md` — erreurs passees
- Logs / traces d'erreur
- Code concerne

## Methode de diagnostic
```
1. REPRODUIRE   →  Declencher le bug de maniere fiable
2. LOCALISER    →  Binary search : commenter/isoler pour trouver la ligne
3. COMPRENDRE   →  Lire le code + contraintes connues + recherche internet
4. CORRIGER     →  Fix minimal et cible (pas de refactoring)
5. VERIFIER     →  Re-executer + tester les cas limites
6. DOCUMENTER   →  Ajouter dans tech-constraints.md + learnings.md
```

## Regles
1. TOUJOURS collecter les preuves AVANT de proposer un fix
2. Ne pas deviner — reproduire d'abord
3. Fix minimal — ne pas refactorer en debuggant
4. Rechercher sur internet si erreur inconnue
5. Documenter CHAQUE piege decouvert
6. Verifier qu'il n'y a pas de regression

## Documents a mettre a jour
- `docs/reference/tech-constraints.md` — nouveau piege
- `memory/learnings.md` — lecon apprise
- `docs/pm/sprints/current.md` — documenter le bug et le fix

## Checklist de sortie
- [ ] Cause racine identifiee et documentee
- [ ] Fix applique et teste
- [ ] Pas de regression
- [ ] Piege documente dans tech-constraints.md
- [ ] Lecon ajoutee dans learnings.md
```

### 4g. `docs/pm/agents/reporter.md`

```markdown
# 📊 Role : Reporter

## Mission
Maintenir a jour tous les documents de pilotage que l'utilisateur
utilise pour suivre le projet. Generer des rapports, mettre a jour
le dashboard HTML, et s'assurer que l'etat du projet est toujours
visible et comprehensible pour l'humain.

## Quand s'active
- **Automatiquement** a la fin de chaque session de travail
- **Automatiquement** quand un sprint se termine
- **Automatiquement** quand une tache passe a "Done"
- **Sur demande** quand l'utilisateur veut un point de situation

## Methode de travail
1. Lire l'etat actuel du sprint (`docs/pm/sprints/current.md`)
2. Comparer avec l'etat precedent (quoi a change depuis la derniere fois)
3. Mettre a jour CHAQUE document de pilotage :
   a. `docs/pm/sprints/current.md` — statuts des taches, notes de session
   b. `docs/pm/BACKLOG.md` — deplacer les items termines, ajouter les nouveaux
   c. `dashboard.html` — PROJECT_DATA JSON avec les nouvelles donnees
   d. `MEMORY.md` — resume de la session, etat actif
   e. `memory/sessions/YYYY-MM-DD.md` — journal de session complet
   f. `memory/decisions.md` — si nouvelles decisions
   g. `memory/learnings.md` — si nouveaux pieges
4. Generer un resume pour l'utilisateur :
   - Ce qui a ete fait (taches terminees)
   - Ce qui est en cours
   - Ce qui bloque
   - Prochaines etapes recommandees
   - KPIs mis a jour (burndown, velocity)

## Contexte obligatoire
- `docs/pm/sprints/current.md`
- `docs/pm/BACKLOG.md`
- `dashboard.html` (section PROJECT_DATA)
- `MEMORY.md`
- Toutes les taches modifiees pendant la session

## Ce que le Reporter met a jour dans le Dashboard
```javascript
// Le Reporter met a jour ces champs dans PROJECT_DATA :
sprint.progress          // % de completion recalcule
kpis.*                   // Compteurs done/inProgress/todo/backlogTotal
tasks[].status           // Statut de chaque tache modifiee
agents[].active          // Qui etait actif cette session
agents[].lastActivity    // Derniere action de chaque agent
agents[].tasksCompleted  // +1 quand un agent termine une tache
burndown[]               // Ajouter le point de la session
sessions[]               // Ajouter la session du jour
skills[]                 // Ajouter les skills utilises cette session
activityFeed[]           // Ajouter les evenements (tache finie, agent active, etc.)
```

## Format du resume utilisateur (fin de session)
```markdown
---
## 📊 Rapport de session — {date}

### Fait cette session
| Tache | Agent | Statut |
|-------|-------|--------|
| {T-001} | 🔨 Builder | ✅ Termine |
| {T-002} | 📐 Architect | 🔄 En cours |

### KPIs Sprint
- **Progression** : {X}% ({done}/{total} taches)
- **Velocity** : {N} taches/session (moyenne)
- **Burndown** : {en avance / en retard / dans les temps}

### Prochaine session
- Priorite : {tache la plus urgente}
- Agent recommande : {agent}

### Documents mis a jour
- ✅ current.md
- ✅ dashboard.html
- ✅ MEMORY.md
- ✅ memory/sessions/{date}.md
---
```

## Regles
1. Ne JAMAIS oublier de mettre a jour le dashboard
2. Les KPIs doivent etre calcules, pas inventes
3. Le resume doit etre concis (pas un roman)
4. Toujours mentionner les bloqueurs s'il y en a
5. Le burndown doit refleter la realite (pas de points sautes)
6. Les skills utilises doivent etre traces

## Documents a mettre a jour
- `docs/pm/sprints/current.md` — statuts et notes
- `docs/pm/BACKLOG.md` — items termines/nouveaux
- `dashboard.html` — PROJECT_DATA complet
- `MEMORY.md` — etat actif
- `memory/sessions/YYYY-MM-DD.md` — journal
- `memory/decisions.md` — si applicable
- `memory/learnings.md` — si applicable

## Checklist de sortie
- [ ] current.md a jour (taches cochees, notes de session)
- [ ] dashboard.html PROJECT_DATA mis a jour
- [ ] MEMORY.md mis a jour
- [ ] Journal de session ecrit
- [ ] Resume presente a l'utilisateur
- [ ] Aucun document de pilotage oublie
```

---

## Etape 5 : Guide de creation de Skills Parfaits

Inclus dans le guide, section dediee :

```markdown
## Creation de Skills

### Regle d'or
Avant de creer un skill, TOUJOURS rechercher sur internet.
Un skill base sur des assumptions est un skill mediocre.

### Processus en 5 etapes

**1. RECHERCHER** (obligatoire)
- WebSearch : "{domaine} best practices {annee}"
- WebSearch : "claude code skill {domaine}" ou "{domaine} automation checklist"
- Lire 3-5 sources de qualite
- Noter les patterns communs et les pieges

**2. ANALYSER**
- Identifier les etapes que le skill doit couvrir
- Lister les contraintes (ce qui peut mal tourner)
- Definir le trigger (quand le skill s'active)
- Definir l'output attendu

**3. REDIGER**
Structure du fichier skill :

\```markdown
---
name: {nom-kebab-case}
description: {1 ligne — utilisee pour savoir quand activer le skill}
trigger: {condition precise d'activation}
sources: {URLs des references utilisees pour creer le skill}
---

# {Nom du Skill}

## Quand utiliser
{Description precise du contexte d'activation}

## Pre-requis
- {Ce qui doit etre en place avant d'executer}

## Etapes
1. **{Nom etape}** — {Description}
   - {Sous-etape si necessaire}
2. **{Nom etape}** — {Description}
...

## Contraintes
- NE PAS {faire X — et pourquoi}
- TOUJOURS {faire Y — et pourquoi}

## Output attendu
{Ce que le skill produit quand il est termine}

## Exemples
{1-2 exemples concrets d'utilisation}

## Sources
- [{titre}]({url}) — {pertinence}
\```

**4. TESTER**
- Executer le skill sur un cas reel
- Verifier que chaque etape fonctionne
- Ajuster les contraintes si des edge cases apparaissent

**5. DEPLOYER**
- Sauver dans `docs/pm/skills/{nom}.md`
- Ajouter une reference dans `docs/pm/agents/README.md` si lie a un agent
- Annoncer a l'utilisateur que le skill est disponible
```

---

## Etape 6 : Templates Sprint, Vision, Backlog

### 6a. VISION.md
```markdown
# Vision — {Nom du Projet}

## Mission
{1-3 phrases : Qu'est-ce que le projet fait ? Pour qui ? Pourquoi ?}

## Objectifs {Annee}
1. {Objectif 1 — le plus important}
2. {Objectif 2}
3. {Objectif 3}

## Modules
| Nom | Statut | Dossier |
|-----|--------|---------|
| {Module A} | {Statut} | `{chemin}` |

## Contraintes
- {Budget / temps / techniques / equipe}
```

### 6b. BACKLOG.md
```markdown
# Backlog — {Nom du Projet}

## P0 — En cours / Critique
- [ ] {Tache 1} [Agent: Builder]
- [ ] {Tache 2} [Agent: Architect]

## P1 — Prochaine priorite
- [ ] {Feature 1}
- [ ] {Feature 2}

## P2 — Ameliorations
- [ ] {Amelioration 1}

## Icebox — Idees futures
- [ ] {Idee 1}
```

### 6c. Sprint current.md
```markdown
# Sprint : {Nom}

**Goal** : {Objectif clair en 1-2 phrases}
**Debut** : {YYYY-MM-DD}
**Epic** : {Epic parent}
**Agents actifs** : {🔨 Builder, 📐 Architect, ...}

## User Stories
- US-001 : En tant que {qui}, je veux {quoi} pour {pourquoi}
- US-002 : ...

## Taches
| ID | Tache | Agent | Statut | Session |
|----|-------|-------|--------|---------|
| T-001 | {Tache 1} | 🔨 | ✅ Done | 2026-03-12 |
| T-002 | {Tache 2} | 📐 | 🔄 En cours | |
| T-003 | {Tache 3} | 🔨 | 📋 Todo | |

## Criteres d'acceptation
- [ ] {Critere 1}
- [ ] {Critere 2}

## Notes de session
### Session {date}
- **Agent(s)** : {qui etait actif}
- **Fait** : {resume}
- **Prochaine etape** : {quoi}
```

### 6d. Template ADR
```markdown
# ADR-{NNN} : {Titre}

**Status** : Propose / Accepte / Deprecie / Remplace par ADR-{X}
**Date** : {YYYY-MM-DD}
**Agent** : {📐 Architect}

## Contexte
{Probleme + contraintes}

## Recherche effectuee
- {Source 1} — {ce qu'on a appris}
- {Source 2} — {ce qu'on a appris}

## Decision
{Ce qu'on a decide}

## Alternatives considerees
- **{A}** : {desc} — rejete car {raison}
- **{B}** : {desc} — rejete car {raison}

## Consequences
- (+) {Avantage}
- (-) {Inconvenient}
```

---

## Etape 7 : Documents de reference

### 7a. secrets.md (GITIGNORE)
```markdown
# Secrets & Credentials
| Service | Cle / ID | Notes |
|---------|----------|-------|
| {Service} | `{cle}` | {usage} |
```

### 7b. tech-constraints.md
```markdown
# Contraintes Techniques

## Pieges connus
| Piege | Symptome | Solution | Decouvert |
|-------|----------|----------|-----------|
| {piege} | {erreur} | {fix} | {date} |

## Limites environnement
- {Limite 1}

## Dependances critiques
| Package | Version | Attention |
|---------|---------|-----------|
| {pkg} | {ver} | {notes} |
```

### 7c. conventions.md
```markdown
# Conventions

## Code
- Fichiers : {kebab-case / camelCase}
- Variables : {camelCase / snake_case}
- Constantes : {SCREAMING_SNAKE}

## Git
- Branches : `feature/nom`, `fix/nom`
- Commits : {convention}
- PR : {process}

## Tests
- Framework : {X}
- Commande : `{cmd}`
```

---

## Etape 8 : Securite

Ajouter dans `.gitignore` :
```
docs/reference/secrets.md
.env
.env.*
```

Regles :
- JAMAIS de tokens/passwords dans CLAUDE.md, MEMORY.md, sprints, dashboard
- Tous les secrets dans `docs/reference/secrets.md` (gitignore)
- Verifier `.gitignore` AVANT le premier commit

---

## Etape 9 : Script d'initialisation complet

Script bash qui cree TOUTE la structure en une commande.
Inclut :
- Tous les dossiers
- Tous les fichiers templates avec placeholders
- Mise a jour .gitignore
- Message de succes avec prochaines etapes

(Le contenu complet du script sera dans le guide final)

---

## Etape 10 : Dashboard HTML 360

### Fichier : `dashboard.html` (ou `C:\tmp\dashboard-session-sprint.html`)

### Design
- Style RestoTech : dark background (#0a0e27), accent cyan (#00d9ff) + purple (#a855f7)
- Cards avec bordures subtiles + hover effects
- Emojis dans les titres
- Responsive mobile
- Grain effect radial gradients

### Donnees
Objet JSON `PROJECT_DATA` editable en haut du `<script>` :

```javascript
const PROJECT_DATA = {
  project: {
    name: "Mon Projet",
    description: "Description courte",
    stack: "Next.js + PostgreSQL + Docker"
  },
  sprint: {
    name: "Sprint 1 — Setup",
    goal: "Mettre en place le projet",
    startDate: "2026-03-12",
    progress: 45
  },
  kpis: {
    totalTasks: 16,
    done: 5,
    inProgress: 3,
    todo: 8,
    backlogTotal: 24,
    sprintsCompleted: 0,
    sessionsTotal: 3
  },
  agents: [
    { name: "Strategist", emoji: "🎯", active: true, tasksAssigned: 2, tasksCompleted: 2, lastActivity: "Sprint planning", skills: ["writing-plans"] },
    { name: "Architect", emoji: "📐", active: true, tasksAssigned: 3, tasksCompleted: 2, lastActivity: "ADR-001 cree", skills: ["brainstorming", "writing-plans"] },
    { name: "Builder", emoji: "🔨", active: true, tasksAssigned: 8, tasksCompleted: 3, lastActivity: "Feature auth", skills: ["test-driven-development", "executing-plans"] },
    { name: "Operator", emoji: "🚀", active: false, tasksAssigned: 1, tasksCompleted: 0, lastActivity: "—", skills: [] },
    { name: "Investigator", emoji: "🔍", active: false, tasksAssigned: 2, tasksCompleted: 1, lastActivity: "Fix login bug", skills: ["systematic-debugging"] },
    { name: "Reporter", emoji: "📊", active: true, tasksAssigned: 0, tasksCompleted: 3, lastActivity: "Rapport session S3", skills: ["verification-before-completion"] }
  ],
  tasks: [
    { id: "T-001", title: "Setup projet", status: "done", priority: "P0", agent: "Builder", sprint: "Sprint 1", story: "US-001", completedAt: "2026-03-12", session: "S1" },
    { id: "T-002", title: "Choisir stack", status: "done", priority: "P0", agent: "Architect", sprint: "Sprint 1", story: "US-001", completedAt: "2026-03-12", session: "S1" },
    { id: "T-003", title: "CI/CD pipeline", status: "in-progress", priority: "P1", agent: "Operator", sprint: "Sprint 1", story: "US-002", completedAt: null, session: "S3" },
    { id: "T-004", title: "Auth module", status: "todo", priority: "P1", agent: "Builder", sprint: "Sprint 1", story: "US-003", completedAt: null, session: null }
  ],
  stories: [
    { id: "US-001", story: "En tant que dev, je veux un projet initialise pour commencer a coder", priority: "P0", status: "done", agent: "Builder", sprint: "Sprint 1" },
    { id: "US-002", story: "En tant que dev, je veux un pipeline CI/CD pour deployer automatiquement", priority: "P1", status: "in-progress", agent: "Operator", sprint: "Sprint 1" },
    { id: "US-003", story: "En tant qu'utilisateur, je veux m'authentifier pour acceder a l'app", priority: "P1", status: "todo", agent: "Builder", sprint: "Sprint 1" }
  ],
  burndown: [
    { session: "S1", date: "2026-03-12", remaining: 16, ideal: 16 },
    { session: "S2", date: "2026-03-13", remaining: 13, ideal: 12 },
    { session: "S3", date: "2026-03-14", remaining: 11, ideal: 8 }
  ],
  decisions: [
    { id: "ADR-001", title: "Stack technique choisie", date: "2026-03-12", status: "accepted", impact: "high", agent: "Architect" },
    { id: "ADR-002", title: "Auth via NextAuth.js", date: "2026-03-13", status: "proposed", impact: "medium", agent: "Architect" }
  ],
  sessions: [
    { date: "2026-03-12", summary: "Setup projet + choix stack", tasksCompleted: 3, agents: ["Strategist", "Architect", "Builder"] },
    { date: "2026-03-13", summary: "CI/CD + debut auth", tasksCompleted: 2, agents: ["Builder", "Operator"] }
  ],
  backlog: {
    p0: 2, p1: 5, p2: 8, icebox: 9
  },
  // NOUVEAU — Skills utilises dans le projet
  skills: [
    { name: "writing-plans", usedBy: ["Strategist", "Architect"], usedCount: 3, lastUsed: "2026-03-13", description: "Planification structuree avant implementation" },
    { name: "test-driven-development", usedBy: ["Builder"], usedCount: 2, lastUsed: "2026-03-13", description: "Ecrire les tests avant le code" },
    { name: "systematic-debugging", usedBy: ["Investigator"], usedCount: 1, lastUsed: "2026-03-12", description: "Diagnostic methodique des bugs" },
    { name: "brainstorming", usedBy: ["Architect"], usedCount: 1, lastUsed: "2026-03-12", description: "Exploration creative avant choix technique" },
    { name: "verification-before-completion", usedBy: ["Reporter", "Builder"], usedCount: 4, lastUsed: "2026-03-14", description: "Verification systematique avant de declarer termine" },
    { name: "executing-plans", usedBy: ["Builder"], usedCount: 2, lastUsed: "2026-03-13", description: "Execution structuree d'un plan avec checkpoints" }
  ],
  // NOUVEAU — Fil d'activite en temps reel (le Reporter ajoute ici)
  activityFeed: [
    { time: "2026-03-14 16:45", type: "task-done", agent: "Builder", emoji: "✅", message: "T-005 Auth module termine" },
    { time: "2026-03-14 16:30", type: "skill-used", agent: "Builder", emoji: "🛠️", message: "Skill test-driven-development active" },
    { time: "2026-03-14 15:00", type: "agent-activated", agent: "Investigator", emoji: "🔍", message: "Investigator active pour debug login" },
    { time: "2026-03-14 14:00", type: "session-start", agent: "—", emoji: "🟢", message: "Session S3 demarree — Agents: Builder, Investigator" },
    { time: "2026-03-13 18:00", type: "report", agent: "Reporter", emoji: "📊", message: "Rapport session S2 genere — 2 taches terminees" },
    { time: "2026-03-13 17:30", type: "decision", agent: "Architect", emoji: "🏛️", message: "ADR-002 cree : Auth via NextAuth.js" },
    { time: "2026-03-13 14:00", type: "session-start", agent: "—", emoji: "🟢", message: "Session S2 demarree — Agents: Builder, Operator, Architect" },
    { time: "2026-03-12 17:00", type: "sprint-created", agent: "Strategist", emoji: "🎯", message: "Sprint 1 cree : Setup Initial" }
  ]
};
```

### Sections HTML (10 sections)

**1. Header**
- Nom projet + description + badge sprint actif
- 5 KPI pills : Done, In Progress, Todo, Sprint Progress %, Sessions Total
- Barre de progression sprint (gradient cyan→purple, animee)

**2. 🔔 Activity Feed (NOUVEAU — temps reel)**
- Fil d'activite chronologique inverse (plus recent en haut)
- Chaque evenement : heure, emoji type, agent emoji, message
- Types d'evenements avec couleurs :
  - `task-done` (vert) : ✅ tache terminee
  - `agent-activated` (cyan) : agent active
  - `skill-used` (purple) : skill declenche
  - `session-start` (vert vif) : nouvelle session
  - `decision` (orange) : ADR cree
  - `report` (bleu) : rapport genere par Reporter
  - `sprint-created` (dore) : nouveau sprint
  - `blocked` (rouge) : bloqueur detecte
- Limite aux 15 derniers evenements, bouton "Voir tout"
- Genere depuis `activityFeed[]`
- **Le Reporter ajoute un evenement a chaque action significative**

**3. 📋 Kanban Board**
- 3 colonnes : 📋 Todo | 🔄 In Progress | ✅ Done
- Cards avec : titre, badge priorite (P0=rouge, P1=cyan, P2=gris), emoji agent
- **Sur les cards Done** : date de completion + session ou terminee
- Compteur par colonne
- Filtres par agent / priorite (boutons toggle)
- Genere dynamiquement depuis `tasks[]`

**4. 📉 Burndown Chart**
- SVG anime avec courbes smooth
- Axe X : sessions (S1, S2, ...)
- Axe Y : taches restantes
- Ligne ideale (diagonale pointillee grise) vs ligne reelle (cyan plein, epaisse)
- Zone entre les deux coloree (vert si en avance, rouge si en retard)
- Points avec tooltip au hover (date, taches restantes, delta vs ideal)
- Genere depuis `burndown[]`

**5. 📖 User Stories**
- Table avec : ID, Story, Priorite, Status (badge couleur), Agent (emoji), Sprint
- Badges : Done=vert, In Progress=cyan, Todo=gris, Blocked=rouge
- Filtre par statut (boutons toggle)
- Genere depuis `stories[]`

**6. ⏱️ Timeline Sessions**
- Timeline verticale (style RestoTech GTM)
- Chaque session = 1 dot numerote + card avec :
  - Resume de la session
  - Agents actifs (emojis)
  - Nombre de taches terminees
  - Skills utilises cette session
- Genere depuis `sessions[]`

**7. 👥 Agent Team**
- 6 cards (grille 3x2)
- Chaque carte :
  - Emoji + Nom
  - Statut visuel (actif=bordure cyan glow / inactif=bordure grise)
  - Barre de progression : tasksCompleted / tasksAssigned
  - Derniere activite
  - Skills maitrises (badges petits)
- **Le Reporter a un indicateur special : "Docs a jour ✅" ou "Mise a jour en attente ⚠️"**
- Genere depuis `agents[]`

**8. 🛠️ Skills Utilises (NOUVEAU)**
- Grille de cards pour chaque skill utilise dans le projet
- Chaque card :
  - Nom du skill
  - Description (1 ligne)
  - Utilise par : emojis des agents qui l'utilisent
  - Nombre de fois utilise (badge compteur)
  - Derniere utilisation (date)
- Trie par frequence d'utilisation (plus utilise en premier)
- Genere depuis `skills[]`

**9. 📋 Backlog Overview**
- Barres horizontales P0/P1/P2/Icebox avec largeur proportionnelle
- Couleurs : P0=rouge, P1=cyan, P2=gris, Icebox=purple fonce
- Compteur total + pourcentage par priorite
- Genere depuis `backlog`

**10. 🏛️ Decisions (ADR)**
- Table : ID, Titre, Date, Status (badge), Impact (badge couleur), Agent (emoji)
- Genere depuis `decisions[]`

### Interactivite (JS vanilla, zero dependance externe)
- Filtres Kanban par agent / priorite (boutons toggle)
- Filtres User Stories par statut
- Filtres Skills par agent
- Compteurs TOUS auto-calcules depuis PROJECT_DATA (pas de valeurs en dur)
- Smooth scroll navigation
- Nav sticky en haut avec liens vers chaque section + indicateur section active
- Burndown tooltips au hover
- Activity Feed scroll auto quand nouveau evenement
- Responsive (grille 1 colonne sur mobile, 2 colonnes tablette)
- **Toutes les donnees viennent du JSON — Claude (via Reporter) edite le JSON, le HTML reagit**

---

## Etape 11 : Optimisation Performance Tokens

### Chargement en 3 tiers

| Tier | Quand | Contenu | ~Tokens |
|------|-------|---------|---------|
| T1 — Toujours | Chaque session | CLAUDE.md (~70 lignes) + MEMORY.md (~60 lignes) | ~4,000 |
| T2 — Sprint | Sessions de travail | current.md (lu par Claude au besoin) | ~2,000 |
| T3 — A la demande | Quand pertinent | agents/*.md, ADR, sessions/, learnings, secrets | 1,000-5,000/fichier |

---

## Verification post-implementation

1. `C:\tmp\ClaudeCode_Agile.md` existe et contient toutes les sections
2. `C:\tmp\dashboard-session-sprint.html` s'ouvre dans un navigateur
3. Le dashboard affiche : KPIs, Kanban, Burndown, Stories, Timeline, Agents, Backlog, ADR
4. Les filtres Kanban fonctionnent
5. Le burndown chart est anime
6. Le JSON PROJECT_DATA est facilement editable
7. Le guide couvre : memoire, agents, skills, Agent Team prompt, dashboard

---

## Resume des fichiers a creer

| # | Fichier | ~Lignes | Description |
|---|---------|---------|-------------|
| 1 | `C:\tmp\ClaudeCode_Agile.md` | ~900 | Guide universel (6 agents, skills, memoire, dashboard) |
| 2 | `C:\tmp\dashboard-session-sprint.html` | ~1400 | Dashboard 360 (10 sections, activity feed, skills, completions) |
