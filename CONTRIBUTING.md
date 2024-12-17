# Guide de Contribution

Bienvenue dans le projet **Content Generator SaaS** ! Nous apprécions votre intérêt à contribuer et souhaitons vous fournir les informations nécessaires pour respecter le code et l'organisation de l'application. Veuillez suivre les instructions ci-dessous pour assurer une collaboration fluide et efficace.

## Table des Matières

1. [Description du Projet](#description-du-projet)
2. [Structure du Projet](#structure-du-projet)
3. [Environnement de Développement](#environnement-de-développement)
4. [Normes de Codage](#normes-de-codage)
5. [Gestion des Branches](#gestion-des-branches)
6. [Processus de Contribution](#processus-de-contribution)
7. [Tests](#tests)
8. [Bonnes Pratiques](#bonnes-pratiques)
9. [Contact](#contact)

## Description du Projet

**Content Generator SaaS** est une plateforme de génération de contenu construite avec **React** et **TypeScript**. Elle utilise **Material-UI (MUI)** pour l'interface utilisateur et **Firebase Firestore** comme backend pour la gestion des données. L'application permet aux utilisateurs de créer et gérer des projets, de générer du contenu personnalisé via **OpenAI**, et de publier directement sur des sites **WordPress**.

## Structure du Projet

Le projet est organisé de manière modulaire pour faciliter la maintenance et l'extensibilité. Voici un aperçu de la structure des dossiers principaux :

```
content-generator-saas/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── articles/
│   │   │   ├── ArticlesList.tsx
│   │   │   └── NewArticlePage.tsx
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── GoogleSignInButton.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SignIn.tsx
│   │   │   ├── SignInPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── content/
│   │   │   └── ContentGenerator.tsx
│   │   ├── layout/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── personas/
│   │   │   ├── PersonaModal.tsx
│   │   │   └── PersonasManager.tsx
│   │   ├── projects/
│   │   │   ├── ProjectForm.tsx
│   │   │   └── ProjectsPage.tsx
│   │   ├── settings/
│   │   │   └── Settings.tsx
│   │   ├── sites/
│   │   │   ├── SiteModal.tsx
│   │   │   └── SitesList.tsx
│   │   └── wordpress/
│   │       └── WordPressPublisher.tsx
│   ├── config/
│   │   └── firebase.ts
│   ├── content-types/
│   │   └── index.ts
│   ├── hooks/
│   ├── i18n/
│   │   ├── i18n.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── fr.json
│   ├── locales/
│   │   ├── en/
│   │   └── fr/
│   ├── pages/
│   ├── prompts/
│   │   ├── templates/
│   │   │   ├── blogPost.ts
│   │   │   ├── comparison.ts
│   │   │   ├── content-types/
│   │   │   ├── humanize/
│   │   │   └── semantic/
│   │   │       ├── aiAnalysis.ts
│   │   │       └── scrapAnalysis.ts
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── types/
│   ├── services/
│   │   ├── firestore.ts
│   │   └── openai.ts
│   ├── types/
│   │   └── articleStatus.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── reportWebVitals.ts
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Environnement de Développement

### Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** ou **yarn**
- **Firebase Project** configuré
- **Clé API OpenAI**

### Installation

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

## Normes de Codage

Pour maintenir une base de code propre et cohérente, veuillez suivre les normes de codage suivantes :

- **Langage :** TypeScript avec JSX pour les composants React.
- **Style :** Utilisation de Prettier et ESLint pour le formatage et la qualité du code.
- **Organisation :** 
  - Séparation claire des composants, services, hooks, etc.
  - Utilisation de dossiers pour regrouper les fonctionnalités similaires.
- **Nommage :** 
  - Utiliser le camelCase pour les variables et les fonctions.
  - Utiliser le PascalCase pour les composants React et les classes.
- **Documentation :** Ajouter des commentaires pertinents et maintenir à jour la documentation dans le code.

## Gestion des Branches

Adoptez la stratégie Git suivante pour une gestion efficace des branches :

- **Branche Principale (`main`):** Contient le code en production.
- **Branche de Développement (`develop`):** Intégration des fonctionnalités en cours de développement.
- **Branches Fonctionnelles (`feature/*`):** Pour le développement de nouvelles fonctionnalités.
- **Branches de Correction (`bugfix/*`):** Pour les corrections de bugs.
- **Branches de Release (`release/*`):** Préparation des nouvelles versions.
- **Branches de Hotfix (`hotfix/*`):** Corrections rapides en production.

### Exemple de Workflow

1. **Créer une branche fonctionnelle :**

    ```bash
    git checkout -b feature/nom-de-la-fonctionnalité
    ```

2. **Travailler sur la fonctionnalité et committer les changements :**

    ```bash
    git add .
    git commit -m "Ajouter une nouvelle fonctionnalité"
    ```

3. **Pousser la branche vers le dépôt distant :**

    ```bash
    git push origin feature/nom-de-la-fonctionnalité
    ```

4. **Créer une Pull Request pour révision et fusion :**

    - Assurez-vous que les tests passent.
    - Attendez les revues de code avant de fusionner.

## Processus de Contribution

1. **Fork le dépôt.**
2. **Cloner le dépôt forké:**

    ```bash
    git clone https://github.com/votre-utilisateur/content-generator-saas.git
    cd content-generator-saas
    ```

3. **Créer une branche pour votre fonctionnalité ou correction :**

    ```bash
    git checkout -b feature/nom-de-la-fonctionnalité
    ```

4. **Effectuer vos modifications et committer :**

    ```bash
    git add .
    git commit -m "Description de la fonctionnalité ou correction"
    ```

5. **Pousser vos changements vers votre dépôt forké :**

    ```bash
    git push origin feature/nom-de-la-fonctionnalité
    ```

6. **Ouvrir une Pull Request sur le dépôt principal.**

## Tests

Assurez-vous que toutes les fonctionnalités sont bien testées :

- **Tests Unitaires :** Utilisez Jest pour les tests unitaires des fonctions et des composants.
- **Tests d'Intégration :** Vérifiez l'intégration entre les différents modules.
- **Tests End-to-End :** Utilisez des outils comme Cypress pour les tests end-to-end.

Pour exécuter les tests :

```bash
npm run test
```
ou
```bash
yarn test
```

## Bonnes Pratiques

- **Commits Atomiques :** Chaque commit doit représenter une seule modification logique.
- **Messages de Commit Clairs :** Utilisez des messages de commit descriptifs.
- **Revue de Code :** Participer activement aux revues de code et respecter les feedbacks.
- **Documentation :** Maintenir la documentation à jour et complète.
- **Sécurité :** Ne jamais inclure de clés API ou de secrets dans le code source. Utiliser des variables d'environnement.

## Contact

Pour toute question ou suggestion, veuillez contacter [vous@exemple.com](mailto:vous@exemple.com).

Merci de votre contribution !
