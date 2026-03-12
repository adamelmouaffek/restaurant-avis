# Contraintes Techniques — Restaurant Avis

## Pieges connus

| Piege | Symptome | Solution | Decouvert |
|-------|----------|----------|-----------|
| NextAuth pages.signIn vers page inexistante | 404 apres callback OAuth | Ne pas configurer pages.signIn si la page n'existe pas | 2026-03-08 |
| NEXTAUTH_URL localhost sur Vercel | OAuth redirect echoue en prod | S'assurer que NEXTAUTH_URL = URL Vercel en prod | 2026-03-08 |
| Google OAuth app en mode "Testing" | "Try signing in with a different account" | Publier l'app en mode "In production" dans Google Cloud Console | 2026-03-09 |
| Env vars avec caracteres speciaux sur Vercel | Valeurs tronquees | Utiliser `printf '%s'` au lieu de `echo` pour pousser les vars | 2026-03-09 |
| KDS PATCH via /api/menu/orders/[id] | 401 — pas de session dashboard | Creer un endpoint dedie /api/kds/[slug]/orders/[id] avec auth par slug | 2026-03-12 |
| ESLint unescaped entities dans JSX | Build echoue | Utiliser &apos; &quot; au lieu de ' " dans le JSX | 2026-03-11 |
| Supabase Realtime sans trigger updated_at | UPDATE non detecte par Realtime | Creer un trigger BEFORE UPDATE qui set updated_at = now() | 2026-03-11 |
| git push avec mauvais credentials | Permission denied (skyfix01) | Executer `git credential-manager erase` pour reset | 2026-03-09 |

## Limites environnement

- **Vercel free tier** : 100 GB bandwidth/mois, serverless functions 10s timeout
- **Supabase free tier** : 500 MB DB, 2 GB storage, 50k auth users
- **Pas de Supabase CLI** : utiliser connexion pg directe pour DDL
- **Windows** : utiliser bash syntax dans Claude Code (forward slashes, /dev/null)

## Dependances critiques

| Package | Version | Attention |
|---------|---------|-----------|
| next | 14.2.35 | App Router, pas Pages Router |
| @supabase/supabase-js | 2.x | Client JS direct, pas de Prisma |
| next-auth | 4.x | v4 seulement (pas v5 beta) |
| pg | 8.x | Utilisee pour DDL direct, pas en runtime |
| bcryptjs | 3.x | Hash passwords dashboard (pas bcrypt natif) |
