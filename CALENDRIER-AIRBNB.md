# Configuration du calendrier Airbnb

Le calendrier public est dans `public/index.html` et `public/availability.js`. La fonction serveur `functions/api/availability.js` récupère le flux iCal, et ne renvoie au navigateur que les plages bloquées et l'heure de consultation (aucun nom de voyageur ni URL secrète).

## Activer dans Cloudflare Pages
1. Ouvrir **Workers & Pages → gite-esneux → Settings → Variables and Secrets → Add**.
2. Nom de la variable : `AIRBNB_ICAL_URL`.
3. Valeur : coller l'URL complète d'export iCal fournie par Airbnb (y compris le paramètre secret après `?`).
4. Sélectionner **Encrypt** puis **Save**. Ne pas publier cette URL dans GitHub, dans un fichier HTML ou dans un message public.
5. Déclencher un nouveau déploiement du projet Pages (branche `main`) pour que la fonction dispose du secret.
6. Vérifier sur le site la section « Choisissez vos dates », puis tester une date bloquée et une date libre.

**Attention :** la synchronisation iCal est différée. Les disponibilités affichées ne sont pas une garantie de réservation. Airbnb reste la source de confirmation du tarif, des conditions et de la réservation. La fonction ne renvoie pas les détails des réservations.

**Architecture Cloudflare Pages :** racine du dépôt pour le dossier `functions/`, sortie statique `public/`. Ne pas définir `public` comme racine du dépôt, sinon les Pages Functions risquent de ne pas être détectées.
