# Combat Tracker

A D&D 5e initiative and encounter tracker for Game Masters — built with React + Vite, backed by Firebase (Authentication + Firestore).

This is a standalone web app with its own Firebase project, separate from any mobile app project.

## Local development

```bash
npm install
npm run dev
```

## One-time Firebase setup

You'll need a Firebase project before auth or saved data will work. This only has to be done once.

### 1. Create the project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. Name it something like `combat-tracker` (this is separate from any other Firebase project you own — don't reuse an existing one).
3. Google Analytics is optional; you can skip it.

### 2. Enable Authentication

1. In the Firebase console, go to **Build > Authentication > Get started**.
2. Under **Sign-in method**, enable **Email/Password**.

### 3. Create the Firestore database

1. Go to **Build > Firestore Database > Create database**.
2. Choose **Start in production mode** (the security rules in this repo already lock data down per-user).
3. Pick a location close to your users.

### 4. Register a web app and get your config

1. In **Project settings** (gear icon) > **General**, scroll to **Your apps** and click the web icon (`</>`).
2. Give it a nickname (e.g. "Combat Tracker Web") — you don't need Firebase Hosting checked here, we'll set that up separately.
3. Copy the `firebaseConfig` values it gives you.

### 5. Configure local environment variables

```bash
cp .env.example .env
```

Fill in `.env` with the values from step 4:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` is gitignored — never commit real keys.

### 6. Point the Firebase CLI at your project

```bash
npx firebase-tools login
npx firebase-tools use --add
```

Select the project you created in step 1. This updates `.firebaserc` (currently a placeholder in this repo) so `firebase deploy` targets the right project.

### 7. Deploy the Firestore security rules

```bash
npm run deploy:rules
```

This pushes `firestore.rules`, which restricts every document to its owning signed-in user (`users/{uid}/...`).

### 8. Deploy the site to Firebase Hosting

```bash
npm run deploy
```

This builds the app and publishes `dist/` to Firebase Hosting. Your site will be live at `https://<your-project-id>.web.app` (you can attach a custom domain later from **Build > Hosting** in the console).

## What's saved to Firestore

Data lives under `users/{uid}/...` and is only readable/writable by that signed-in user:

- `users/{uid}/characters/{id}` — saved player characters (name, max HP, AC), reusable across encounters.
- `users/{uid}/customMonsters/{id}` — a personal monster library beyond the built-in SRD list.

Encounter state itself (the current combatant list, HP, conditions, etc.) still lives in the browser's `localStorage` and is not synced to Firestore.
