# Gîte d’Esneux
Site vitrine statique, responsive, sans dépendance et sans collecte de données. Fichiers servis depuis public/.

## Publier sur Cloudflare Pages
Importer ce dépôt dans Workers & Pages → Create application → Pages → Import an existing Git repository.
- Branche de production : main
- Framework : None
- Commande de compilation : exit 0
- Dossier de sortie : public

Ne pas créer un projet Worker à la place d’un projet Pages.
Guide officiel : https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## Contenu et photos
Source : https://fr.airbnb.be/rooms/1450634688033262798
Vérification : 13 novembre 2026.
Capacité : 4 voyageurs, 2 chambres et 2 salles de bain. Jardin, terrasse couverte, cuisine, Wi-Fi, parking et animaux acceptés confirmés dans l’annonce.
Textes reformulés ; aucune note ni aucun prix variable recopié.
L’illustration de la page est abstraite et identifiée comme telle. Aucune photo de substitution n’est présentée comme une photo du logement.
À obtenir du propriétaire : photos originales autorisées (extérieur, séjour, chambres, salles de bain, jardin), légendes et textes alternatifs ; nom commercial définitif et informations légales de l’exploitant. Ne pas utiliser le nom provisoire « La Parenthèse de l’Ourthe » sans validation.

## Évolution vers la réservation directe
La vitrine reste indépendante du moteur de réservation. Les liens Airbnb sont identifiés par data-booking dans public/index.html.
Une prochaine étape pourra ajouter une API via Pages Functions ou un service de réservation externe : calendrier centralisé, règles tarifaires, disponibilités vérifiées côté serveur, blocage temporaire des dates et paiement hébergé avec confirmation par webhook signé et idempotent.
Les secrets et données personnelles resteront côté serveur. Une synchronisation iCal seule ne garantit pas l’absence de double réservation. Ajouter les conditions de réservation et les informations de confidentialité lors de cette étape.
Aucun calendrier, prix, paiement ou formulaire fictif n’est activé.
