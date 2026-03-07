# PHASE 3 -- Dashboard Back-Office Gerant

> **Objectif** : Fournir au gerant un tableau de bord complet pour gerer ses cadeaux, consulter les avis, generer des QR codes et suivre ses statistiques.
> **Sprint** : Sprint 2
> **Points totaux** : 18

---

### US-011 : Layout dashboard avec sidebar navigation

| | |
|---|---|
| **Phase** | 3 |
| **Module** | Dashboard |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [x] Termine |

**Story** : En tant que gerant, je veux un dashboard avec une navigation claire en sidebar pour acceder rapidement a toutes les sections de gestion.

**Criteres d'acceptation** :
- [ ] Layout avec sidebar fixe a gauche (desktop) et menu hamburger (mobile)
- [ ] Navigation avec icones Lucide : Accueil, Cadeaux, Avis, QR Codes, Statistiques
- [ ] Indicateur visuel de la page active dans la sidebar
- [ ] Header avec nom du restaurant et bouton de deconnexion
- [ ] Layout responsive : sidebar collapse en mode mobile
- [ ] Toutes les pages `/dashboard/*` utilisent ce layout
- [ ] Composant dans `src/shared/components/Sidebar.tsx`

---

### US-012 : Page config cadeaux -- CRUD + probabilites + apercu roue

| | |
|---|---|
| **Phase** | 3 |
| **Module** | Dashboard |
| **Priorite** | HAUTE |
| **Estimation** | 5 points |
| **Statut** | [x] Termine |

**Story** : En tant que gerant, je veux configurer mes cadeaux (nom, description, probabilite) et voir un apercu de la roue en temps reel.

**Criteres d'acceptation** :
- [ ] Liste des cadeaux existants dans un tableau
- [ ] Bouton "Ajouter un cadeau" ouvrant un formulaire
- [ ] Champs : nom, description, probabilite (poids), couleur, icone, actif (toggle)
- [ ] Edition et suppression de cadeaux existants
- [ ] Suppression avec confirmation
- [ ] Apercu visuel de la roue en temps reel (update live)
- [ ] Appels API CRUD vers `/api/avis/prizes`
- [ ] Toast de confirmation apres chaque action
- [ ] Composant dans `src/modules/avis/components/PrizeConfigForm.tsx`

---

### US-013 : Page liste avis -- tableau + filtres + note moyenne

| | |
|---|---|
| **Phase** | 3 |
| **Module** | Dashboard |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [x] Termine |

**Story** : En tant que gerant, je veux consulter tous les avis recus avec des filtres pour suivre la satisfaction de mes clients.

**Criteres d'acceptation** :
- [ ] Tableau des avis : date, client (email), note (etoiles), commentaire
- [ ] Note moyenne globale affichee en haut (grande, visible)
- [ ] Filtre par note (1 a 5 etoiles)
- [ ] Tri par date (plus recent en premier)
- [ ] Nombre total d'avis affiche
- [ ] Composant dans `src/modules/avis/components/ReviewsTable.tsx`

---

### US-014 : Generateur QR codes par table

| | |
|---|---|
| **Phase** | 3 |
| **Module** | Dashboard |
| **Priorite** | MOYENNE |
| **Estimation** | 3 points |
| **Statut** | [x] Termine |

**Story** : En tant que gerant, je veux generer des QR codes pour mes tables qui pointent vers ma page restaurant.

**Criteres d'acceptation** :
- [ ] Champ de saisie pour le numero de table
- [ ] Bouton "Generer" creant un QR code vers `/r/[slug]?table=[numero]`
- [ ] QR code affiche a l'ecran avec numero de table
- [ ] Bouton "Telecharger PNG" pour chaque QR
- [ ] Enregistrement en base (table `qr_codes`)
- [ ] Liste des QR codes deja generes
- [ ] Generation par lot : "Generer tables 1 a 10"
- [ ] Librairie : `react-qr-code`
- [ ] Composant dans `src/modules/avis/components/QRCodeGenerator.tsx`

---

### US-015 : Page stats -- 4 cartes overview + graphique participations

| | |
|---|---|
| **Phase** | 3 |
| **Module** | Dashboard |
| **Priorite** | MOYENNE |
| **Estimation** | 4 points |
| **Statut** | [x] Termine |

**Story** : En tant que gerant, je veux voir des statistiques cles pour mesurer l'impact de la roue cadeaux.

**Criteres d'acceptation** :
- [ ] 4 cartes KPI : Total avis, Note moyenne, Total participations, Taux de conversion
- [ ] Graphique en barres : participations par jour (7 derniers jours)
- [ ] Les donnees sont chargees depuis les API existantes
- [ ] Responsive : cartes empilees sur mobile
- [ ] Composant dans `src/modules/avis/components/StatsCards.tsx`
