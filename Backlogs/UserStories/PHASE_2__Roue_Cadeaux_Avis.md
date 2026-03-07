# PHASE 2 -- Roue Cadeaux & Avis (Killer Feature)

> **Objectif** : Implementer le flow client complet : page restaurant, formulaire d'avis, roue animee, revelation du cadeau, anti-abus.
> **Sprint** : Sprint 1
> **Points totaux** : 16
> **Module** : Killer Feature MVP

---

### US-006 : Page accueil restaurant /r/[slug]

| | |
|---|---|
| **Phase** | 2 |
| **Module** | Flow Client |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que client du restaurant, je veux acceder a la page de l'etablissement via un QR code pour decouvrir le restaurant et laisser un avis.

**Criteres d'acceptation** :
- [ ] Route dynamique `/r/[slug]` fonctionnelle
- [ ] Design mobile-first (optimise pour ecran 320px - 428px)
- [ ] Affichage du logo, nom et couleur primaire du restaurant
- [ ] CTA principal visible : "Laissez un avis et tentez de gagner un cadeau !"
- [ ] Chargement des donnees restaurant depuis Supabase via le slug
- [ ] Page 404 personnalisee si le slug n'existe pas
- [ ] Temps de chargement < 2s sur mobile 4G

---

### US-007 : Formulaire avis -- etoiles interactives + commentaire

| | |
|---|---|
| **Phase** | 2 |
| **Module** | Flow Client |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que client du restaurant, je veux noter mon experience avec des etoiles et ecrire un commentaire pour partager mon avis.

**Criteres d'acceptation** :
- [ ] Composant StarRating interactif (1 a 5) avec retour visuel au tap/clic
- [ ] Champ commentaire (textarea, optionnel mais encourage)
- [ ] Validation : note obligatoire
- [ ] Bouton "Envoyer mon avis" desactive tant que la note n'est pas choisie
- [ ] Appel API POST `/api/avis/reviews` pour sauvegarder
- [ ] L'utilisateur doit etre connecte (Google OAuth) avant de soumettre
- [ ] Animation fluide sur les etoiles (scale + couleur doree)
- [ ] Composant dans `src/modules/avis/components/StarRating.tsx`

---

### US-008 : Roue animee CSS + API spin serveur

| | |
|---|---|
| **Phase** | 2 |
| **Module** | Roue Cadeaux |
| **Priorite** | HAUTE |
| **Estimation** | 5 points |
| **Statut** | [ ] A faire |

**Story** : En tant que client du restaurant, je veux tourner une roue de cadeaux animee apres avoir laisse mon avis pour decouvrir mon lot de facon ludique.

**Criteres d'acceptation** :
- [ ] Roue visuelle avec segments colores (1 segment par cadeau actif)
- [ ] Noms des cadeaux affiches sur chaque segment
- [ ] Animation CSS : duree 4s, easing `cubic-bezier(0.17, 0.67, 0.12, 0.99)`
- [ ] API POST `/api/avis/wheel/spin` : selection ponderee selon probabilites
- [ ] Le resultat est determine cote serveur AVANT l'animation (anti-triche)
- [ ] La roue s'arrete sur le segment correspondant au cadeau gagne
- [ ] Fleche indicatrice fixe en haut de la roue
- [ ] Bouton "Tournez la roue !" avec etat loading pendant l'appel API
- [ ] La roue ne peut etre tournee qu'une seule fois par participation
- [ ] Algorithme dans `src/modules/avis/lib/wheel-logic.ts`
- [ ] Composant dans `src/modules/avis/components/SpinningWheel.tsx`

---

### US-009 : Page revelation cadeau + confetti

| | |
|---|---|
| **Phase** | 2 |
| **Module** | Roue Cadeaux |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que client du restaurant, je veux voir clairement le cadeau que j'ai gagne avec une animation festive pour vivre une experience memorable.

**Criteres d'acceptation** :
- [ ] Animation confetti declenchee automatiquement (`canvas-confetti`)
- [ ] Nom du cadeau affiche en grand
- [ ] Description du cadeau en dessous
- [ ] Message "Presentez cet ecran au serveur" bien visible
- [ ] Bouton optionnel "Laissez aussi votre avis sur Google Maps" (lien externe)
- [ ] La participation est enregistree en base (table `participations`)
- [ ] Design celebratoire : couleurs vives, typographie festive
- [ ] Composant dans `src/modules/avis/components/PrizeReveal.tsx`

---

### US-010 : Anti-abus -- 1 participation par email par restaurant

| | |
|---|---|
| **Phase** | 2 |
| **Module** | Securite |
| **Priorite** | HAUTE |
| **Estimation** | 2 points |
| **Statut** | [ ] A faire |

**Story** : En tant que gerant, je veux que chaque client ne puisse participer qu'une seule fois par restaurant pour eviter les abus.

**Criteres d'acceptation** :
- [ ] Verification en base : un email ne peut avoir qu'une participation par restaurant
- [ ] Contrainte UNIQUE en base sur (restaurant_id, email) dans `participants`
- [ ] Message clair si deja participe : "Vous avez deja participe pour ce restaurant"
- [ ] La verification se fait cote serveur (API) et non cote client uniquement
- [ ] Le flow est bloque AVANT l'affichage de la roue (pas apres)
