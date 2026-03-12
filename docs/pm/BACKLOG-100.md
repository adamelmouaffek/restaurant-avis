# Restaurant Avis — 100 User Stories

> Backlog complet couvrant les 5 modules de la suite SaaS HoReCa
> Genere le 2026-03-12

## Personas

| Persona | Description |
|---------|-------------|
| **Client** | Diner au restaurant |
| **Gerant** | Proprietaire/manager du restaurant |
| **Cuisinier** | Personnel cuisine |
| **Serveur** | Personnel salle |
| **Super-Admin** | Adam — administrateur de la plateforme |

## Repartition

| Module | Stories | Priorite |
|--------|---------|----------|
| 1. Menu QR + Commande + Paiement | US-001 → US-020 | P0-P1 |
| 2. Roue Cadeaux + Avis | US-021 → US-040 | P0-P1 |
| 3. Site Web + SEO | US-041 → US-060 | P1-P2 |
| 4. Google Maps & GMB | US-061 → US-075 | P2 |
| 5. Social Media Automation | US-076 → US-090 | P2-P3 |
| Transverse : Billing, Admin, Compliance | US-091 → US-100 | P2-P3 |

---

# Module 1 : Menu QR + Commande + Paiement

---

### US-001 : Scanner le QR code de table pour acceder au menu digital
**Persona** : Client
**Module** : 1
**Priorite** : P0
**Story** : En tant que client, je veux scanner un QR code pose sur ma table pour acceder directement au menu digital du restaurant sans telecharger d'application.
**Criteres d'acceptation** :
- [ ] Le scan du QR code ouvre le menu dans le navigateur mobile avec identification automatique du numero de table
- [ ] Le menu s'affiche en moins de 2 secondes sur connexion 4G
- [ ] Le QR code redirige vers une URL unique par table (ex: `/r/{restaurant_slug}/table/{numero}`)

---

### US-002 : Consulter les categories et plats du menu
**Persona** : Client
**Module** : 1
**Priorite** : P0
**Story** : En tant que client, je veux parcourir le menu organise par categories (entrees, plats, desserts, boissons) pour choisir ce que je veux commander.
**Criteres d'acceptation** :
- [ ] Les categories s'affichent avec navigation par onglets ou scroll ancre
- [ ] Chaque plat affiche son nom, sa photo, sa description, son prix et ses allergenes
- [ ] Les allergenes sont affiches sous forme d'icones normalisees (gluten, lactose, arachides, etc.)

---

### US-003 : Afficher le menu en plusieurs langues
**Persona** : Client
**Module** : 1
**Priorite** : P1
**Story** : En tant que client, je veux changer la langue du menu (francais, anglais, arabe) pour comprendre les plats dans ma langue.
**Criteres d'acceptation** :
- [ ] Un selecteur de langue est visible en haut du menu avec drapeaux (FR/EN/AR)
- [ ] Le changement de langue traduit les noms de plats, descriptions et categories sans recharger la page
- [ ] La langue arabe s'affiche en mode RTL (droite a gauche) avec mise en page adaptee

---

### US-004 : Ajouter des plats au panier et modifier les quantites
**Persona** : Client
**Module** : 1
**Priorite** : P0
**Story** : En tant que client, je veux ajouter des plats a mon panier et ajuster les quantites pour preparer ma commande.
**Criteres d'acceptation** :
- [ ] Un bouton "Ajouter" est present sur chaque plat disponible
- [ ] Le panier affiche le nombre d'articles et le total en temps reel via un badge flottant
- [ ] Je peux augmenter, diminuer ou supprimer un article depuis le panier
- [ ] Je peux ajouter une note speciale par article (ex: "sans oignons", "bien cuit")

---

### US-005 : Passer commande depuis le telephone
**Persona** : Client
**Module** : 1
**Priorite** : P0
**Story** : En tant que client, je veux valider mon panier et envoyer ma commande a la cuisine directement depuis mon telephone.
**Criteres d'acceptation** :
- [ ] Un bouton "Commander" recapitule les articles, le total et le numero de table
- [ ] La commande est enregistree en base de donnees avec le statut "en_attente"
- [ ] Un ecran de confirmation s'affiche avec le numero de commande et le temps d'attente estime

---

### US-006 : Recevoir les commandes en temps reel sur le KDS cuisine
**Persona** : Cuisinier
**Module** : 1
**Priorite** : P0
**Story** : En tant que cuisinier, je veux voir les nouvelles commandes apparaitre en temps reel sur l'ecran cuisine pour commencer la preparation immediatement.
**Criteres d'acceptation** :
- [ ] Les commandes apparaissent sur le KDS en moins de 2 secondes via Supabase Realtime
- [ ] Chaque commande affiche le numero de table, les articles, les notes speciales et l'heure de reception
- [ ] Une alerte sonore et une vibration se declenchent a chaque nouvelle commande

---

### US-007 : Gerer le statut des commandes sur le KDS
**Persona** : Cuisinier
**Module** : 1
**Priorite** : P0
**Story** : En tant que cuisinier, je veux changer le statut d'une commande (en attente, confirmee, en preparation, prete, livree) pour informer le serveur et le client.
**Criteres d'acceptation** :
- [ ] Un clic ou swipe sur une commande fait avancer son statut a l'etape suivante
- [ ] Les commandes sont colorees par statut (jaune = en attente, bleu = en preparation, vert = prete)
- [ ] Le changement de statut est propage en temps reel au client et au serveur

---

### US-008 : Suivre le statut de ma commande en temps reel
**Persona** : Client
**Module** : 1
**Priorite** : P1
**Story** : En tant que client, je veux suivre l'avancement de ma commande sur mon telephone pour savoir quand elle sera prete.
**Criteres d'acceptation** :
- [ ] Une page de suivi affiche une barre de progression avec les etapes (en attente → confirmee → en preparation → prete → livree)
- [ ] Le statut se met a jour en temps reel sans rafraichir la page
- [ ] Une notification push ou visuelle m'alerte quand ma commande est prete

---

### US-009 : Payer par carte, Apple Pay ou Google Pay via Stripe
**Persona** : Client
**Module** : 1
**Priorite** : P1
**Story** : En tant que client, je veux payer ma commande directement depuis mon telephone avec ma carte bancaire, Apple Pay ou Google Pay.
**Criteres d'acceptation** :
- [ ] La page de paiement integre Stripe Checkout avec les options carte, Apple Pay et Google Pay
- [ ] Le paiement est securise (HTTPS, tokenisation Stripe, pas de stockage de donnees bancaires)
- [ ] Un recu numerique est affiche apres paiement avec le detail de la commande et le montant

---

### US-010 : Choisir de payer plus tard avec le serveur
**Persona** : Client
**Module** : 1
**Priorite** : P1
**Story** : En tant que client, je veux choisir l'option "Payer au serveur" pour regler en especes ou par carte au moment de l'addition.
**Criteres d'acceptation** :
- [ ] Un bouton "Payer au serveur" est disponible a cote de l'option paiement en ligne
- [ ] La commande est marquee "paiement_en_attente" et visible dans le dashboard serveur
- [ ] Le serveur peut marquer la commande comme "payee" depuis son interface

---

### US-011 : Afficher des suggestions d'upselling automatiques
**Persona** : Client
**Module** : 1
**Priorite** : P2
**Story** : En tant que client, je veux recevoir des suggestions pertinentes (dessert, boisson, supplement) avant de valider ma commande pour completer mon repas.
**Criteres d'acceptation** :
- [ ] Un encart "Voulez-vous ajouter ?" s'affiche au moment du recapitulatif panier
- [ ] Les suggestions sont configurables par le gerant (ex: dessert si commande plat, cafe si commande dessert)
- [ ] Le client peut ajouter une suggestion au panier en un clic

---

### US-012 : Commander en mode hotel (room service)
**Persona** : Client
**Module** : 1
**Priorite** : P2
**Story** : En tant que client d'hotel, je veux saisir mon numero de chambre pour commander un room service depuis le menu digital.
**Criteres d'acceptation** :
- [ ] Un champ "Numero de chambre" remplace le numero de table quand le mode hotel est active
- [ ] La commande est associee au numero de chambre et affichee sur le KDS avec la mention "Room Service"
- [ ] Le gerant peut activer/desactiver le mode hotel depuis le dashboard

---

### US-013 : Consulter les statistiques par table
**Persona** : Gerant
**Module** : 1
**Priorite** : P2
**Story** : En tant que gerant, je veux voir les statistiques par table (panier moyen, heures de pointe, nombre de commandes) pour optimiser mon service.
**Criteres d'acceptation** :
- [ ] Un tableau de bord affiche le panier moyen, le nombre de commandes et le CA par table
- [ ] Un graphique montre les heures de pointe (nombre de commandes par tranche horaire)
- [ ] Les donnees sont filtrables par periode (aujourd'hui, semaine, mois)

---

### US-014 : Vue multi-tables pour le serveur
**Persona** : Serveur
**Module** : 1
**Priorite** : P1
**Story** : En tant que serveur, je veux voir en un coup d'oeil l'etat de toutes mes tables pour savoir quelles commandes sont pretes et lesquelles attendent.
**Criteres d'acceptation** :
- [ ] Un plan de salle ou une liste affiche toutes les tables avec un code couleur par statut
- [ ] Je peux cliquer sur une table pour voir le detail de la commande en cours
- [ ] Les commandes marquees "prete" clignotent ou sont mises en avant visuellement

---

### US-015 : Marquer un plat comme indisponible en temps reel
**Persona** : Gerant
**Module** : 1
**Priorite** : P0
**Story** : En tant que gerant ou cuisinier, je veux marquer un plat comme indisponible ("86") pour qu'il ne soit plus commandable par les clients.
**Criteres d'acceptation** :
- [ ] Un toggle "Disponible / Indisponible" est accessible depuis le dashboard et le KDS
- [ ] Le plat marque indisponible s'affiche grise avec la mention "Epuise" cote client en temps reel
- [ ] Le plat indisponible ne peut pas etre ajoute au panier

---

### US-016 : Gerer les categories et plats du menu depuis le dashboard
**Persona** : Gerant
**Module** : 1
**Priorite** : P0
**Story** : En tant que gerant, je veux creer, modifier et supprimer des categories et des plats depuis le dashboard pour tenir mon menu a jour.
**Criteres d'acceptation** :
- [ ] Je peux creer une categorie avec un nom, un ordre d'affichage et une icone
- [ ] Je peux creer un plat avec nom, description, prix, allergenes et categorie associee
- [ ] Les modifications sont visibles immediatement sur le menu client sans deploiement
- [ ] Je peux reorganiser l'ordre des categories et des plats par glisser-deposer

---

### US-017 : Voir et gerer les commandes depuis le dashboard
**Persona** : Gerant
**Module** : 1
**Priorite** : P0
**Story** : En tant que gerant, je veux consulter la liste de toutes les commandes et filtrer par statut, date ou table pour suivre l'activite du restaurant.
**Criteres d'acceptation** :
- [ ] La page commandes affiche la liste en temps reel avec numero, table, montant, statut et heure
- [ ] Des filtres permettent de trier par statut (en cours, terminees, annulees) et par date
- [ ] Je peux cliquer sur une commande pour voir le detail des articles et les notes

---

### US-018 : Generer les QR codes par table
**Persona** : Gerant
**Module** : 1
**Priorite** : P0
**Story** : En tant que gerant, je veux generer et telecharger un QR code unique pour chaque table pour que mes clients accedent au menu.
**Criteres d'acceptation** :
- [ ] Une page du dashboard permet de definir le nombre de tables et generer les QR codes
- [ ] Chaque QR code est telechargeable individuellement en PNG haute resolution
- [ ] Un bouton "Telecharger tous les QR codes" genere un ZIP avec tous les QR codes etiquetes par numero de table

---

### US-019 : Uploader des photos pour les plats du menu
**Persona** : Gerant
**Module** : 1
**Priorite** : P0
**Story** : En tant que gerant, je veux uploader des photos de mes plats pour que le menu soit visuellement attractif.
**Criteres d'acceptation** :
- [ ] Le formulaire de creation/edition de plat permet d'uploader une image (JPG, PNG, WebP)
- [ ] L'image est stockee sur Supabase Storage et optimisee automatiquement (compression, redimensionnement)
- [ ] Un apercu de l'image s'affiche avant validation

---

### US-020 : Recevoir des notifications sonores sur le KDS
**Persona** : Cuisinier
**Module** : 1
**Priorite** : P0
**Story** : En tant que cuisinier, je veux entendre une alerte sonore et sentir une vibration quand une nouvelle commande arrive pour ne rien manquer pendant le rush.
**Criteres d'acceptation** :
- [ ] Un son d'alerte distinct se joue a chaque nouvelle commande recue
- [ ] Le telephone ou la tablette vibre si l'appareil le supporte (API Vibration)
- [ ] Le cuisinier peut choisir le volume et le type de son dans les parametres du KDS

---

# Module 2 : Roue Cadeaux + Avis

---

### US-021 : Acceder au parcours avis via QR code apres le repas
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux scanner un QR code sur l'addition ou la table pour acceder au formulaire d'avis apres mon repas.
**Criteres d'acceptation** :
- [ ] Le scan du QR code ouvre la page d'avis dans le navigateur avec identification du restaurant
- [ ] La page se charge en moins de 2 secondes et s'affiche correctement sur mobile
- [ ] Le parcours est accessible sans creation de compte prealable

---

### US-022 : S'authentifier via Google OAuth pour laisser un avis verifie
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux me connecter avec mon compte Google pour que mon avis soit verifie et credible.
**Criteres d'acceptation** :
- [ ] Un bouton "Continuer avec Google" lance le flux OAuth Google
- [ ] Le nom et l'email du client sont recuperes automatiquement apres authentification
- [ ] L'avis est marque comme "verifie" avec un badge visible

---

### US-023 : Integrer l'authentification Trustpilot
**Persona** : Client
**Module** : 2
**Priorite** : P2
**Story** : En tant que client, je veux m'authentifier via Trustpilot pour que mon avis soit egalement publie sur cette plateforme.
**Criteres d'acceptation** :
- [ ] Un bouton "Continuer avec Trustpilot" est disponible en alternative a Google OAuth
- [ ] L'API Trustpilot est utilisee pour verifier l'identite du client
- [ ] L'avis est publie simultanement sur la plateforme Restaurant Avis et sur Trustpilot

---

### US-024 : Laisser une note etoilee et un commentaire
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux donner une note de 1 a 5 etoiles et ecrire un commentaire pour partager mon experience.
**Criteres d'acceptation** :
- [ ] Un systeme de 5 etoiles cliquables est affiche avec animation au clic
- [ ] Un champ texte permet d'ecrire un commentaire (minimum 10 caracteres, maximum 500)
- [ ] Le bouton "Envoyer" est desactive tant que la note n'est pas selectionnee

---

### US-025 : Tourner la roue de cadeaux animee
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux tourner une roue de cadeaux animee apres avoir soumis mon avis pour tenter de gagner une recompense.
**Criteres d'acceptation** :
- [ ] La roue s'affiche avec les segments de cadeaux colores et animes (CSS/Canvas)
- [ ] L'animation de rotation dure entre 3 et 5 secondes avec un ralentissement progressif
- [ ] Le resultat est determine cote serveur avant l'animation pour eviter toute manipulation

---

### US-026 : Configurer les cadeaux de la roue
**Persona** : Gerant
**Module** : 2
**Priorite** : P0
**Story** : En tant que gerant, je veux configurer les cadeaux de la roue (nom, description, probabilite, couleur, icone) pour personnaliser les recompenses.
**Criteres d'acceptation** :
- [ ] Un formulaire permet de creer/modifier chaque segment : nom, description, probabilite (%), couleur et icone
- [ ] La somme des probabilites doit egaler 100%, avec validation en temps reel
- [ ] Un apercu de la roue se met a jour en direct lors de la configuration

---

### US-027 : Bloquer les abus (1 spin par compte Google par restaurant)
**Persona** : Gerant
**Module** : 2
**Priorite** : P0
**Story** : En tant que gerant, je veux que chaque client ne puisse tourner la roue qu'une seule fois par restaurant pour eviter les abus.
**Criteres d'acceptation** :
- [ ] Le systeme verifie en base l'identifiant Google du client avant d'autoriser le spin
- [ ] Si le client a deja joue, un message "Vous avez deja participe" s'affiche avec le cadeau gagne precedemment
- [ ] La verification est faite cote serveur pour empecher le contournement

---

### US-028 : Envoyer un rappel SMS 2h apres la visite
**Persona** : Client
**Module** : 2
**Priorite** : P2
**Story** : En tant que client n'ayant pas laisse d'avis, je veux recevoir un SMS de rappel 2h apres ma visite pour me rappeler de donner mon avis et tourner la roue.
**Criteres d'acceptation** :
- [ ] Un workflow n8n declenche l'envoi d'un SMS via Twilio 2 heures apres la commande si aucun avis n'a ete soumis
- [ ] Le SMS contient un lien direct vers la page d'avis du restaurant
- [ ] Le client peut repondre "STOP" pour se desinscrire conformement a la reglementation RGPD

---

### US-029 : Afficher le cadeau gagne avec animation confetti
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux voir le cadeau que j'ai gagne revele avec une animation confetti pour une experience memorable.
**Criteres d'acceptation** :
- [ ] Apres l'arret de la roue, le cadeau gagne s'affiche en grand avec une animation de confetti
- [ ] Le nom, la description et l'icone du cadeau sont affiches clairement
- [ ] L'animation est fluide (60fps) et s'affiche correctement sur tous les mobiles

---

### US-030 : Presenter le bon cadeau au serveur
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux afficher un bon cadeau sur mon ecran a presenter au serveur pour reclamer ma recompense.
**Criteres d'acceptation** :
- [ ] Un ecran "Presentez au serveur" affiche le cadeau gagne avec un design type voucher
- [ ] Un code unique et un QR code de validation sont generes pour eviter les captures d'ecran frauduleuses
- [ ] Le serveur peut valider le bon depuis son interface, ce qui le marque comme "utilise"

---

### US-031 : Configurer les cadeaux et probabilites depuis le dashboard
**Persona** : Gerant
**Module** : 2
**Priorite** : P0
**Story** : En tant que gerant, je veux ajuster les probabilites et activer/desactiver certains cadeaux depuis le dashboard pour gerer mon budget promotionnel.
**Criteres d'acceptation** :
- [ ] Chaque cadeau peut etre active ou desactive via un toggle sans le supprimer
- [ ] Les probabilites sont recalculees automatiquement quand un cadeau est desactive
- [ ] Un historique des modifications est conserve pour tracer les changements

---

### US-032 : Consulter tous les avis recus depuis le dashboard
**Persona** : Gerant
**Module** : 2
**Priorite** : P0
**Story** : En tant que gerant, je veux consulter la liste de tous les avis recus avec des filtres par date, note et statut pour suivre la satisfaction client.
**Criteres d'acceptation** :
- [ ] La page avis affiche la liste complete avec nom du client, note, commentaire, date et statut de verification
- [ ] Des filtres permettent de trier par periode, par note (1-5 etoiles) et par statut (verifie/non verifie)
- [ ] La note moyenne globale est affichee en haut de la page avec un graphique de repartition

---

### US-033 : Voir les analytics des spins de la roue
**Persona** : Gerant
**Module** : 2
**Priorite** : P1
**Story** : En tant que gerant, je veux consulter les statistiques de la roue (nombre total de spins, taux de conversion avis → spin, repartition des cadeaux) pour mesurer l'efficacite.
**Criteres d'acceptation** :
- [ ] Un dashboard affiche le nombre total de spins, le taux de conversion et le nombre de cadeaux distribues par type
- [ ] Un graphique camembert montre la repartition reelle des cadeaux vs les probabilites configurees
- [ ] Les metriques sont filtrables par periode (jour, semaine, mois)

---

### US-034 : Exporter les avis en CSV
**Persona** : Gerant
**Module** : 2
**Priorite** : P2
**Story** : En tant que gerant, je veux exporter la liste de mes avis en fichier CSV pour les analyser dans Excel ou les partager avec mon equipe.
**Criteres d'acceptation** :
- [ ] Un bouton "Exporter CSV" est disponible sur la page avis du dashboard
- [ ] Le fichier CSV contient les colonnes : date, nom client, email, note, commentaire, statut verification, cadeau gagne
- [ ] Les filtres actifs s'appliquent a l'export (seuls les avis filtres sont exportes)

---

### US-035 : Rediriger le client vers Google Maps pour poster son avis
**Persona** : Client
**Module** : 2
**Priorite** : P0
**Story** : En tant que client, je veux etre redirige vers la fiche Google Maps du restaurant pour y poster egalement mon avis et aider le restaurant dans son referencement.
**Criteres d'acceptation** :
- [ ] Apres la soumission de l'avis, un bouton "Poster aussi sur Google" ouvre la fiche Google Maps du restaurant
- [ ] Le lien Google Maps est configure par le gerant dans les parametres du dashboard
- [ ] La redirection s'ouvre dans un nouvel onglet sans interrompre le parcours de la roue

---

### US-036 : Poster un avis sur Trustpilot via l'API
**Persona** : Client
**Module** : 2
**Priorite** : P2
**Story** : En tant que client authentifie via Trustpilot, je veux que mon avis soit automatiquement publie sur Trustpilot pour renforcer la reputation en ligne du restaurant.
**Criteres d'acceptation** :
- [ ] L'avis est envoye a l'API Trustpilot Business avec la note et le commentaire
- [ ] En cas d'echec de l'API, l'avis est enregistre localement et une tentative de reenvoi est planifiee
- [ ] Le client est informe que son avis a ete publie sur Trustpilot avec un lien de confirmation

---

### US-037 : Respecter la conformite DGCCRF (cadeau non conditionne a un avis positif)
**Persona** : Gerant
**Module** : 2
**Priorite** : P0
**Story** : En tant que gerant, je veux que le systeme de roue cadeaux soit conforme a la reglementation DGCCRF pour eviter toute sanction legale.
**Criteres d'acceptation** :
- [ ] Le cadeau est attribue quelle que soit la note donnee (1, 2, 3, 4 ou 5 etoiles)
- [ ] Aucune difference de traitement (probabilites, cadeaux disponibles) n'existe entre un avis positif et negatif
- [ ] Une mention legale "Cadeau offert independamment de la note" est affichee sur la page de la roue

---

### US-038 : Recevoir une notification email quand un nouvel avis arrive
**Persona** : Gerant
**Module** : 2
**Priorite** : P1
**Story** : En tant que gerant, je veux recevoir un email a chaque nouvel avis soumis pour reagir rapidement, surtout en cas d'avis negatif.
**Criteres d'acceptation** :
- [ ] Un email est envoye a l'adresse du gerant dans les 30 secondes suivant la soumission d'un avis
- [ ] L'email contient la note, le commentaire, le nom du client et un lien direct vers le dashboard
- [ ] Le gerant peut activer/desactiver ces notifications et choisir de recevoir uniquement les avis en dessous de 3 etoiles

---

### US-039 : Analyser le sentiment des avis (positif/negatif/neutre)
**Persona** : Gerant
**Module** : 2
**Priorite** : P2
**Story** : En tant que gerant, je veux que chaque avis soit automatiquement classe par sentiment (positif, negatif, neutre) pour identifier rapidement les problemes.
**Criteres d'acceptation** :
- [ ] Un tag de sentiment (positif/negatif/neutre) est attribue automatiquement a chaque avis via analyse du texte
- [ ] Le dashboard permet de filtrer les avis par sentiment
- [ ] Un graphique montre l'evolution du sentiment sur les 30 derniers jours

---

### US-040 : Suivre les clients recurrents via leur numero de telephone
**Persona** : Gerant
**Module** : 2
**Priorite** : P2
**Story** : En tant que gerant, je veux identifier les clients recurrents via leur numero de telephone pour personnaliser leur experience et mesurer la fidelite.
**Criteres d'acceptation** :
- [ ] Le numero de telephone est collecte (optionnel, avec consentement RGPD) lors du parcours avis
- [ ] Le dashboard affiche le nombre de visites par client et la date de derniere visite
- [ ] Un indicateur "client fidele" (3+ visites) est visible sur la fiche client

---

# Module 3 : Site Web + SEO

---

### US-041 : Generation automatique du site web
**Persona** : Gerant
**Module** : 3
**Priorite** : P1
**Story** : En tant que gerant, je veux qu'un site web soit genere automatiquement a partir des donnees de mon profil restaurant pour avoir une presence en ligne sans effort technique.
**Criteres d'acceptation** :
- [ ] Le site est genere des que le gerant complete son profil (nom, adresse, telephone, horaires, description)
- [ ] Le site est accessible via une URL unique de type `slug.restaurantavis.fr`
- [ ] Toute modification du profil se repercute sur le site en moins de 60 secondes
- [ ] Le site genere contient au minimum les pages Accueil, Menu, Contact

---

### US-042 : Page d'accueil avec hero et CTA
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux voir une page d'accueil attractive avec une photo hero, la proposition de valeur du restaurant et un bouton "Reserver" pour comprendre rapidement l'offre et passer a l'action.
**Criteres d'acceptation** :
- [ ] La page affiche une image hero (photo uploadee par le gerant ou image par defaut)
- [ ] La proposition de valeur (description courte, type de cuisine, fourchette de prix) est visible sans scroller
- [ ] Un bouton CTA "Reserver" est present au-dessus de la ligne de flottaison et redirige vers la page de reservation
- [ ] Le temps de chargement de la page est inferieur a 3 secondes sur connexion 4G

---

### US-043 : Page menu auto-alimentee depuis le module QR
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux consulter le menu du restaurant sur le site web pour decider si je veux y manger avant de me deplacer.
**Criteres d'acceptation** :
- [ ] La page menu affiche les categories, plats, descriptions et prix issus du module QR Menu
- [ ] Les modifications du menu dans le module QR se synchronisent automatiquement sur le site
- [ ] Les allergenes et pictogrammes sont affiches pour chaque plat
- [ ] La page est navigable par categorie (entrees, plats, desserts, boissons)

---

### US-044 : Page de reservation avec integration Calendly
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux pouvoir reserver une table directement depuis le site web pour garantir ma place au restaurant.
**Criteres d'acceptation** :
- [ ] Le gerant peut configurer un lien Calendly ou activer le formulaire de reservation integre
- [ ] Le formulaire integre collecte : date, heure, nombre de couverts, nom, telephone, email
- [ ] Le gerant recoit une notification email a chaque nouvelle reservation
- [ ] Le client recoit un email de confirmation avec les details de sa reservation

---

### US-045 : Page galerie photos
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux voir des photos du restaurant, des plats et de l'ambiance pour me donner envie d'y aller.
**Criteres d'acceptation** :
- [ ] Le gerant peut uploader jusqu'a 50 photos organisees par categorie (plats, salle, equipe, evenements)
- [ ] Les images sont compressees automatiquement (WebP, max 500 Ko) pour ne pas ralentir le site
- [ ] La galerie s'affiche en grille responsive avec un mode lightbox au clic

---

### US-046 : Page avis agreges
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux lire les avis Google et Trustpilot directement sur le site du restaurant pour evaluer sa reputation sans quitter la page.
**Criteres d'acceptation** :
- [ ] Les avis Google et Trustpilot sont recuperes et affiches avec la note, le texte et la date
- [ ] La note moyenne globale est affichee en haut de la page avec le nombre total d'avis
- [ ] Les avis sont tries par defaut du plus recent au plus ancien avec possibilite de filtrer par note
- [ ] Les donnees sont mises a jour automatiquement toutes les 24 heures

---

### US-047 : Page contact avec Google Maps
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux trouver facilement l'adresse, les horaires et le numero de telephone du restaurant pour m'y rendre ou les contacter.
**Criteres d'acceptation** :
- [ ] La page affiche une carte Google Maps interactive avec le marqueur du restaurant
- [ ] Les horaires d'ouverture sont affiches jour par jour avec indication "Ouvert maintenant" / "Ferme"
- [ ] Le telephone est cliquable (tel:) et l'email est cliquable (mailto:)

---

### US-048 : Blog avec articles generes par IA
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux que des articles de blog soient generes automatiquement par IA pour ameliorer mon referencement sans y consacrer du temps.
**Criteres d'acceptation** :
- [ ] Le gerant peut demander la generation d'un article en fournissant un sujet ou un mot-cle
- [ ] L'article genere par GPT-4o fait entre 600 et 1200 mots, est structure avec des sous-titres H2/H3 et inclut le mot-cle cible
- [ ] Le gerant peut modifier l'article avant publication
- [ ] Chaque article genere un slug SEO-friendly et une meta description automatique

---

### US-049 : Planification et publication du blog
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux pouvoir planifier la publication de mes articles de blog pour maintenir un rythme regulier sans intervention manuelle.
**Criteres d'acceptation** :
- [ ] Le gerant peut choisir une date et une heure de publication pour chaque article
- [ ] Les articles planifies apparaissent dans un calendrier editorial dans le dashboard
- [ ] L'article est publie automatiquement a la date prevue et apparait sur le site

---

### US-050 : Donnees structurees Schema.org Restaurant
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux que le restaurant apparaisse avec des informations riches (note, horaires, fourchette de prix) directement dans les resultats Google pour m'aider a choisir rapidement.
**Criteres d'acceptation** :
- [ ] Le balisage JSON-LD `Restaurant` est present sur chaque page du site avec les champs : name, address, telephone, openingHours, priceRange, servesCuisine
- [ ] Le balisage `AggregateRating` est inclus lorsque des avis sont disponibles
- [ ] Le test Google Rich Results Validator ne retourne aucune erreur

---

### US-051 : Meta titles et descriptions dynamiques
**Persona** : Gerant
**Module** : 3
**Priorite** : P1
**Story** : En tant que gerant, je veux que chaque page de mon site ait un titre et une description uniques et optimises pour apparaitre correctement dans les resultats de recherche.
**Criteres d'acceptation** :
- [ ] Chaque page genere automatiquement un meta title (<60 caracteres) et une meta description (<155 caracteres) a partir des donnees du restaurant
- [ ] Le gerant peut personnaliser le meta title et la meta description de chaque page depuis le dashboard
- [ ] Les balises `<title>` et `<meta name="description">` sont presentes dans le HTML rendu

---

### US-052 : Generation automatique du sitemap.xml
**Persona** : Super-Admin
**Module** : 3
**Priorite** : P1
**Story** : En tant que super-admin, je veux qu'un fichier sitemap.xml soit genere automatiquement pour chaque site restaurant pour faciliter l'indexation par Google.
**Criteres d'acceptation** :
- [ ] Le sitemap.xml est genere dynamiquement et liste toutes les pages publiques du site
- [ ] Le sitemap est mis a jour automatiquement lors de l'ajout ou la suppression de pages (articles de blog notamment)
- [ ] Le sitemap est accessible a l'URL `/sitemap.xml` et reference dans le fichier `robots.txt`

---

### US-053 : Optimisation Core Web Vitals
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client, je veux que le site du restaurant se charge rapidement et soit fluide pour ne pas quitter la page par frustration.
**Criteres d'acceptation** :
- [ ] Le score Lighthouse Performance est superieur a 85 sur mobile
- [ ] Le LCP (Largest Contentful Paint) est inferieur a 2.5 secondes
- [ ] Le CLS (Cumulative Layout Shift) est inferieur a 0.1
- [ ] Les images sont servies en format WebP avec lazy loading

---

### US-054 : Balises Open Graph pour le partage social
**Persona** : Client
**Module** : 3
**Priorite** : P2
**Story** : En tant que client, je veux que le lien du restaurant s'affiche avec une belle image et un titre attractif quand je le partage sur les reseaux sociaux pour donner envie a mes amis.
**Criteres d'acceptation** :
- [ ] Les balises `og:title`, `og:description`, `og:image` et `og:url` sont presentes sur chaque page
- [ ] L'image Open Graph est generee automatiquement (logo + nom du restaurant) si aucune image personnalisee n'est fournie
- [ ] Le rendu est correct sur Facebook, WhatsApp et Twitter (valide via les outils de debug respectifs)

---

### US-055 : Support de domaine personnalise
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux pouvoir connecter mon propre nom de domaine a mon site restaurant pour renforcer mon image de marque.
**Criteres d'acceptation** :
- [ ] Le gerant peut saisir un nom de domaine personnalise dans les parametres du dashboard
- [ ] Le systeme fournit les enregistrements DNS (CNAME) a configurer chez le registrar
- [ ] Le certificat SSL est provisionne automatiquement via Let's Encrypt dans les 10 minutes suivant la configuration DNS
- [ ] Par defaut, le site reste accessible sur le sous-domaine `slug.restaurantavis.fr`

---

### US-056 : Design responsive mobile-first
**Persona** : Client
**Module** : 3
**Priorite** : P1
**Story** : En tant que client sur mobile, je veux que le site du restaurant soit parfaitement lisible et navigable sur mon smartphone pour consulter le menu ou reserver en deplacement.
**Criteres d'acceptation** :
- [ ] Toutes les pages s'adaptent correctement aux ecrans de 320px a 1920px
- [ ] La navigation mobile utilise un menu hamburger avec une animation fluide
- [ ] Les boutons CTA ont une taille minimale de 44x44px pour etre facilement cliquables au doigt

---

### US-057 : Integration Google Ads geo-cible
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux lancer des campagnes Google Ads ciblees sur ma zone geographique pour attirer des clients proches de mon restaurant.
**Criteres d'acceptation** :
- [ ] Le gerant peut connecter son compte Google Ads depuis le dashboard
- [ ] Le systeme propose des campagnes pre-configurees avec ciblage geographique (rayon de 5 a 20 km autour du restaurant)
- [ ] Le dashboard affiche les metriques cles : impressions, clics, cout, conversions (reservations)

---

### US-058 : Pixel de remarketing pour visiteurs QR menu
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux cibler en publicite les clients qui ont deja scanne mon QR menu pour les inciter a revenir.
**Criteres d'acceptation** :
- [ ] Un pixel Facebook et/ou Google est installe automatiquement sur le site et la page QR menu
- [ ] Une audience de remarketing est creee automatiquement a partir des visiteurs du QR menu
- [ ] Le gerant peut activer/desactiver le tracking depuis le dashboard en conformite RGPD

---

### US-059 : Suivi de positionnement SEO par mots-cles
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux suivre le classement de mon site sur les mots-cles importants (ex: "restaurant italien Paris 11") pour mesurer l'efficacite de mon referencement.
**Criteres d'acceptation** :
- [ ] Le gerant peut definir jusqu'a 10 mots-cles a suivre
- [ ] Le positionnement est verifie automatiquement chaque semaine et affiche sous forme de graphique d'evolution
- [ ] Une notification est envoyee lorsque le site entre dans le top 10 ou perd plus de 5 positions

---

### US-060 : Rapport mensuel de performance SEO
**Persona** : Gerant
**Module** : 3
**Priorite** : P2
**Story** : En tant que gerant, je veux recevoir chaque mois un rapport de performance SEO de mon site pour comprendre ce qui fonctionne et ce qui doit etre ameliore.
**Criteres d'acceptation** :
- [ ] Le rapport est genere automatiquement le 1er de chaque mois et envoye par email au gerant
- [ ] Le rapport inclut : visites organiques, pages les plus vues, positionnement des mots-cles, score Lighthouse, nombre d'avis recus
- [ ] Le rapport est egalement consultable dans le dashboard sous forme de page dediee

---

# Module 4 : Google Maps & GMB

---

### US-061 : Connexion a l'API Google My Business
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux connecter mon compte Google My Business a la plateforme pour gerer ma fiche directement depuis mon dashboard.
**Criteres d'acceptation** :
- [ ] Le gerant peut se connecter via OAuth Google avec les permissions GMB (Business Profile API)
- [ ] La plateforme recupere et affiche les informations de la fiche GMB (nom, adresse, horaires, categorie, photos)
- [ ] En cas d'erreur de connexion ou d'expiration du token, le gerant recoit une notification avec les etapes pour se reconnecter

---

### US-062 : Completude a 100% du profil GMB
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux etre guide pour completer ma fiche Google My Business a 100% pour maximiser ma visibilite dans les recherches locales.
**Criteres d'acceptation** :
- [ ] Le dashboard affiche un indicateur de completude en pourcentage avec une checklist des champs manquants
- [ ] Les champs couverts incluent : horaires, categories, photos (min 10), attributs (Wi-Fi, terrasse, accessibilite), description, lien de reservation
- [ ] Le gerant peut modifier chaque champ depuis le dashboard et la modification est synchronisee avec GMB via l'API
- [ ] Une notification est envoyee lorsque le profil atteint 100%

---

### US-063 : Publications hebdomadaires automatisees via n8n
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux que des publications soient postees automatiquement chaque semaine sur ma fiche Google pour maintenir mon profil actif sans effort.
**Criteres d'acceptation** :
- [ ] Un workflow n8n genere et publie un post GMB chaque semaine (jour et heure configurables)
- [ ] Le contenu du post est genere par GPT-4o a partir du profil restaurant (type de cuisine, plats populaires, evenements)
- [ ] Le gerant peut pre-approuver ou modifier le post avant publication depuis le dashboard

---

### US-064 : Templates de contenu saisonnier
**Persona** : Gerant
**Module** : 4
**Priorite** : P2
**Story** : En tant que gerant, je veux disposer de modeles de publications saisonnieres pour communiquer sur mes promotions, nouveaux plats et evenements sans effort de redaction.
**Criteres d'acceptation** :
- [ ] La plateforme propose au moins 20 templates classes par categorie : promotions, nouveaux plats, evenements, fetes (Noel, Saint-Valentin, Ramadan, etc.)
- [ ] Chaque template est personnalisable avec les donnees du restaurant (nom, plat vedette, prix)
- [ ] Le gerant peut planifier la publication d'un template a une date precise

---

### US-065 : Reponses automatiques aux avis par IA
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux que l'IA genere automatiquement des reponses personnalisees a chaque avis Google recu pour montrer aux clients que je suis a l'ecoute sans y passer des heures.
**Criteres d'acceptation** :
- [ ] Des que un nouvel avis est detecte, GPT-4o genere une reponse adaptee au contenu et au ton de l'avis
- [ ] La reponse generee est en francais, polie, professionnelle et fait entre 50 et 150 mots
- [ ] La reponse mentionne le prenom du client et fait reference a un element specifique de l'avis
- [ ] La reponse n'est jamais publiee automatiquement sans validation (cf. US-066)

---

### US-066 : Pre-approbation des reponses IA par le staff
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux valider ou modifier chaque reponse generee par l'IA avant qu'elle soit publiee pour garder le controle sur ma communication.
**Criteres d'acceptation** :
- [ ] Les reponses en attente de validation sont listees dans le dashboard avec les boutons "Approuver", "Modifier" et "Rejeter"
- [ ] Le gerant recoit une notification (email ou push) lorsqu'une nouvelle reponse est en attente
- [ ] Une fois approuvee, la reponse est publiee sur Google via l'API dans les 5 minutes
- [ ] Si aucune action n'est prise sous 48h, un rappel est envoye

---

### US-067 : Templates de reponses par type d'avis
**Persona** : Gerant
**Module** : 4
**Priorite** : P2
**Story** : En tant que gerant, je veux disposer de modeles de reponses adaptes selon le type d'avis (positif, negatif, neutre) pour accelerer la validation et garantir un ton adapte.
**Criteres d'acceptation** :
- [ ] La plateforme propose au moins 5 templates par type d'avis (positif 4-5 etoiles, neutre 3 etoiles, negatif 1-2 etoiles)
- [ ] L'IA utilise le template adapte comme base et le personnalise avec le contenu de l'avis
- [ ] Le gerant peut creer, modifier et supprimer ses propres templates personnalises

---

### US-068 : Analyse de sentiment des avis
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux voir une analyse de sentiment de mes avis pour identifier rapidement les points forts et les axes d'amelioration de mon restaurant.
**Criteres d'acceptation** :
- [ ] Chaque avis recoit un score de sentiment (positif, neutre, negatif) et des themes extraits (nourriture, service, ambiance, prix, attente)
- [ ] Le dashboard affiche un graphique d'evolution du sentiment sur les 12 derniers mois
- [ ] Les themes negatifs recurrents sont mis en avant avec des alertes si un theme depasse 3 mentions negatives en 30 jours

---

### US-069 : Suivi du positionnement local par mots-cles
**Persona** : Gerant
**Module** : 4
**Priorite** : P2
**Story** : En tant que gerant, je veux suivre le classement de mon restaurant sur Google Maps pour les mots-cles locaux (ex: "pizzeria Bastille") pour mesurer ma visibilite locale.
**Criteres d'acceptation** :
- [ ] Le gerant peut definir jusqu'a 10 mots-cles locaux a suivre
- [ ] Le classement Google Maps (Local Pack et Maps) est verifie chaque semaine et affiche sous forme de graphique
- [ ] Une alerte est envoyee si le restaurant sort du top 5 pour un mot-cle suivi

---

### US-070 : Analyse concurrentielle des restaurants proches
**Persona** : Gerant
**Module** : 4
**Priorite** : P2
**Story** : En tant que gerant, je veux voir comment mon restaurant se compare aux concurrents proches sur Google Maps pour identifier des opportunites de differentiation.
**Criteres d'acceptation** :
- [ ] Le systeme identifie automatiquement les 5 concurrents les plus proches dans la meme categorie de cuisine
- [ ] Le dashboard affiche un tableau comparatif : note moyenne, nombre d'avis, frequence de publication, temps de reponse aux avis
- [ ] Les donnees sont mises a jour automatiquement chaque semaine

---

### US-071 : Rapport mensuel de visibilite Google
**Persona** : Gerant
**Module** : 4
**Priorite** : P1
**Story** : En tant que gerant, je veux recevoir chaque mois un rapport de visibilite Google pour comprendre combien de clients me trouvent via Google et quelles actions generent le plus de trafic.
**Criteres d'acceptation** :
- [ ] Le rapport inclut : impressions dans la recherche, vues de la fiche, clics sur le telephone, clics sur l'itineraire, clics sur le site web
- [ ] Le rapport compare les donnees au mois precedent avec des indicateurs de tendance (hausse/baisse en %)
- [ ] Le rapport est envoye par email le 1er du mois et consultable dans le dashboard

---

### US-072 : Optimisation des photos pour Google Maps
**Persona** : Gerant
**Module** : 4
**Priorite** : P2
**Story** : En tant que gerant, je veux que mes photos soient optimisees et publiees sur Google Maps pour attirer plus de clients visuellement.
**Criteres d'acceptation** :
- [ ] La plateforme redimensionne et compresse les photos au format optimal pour GMB (720x540px minimum, max 5 Mo)
- [ ] Le gerant peut uploader des photos depuis le dashboard et elles sont publiees sur GMB via l'API
- [ ] Le dashboard affiche les statistiques de vues par photo pour identifier les visuels les plus performants

---

### US-073 : Gestion des campagnes Google Ads locales
**Persona** : Gerant
**Module** : 4
**Priorite** : P2
**Story** : En tant que gerant, je veux lancer et gerer des campagnes Google Ads locales depuis mon dashboard pour attirer plus de clients dans ma zone geographique.
**Criteres d'acceptation** :
- [ ] Le gerant peut creer une campagne locale avec un budget journalier, un rayon de ciblage et des mots-cles suggeres
- [ ] Le dashboard affiche les performances en temps reel : impressions, clics, cout par clic, conversions
- [ ] Le systeme propose des recommandations d'optimisation basees sur les performances (ajustement d'encheres, nouveaux mots-cles)

---

### US-074 : Lien de reservation direct depuis Google Maps
**Persona** : Client
**Module** : 4
**Priorite** : P1
**Story** : En tant que client, je veux pouvoir reserver une table directement depuis la fiche Google Maps du restaurant pour simplifier mon parcours de reservation.
**Criteres d'acceptation** :
- [ ] Le lien de reservation dans la fiche GMB pointe vers la page de reservation du site genere (module 3) ou vers le QR menu
- [ ] Le lien est configure automatiquement via l'API GMB lors de la connexion du compte
- [ ] Le nombre de clics sur le lien de reservation est suivi et affiche dans le dashboard

---

### US-075 : Suivi du temps de reponse aux avis (SLA)
**Persona** : Super-Admin
**Module** : 4
**Priorite** : P1
**Story** : En tant que super-admin, je veux suivre le temps de reponse moyen aux avis de chaque restaurant pour garantir un niveau de service optimal et identifier les gerants inactifs.
**Criteres d'acceptation** :
- [ ] Le dashboard admin affiche le temps moyen de reponse aux avis par restaurant (objectif SLA : < 24h)
- [ ] Les restaurants depassant le SLA de 48h sont signales en rouge avec une alerte automatique au gerant
- [ ] Un rapport hebdomadaire est envoye au super-admin avec le classement des restaurants par reactivite
- [ ] Le gerant voit son propre temps de reponse moyen dans son dashboard avec un indicateur vert/orange/rouge

---

# Module 5 : Social Media Automation

---

### US-076 : Connexion Instagram Graph API
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux connecter mon compte Instagram professionnel via l'API Graph pour pouvoir publier du contenu directement depuis la plateforme
**Criteres d'acceptation** :
- [ ] Le gerant peut lier son compte Instagram Business via OAuth Facebook
- [ ] Le token d'acces est stocke de maniere securisee et renouvele automatiquement
- [ ] Un indicateur affiche le statut de connexion (connecte/deconnecte/expire)
- [ ] La deconnexion revoque le token et supprime les donnees associees

---

### US-077 : Connexion page Facebook
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux connecter ma page Facebook professionnelle pour publier mes contenus sur Facebook en parallele d'Instagram
**Criteres d'acceptation** :
- [ ] Le gerant peut selectionner sa page Facebook parmi celles qu'il administre
- [ ] Les publications peuvent etre envoyees sur Facebook independamment d'Instagram
- [ ] Le gerant peut deconnecter sa page Facebook a tout moment

---

### US-078 : Integration TikTok
**Persona** : Gerant
**Module** : 5
**Priorite** : P3
**Story** : En tant que gerant, je veux connecter mon compte TikTok Business pour publier des videos courtes et toucher une audience plus jeune
**Criteres d'acceptation** :
- [ ] Le gerant peut lier son compte TikTok via OAuth
- [ ] L'upload de videos respecte les contraintes TikTok (duree, format, ratio)
- [ ] Un message d'erreur clair s'affiche si le compte n'est pas un compte Business

---

### US-079 : Pipeline video vers Reel vertical
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux uploader une video brute et obtenir automatiquement un Reel vertical optimise pour ne pas avoir a utiliser de logiciel de montage
**Criteres d'acceptation** :
- [ ] Le pipeline n8n + FFmpeg convertit toute video en format 9:16 (1080x1920)
- [ ] Le traitement ajoute un crop intelligent centre sur le sujet principal
- [ ] Le gerant recoit une notification quand le Reel est pret a valider
- [ ] Les formats acceptes sont MP4, MOV et AVI avec une limite de 500 Mo

---

### US-080 : Generation automatique de legendes IA
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux que la plateforme genere automatiquement une legende avec hashtags et appel a l'action pour chaque publication afin de gagner du temps sur la redaction
**Criteres d'acceptation** :
- [ ] GPT-4o genere une legende en francais adaptee au type de contenu (photo, video, story)
- [ ] La legende inclut 5 a 15 hashtags pertinents et un CTA clair
- [ ] Le gerant peut modifier la legende generee avant publication
- [ ] La generation prend en compte le nom du restaurant et sa localisation

---

### US-081 : Ton de communication configurable
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux choisir le ton de mes publications (ludique, professionnel, decale) pour que ma communication reflete l'identite de mon etablissement
**Criteres d'acceptation** :
- [ ] Trois presets de ton sont disponibles : ludique, professionnel, decale
- [ ] Le ton selectionne est applique a toutes les legendes generees par l'IA
- [ ] Le gerant peut changer de ton a tout moment dans les parametres

---

### US-082 : Systeme de templates de publications
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux utiliser des templates pre-concus (nouveau plat, evenement, promo, saison) pour creer des publications coherentes rapidement
**Criteres d'acceptation** :
- [ ] Au moins 4 categories de templates sont disponibles : nouveau plat, evenement, promotion, saisonnier
- [ ] Chaque template propose un visuel type et une structure de legende
- [ ] Le gerant peut previsualiser le resultat avant de valider
- [ ] Les templates s'adaptent aux couleurs et au logo du restaurant

---

### US-083 : Validation manuelle avant publication via Telegram
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux recevoir une notification Telegram avec un apercu de chaque publication et pouvoir l'approuver ou la refuser avant qu'elle soit publiee
**Criteres d'acceptation** :
- [ ] Un webhook Telegram envoie l'apercu (image/video + legende) au gerant
- [ ] Le gerant peut approuver, refuser ou demander une modification via des boutons inline
- [ ] Aucune publication n'est envoyee aux reseaux sociaux sans approbation explicite
- [ ] Un refus renvoie le contenu en brouillon avec le commentaire du gerant

---

### US-084 : Planification de publications par lot
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux planifier mes publications a l'avance aux meilleurs creneaux horaires pour maximiser l'engagement sans y penser au quotidien
**Criteres d'acceptation** :
- [ ] Un algorithme propose les meilleurs creneaux de publication selon les donnees d'engagement passees
- [ ] Le gerant peut planifier jusqu'a 30 publications a l'avance
- [ ] Le gerant peut modifier ou annuler une publication planifiee avant son envoi

---

### US-085 : Rapport mensuel d'engagement
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux recevoir chaque mois un rapport synthetique de mes performances sur les reseaux sociaux pour suivre ma progression
**Criteres d'acceptation** :
- [ ] Le rapport inclut : portee, impressions, nouveaux abonnes, taux d'engagement
- [ ] Les donnees sont presentees avec des graphiques comparatifs mois par mois
- [ ] Le rapport est accessible dans le dashboard et envoyable par email en PDF

---

### US-086 : Analyse des contenus les plus performants
**Persona** : Gerant
**Module** : 5
**Priorite** : P3
**Story** : En tant que gerant, je veux identifier mes publications les plus performantes pour comprendre ce qui plait a mon audience et reproduire ce succes
**Criteres d'acceptation** :
- [ ] Un classement des 10 meilleurs posts par engagement est affiche
- [ ] Chaque post affiche ses metriques detaillees (likes, commentaires, partages, sauvegardes)
- [ ] Des recommandations IA suggerent pourquoi ces contenus ont fonctionne

---

### US-087 : Calendrier de contenu
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux visualiser toutes mes publications passees et planifiees sur un calendrier pour avoir une vue d'ensemble de ma strategie de contenu
**Criteres d'acceptation** :
- [ ] Le calendrier affiche les publications par jour avec une vignette visuelle
- [ ] Le gerant peut glisser-deposer une publication pour changer sa date
- [ ] Les codes couleur distinguent les statuts : brouillon, planifie, publie, refuse

---

### US-088 : Recherche et suggestions de hashtags
**Persona** : Gerant
**Module** : 5
**Priorite** : P3
**Story** : En tant que gerant, je veux obtenir des suggestions de hashtags populaires et pertinents pour mon secteur afin d'augmenter la visibilite de mes publications
**Criteres d'acceptation** :
- [ ] La plateforme suggere des hashtags bases sur le contenu de la publication et la localisation
- [ ] Chaque hashtag affiche une estimation de sa popularite (volume de posts)
- [ ] Le gerant peut sauvegarder des groupes de hashtags favoris reutilisables

---

### US-089 : Benchmark concurrentiel sur les reseaux sociaux
**Persona** : Gerant
**Module** : 5
**Priorite** : P3
**Story** : En tant que gerant, je veux comparer mes performances sociales a celles de restaurants concurrents de ma zone pour situer mon positionnement
**Criteres d'acceptation** :
- [ ] Le gerant peut ajouter jusqu'a 5 comptes concurrents a surveiller
- [ ] Un tableau comparatif affiche : nombre d'abonnes, frequence de publication, engagement moyen
- [ ] Les donnees sont mises a jour de maniere hebdomadaire

---

### US-090 : Mediatheque photos et videos
**Persona** : Gerant
**Module** : 5
**Priorite** : P2
**Story** : En tant que gerant, je veux stocker et organiser mes photos et videos dans une mediatheque centralisee pour retrouver facilement mes visuels lors de la creation de publications
**Criteres d'acceptation** :
- [ ] Le gerant peut uploader des photos (JPG, PNG, WebP) et videos (MP4, MOV)
- [ ] Les medias sont organisables par dossiers et tags personnalises
- [ ] Une barre de recherche permet de retrouver un media par nom ou tag
- [ ] Le stockage est limite a 5 Go par restaurant sur le plan Essential

---

# Transverse : Billing, Admin, Compliance

---

### US-091 : Gestion des abonnements Stripe
**Persona** : Super-Admin
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que super-admin, je veux gerer les abonnements via Stripe avec les 4 plans (Essential, All-in-One, Growth, Full Pilotage) pour monetiser la plateforme
**Criteres d'acceptation** :
- [ ] Les 4 plans sont configures dans Stripe avec leurs prix respectifs
- [ ] Le changement de plan (upgrade/downgrade) est effectif immediatement avec prorata
- [ ] Les webhooks Stripe mettent a jour le statut d'abonnement en base en temps reel

---

### US-092 : Portail client facturation
**Persona** : Gerant
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que gerant, je veux acceder a un portail de facturation pour consulter mes factures, changer de plan ou resilier mon abonnement en toute autonomie
**Criteres d'acceptation** :
- [ ] Le gerant peut consulter et telecharger ses factures au format PDF
- [ ] Le gerant peut changer de plan sans contacter le support
- [ ] La resiliation prend effet a la fin de la periode de facturation en cours
- [ ] Un email de confirmation est envoye pour chaque action de facturation

---

### US-093 : Dashboard super-admin multi-restaurants
**Persona** : Super-Admin
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que super-admin, je veux voir tous les restaurants inscrits avec leurs metriques cles pour piloter la plateforme globalement
**Criteres d'acceptation** :
- [ ] Le dashboard affiche la liste de tous les restaurants avec : plan actif, date d'inscription, statut
- [ ] Des filtres permettent de trier par plan, date, statut de paiement
- [ ] Le super-admin peut acceder au dashboard de n'importe quel restaurant en lecture seule

---

### US-094 : Architecture multi-tenant avec RLS
**Persona** : Super-Admin
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que super-admin, je veux que chaque restaurant ne puisse acceder qu'a ses propres donnees pour garantir l'isolation et la securite des informations
**Criteres d'acceptation** :
- [ ] Les politiques RLS Supabase sont actives sur toutes les tables contenant des donnees restaurant
- [ ] Un restaurant ne peut jamais lire, modifier ou supprimer les donnees d'un autre restaurant
- [ ] Des tests automatises verifient l'isolation des donnees entre tenants

---

### US-095 : Onboarding self-service restaurant
**Persona** : Gerant
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que gerant, je veux pouvoir m'inscrire et configurer mon restaurant en autonomie via un parcours guide pour commencer a utiliser la plateforme sans assistance
**Criteres d'acceptation** :
- [ ] Le parcours d'inscription comprend : creation de compte, infos restaurant, choix du plan, paiement
- [ ] Un assistant pas-a-pas guide le gerant a travers la configuration initiale (horaires, logo, menu)
- [ ] Le gerant peut commencer a utiliser la plateforme en moins de 10 minutes
- [ ] Un email de bienvenue est envoye avec un recapitulatif et des liens utiles

---

### US-096 : Conformite RGPD
**Persona** : Client
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que client, je veux que mes donnees personnelles soient traitees conformement au RGPD pour exercer mes droits de consentement, d'acces et de suppression
**Criteres d'acceptation** :
- [ ] Un bandeau cookie conforme s'affiche au premier acces avec choix granulaire (necessaire, analytique, marketing)
- [ ] Une page de politique de confidentialite est accessible depuis toutes les pages
- [ ] Le client peut demander la suppression de ses donnees via un formulaire dedie
- [ ] Les donnees sont effectivement supprimees sous 30 jours apres la demande

---

### US-097 : Conformite DGCCRF
**Persona** : Super-Admin
**Module** : Transverse
**Priorite** : P2
**Story** : En tant que super-admin, je veux que la plateforme respecte les obligations DGCCRF pour eviter tout risque juridique lie aux pratiques commerciales et avis en ligne
**Criteres d'acceptation** :
- [ ] Les avis affiches ne peuvent pas etre modifies ou supprimes selectivement par le gerant
- [ ] Les mentions legales obligatoires sont presentes et accessibles (CGU, CGV, identite de l'editeur)
- [ ] Un mecanisme de signalement d'avis frauduleux est disponible pour les clients

---

### US-098 : Monitoring de performance
**Persona** : Super-Admin
**Module** : Transverse
**Priorite** : P3
**Story** : En tant que super-admin, je veux surveiller les performances techniques de la plateforme pour garantir une experience rapide et fiable aux utilisateurs
**Criteres d'acceptation** :
- [ ] Un score Lighthouse est calcule automatiquement chaque semaine pour les pages cles
- [ ] Un monitoring d'uptime alerte par email et Telegram si la plateforme est indisponible plus de 5 minutes
- [ ] Un tableau de bord affiche les metriques Core Web Vitals (LCP, FID, CLS) sur 30 jours

---

### US-099 : Support client par tickets
**Persona** : Gerant
**Module** : Transverse
**Priorite** : P3
**Story** : En tant que gerant, je veux soumettre des tickets de support depuis mon dashboard pour signaler un probleme ou poser une question et suivre la resolution
**Criteres d'acceptation** :
- [ ] Le gerant peut creer un ticket avec un sujet, une description et une capture d'ecran optionnelle
- [ ] Le gerant voit le statut de ses tickets (ouvert, en cours, resolu) dans son dashboard
- [ ] Le super-admin recoit une notification pour chaque nouveau ticket et peut y repondre

---

### US-100 : Option white-label
**Persona** : Gerant
**Module** : Transverse
**Priorite** : P3
**Story** : En tant que gerant, je veux pouvoir supprimer le branding "Restaurant Avis" de l'interface visible par mes clients pour presenter la plateforme comme un outil interne a mon etablissement
**Criteres d'acceptation** :
- [ ] Le gerant peut activer l'option white-label depuis les parametres de son compte
- [ ] Le logo, le nom et les couleurs de la plateforme sont remplaces par ceux du restaurant sur toutes les pages client
- [ ] L'option white-label est reservee aux plans Growth et Full Pilotage
- [ ] Un apercu en temps reel montre le rendu avant activation
