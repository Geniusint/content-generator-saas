# Content Generator SaaS

## Description

Content Generator SaaS est une plateforme de génération de contenu construite avec React et TypeScript. Elle utilise Material-UI (MUI) pour l'interface utilisateur et Firebase Firestore comme backend pour la gestion des données. L'application permet aux utilisateurs de créer et de gérer des projets, de générer du contenu personnalisé via OpenAI, et de publier directement sur des sites WordPress.

## Fonctionnalités

1. **Gestion des Projets**
   - Créer, modifier et supprimer des projets.
   - Association de projets à des sites et des personas.

2. **Authentification**
   - Inscription et connexion des utilisateurs.
   - Protection des routes avec des composants sécurisés.

3. **Génération de Contenu**
   - Génération de contenu personnalisé basé sur des personas et des mots-clés via OpenAI.

4. **Publication sur WordPress**
   - Publication automatique du contenu généré sur des sites WordPress configurés.

5. **Gestion des Personas**
   - Création et gestion de personas pour personnaliser le contenu généré.

6. **Gestion des Sites**
   - Configuration et gestion des sites de publication.

7. **Configuration et Services**
   - Service principal : `firestore.ts`, qui encapsule les opérations CRUD pour Firestore.
   - Configuration Firebase dans `firebase.ts`.

8. **Structure de l'Interface**
   - Composants : `Layout.tsx` et `Sidebar.tsx`.
   - Utilisation de `React Router` pour la navigation et de MUI pour une interface réactive et adaptée aux différentes tailles d'écran.

9. **Internationalisation**
   - Configuration dans `i18n.ts` avec des fichiers de traduction en anglais et en français.

10. **Types et Interfaces**
    - Définis dans `types/` et `services/firestore.ts`, assurant un typage strict et une gestion cohérente des données.

## Technologies Utilisées

- **Frontend :**
  - React
  - TypeScript
  - Material-UI (MUI)
  - React Router

- **Backend :**
  - Firebase Firestore

- **Services :**
  - OpenAI API
  - WordPress API

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Étapes d'installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/votre-utilisateur/content-generator-saas.git
   cd content-generator-saas
   ```

2. **Installer les dépendances :**

   ```bash
   npm install
   ```

   ou

   ```bash
   yarn install
   ```

3. **Configurer Firebase :**

   - Créez un projet Firebase et obtenez les configurations nécessaires.
   - Remplissez les variables d'environnement dans `src/config/firebase.ts`.

4. **Configurer OpenAI :**

   - Obtenez une clé API OpenAI.
   - Ajoutez la clé API dans les paramètres utilisateur via la configuration.

5. **Démarrer le serveur de développement :**

   ```bash
   npm run dev
   ```

   ou

   ```bash
   yarn dev
   ```

6. **Accéder à l'application :**

   Ouvrez votre navigateur et allez à `http://localhost:3000`.

## Utilisation

1. **Inscription et Connexion :**

   - Inscrivez-vous ou connectez-vous avec un compte existant.

2. **Gestion des Projets :**

   - Créez de nouveaux projets, associez des sites et des personas.

3. **Génération de Contenu :**

   - Utilisez le générateur de contenu pour créer des articles basés sur des personas et des mots-clés.

4. **Publication sur WordPress :**

   - Configurez vos sites WordPress et publiez directement vos articles générés.

## Contribution

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :

1. Fork le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalité`).
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/ma-fonctionnalité`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter [vous@exemple.com](mailto:vous@exemple.com).
