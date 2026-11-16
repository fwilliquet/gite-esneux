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
Le calendrier de consultation iCal est désormais intégré : `public/availability.js` affiche les dates non bloquées et transmet les dates choisies à Airbnb. La fonction serveur `functions/api/availability.js` nécessite le secret chiffré `AIRBNB_ICAL_URL` dans Cloudflare Pages. Voir `CALENDRIER-AIRBNB.md` pour la configuration. Les disponibilités restent indicatives et Airbnb confirme les réservations. Aucun paiement direct n’est activé.

## Redéploiement
Un commit sur `main` déclenche normalement un nouveau déploiement si l’intégration GitHub → Cloudflare Pages et les déploiements automatiques sont activés. Vérifier l’onglet **Deployments** dans Cloudflare et le statut du build. La configuration du secret `AIRBNB_ICAL_URL` reste nécessaire pour charger le calendrier.

## Diagnostic Cloudflare Pages — calendrier iCal

Si `/api/availability` retourne `{"error":"Calendrier non configuré"}`, la fonction Pages est bien exécutée, mais la variable `AIRBNB_ICAL_URL` n'est pas accessible à cette fonction. Vérifier dans **Workers & Pages → gite-esneux → Settings → Variables and Secrets** que le nom est exact, que la variable est définie en **Production** et qu'elle est bien enregistrée comme secret. Redéployer après la configuration. Ne jamais enregistrer l'URL iCal dans GitHub : elle contient un jeton confidentiel.

