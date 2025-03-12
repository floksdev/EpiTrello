### Documentation du Frontend
## 1. Introduction
L’application frontend est développée en React et utilise react-router-dom pour la gestion de la navigation. Elle communique avec le backend via des appels HTTP pour authentifier les utilisateurs, récupérer et modifier des données (tableaux, listes, cartes, etc.) et implémente des systèmes d’authentification (email/mot de passe, Google, Discord). Le stockage du token JWT dans le localStorage permet de sécuriser les accès aux pages protégées.


## 2. Technologies et Outils
React : Bibliothèque pour construire l’interface utilisateur.
React Router DOM : Pour la navigation et la gestion des routes.
Hooks React : useState, useEffect, useRef pour la gestion des états et des cycles de vie.
CSS : Utilisé pour le style, avec des fichiers dédiés dans chaque module (Auth, Navbar, inBoard, etc.).
React Icons : Pour l’intégration d’icônes (Discord, Bell, Search, etc.).
OAuth et JWT : Pour l’authentification via Google et Discord et la sécurisation des accès aux pages.
Fetch API : Pour réaliser les appels aux endpoints du backend.

## 3. Structure du Projet
La structure des dossiers est organisée de façon à isoler les différentes responsabilités et faciliter la maintenance :
```bash
src/
 ├── AuthPages/              // Pages d’authentification (Login, Register, etc.)
 │    ├── Login.js           // Formulaire de connexion
 │    ├── Register.js        // Formulaire d’inscription
 │    └── (DiscordCallback.js, etc.)
 │
 ├── Components/             // Composants réutilisables (ex: Navbar)
 │    ├── Navbar/            // Barre de navigation et ses styles (Navbar.js, Navbar.css)
 │    └── (autres composants)
 │
 ├── Handling/               // Gestion des routes protégées
 │    └── ProtectRoutes.js   // Composant de protection de routes (vérifie le token JWT)
 │
 ├── MainPages/              // Pages principales après authentification
 │    ├── Account/           // Page "Mon Compte" permettant de visualiser/modifier les infos utilisateur
 │    ├── Board/             // Liste des espaces de travail
 │    ├── Favourites/        // Tableaux marqués comme favoris
 │    ├── LandingPage/       // Page d’accueil publique
 │    ├── RecentBoards/      // Tableaux récents
 │    └── inBoard/           // Vue détaillée d’un tableau (gestion des listes, cartes, etc.)
 │         ├── inBoard.js   // Composant principal pour la gestion d’un board
 │         └── css/         // Styles spécifiques à la page inBoard
 │
 ├── App.js                  // Configuration des routes et composition générale de l’application
 └── index.js                // Point d’entrée, intègre BrowserRouter et les styles globaux
```
## 5. Description des Modules et Composants
## 4.1 AuthPages
Login.js
Fonctionnalités principales :
Formulaire de connexion avec champs email et mot de passe.
Envoi des données vers le backend pour vérification.
Gestion de la réponse : enregistrement du token dans le localStorage et redirection vers l’espace de travail.
Intégration de la connexion via Google OAuth et redirection pour Discord.
Affichage d’un message d’erreur en cas de problème.
Points clés :
Utilisation des hooks (useState, useNavigate).
Rendu conditionnel pour les messages d’erreur.
Register.js
Fonctionnalités principales :
Formulaire d’inscription pour créer un nouveau compte.
Envoi des données (email et mot de passe) au backend.
Gestion des retours (succès ou erreur) avec affichage temporaire de messages.
Possibilité d’utiliser la connexion via Google ou Discord pour s’inscrire.
Points clés :
Utilisation des effets (useEffect) pour gérer l’affichage temporaire des messages.
Appels à l’API via fetch.
Auth.css
Rôle :
Définit le style général des pages d’authentification.
Gestion de la mise en page, des couleurs et des animations sur les boutons et formulaires.
Points clés :
Responsive design pour s’adapter aux différents écrans.
Utilisation d’images (logos, icônes) pour renforcer l’identité visuelle.
## 4.2 Components
Navbar (Navbar.js & Navbar.css)
Fonctionnalités principales :
Barre de navigation fixe en haut de l’écran, présente sur la majorité des pages (hors landing, login, register).
Affichage du logo, des liens de navigation (Espaces de travail, Récent, Favoris), d’un champ de recherche, des icônes (notifications, FAQ) et du menu utilisateur.
Gestion d’un menu déroulant pour accéder au compte ou se déconnecter.
Intégration d’actions telles que la création d’un nouveau board et l’affichage des logs d’activité.
Points clés :
Interaction avec le backend pour récupérer les boards et logs d’activité.
Utilisation d’événements de clic et de gestion de l’état pour le menu déroulant et les modales.
## 4.3 Handling
ProtectRoutes.js
Fonctionnalités principales :
Composant wrapper qui protège les routes nécessitant une authentification.
Vérification de la présence et de la validité du token JWT (notamment via la fonction jwtDecode).
Redirection vers la page de connexion si le token est absent ou expiré.
Points clés :
Permet de centraliser la logique de protection des routes.
Simplifie la gestion des accès dans App.js.
## 4.4 MainPages
Account (MonCompte)
Fonctionnalités principales :
Affichage des informations utilisateur (email, photo de profil, permissions).
Possibilité de modifier le mot de passe grâce à un formulaire d’édition.
Liste des boards associés à l’utilisateur.
Points clés :
Appels API sécurisés avec le token pour récupérer et mettre à jour les données.
Interface utilisateur simple et intuitive pour la gestion du compte.
Board
Fonctionnalités principales :
Affichage de la liste des espaces de travail de l’utilisateur, avec pagination.
Possibilité de créer un nouveau board et de l’archiver.
Redirection vers la page détaillée d’un board lors de la sélection.
Points clés :
Utilisation des hooks pour la gestion des états (liste des boards, pagination).
Interaction avec le backend pour la création et la récupération des boards.
Favourites et RecentBoards
Fonctionnalités principales :
Favourites : Affichage des boards marqués comme favoris.
RecentBoards : Affichage des boards récemment modifiés (filtrage sur la date de mise à jour).
Points clés :
Appels API pour récupérer l’ensemble des boards, puis filtrage côté client.
Navigation rapide vers un board sélectionné.
LandingPage
Fonctionnalités principales :
Page d’accueil publique qui présente les fonctionnalités et avantages de l’application.
Menu de navigation public avec liens vers la connexion et l’inscription.
Call-to-action pour encourager l’inscription.
Points clés :
Utilisation d’images et d’animations pour une présentation attractive.
Structure simple pour capter l’attention des visiteurs.
## 4.5 inBoard (Vue détaillée d’un Board)
inBoard.js (HandleList)
Fonctionnalités principales :
Affichage et gestion des listes et cartes d’un board.
Ajout, modification, déplacement (drag & drop) et archivage de listes et de cartes.
Gestion de l’édition de cartes (titre, description, étiquettes, assignation d’utilisateurs).
Ajout de membres au board et affichage des membres via une modale.
Points clés :
Utilisation intensive de hooks (useState, useEffect, useRef) pour gérer les états multiples.
Implémentation du drag & drop pour la réorganisation des listes et des cartes.
Appels API pour chaque action (création, mise à jour, archivage) afin de synchroniser les données avec le backend.
Gestion dynamique des étiquettes (labels) avec des couleurs calculées en fonction du contenu.
Interface utilisateur responsive et interactive grâce aux mises à jour en temps réel.
css/inBoard.css
Rôle :
Définit le style spécifique de la page inBoard, notamment la mise en page des listes, cartes, modales et actions interactives.
Points clés :
Assure une expérience utilisateur fluide lors du drag & drop et de l’édition de contenu.
## 4.6 App.js et index.js
App.js
Fonctionnalités principales :
Configuration des routes principales de l’application via react-router-dom.
Utilisation du composant ProtectRoutes pour sécuriser les pages nécessitant une authentification.
Définition des chemins pour toutes les pages principales (landing, login, register, board, mon-compte, recent, favoris, inBoard, etc.).
Points clés :
Structure centralisée des routes pour faciliter l’extension ou la modification de la navigation.
index.js
Fonctionnalités principales :
Point d’entrée de l’application React.
Rendu de l’application dans le DOM avec le contexte du BrowserRouter.
Importation des styles globaux et des polices.
Points clés :
Initialise l’application et permet le routage en mode client.
