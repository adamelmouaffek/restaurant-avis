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
