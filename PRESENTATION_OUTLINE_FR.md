# Plan De Presentation

## Diapositive 1. Titre

**Systeme De Gestion De Stock Pour Le E-Commerce**

- Backend API en Laravel
- Prototype frontend en React
- Inventaire, commandes, mouvements de stock et authentification

Notes orales :
- Presenter le projet comme un prototype fonctionnel de gestion de stock dans un contexte e-commerce.
- Preciser que l'accent est mis sur l'architecture backend, les workflows API et une interface frontend pour exploiter et demontrer le systeme.

## Diapositive 2. Problematique

**Quel probleme resolvons-nous ?**

- Les produits e-commerce ont besoin d'un suivi de stock precis
- Les commandes doivent diminuer le stock automatiquement
- Les changements de stock doivent etre auditables
- Les utilisateurs ont besoin d'une interface simple pour tester et utiliser le systeme

Notes orales :
- Expliquer que les incoherences de stock peuvent provoquer des surventes, une mauvaise experience client et une faible visibilite operationnelle.
- L'objectif etait de concevoir un backend qui applique les regles de stock et les expose via une API claire et une interface simple.

## Diapositive 3. Objectifs Du Projet

**Objectifs principaux**

- Construire un backend de gestion de stock orienté API
- Suivre les bonnes pratiques Laravel
- Gerer produits, categories, commandes et mouvements de stock
- Empecher les commandes si le stock est insuffisant
- Ajouter authentification et controle d'acces par roles
- Construire un prototype frontend simple pour la demonstration

Notes orales :
- Mentionner que le systeme a ete construit etape par etape, module par module.
- Insister sur le fait que meme si c'est un prototype, la structure est orientee qualite et maintenabilite.

## Diapositive 4. Stack Technique

**Backend**

- Laravel
- Eloquent ORM
- MySQL
- Laravel Sanctum
- Tests fonctionnels PHPUnit

**Frontend**

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router

Notes orales :
- Expliquer que Laravel a ete choisi pour ses conventions fortes autour des API et de l'architecture.
- React + Vite a ete choisi pour la rapidite de mise en place et la simplicite adaptee au prototype.

## Diapositive 5. Conception De La Base De Donnees

**Tables principales**

- `categories`
- `products`
- `orders`
- `order_items`
- `stock_movements`
- `users`
- `personal_access_tokens`

**Relations principales**

- un produit appartient a une categorie
- une commande contient plusieurs lignes de commande
- une ligne de commande appartient a un produit
- un mouvement de stock appartient a un produit
- un mouvement de stock peut appartenir a une commande

Notes orales :
- C'est le modele de donnees central de l'application.
- Il est concu autour de la tracabilite du stock et de l'integrite des commandes.

## Diapositive 6. Migrations

**Qu'est-ce qu'une migration en Laravel ?**

- une definition versionnee du schema de base de donnees
- une alternative en PHP a l'ecriture manuelle de scripts SQL a chaque changement
- executee avec `php artisan migrate`

**Ce que nous avons cree**

- le schema de toutes les tables metier
- les cles etrangeres et contraintes
- des champs numeriques avec des valeurs par defaut sures
- des unicites comme le SKU
- le support des roles utilisateur

Notes orales :
- Si l'audience connait SQL, comparer les migrations a des scripts `CREATE TABLE` et `ALTER TABLE` geres de maniere centralisee.
- Mentionner que nous avons aussi corrige un probleme de nommage des migrations pour garantir leur execution correcte par Laravel.

## Diapositive 7. Modeles Eloquent

**Qu'est-ce qu'un modele en Laravel ?**

- une classe PHP qui represente une table
- definit les champs `fillable`
- definit les casts
- definit les relations entre tables

**Modeles principaux**

- `Category`
- `Product`
- `Order`
- `OrderItem`
- `StockMovement`
- `User`

Notes orales :
- Expliquer que les modeles font le lien entre les enregistrements de la base et la logique de l'application.
- Les relations sont importantes car l'API et le frontend s'appuient fortement dessus.

## Diapositive 8. Architecture Backend

**Organisation du backend**

- les Controllers gerent les requetes HTTP
- les Form Requests gerent la validation
- les Services gerent la logique metier
- les Resources formatent les reponses JSON
- les Policies gerent l'autorisation

**Pourquoi c'est important**

- code plus propre
- meilleure separation des responsabilites
- tests plus faciles
- backend plus sur et plus maintenable

Notes orales :
- C'est une diapositive architecturale tres importante.
- Montrer que le projet n'est pas seulement fonctionnel, mais aussi bien structure.

## Diapositive 9. Logique Metier

**Regles de stock implementees**

- le stock augmente via `stock_in`
- le stock diminue lors de la creation d'une commande
- le stock insuffisant bloque la creation d'une commande
- chaque changement de stock cree une ligne dans `stock_movements`
- la creation de commande est transactionnelle

Notes orales :
- C'est le coeur fonctionnel du systeme.
- Mentionner que les transactions evitent les etats incoherents en cas d'erreur partielle.

## Diapositive 10. Endpoints API

**Authentification**

- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `POST /api/logout`

**Categories**

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

**Produits**

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

**Commandes et stock**

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/stock-movements/stock-in`
- `GET /api/stock-movements`
- `GET /api/stock-movements/{id}`

Notes orales :
- Cette diapositive donne une vue claire de la surface API.
- Insister sur le fait que le backend est entierement pilote par API.

## Diapositive 11. Authentification Et Autorisation

**Authentification**

- implementee avec Laravel Sanctum
- acces API base sur des tokens
- token Bearer utilise par le frontend et par Insomnia

**Autorisation**

- controle d'acces par roles
- roles :
  - `admin`
  - `warehouse`
  - `sales`

**Exemples**

- admin : acces complet
- warehouse : stock-in et visibilite sur l'inventaire
- sales : creation de commandes et visibilite sur produits/categories

Notes orales :
- Expliquer la difference entre authentification et autorisation.
- L'authentification repond a la question : qui es-tu ?
- L'autorisation repond a la question : que peux-tu faire ?

## Diapositive 12. Tests API

**Comment nous avons teste l'API**

- Insomnia pour les tests manuels
- authentification Bearer token
- tests des CRUD et des workflows
- tests du comportement selon les roles

**Flux typique**

1. se connecter
2. recuperer le token
3. appeler les endpoints proteges
4. verifier les reponses backend

**Exemples testes**

- creation de categorie
- creation de produit
- stock in
- creation de commande
- stock insuffisant retourne `422`

Notes orales :
- Mentionner qu'Insomnia a servi a la fois pour la validation technique et pour la preparation de la demonstration.

## Diapositive 13. Tests Automatises

**Tests fonctionnels implementes**

- le stock-in augmente la quantite
- la creation de commande diminue le stock
- le stock insuffisant retourne `422`
- les mouvements de stock sont enregistres
- l'inscription et la connexion fonctionnent
- l'acces invite est bloque
- les restrictions de roles sont appliquees

**Pourquoi les tests sont importants**

- verifier les regles metier
- proteger contre les regressions
- rendre le prototype plus fiable

Notes orales :
- Cette diapositive montre la rigueur d'ingenierie.
- Preciser que les flux d'authentification et d'inventaire ont ete verifies par des tests automatises.

## Diapositive 14. Prototype Frontend

**Objectif du frontend**

- fournir une interface exploitable pour l'API
- demontrer la connexion et les pages protegees
- permettre de tester les workflows backend via l'interface
- afficher les resultats a l'utilisateur authentifie

**Ecrans realises**

- login
- register
- dashboard
- categories
- products
- stock in
- orders
- stock movements
- profile

**Comportement du frontend**

- stocke le token d'authentification
- appelle l'API Laravel avec Bearer token
- affiche une navigation adaptee au role
- montre les resultats backend dans des formulaires, tableaux et cartes de synthese

Notes orales :
- Preciser que le frontend est un prototype d'exploitation, pas encore un produit final.
- Son role est de rendre le backend testable et presentable.

## Diapositive 15. Etat Actuel Et Perspectives

**Etat actuel**

- schema de base de donnees fonctionnel
- API Laravel fonctionnelle
- authentification et autorisation par roles
- logique metier testee
- prototype frontend fonctionnel

**Ce qui n'est pas encore implemente**

- deploiement production
- reporting avance
- upload d'images/fichiers
- annulation de commande avec restitution du stock
- UX frontend plus poussee

**Prochaines etapes**

- ameliorer l'interface et l'ergonomie
- ajouter davantage de validations et de gestion des cas limites
- ajouter des rapports et indicateurs
- preparer un environnement de production

Notes orales :
- Terminer avec une conclusion equilibree.
- Le prototype est deja exploitable et demonstrable, mais il reste des axes d'amelioration pour aller vers une version plus complete.

## Diapositive Optionnelle. Deroulement De La Demo

Si vous voulez une diapositive apres les 15 slides principales, utilisez celle-ci :

1. Connexion en tant qu'admin
2. Affichage du dashboard
3. Consultation des categories et des produits
4. Realisation d'un stock-in
5. Creation d'une commande
6. Consultation de l'historique des mouvements
7. Changement de role pour montrer les restrictions d'acces

Notes orales :
- Cette diapositive peut servir de transition entre la partie explicative et la demonstration en direct.
