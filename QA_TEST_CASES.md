# TEST CASES - Restaurant Avis MVP
## Mode EMAIL Flow

---

## TEST CASE #1: Page Choix Authentification

**ID:** TC-001
**Titre:** Affichage de la page de choix auth
**Prérequis:** Accès à /r/[slug]/review avec slug valide

### Steps:
```
1. Naviguer vers: https://restaurant-avis.vercel.app/r/la-belle-assiette/review
2. Attendre le chargement (spinner)
```

### Expected Results:
- ✅ Page chargée correctement
- ✅ Titre du restaurant affiché ("La Belle Assiette")
- ✅ Deux boutons visibles:
  - Bouton bleu: "Continuer avec Google"
  - Bouton blanc/outline: "Tester avec un email"
- ✅ Séparateur "ou" au milieu
- ✅ Page centrée et responsive

### Responsive Check:
- [ ] Mobile (375px): Padding de 16px, buttons pleins
- [ ] Desktop (1920px): Max-width 448px respectée

---

## TEST CASE #2: Click sur bouton Email

**ID:** TC-002
**Titre:** Transition vers le formulaire email
**Prérequis:** Être sur la page de choix (TC-001)

### Steps:
```
1. Cliquer sur le bouton "Tester avec un email"
2. Attendre l'affichage du formulaire
```

### Expected Results:
- ✅ Transition vers le formulaire email
- ✅ Les éléments suivants visibles:
  - Titre: "Tester rapidement"
  - Sous-titre: "Donnez votre avis pour La Belle Assiette"
  - Champ Email (requis)
  - Champ Nom (optionnel)
  - Rating 5 étoiles
  - Champ Commentaire (optionnel)
  - Bouton "Envoyer mon avis" (grisé)
- ✅ Bouton de retour en bas ("Retour au choix...")

---

## TEST CASE #3: Validation Email

**ID:** TC-003
**Titre:** Valider le champ email
**Prérequis:** Formulaire email ouvert (TC-002)

### Steps - Cas 1: Email vide
```
1. Laisser le champ email vide
2. Cliquer sur "Envoyer mon avis"
```

**Expected:**
- ✅ Message d'erreur: "Veuillez entrer votre email."
- ✅ Erreur en rouge avec border

### Steps - Cas 2: Email invalide
```
1. Taper: "test@"
2. Cliquer sur "Envoyer mon avis"
```

**Expected:**
- ✅ HTML5 validation bloque la soumission
- OU Message d'erreur côté serveur

### Steps - Cas 3: Email déjà utilisé
```
1. Taper: "marie.dupont@gmail.com" (du seed)
2. Donner une note
3. Cliquer sur "Envoyer mon avis"
```

**Expected:**
- ✅ Message d'erreur: "Vous avez déjà donné votre avis pour ce restaurant."

---

## TEST CASE #4: Validation Rating

**ID:** TC-004
**Titre:** Valider le rating 5 étoiles
**Prérequis:** Formulaire email ouvert (TC-002)

### Steps:
```
1. Observer le rating non coché
2. Cliquer sur "Envoyer mon avis"
```

**Expected:**
- ✅ Bouton est GRISÉ (disabled)
- ✅ Pas possible de cliquer

### Steps - Interaction étoiles:
```
1. Cliquer sur la 1ère étoile
2. Observer le feedback
3. Cliquer sur la 5ème étoile
```

**Expected:**
- ✅ 1ère étoile: Message "Décevant"
- ✅ 5ème étoile: Message "Excellent !"
- ✅ Bouton devient ACTIF (clickable)

---

## TEST CASE #5: Remplissage complet

**ID:** TC-005
**Titre:** Soumettre un avis valide
**Prérequis:** Formulaire email ouvert (TC-002)

### Steps:
```
1. Email: test-qa-{timestamp}@demo.fr (ex: test-qa-1234@demo.fr)
2. Nom: "Test QA User"
3. Rating: 5 étoiles
4. Commentaire: "Excellent test coverage!"
5. Cliquer "Envoyer mon avis"
```

**Expected:**
- ✅ Bouton affiche spinner + "Envoi en cours..."
- ✅ Button devient disabled
- ✅ Attendre ~2-3 secondes pour réponse API

---

## TEST CASE #6: Redirection vers la roue

**ID:** TC-006
**Titre:** Redirection post-soumission
**Prérequis:** Avis soumis avec succès (TC-005)

### Steps:
```
1. Observer la redirection automatique
2. Vérifier l'URL
```

**Expected:**
- ✅ URL change vers: /r/la-belle-assiette/wheel?participantId=XXX&reviewId=YYY
- ✅ Page affiche la roue interactive
- ✅ Loader initial disparaît
- ✅ Titre: "Tentez votre chance !"
- ✅ Sous-titre: "Tournez la roue pour découvrir votre cadeau"

---

## TEST CASE #7: Affichage de la roue

**ID:** TC-007
**Titre:** Vérifier l'apparence de la roue
**Prérequis:** Page roue chargée (TC-006)

### Visual Checks:
- ✅ Roue circulaire visible
- ✅ 6 segments de couleurs différentes
- ✅ Chaque segment avec:
  - Icône (emoji) visible
  - Nom du cadeau lisible
- ✅ Flèche noire au sommet (pointeur)
- ✅ Cercle blanc au centre
- ✅ Bouton orange "Tournez la roue !" visible

### Responsive Check:
- [ ] Mobile (375px): Roue adaptée, pas de débordement
- [ ] Desktop (1920px): Roue bien dimensionnée

---

## TEST CASE #8: Animation de la roue

**ID:** TC-008
**Titre:** Tester l'animation de spin
**Prérequis:** Page roue chargée (TC-007)

### Steps:
```
1. Cliquer sur le bouton "Tournez la roue !"
2. Observer la roue tourner
3. Compter le temps
```

**Expected:**
- ✅ Roue commence à tourner immédiatement
- ✅ Animation fluide (GPU accelerated)
- ✅ Durée: ~4 secondes
- ✅ Bouton affiche "La roue tourne..." + spinner
- ✅ Bouton devient disabled (non-clickable)
- ✅ Après 4s: Redirection automatique vers la page cadeau

---

## TEST CASE #9: Page révélation cadeau

**ID:** TC-009
**Titre:** Vérifier la page cadeau gagné
**Prérequis:** Roue terminée (TC-008)

### Steps:
```
1. Observer la page après la redirection
2. Attendre l'affichage complet
```

**Expected:**
- ✅ Animaion confetti (multicolore)
- ✅ Icône du cadeau avec animation bounce
- ✅ Texte: "Félicitations !"
- ✅ Texte: "Vous avez gagné"
- ✅ Nom du cadeau affiché (ex: "Café Offert")
- ✅ Description du cadeau (ex: "Un café offert à présenter au serveur")
- ✅ Bloc noir d'instructions: "Présentez cet écran au serveur"

### Confetti Check:
- ✅ Premère explosion: 100 particules centre
- ✅ Deuxième explosion: 2x 60 particules côtés
- ✅ Durée totale confetti: ~2-3 secondes

### Responsive Check:
- [ ] Mobile (375px): Padding p-5, textes lisibles
- [ ] Desktop (1920px): Padding p-8, espacé

---

## TEST CASE #10: Retour à la page de choix

**ID:** TC-010
**Titre:** Tester le bouton de retour
**Prérequis:** Être dans le formulaire email (TC-002)

### Steps:
```
1. Localiser le petit texte gris en bas: "Retour au choix d'authentification"
2. Cliquer dessus
```

**Expected:**
- ✅ Retour à la page de choix (TC-001)
- ✅ Les deux boutons réapparaissent
- ✅ Formulaire disparu
- ✅ URL: /r/la-belle-assiette/review

---

## TEST CASE #11: Responsive Mobile

**ID:** TC-011
**Titre:** Test responsive iPhone SE (375px)
**Prérequis:** Devtools ouvert

### Steps:
```
1. Ouvrir DevTools (F12)
2. Activer Device Toolbar
3. Sélectionner "iPhone SE" (375x667)
4. Parcourir le flow complet
```

**Expected pour chaque écran:**
- ✅ Pas de débordement horizontal
- ✅ Texte lisible (min 14px)
- ✅ Boutons cliquables (min 44x44px)
- ✅ Spacing vertical maintenu (gap-6, gap-8)
- ✅ Padding: px-4 sur mobile

### Écrans à tester:
1. Page choix (TC-001)
2. Formulaire email (TC-002)
3. Roue (TC-007)
4. Cadeau révélé (TC-009)

---

## TEST CASE #12: Responsive Desktop

**ID:** TC-012
**Titre:** Test responsive Desktop (1920px)
**Prérequis:** Navigateur large

### Steps:
```
1. Ouvrir le navigateur en plein écran (1920x1080+)
2. Parcourir le flow complet
```

**Expected pour chaque écran:**
- ✅ Max-width respectée (md: 448px formulaire)
- ✅ Padding augmenté (sm:p-8)
- ✅ Textes agrandis (sm: breakpoints)
- ✅ Shadows et effects visibles
- ✅ Spacing aéré

---

## TEST CASE #13: Console - Pas d'erreurs

**ID:** TC-013
**Titre:** Vérifier la console JavaScript
**Prérequis:** Flow complet complété (TC-005 à TC-009)

### Steps:
```
1. Ouvrir DevTools (F12)
2. Aller à l'onglet "Console"
3. Parcourir le flow complet une nouvelle fois
```

**Expected:**
- ✅ Aucun message ERROR en rouge
- ✅ Aucun message 404
- ✅ Aucun message d'exception
- ⚠️ Warning webpack (non-critique) OK

### Erreurs à vérifier:
```javascript
// Aucun de ces messages:
❌ "Cannot read property 'xxx' of undefined"
❌ "Failed to fetch"
❌ "404 Not Found"
❌ "CORS error"
❌ "Unauthorized"
```

---

## TEST CASE #14: Performance - Lighthouse

**ID:** TC-014
**Titre:** Vérifier les performances
**Prérequis:** Page chargée

### Steps:
```
1. DevTools → Lighthouse
2. Cliquer "Analyze page load"
3. Attendre le rapport
```

**Expected:**
- ✅ Performance: > 85
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 90

### Métriques clés:
- ✅ First Contentful Paint (FCP): < 2s
- ✅ Largest Contentful Paint (LCP): < 3s
- ✅ Time to Interactive (TTI): < 4s
- ✅ Cumulative Layout Shift (CLS): < 0.1

---

## TEST CASE #15: Edge Case - Doublon email

**ID:** TC-015
**Titre:** Tester un email déjà utilisé
**Prérequis:** Formulaire rempli (TC-005)

### Steps:
```
1. Remplir le formulaire avec les mêmes données
2. Email: test-qa-{timestamp}@demo.fr (le même)
3. Cliquer "Envoyer mon avis"
```

**Expected:**
- ✅ Spinner s'affiche
- ✅ Après 2-3s: Message d'erreur en rouge
- ✅ Texte: "Vous avez déjà donné votre avis pour ce restaurant"
- ✅ Rester sur la page formulaire

---

## TEST CASE #16: Edge Case - Restaurant inexistant

**ID:** TC-016
**Titre:** Accéder à un restaurant inexistant
**Prérequis:** Navigateur

### Steps:
```
1. Naviguer vers: /r/restaurant-inexistant/review
2. Observer la page
```

**Expected:**
- ✅ Loader initial
- ✅ Après 2-3s: Page d'erreur
- ✅ Icône rouge (cercle avec X)
- ✅ Message: "Restaurant introuvable"
- ✅ Sous-message: "Vérifiez le lien ou scannez à nouveau le QR code"

---

## TEST CASE #17: Edge Case - Paramètres manquants

**ID:** TC-017
**Titre:** Accéder à la roue sans paramètres
**Prérequis:** Navigateur

### Steps:
```
1. Accéder directement à: /r/la-belle-assiette/wheel
2. Observer (sans participantId/reviewId)
```

**Expected:**
- ✅ Loader initial
- ✅ Après 2-3s: Page d'erreur
- ✅ Icône ambre (triangle d'alerte)
- ✅ Message: "Oups !"
- ✅ Texte: "Paramètres manquants. Veuillez recommencer le processus."

---

## TEST CASE #18: Timing - Animation 4 secondes

**ID:** TC-018
**Titre:** Vérifier la durée exacte de l'animation
**Prérequis:** Page roue chargée (TC-007)

### Steps:
```
1. Cliquer "Tournez la roue !"
2. Démarrer un chronomètre
3. Arrêter quand la page cadeau apparaît
```

**Expected:**
- ✅ Durée: 4.0 ± 0.3 secondes
- ✅ Pas d'interruption de l'animation
- ✅ Transition fluide vers la page suivante

---

## TEST CASE #19: Interaction - Hover States

**ID:** TC-019
**Titre:** Vérifier les états hover
**Prérequis:** Desktop avec souris

### Steps - Boutons:
```
1. Survoler "Continuer avec Google" → Doit s'assombrir
2. Survoler "Tester avec un email" → Doit s'assombrir
3. Survoler "Tournez la roue !" → Doit s'agrandir + shadow
```

**Expected:**
- ✅ Changement de couleur ou d'ombre
- ✅ Transition lisse (200-300ms)
- ✅ Feedback visuel clair

### Steps - Autres éléments:
```
1. Survoler "Retour au choix..." → Doit s'assombrir
```

**Expected:**
- ✅ Texte gris → gris plus foncé
- ✅ Transition: colors

---

## RÉSUMÉ DES TEST CASES

| ID | Titre | Priorité | Status |
|----|-------|----------|--------|
| TC-001 | Page choix auth | P0 | ✅ |
| TC-002 | Click bouton email | P0 | ✅ |
| TC-003 | Validation email | P1 | ✅ |
| TC-004 | Validation rating | P1 | ✅ |
| TC-005 | Soumission complète | P0 | ⏳ |
| TC-006 | Redirection roue | P0 | ⏳ |
| TC-007 | Affichage roue | P1 | ✅ |
| TC-008 | Animation roue | P0 | ⏳ |
| TC-009 | Cadeau révélé | P0 | ⏳ |
| TC-010 | Retour choix | P1 | ✅ |
| TC-011 | Responsive mobile | P1 | ✅ |
| TC-012 | Responsive desktop | P1 | ✅ |
| TC-013 | Console clean | P0 | ✅ |
| TC-014 | Lighthouse perf | P1 | ⏳ |
| TC-015 | Doublon email | P1 | ⏳ |
| TC-016 | Restaurant inexistant | P2 | ✅ |
| TC-017 | Paramètres manquants | P2 | ✅ |
| TC-018 | Timing 4s | P1 | ⏳ |
| TC-019 | Hover states | P2 | ✅ |

**P0 = Critical | P1 = Important | P2 = Nice-to-have**

---

*Test cases générés par QA-Guard - 2026-03-07*
