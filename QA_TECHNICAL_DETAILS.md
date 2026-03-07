# DÉTAILS TECHNIQUES - ANALYSE DE CODE

## Structure des fichiers testés

```
src/
├── app/
│   ├── r/[slug]/
│   │   ├── review/page.tsx        ← Page choix auth + formulaires
│   │   ├── wheel/page.tsx         ← Page roue
│   │   └── prize/page.tsx         ← Page révélation cadeau
│   └── api/avis/
│       └── reviews/route.ts       ← API POST formulaire
├── modules/avis/components/
│   ├── EmailReviewForm.tsx        ← Formulaire email
│   ├── SpinningWheel.tsx          ← Roue interactive
│   ├── PrizeReveal.tsx            ← Révélation + confetti
│   └── StarRating.tsx             ← Composant rating 5 étoiles
```

## 1. ANALYSE - PAGE REVIEW (review/page.tsx)

### Structure d'état
```typescript
type AuthMode = "choice" | "google" | "email";
```

### Flow d'authentification
1. **Chargement du restaurant** (useEffect, ligne 25-45)
   - Fetch: `GET /api/avis/restaurants?slug={slug}`
   - Données retournées: id, name, logo_url, primary_color
   - Erreur → affichage message

2. **Choix d'authentification** (ligne 76-123)
   - Affiche deux boutons
   - `setAuthMode("google")` → déclencheur signIn
   - `setAuthMode("email")` → mode formulaire

3. **Mode Google** (ligne 56-61, 191-227)
   - useEffect déclenche `signIn("google")`
   - Attend session authenticated
   - Affiche ReviewForm (Google OAuth)

4. **Mode Email** (ligne 164-188)
   - Affiche EmailReviewForm
   - Bouton retour en bas

### Redirection succès
```javascript
handleSuccess = (participantId: string, reviewId: string) => {
  router.push(`/r/${slug}/wheel?participantId=${participantId}&reviewId=${reviewId}`)
}
```

## 2. ANALYSE - FORMULAIRE EMAIL

### Validation côté client
```javascript
// Email requis
if (!formData.email.trim()) {
  setError("Veuillez entrer votre email.");
  return;
}

// Rating requis
if (formData.rating === 0) {
  setError("Veuillez donner une note.");
  return;
}
```

### Soumission API
```javascript
POST /api/avis/reviews {
  restaurant_id: string,
  email: string,
  name: string,
  google_sub: null,
  rating: 1-5,
  comment?: string
}
```

### Gestion du doublon (ligne 52-56)
```javascript
if (existingParticipant) {
  return NextResponse.json(
    { error: "Vous avez déjà participé", alreadyParticipated: true },
    { status: 409 }
  );
}
```

## 3. ANALYSE - ROUE SPINNING

### Gradient conic
```javascript
const conicGradient = prizes
  .map((prize, i) => {
    const start = (segmentAngle * i).toFixed(2);
    const end = (segmentAngle * (i + 1)).toFixed(2);
    return `${prize.color} ${start}deg ${end}deg`;
  })
  .join(", ");
```

### Animation CSS
```css
transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
```
- **Durée:** 4000ms
- **Easing:** cubic-bezier (accélération réaliste)
- **Propriété:** transform (optimisé pour GPU)

### Calcul rotation
```javascript
const targetAngle = data.angle; // API retourne angle aléatoire
const newRotation = rotation + targetAngle; // Continue les tours
setRotation(newRotation);
```

### Appel API spin
```javascript
POST /api/avis/wheel/spin {
  restaurant_id: string,
  participant_id: string,
  review_id: string
}

// Réponse:
{
  angle: number,
  prizeId: string,
  prizeName: string,
  prizeIcon: string,
  prizeColor: string,
  prizeDescription?: string,
  segmentIndex: number
}
```

### Timing de révélation
```javascript
setTimeout(() => {
  setIsSpinning(false);
  onPrizeWon({...});
}, 4200); // Après 4.2s (animation 4s + buffer 200ms)
```

## 4. ANALYSE - CONFETTI ANIMATION

### Canvas Confetti
```javascript
import("canvas-confetti").then((confettiModule) => {
  const confetti = confettiModule.default;

  // Burst 1: Centre
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#fbbf24", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#10b981"]
  });

  // Burst 2 & 3: Côtés (300ms après)
  setTimeout(() => {
    confetti({ ... }); // Gauche
    confetti({ ... }); // Droite
  }, 300);
});
```

### Prévention double exécution
```javascript
const confettiFired = useRef(false);
useEffect(() => {
  if (confettiFired.current) return;
  confettiFired.current = true;
  // ...
}, []);
```

## 5. ANALYSE - RESPONSIVE DESIGN

### Breakpoints Tailwind utilisés
- **sm:** 640px (activé partout)
- **px-4:** padding mobile 16px
- **max-w-md:** 448px (formulaire)
- **max-w-sm:** 384px (roue)

### Texte responsive
```
text-[10px] sm:text-xs      (8px → 12px)
text-[8px] sm:text-[10px]   (8px → 10px)
text-6xl sm:text-7xl        (60px → 84px)
text-2xl sm:text-3xl        (24px → 30px)
text-sm sm:text-base        (14px → 16px)
text-xs sm:text-sm          (12px → 14px)
```

### Sizing responsive
```
w-10 h-10 sm:w-12 sm:h-12                  (40px → 48px)
w-28 h-28 sm:w-32 sm:h-32                  (112px → 128px)
p-6 sm:p-8                                  (24px → 32px)
p-5 sm:p-6                                  (20px → 24px)
```

## 6. ANALYSE - GESTION DES ERREURS

### Levels d'erreur

| Level | Code | Exemple |
|-------|------|---------|
| Validation client | N/A | Rating = 0 |
| Email format | N/A | HTML5 email input |
| Dupli. participant | 409 | alreadyParticipated |
| Restaurant not found | 404 | slug invalide |
| Rating hors limites | 400 | rating < 1 ou > 5 |
| Server error | 500 | DB unavailable |

### Affichage des erreurs
```jsx
{error && (
  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
    {error}
  </div>
)}
```

## 7. ANALYSE - PERFORMANCE

### Optimisations identifiées

✅ **CSS Transitions (GPU accelerated)**
- `transform` propriété uniquement
- `cubic-bezier` pour fluidité

✅ **Import dynamique canvas-confetti**
```javascript
import("canvas-confetti") // Lazy load
```

✅ **Réutilisation de refs**
```javascript
const wheelRef = useRef<HTMLDivElement>(null);
const confettiFired = useRef(false);
```

✅ **Pas de re-renders inutiles**
- `useCallback` sur handleSpin
- Dependencies bien définies

### Tailles estimées

| Asset | Taille |
|-------|--------|
| EmailReviewForm.tsx | ~7KB |
| SpinningWheel.tsx | ~9KB |
| PrizeReveal.tsx | ~8KB |
| canvas-confetti | ~20KB (lazy) |

## 8. ANALYSE - SÉCURITÉ

### Validation requises

✅ **Côté client:**
- Email regex (HTML5)
- Rating 1-5
- Trim whitespace

✅ **Côté serveur:**
```javascript
if (!restaurant_id || !email || !rating) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}

if (rating < 1 || rating > 5) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}

// Vérifier doublon
const existingParticipant = await supabaseAdmin
  .from("participants")
  .select("id")
  .eq("restaurant_id", restaurant_id)
  .eq("email", email)
  .single();
```

### Points de sécurité

✅ **SQL Injection:** Supabase client library (paramétrées)
✅ **XSS:** React escaping automatique
✅ **CSRF:** NextAuth token-based
✅ **Rate limiting:** À configurer sur /api/avis/reviews

## 9. ANALYSE - ACCESSIBILITÉ

✅ **ARIA labels:**
```jsx
<span role="img" aria-label={prizeName}>
  {prizeIcon}
</span>
```

✅ **Sémantique HTML:**
- `<main>` wrapper
- `<label>` pour inputs
- `<h1>`, `<h2>` titres

✅ **Contraste couleurs:**
- Texte blanc sur gradient amber/orange
- Texte gris-900 sur white
- Border red sur red-50

✅ **Interactivité:**
- Buttons avec hover/active states
- Textes explicatifs pour actions

## 10. RÉSUMÉ - CHECKLIST TECHNIQUE

| Item | Status | Notes |
|------|--------|-------|
| TypeScript strict | ✅ | Complète |
| Composants réutilisables | ✅ | Bien séparés |
| Gestion état | ✅ | useState/useRef appropriés |
| Error handling | ✅ | Complète |
| Loading states | ✅ | Spinners présents |
| Responsive design | ✅ | Breakpoints sm: |
| Performance | ✅ | CSS GPU accelerated |
| Sécurité validation | ✅ | Client + server |
| Accessibilité | ✅ | ARIA labels |
| Code structure | ✅ | Modulaire et lisible |

---

## FICHIERS CLÉS

1. **Page Review:** `/src/app/r/[slug]/review/page.tsx` (229 lignes)
2. **Formulaire Email:** `/src/modules/avis/components/EmailReviewForm.tsx` (215 lignes)
3. **Roue:** `/src/modules/avis/components/SpinningWheel.tsx` (194 lignes)
4. **Révélation:** `/src/modules/avis/components/PrizeReveal.tsx` (135 lignes)
5. **API Reviews:** `/src/app/api/avis/reviews/route.ts` (94 lignes)

**Total:** ~860 lignes de code pour le flow complet

---

*Analyse technique - QA-Guard 2026-03-07*
