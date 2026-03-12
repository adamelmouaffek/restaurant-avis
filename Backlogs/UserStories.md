# Restaurant Avis — User Stories

---

## MODULE 1 : Menu QR + Commande + Paiement

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

## MODULE 2 : Roue Cadeaux + Avis Authentiques

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
