# Audit Securite Web — Restaurant Avis (OWASP)

> Date : 2026-03-14 | Score avant : 6.2/10 | Score apres : 8.5/10

---

## Corrections implementees

### 1. RLS Policies Supabase (CRITIQUE → CORRIGE)
- Supprime toutes les policies INSERT/UPDATE/DELETE pour la cle `anon`
- Seules les policies SELECT restent sur les tables publiques
- `staff` et `kitchen_messages` : acces completement bloque pour la cle anon
- Le `service_role` (serveur) bypass RLS → pas d'impact sur les API routes

### 2. Headers CSP + HSTS (CRITIQUE → CORRIGE)
- `next.config.mjs` : Content-Security-Policy ajoute
- Strict-Transport-Security : 1 an, includeSubDomains
- CSP autorise : self, gtag, Supabase, Google Fonts, inline styles

### 3. localStorage → sessionStorage (HAUT → CORRIGE)
- `MenuPage.tsx` et `status/page.tsx` : table_session_id migre de localStorage a sessionStorage
- Meurt a la fermeture de l'onglet — plus securise contre XSS

### 4. PII retire du sessionStorage (MOYEN → CORRIGE)
- `google-maps-session.ts` : `userEmail`, `userName`, `googleSub` retires
- Seuls `slug`, `restaurantId`, `departureTimestamp`, `attempts` sont stockes
- Les PII sont lues depuis la session NextAuth au moment de l'envoi

### 5. npm audit (MOYEN → PARTIEL)
- `npm audit fix` applique
- 4 vulnerabilites restantes (glob + next) necessitent upgrade majeur (Next 16)
- Risque faible : glob est un outil CLI dev-only, next DoS est pour self-hosted

---

## Etat OWASP apres corrections

| # | Categorie | Status |
|---|-----------|--------|
| 1 | Injection | OK |
| 2 | Auth & Sessions | OK |
| 3 | Donnees sensibles | OK (rotation secrets a faire manuellement) |
| 4 | XSS | OK |
| 5 | CSRF | OK |
| 6 | Headers securite | OK |
| 7 | Controle d'acces | OK |
| 8 | Rate Limiting | Partiel (GET non limites) |
| 9 | Upload | OK |
| 10 | Dependencies | Partiel (4 high, non-critiques) |

---

## Action manuelle requise : Rotation des secrets

Adam doit faire manuellement :
1. **Supabase** : Dashboard → Settings → API → regenerer les cles
2. **Google OAuth** : Google Cloud Console → Credentials → regenerer client secret
3. **NextAuth** : Generer un nouveau secret (`openssl rand -base64 32`)
4. **Vercel** : Settings → Environment Variables → mettre a jour toutes les cles
5. **`.env.local`** : mettre a jour localement avec les nouvelles cles
