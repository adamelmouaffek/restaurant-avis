# PLAN D'ACTION - QA-Guard Test Results

**Date:** 2026-03-07
**Status:** APPROUVÉ AVEC RÉSERVES
**Overall Score:** 85/100

---

## 🔴 ISSUES CRITIQUES À CORRIGER

### Issue #1: Base de données Supabase vide en production
**Sévérité:** 🔴 CRITIQUE
**Impact:** Impossible de tester le flow complet en production
**Assigné à:** DevOps / Database Admin

**Problème:**
```
https://restaurant-avis.vercel.app/r/la-belle-assiette/review
↓
404: Restaurant introuvable
```

**Cause:**
- L'instance Supabase de production ne contient pas les données de seed
- Seul le schéma SQL est appliqué, pas les données d'insertion

**Solution - Option A (Recommandée): Script d'initialisation**
```bash
# 1. Récupérer les credentials Supabase production
SUPABASE_URL=xxxxx
SUPABASE_KEY=xxxxx

# 2. Exécuter le seed
psql -h db.supabase.co \
  -U postgres \
  -d postgres \
  -c "$(cat supabase/seed.sql)"
```

**Solution - Option B: Dashboard UI**
```
1. Se connecter à https://restaurant-avis.vercel.app/dashboard/login
2. Email: demo@restaurant-avis.fr
3. Password: demo1234
4. Créer un restaurant via le dashboard
5. Copier le slug généré
6. Ajouter des cadeaux
```

**Solution - Option C: Supabase Admin Console**
```
1. Accéder à https://supabase.com/dashboard/
2. Sélectionner le projet Restaurant Avis
3. SQL Editor
4. Exécuter supabase/seed.sql
5. Vérifier les données avec SELECT
```

**Priorité:** URGENT (avant GO LIVE)
**Checklist d'implémentation:**
- [ ] Choisir la solution (A/B/C)
- [ ] Exécuter le seed en production
- [ ] Vérifier les données: `SELECT * FROM restaurants;`
- [ ] Tester l'URL: /r/la-belle-assiette/review
- [ ] Compléter le flow complet en production
- [ ] Documenter la procédure

---

### Issue #2: Clés d'environnement incorrectes
**Sévérité:** 🟡 MOYENNE
**Impact:** RLS (Row Level Security) non appliquée, limitations API côté serveur
**Assigné à:** DevOps / Security

**Problème:**
```
.env.local:
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_WwuC2S6UAjaovjNpOk7vkg_W97qlr_k
                          ↑ Ceci est une PUBLISHABLE KEY, pas une SERVICE ROLE KEY
```

**Conséquences:**
- Pas de vrai service role access
- RLS policies ne peuvent pas être bypassées côté serveur
- Appels API côté serveur limités

**Solution:**
```
1. Se connecter à https://app.supabase.com
2. Sélectionner le projet
3. Project Settings → API Keys
4. Copier la "Service Role Key" (commence par sbp_xxx)
5. Remplacer dans .env.local
6. Redémarrer le serveur dev
7. En production: configurer via Vercel Dashboard
   - Settings → Environment Variables
   - SUPABASE_SERVICE_ROLE_KEY=<vraie_clé>
```

**Vérification:**
```javascript
// Après correction, cet appel doit fonctionner sans limitation RLS
const { data } = await supabaseAdmin
  .from("reviews")
  .select("*")
  .limit(1000); // Doit retourner sans limiter par user
```

**Priorité:** HAUTE (avant production)
**Checklist:**
- [ ] Obtenir la vraie service role key
- [ ] Mettre à jour .env.local
- [ ] Tester l'API localement
- [ ] Configurer en Vercel
- [ ] Vérifier en production
- [ ] Documenter dans .env.example

---

## 🟡 ISSUES MINEURES À ADRESSER

### Issue #3: Pas de rate limiting sur les endpoints API
**Sévérité:** 🟡 MOYENNE
**Impact:** Spam possible sur POST /api/avis/reviews
**Assigné à:** Backend

**Problème:**
- L'endpoint POST /api/avis/reviews n'a pas de limite de requêtes
- Un utilisateur malveillant pourrait créer des milliers de reviews

**Solution recommandée:**
```javascript
// Installer une libraire
npm install next-rate-limit

// Ajouter dans /api/avis/reviews/route.ts
import { rateLimit } from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // 500 requêtes par IP/min
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(request);
  } catch {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }
  // ...resto du code
}
```

**Alternative (simple):**
```javascript
// Utiliser Vercel Edge Middleware
// middleware.ts
import { rateLimit } from 'next-rate-limit';

export const middleware = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/api/avis/reviews')) {
    const ip = request.ip || 'unknown';
    // Vérifier le rate limit par IP
  }
};
```

**Priorité:** MOYENNE (avant production idéalement)
**Checklist:**
- [ ] Choisir la libraire (next-rate-limit ou Upstash)
- [ ] Implémenter le rate limiting
- [ ] Tester avec ab ou wrk
- [ ] Documenter les limites (ex: 10 req/min par IP)
- [ ] Monitorer en production

---

### Issue #4: Pas de logs serveur pour monitoring
**Sévérité:** 🟡 BASSE
**Impact:** Difficile de diagnostiquer les problèmes en production
**Assigné à:** DevOps

**Problème:**
```javascript
// Dans route.ts, pas de logs
export async function POST(request: NextRequest) {
  try {
    // ...
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
  // Le message d'erreur exact n'est pas loggé
}
```

**Solution:**
```javascript
import { logger } from '@/shared/lib/logger'; // À créer

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    logger.info('reviews_submit_start', { email: body.email });

    // ...code...

    logger.info('reviews_submit_success', {
      participantId,
      duration: Date.now() - startTime
    });
  } catch (error) {
    logger.error('reviews_submit_error', {
      error: error.message,
      duration: Date.now() - startTime
    });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

**Choix de solution:**
- Vercel Logs (gratuit)
- Sentry (monitoring errors) - recommandé
- LogRocket (session replay)

**Priorité:** BASSE (nice-to-have)
**Checklist:**
- [ ] Choisir le logging service
- [ ] Installer la libraire
- [ ] Ajouter les logs clés
- [ ] Configurer les alertes
- [ ] Tester en production

---

## 🟢 POINTS POSITIFS À MAINTENIR

✅ **Code propre et modulaire**
- Continue avec cette structure
- Réutilisez les composants pour d'autres restaurantes

✅ **Animations fluides**
- Les transitions 4s et confetti fonctionnent parfaitement
- Maintenir les perfs GPU

✅ **Responsive design**
- Breakpoints bien appliqués
- Tester régulièrement sur mobile

✅ **Validation complète**
- Client + server-side
- Continuer cette pratique

---

## 📋 CHECKLIST PRÉ-PRODUCTION

### Base de données
- [ ] Issue #1: Seed data appliqué en production ✅ CRITIQUE
- [ ] Issue #2: Service role key configurée ✅ CRITIQUE
- [ ] Schema SQL vérifié
- [ ] Backups configurés
- [ ] RLS policies testées

### Sécurité
- [ ] Issue #3: Rate limiting implémenté ⏳ MEDIUM
- [ ] CORS configuré correctement
- [ ] CSRF tokens actifs
- [ ] Sensitive data pas loggée
- [ ] Passwords hashés (bcrypt)

### Performance
- [ ] Lighthouse score > 90
- [ ] Time to interactive < 3s
- [ ] Bundle size < 200KB
- [ ] Images optimisées
- [ ] Cache headers configurés

### Monitoring
- [ ] Issue #4: Logging implémenté ⏳ MEDIUM
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Alerts configurées

### Testing
- [ ] Flow email complet testé en prod
- [ ] Google OAuth testé
- [ ] Roue et confetti testés
- [ ] Responsive testée (iPhone + Desktop)
- [ ] Offline mode testé

### Documentation
- [ ] README.md mis à jour
- [ ] .env.example correctement fourni
- [ ] API documentation
- [ ] Procédure de déploiement

---

## 🚀 ROADMAP POST-PRODUCTION

### Court terme (Semaines 1-2)
1. Implémenter Issue #3 (Rate limiting)
2. Implémenter Issue #4 (Logging/Monitoring)
3. Ajouter analytics de participation

### Moyen terme (Mois 1-2)
1. Ajouter Google Maps integration
2. Export des avis en CSV
3. Statistiques avancées (dashboard)

### Long terme (Mois 2+)
1. Multi-language support (EN, ES, IT)
2. Webhooks pour intégration tierce
3. API publique pour restaurants
4. Mobile app native

---

## 📞 CONTACTS ET RESSOURCES

**Questions Supabase:**
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

**Questions Vercel:**
- Docs: https://vercel.com/docs
- Dashboard: https://vercel.com/dashboard

**Questions Rate Limiting:**
- Upstash: https://upstash.com
- next-rate-limit: https://www.npmjs.com/package/next-rate-limit

---

## 📊 TRACKING DES ACTIONS

| ID | Issue | Assigné | Status | Due Date | Priority |
|----|-------|---------|--------|----------|----------|
| #1 | BD Seed Data | DevOps | ⏳ TODO | ASAP | 🔴 CRITICAL |
| #2 | Env Keys | DevOps | ⏳ TODO | ASAP | 🔴 CRITICAL |
| #3 | Rate Limiting | Backend | ⏳ TODO | Avant prod | 🟡 MEDIUM |
| #4 | Logging | DevOps | ⏳ TODO | Post-prod | 🟡 LOW |

---

**Rapport généré par:** QA-Guard (Claude Code)
**Date:** 2026-03-07
**Prochaine révision:** Après implémentation des issues critiques

