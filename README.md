# Content Generator SaaS

Une application SaaS de génération de contenu alimentée par l'IA, similaire à Skoatch.

## Fonctionnalités

- Génération de contenu assistée par IA
- Ajout automatisé de médias
- Planification et publication sur WordPress
- Personnalisation des personas
- Authentification utilisateur avec Firebase
- Interface utilisateur responsive

## Configuration requise

- Node.js 14.x ou supérieur
- Compte Firebase
- Compte OpenAI (pour l'API GPT)
- Site WordPress avec accès API REST

## Installation

1. Cloner le dépôt
2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
Créer un fichier `.env` à la racine du projet avec :
```
REACT_APP_FIREBASE_API_KEY=votre_clé_api
REACT_APP_FIREBASE_AUTH_DOMAIN=votre_domaine
REACT_APP_FIREBASE_PROJECT_ID=votre_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
REACT_APP_FIREBASE_APP_ID=votre_app_id

REACT_APP_OPENAI_API_KEY=votre_clé_api_openai

REACT_APP_WP_API_URL=votre_url_wordpress
REACT_APP_WP_USERNAME=votre_username
REACT_APP_WP_APP_PASSWORD=votre_password
```

4. Démarrer l'application :
```bash
npm start
```

## Structure du projet

```
src/
  ├── components/
  │   ├── auth/
  │   ├── content/
  │   ├── wordpress/
  │   └── persona/
  ├── config/
  │   └── firebase.ts
  └── App.tsx
```

## Sécurité

- Toutes les clés API doivent être stockées dans les variables d'environnement
- L'authentification est gérée via Firebase
- Les règles de sécurité Firestore doivent être configurées
- Les tokens WordPress doivent être sécurisés

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request
