# Convention de Commit

Pour assurer une bonne lisibilité et faciliter le suivi de l'historique du projet, merci de respecter la convention de commit suivante lors de vos contributions.

## Format de Base

Utilisez le terminal pour ajouter et valider vos changements :

```bash
git add .
git commit -m "[TYPE] Message explicite du commit"
```
## Exemple :
```bash
git add .
git commit -m "[ADD] Ajout de la fonctionnalité de connexion avec Google OAuth"
```
## Types de Commit
Voici quelques préfixes recommandés pour catégoriser vos commits. Vous êtes libre d'ajouter d'autres types si nécessaire :
```bash
[ADD] : Ajout d'une nouvelle fonctionnalité ou d'un nouveau fichier.
[FIX] : Correction d'un bug.
[REFACTOR] : Refactorisation du code sans modification de la fonctionnalité.
[DOC] : Mise à jour ou ajout de la documentation.
[STYLE] : Modification du style (indentation, formatage, espaces, etc.) sans modifier le code.
[TEST] : Ajout ou modification de tests.
[CI] : Modification de la configuration ou des scripts d'intégration continue.
[PERF] : Amélioration de la performance.
[CHORE] : Tâches d'entretien qui ne modifient pas directement le code de production (mise à jour de dépendances, nettoyage de code, etc.).
Bonnes Pratiques
Clarté et concision : Votre message doit être explicite et concis.
Verbe à l'infinitif : Utilisez des verbes à l'infinitif pour décrire l'action (ex. "Ajouter", "Corriger", "Refactoriser").
Une seule action par commit : Essayez de regrouper les changements liés dans un seul commit.
Respectez l'ordre chronologique : Commits logiques et en ordre pour faciliter la revue du code.
En suivant cette convention, nous assurons une meilleure compréhension et une collaboration plus efficace sur le projet.
```
