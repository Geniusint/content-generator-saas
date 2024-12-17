# Guide des Développeurs

Bienvenue dans le projet **Content Generator SaaS** ! Ce guide a pour but de vous fournir des instructions et des informations essentielles pour vous assurer que votre contribution respecte les normes de code et l'organisation de l'application.

## Présentation de l'Application

**Content Generator SaaS** est une plateforme de génération de contenu développée avec **React** et **TypeScript**. Elle utilise **Material-UI (MUI)** pour l'interface utilisateur et **Firebase Firestore** comme backend pour la gestion des données. L'application permet aux utilisateurs de créer et de gérer des projets, de générer du contenu personnalisé via **OpenAI**, et de publier directement sur des sites **WordPress**.

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
├── CONTRIBUTING.md
└── tsconfig.json
```

## Instructions et Informations pour les Nouveaux Développeurs

### 1. Environnement de Développement

- **Technologies Utilisées :**
  - **Frontend :** React, TypeScript, Material-UI (MUI), React Router
  - **Backend :** Firebase Firestore
  - **Services :** OpenAI API, WordPress API

- **Prérequis :**
  - **Node.js** (version 14 ou supérieure)
  - **npm** ou **yarn**
  - **Compte Firebase** avec Firestore configuré
  - **Clé API OpenAI**

### 2. Installation du Projet

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

   - Créez un projet Firebase et récupérez les configurations nécessaires.
   - Remplissez les variables d'environnement dans `src/config/firebase.ts`.

4. **Configurer OpenAI :**

   - Obtenez une clé API OpenAI.
   - Ajoutez la clé API dans les paramètres utilisateurs via la configuration.

5. **Démarrer le serveur de développement :**

   ```bash
   npm run dev
   ```

   ou

   ```bash
   yarn dev
   ```

6. **Accéder à l'application :**

   Ouvrez votre navigateur et rendez-vous sur `http://localhost:3000`.

### 3. Normes de Codage

- **Langage :** TypeScript avec JSX pour les composants React.
- **Style :** Utilisation de **Prettier** et **ESLint** pour le formatage et la qualité du code.
- **Organisation :**
  - Séparation claire des composants, services, hooks, etc.
  - Utilisation de dossiers pour regrouper les fonctionnalités similaires.
- **Nommage :**
  - **camelCase** pour les variables et les fonctions.
  - **PascalCase** pour les composants React et les classes.
- **Documentation :** Ajouter des commentaires pertinents et maintenir à jour la documentation dans le code.

### 4. Gestion des Branches

Adoptez la stratégie Git suivante pour une gestion efficace des branches :

- **Branche Principale (`main`) :** Contient le code en production.
- **Branche de Développement (`develop`) :** Intégration des fonctionnalités en cours de développement.
- **Branches Fonctionnelles (`feature/*`) :** Pour le développement de nouvelles fonctionnalités.
- **Branches de Correction (`bugfix/*`) :** Pour les corrections de bugs.
- **Branches de Release (`release/*`) :** Préparation des nouvelles versions.
- **Branches de Hotfix (`hotfix/*`) :** Corrections rapides en production.

### 5. Processus de Contribution

1. **Fork le dépôt.**
2. **Cloner le dépôt forké :**

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

### 6. Tests

Assurez-vous que toutes les fonctionnalités sont bien testées :

- **Tests Unitaires :** Utilisez **Jest** pour les tests unitaires des fonctions et des composants.
- **Tests d'Intégration :** Vérifiez l'intégration entre les différents modules.
- **Tests End-to-End :** Utilisez des outils comme **Cypress** pour les tests end-to-end.

Pour exécuter les tests :

```bash
npm run test
```

ou

```bash
yarn test
```

### 7. Bonnes Pratiques

- **Commits Atomiques :** Chaque commit doit représenter une seule modification logique.
- **Messages de Commit Clairs :** Utilisez des messages de commit descriptifs.
- **Revue de Code :** Participer activement aux revues de code et respecter les feedbacks.
- **Documentation :** Maintenir la documentation à jour et complète.
- **Sécurité :** Ne jamais inclure de clés API ou de secrets dans le code source. Utiliser des variables d'environnement.

### 8. Ressources Supplémentaires

- [Documentation React](https://reactjs.org/docs/getting-started.html)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/getting-started/installation/)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [OpenAI API Documentation](https://beta.openai.com/docs/)

## Contact

Pour toute question ou suggestion, veuillez contacter [vous@exemple.com](mailto:vous@exemple.com).

Merci de votre contribution !
