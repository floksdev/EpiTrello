## Documentation du Backend
## 1. Introduction
Ce projet backend est construit avec Node.js et Express, et utilise MongoDB via Mongoose pour la gestion de la base de données. Il gère les fonctionnalités essentielles d'une application de gestion collaborative (tableaux, listes, cartes, utilisateurs) et intègre des systèmes d'authentification traditionnels ainsi que via OAuth (Google et Discord). Le code intègre également des mécanismes de suivi d'activité (logs) et une gestion fine des droits d'accès grâce à des middlewares.

## 2. Architecture du Projet
```bash
Backend/
├── DataBase/                      # Contient tous les modèles (schémas) de la base de données avec Mongoose
│   ├── ActivityLog.js             # Schéma pour enregistrer les actions des utilisateurs (logs d’activité)
│   ├── boardCollection.js         # Modèle pour les tableaux collaboratifs (nom, description, membres, listes, etc.)
│   ├── cardCollection.js          # Modèle pour les cartes des listes (titre, description, labels, échéance, etc.)
│   ├── dbCollection.js            # Gestion de la connexion à MongoDB à l’aide de Mongoose et des variables d’environnement
│   ├── dbHandler.js               # Initialise la connexion DB et importe l’ensemble des modèles
│   ├── listCollection.js          # Schéma pour les listes de tableaux (nom, position, cartes, etc.)
│   └── userCollection.js          # Modèle pour les utilisateurs avec gestion du hachage de mot de passe et ID auto-incrémenté
│
├── Middlewares/                   # Regroupe les middlewares utilisés dans l’application
│   └── TokenValidity.js           # Middleware qui vérifie la validité du token JWT pour sécuriser les routes
│
├── routes/                        # Contient les modules de routes Express pour chaque fonctionnalité de l’API
│   ├── BoardInfos.js              # Routes pour récupérer les infos d’un tableau (nom et membres)
│   ├── Boards.js                  # Routes pour la gestion des tableaux (création, modification, ajout de membres, etc.)
│   ├── Cards.js                   # Routes pour la gestion des cartes (création, mise à jour, assignation, etc.)
│   ├── DiscordLogin.js            # Route gérant l’authentification via Discord OAuth
│   ├── GoogleLogin.js             # Route gérant l’authentification via Google OAuth
│   ├── Handler.js                 # Fichier central qui importe et monte toutes les routes de l’application
│   ├── Lists.js                   # Routes pour la gestion des listes (création, mise à jour, récupération)
│   ├── LogActivity.js             # Fonction utilitaire pour enregistrer les actions dans la collection ActivityLog
│   ├── Login.js                   # Route pour la connexion des utilisateurs (vérification email/mot de passe)
│   └── Register.js                # Route pour l’inscription des utilisateurs (création de compte et hachage du mot de passe)
│
└── index.js                       # Point d’entrée de l’application : initialise la DB, configure Express et démarre le serveur
```

## Technologies Principales
Node.js & Express : pour la création d’un serveur web performant.
MongoDB avec Mongoose : pour la modélisation et l’interaction avec la base de données.
JWT : pour sécuriser l’authentification des utilisateurs.
bcrypt : pour le hachage sécurisé des mots de passe.
OAuth2 : intégration avec Google et Discord pour des connexions tierces.
Structure des Dossiers
Database/ : Contient l’ensemble des modèles Mongoose (schémas pour utilisateurs, tableaux, listes, cartes, logs d’activité).
Middlewares/ : Regroupe notamment le middleware TokenValidity qui vérifie la validité des tokens JWT.
routes/ :
Chaque fonctionnalité (authentification, gestion des tableaux, listes, cartes, etc.) dispose de son propre module.
Le fichier Handler.js centralise l’intégration de toutes ces routes.
index.js : Point d’entrée de l’application, initialisant la connexion à la base de données, les middlewares et le serveur Express.

## 3. Configuration et Installation
Installation des Dépendances
Installez les dépendances via npm :
```bash
npm install
```
Fichier de Configuration (.env)
Assurez-vous de créer un fichier config.env (ou .env) avec les variables nécessaires :
```bash
CONN_STR : Chaîne de connexion à MongoDB.
JWT_SECRET : Clé secrète pour la génération et vérification des tokens JWT.
PORT : Port d’exécution du serveur (par défaut, 3001).
DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI : Pour l’intégration avec Discord.
GOOGLE_CLIENT_ID : Pour l’authentification via Google.
```
## 4. Base de Données
Modèles et Collections
ActivityLog.js
But : Enregistrer les activités sur un tableau.
Champs principaux :
board : Référence au tableau concerné.
userEmail : Email de l’utilisateur ayant effectué l’action.
action : Description de l’action.
details : Détails complémentaires (facultatif).
Timestamps : Création et mise à jour automatiques.
boardCollection.js
But : Représenter un tableau collaboratif.
Champs :
name (obligatoire) et description.
members : Liste d’IDs d’utilisateurs.
lists : Liste d’IDs de listes associées.
archive et favorite : Statuts booléens.
listCollection.js
But : Gérer les listes d’un tableau.
Champs :
name (obligatoire) et position pour l’ordre.
board : Référence au tableau parent.
cards : Liste d’IDs des cartes.
archive : Indique si la liste est archivée.
cardCollection.js
But : Gérer les cartes au sein des listes.
Champs :
title (obligatoire) et description.
list : Référence à la liste parente.
labels : Étiquettes associées.
dueDate : Date d’échéance.
members et asigne : Références aux utilisateurs.
archive et position : Pour la gestion de l’état et de l’ordre.
userCollection.js
But : Gérer les utilisateurs.
Champs :
email et password (obligatoires), avec un hachage sécurisé.
lastname, firstname et permissions (pour distinguer les administrateurs).
boards : Références aux tableaux auxquels l’utilisateur participe.
Particularité : Utilisation du plugin mongoose-sequence pour un ID auto-incrémenté.
dbCollection.js & dbHandler.js
But : Établir la connexion à MongoDB.
Fonctionnalité : dbHandler.js importe tous les modèles et initie la connexion via dbConnection().
## 5. Middlewares
TokenValidity.js
Rôle : Vérifier la présence et la validité du token JWT dans les requêtes.
Fonctionnement :
Extrait le token depuis l’en-tête Authorization.
Utilise jwt.verify pour valider le token.
En cas d’erreur (absence, invalidité ou expiration), renvoie une réponse 403 ou 401.
Utilisation : Ce middleware est appliqué sur la plupart des routes protégées.
## 6. Routes
Les endpoints sont organisés en modules dans le dossier routes/. Chaque module correspond à une fonctionnalité spécifique.

## 6.1 Authentification
Register (routes/Register.js)
Permet de créer un nouvel utilisateur.
Vérifie l’unicité de l’email.
Hache le mot de passe avec bcrypt avant de sauvegarder.
Login (routes/Login.js)
Valide les identifiants (email et mot de passe).
Génère un token JWT avec une durée d’expiration de 15 jours.
GoogleLogin (routes/GoogleLogin.js)
Utilise l’OAuth2 de Google pour authentifier l’utilisateur.
Crée un compte si l’utilisateur n’existe pas déjà et retourne un JWT.
DiscordLogin (routes/DiscordLogin.js)
Intègre l’authentification via Discord.
Récupère les informations utilisateur via l’API Discord.
Crée un compte et génère un token JWT en cas de nouvelle connexion.
## 6.2 Gestion des Tableaux (Boards)
BoardInfos (routes/BoardInfos.js)
GET /:boardID : Récupère les informations de base d’un tableau (nom et membres).
POST /getMembers : Permet de récupérer les informations des membres à partir d’un tableau d’IDs.
Boards (routes/Boards.js)
GET /:userID : Récupère les tableaux auxquels l’utilisateur appartient.
PATCH /:userID : Permet de modifier le mot de passe de l’utilisateur.
GET /:userID/Boards : Liste les tableaux pour un utilisateur authentifié.
POST /:userID/Boards : Crée un nouveau tableau et l’ajoute à l’utilisateur.
POST /:userID/Boards/:boardID/addMember : Ajoute un nouveau membre à un tableau.
PATCH /:userID/Boards/:boardID : Met à jour les informations d’un tableau (nom, membres, état archive/favorite).
GET /:userID/Boards/:boardID/activity : Récupère les logs d’activité du tableau.
Note : Chaque action majeure (création, modification) utilise la fonction logActivity pour enregistrer l’historique des actions.

## 6.3 Gestion des Listes
Lists (routes/Lists.js)
GET /:boardID/lists : Récupère toutes les listes associées à un tableau.
POST /:boardID/lists : Crée une nouvelle liste et l’ajoute au tableau.
PATCH /:boardID/lists/:listID : Met à jour une liste (nom, position, archive) et enregistre le changement.
## 6.4 Gestion des Cartes (Cards)
Cards (routes/Cards.js)
GET /:listID/cards : Récupère toutes les cartes d’une liste.
POST /:listID/cards : Crée une nouvelle carte dans la liste et y ajoute le créateur.
PATCH /:listID/cards/:cardID : Met à jour une carte. Si la carte est déplacée vers une autre liste, la mise à jour est gérée dans les deux listes.
PATCH /:listID/cards/:cardID/assign : Permet d’assigner une carte à un utilisateur.
## 6.5 Log d’Activité
LogActivity.js
Fonction utilitaire appelée par plusieurs routes pour enregistrer les actions des utilisateurs.
Stocke l’activité dans la collection ActivityLog avec des informations telles que le tableau concerné, l’email de l’utilisateur, l’action et des détails complémentaires.
## 6.6 Intégration des Routes
Handler.js (routes/Handler.js)
Centralise l’ensemble des routes de l’application.
Les endpoints sont exposés sous les chemins suivants :
/register – Inscription.
/login – Connexion.
/auth/google & /auth/discord – Connexions tierces.
/users, /board, /lists, /board-infos – Gestion des tableaux, listes, cartes et informations.
## 7. Point d’Entrée de l’Application
index.js
Rôle : Point d’entrée principal du serveur.
Fonctionnalités :
Initialisation de la connexion à la base de données via dbHandler().
Configuration des middlewares globaux (CORS, parsing JSON).
Intégration des routes via routesHandling.
Lancement du serveur sur le port défini (par défaut 3001).
