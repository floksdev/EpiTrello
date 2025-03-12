# EpiTrello

EpiTrello est une application collaborative de gestion de projets inspirée de Trello. Ce projet permet de gérer des tableaux, listes et cartes, avec une authentification via email/mot de passe et OAuth (Google et Discord).

## Fonctionnalités

- **Gestion des Tableaux** : Créez, modifiez et archivez vos tableaux.
- **Gestion des Listes et Cartes** : Organisez vos tâches avec des listes et des cartes. Déplacez-les par glisser-déposer.
- **Authentification** : Inscription et connexion via email ou via OAuth (Google, Discord).
- **Suivi d'Activité** : Visualisez l'historique des actions réalisées sur chaque tableau.

## Prérequis

- **Node.js** (version 14+)
- **npm** (version 6+)
- **MongoDB** (pour le backend)

## Installation

### Backend

1. Naviguez dans le dossier `backend` :
```bash
cd backend
```
Installez les dépendances :
```bash
npm install
```
Configurez vos variables d'environnement dans un fichier .env (voir la documentation pour les variables requises).

Lancez le serveur de développement :
```bash
npm run dev
```

### Frontend

Naviguez dans le dossier frontend :
```bash
cd frontend
```
Installez les dépendances :
```bash
npm install
```
Lancez le serveur de développement :
```bash
npm run dev
```
Utilisation
Une fois les deux serveurs démarrés, le backend sera accessible sur le port configuré (par défaut 3001) et le frontend sur le port configuré (par défaut 3000). Rendez-vous sur votre navigateur à l'adresse du frontend pour commencer à utiliser EpiTrello.

Contributions
Merci de respecter la Convention de Commit pour vos contributions.

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à contacter l'équipe de développement.
