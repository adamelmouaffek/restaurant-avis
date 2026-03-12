# Conventions — Restaurant Avis

## Code

- **Fichiers composants** : PascalCase.tsx (MenuPage.tsx, KDSBoard.tsx)
- **Fichiers utilitaires** : kebab-case.ts (dashboard-auth.ts, wheel-logic.ts)
- **Variables** : camelCase
- **Constantes** : SCREAMING_SNAKE (ORDER_STATUS_LABELS, ALLERGENS_EU)
- **Types/Interfaces** : PascalCase (OrderWithItems, CartItem)
- **Dossiers** : kebab-case (modules/avis/, shared/lib/)

## Architecture

- Pages dans `app/` = minces, importent depuis `modules/`
- Composants specifiques a un module = dans `modules/[nom]/components/`
- Composants partages = dans `shared/components/`
- API routes groupees par module = `api/avis/`, `api/menu/`
- Types specifiques = `modules/[nom]/types.ts`
- Types partages = `shared/types/index.ts`

## Git

- Branches : `master` (branche principale)
- Commits : `type: description` (feat:, fix:, docs:, refactor:)
- Pas de force push sur master
- Committer apres chaque feature complete

## Tests

- Framework : Pas encore de tests automatises (backlog P2)
- Verification : `npm run build` doit passer avant chaque deploy
- ESLint : integre au build Next.js

## API

- Routes publiques (client) : pas d'auth (POST /api/menu/orders)
- Routes dashboard : protegees par `getDashboardSession()`
- Routes KDS : authentification par slug URL
- Prix : TOUJOURS re-fetcher cote serveur (jamais faire confiance au client)
