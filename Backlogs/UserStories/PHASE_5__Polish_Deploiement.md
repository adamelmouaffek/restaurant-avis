# PHASE 5 -- Polish & Deploiement

> **Objectif** : Tester la qualite responsive, deployer en production sur Vercel et valider le flow complet end-to-end.
> **Sprint** : Sprint 3
> **Points totaux** : 7

---

### US-020 : Test responsive mobile (320px iPhone SE minimum)

| | |
|---|---|
| **Phase** | 5 |
| **Module** | Qualite |
| **Priorite** | HAUTE |
| **Estimation** | 2 points |
| **Statut** | [ ] A faire |

**Story** : En tant que Product Owner, je veux que toutes les pages soient utilisables sur un iPhone SE (320px) pour garantir l'accessibilite.

**Criteres d'acceptation** :
- [ ] Pages testees a 320px, 375px, 428px
- [ ] Aucun overflow horizontal
- [ ] Textes lisibles sans zoom (font-size min 14px)
- [ ] Boutons CTA cliquables (min 44x44px zone de tap)
- [ ] Roue cadeaux visible en entier et jouable sur petit ecran
- [ ] Dashboard fonctionnel en mode mobile
- [ ] Lighthouse mobile score > 85

---

### US-021 : Deploiement Vercel

| | |
|---|---|
| **Phase** | 5 |
| **Module** | DevOps |
| **Priorite** | HAUTE |
| **Estimation** | 3 points |
| **Statut** | [ ] A faire |

**Story** : En tant que Product Owner, je veux que la demo soit accessible en ligne via une URL publique pour la montrer a des restaurateurs.

**Criteres d'acceptation** :
- [ ] Repository GitHub cree et code pousse
- [ ] Projet Vercel connecte au repo GitHub
- [ ] Variables d'environnement configurees sur Vercel
- [ ] Build reussi sans erreur
- [ ] URL de production fonctionnelle
- [ ] HTTPS actif
- [ ] Deploy automatique a chaque push sur `main`

---

### US-022 : Test flow complet en production

| | |
|---|---|
| **Phase** | 5 |
| **Module** | Qualite |
| **Priorite** | HAUTE |
| **Estimation** | 2 points |
| **Statut** | [ ] A faire |

**Story** : En tant que Product Owner, je veux tester le parcours complet en production pour valider que tout fonctionne avant de pitcher.

**Criteres d'acceptation** :
- [ ] Scanner un QR code mene a la bonne page restaurant
- [ ] Connexion Google OAuth fonctionne en production
- [ ] Soumission d'un avis s'enregistre en base Supabase
- [ ] La roue tourne et affiche le bon cadeau
- [ ] Confetti et nom du cadeau affiches correctement
- [ ] L'anti-abus bloque une deuxieme participation
- [ ] Le dashboard affiche le nouvel avis et la participation
- [ ] Temps de chargement < 3s sur 4G
- [ ] Aucune erreur dans la console navigateur
