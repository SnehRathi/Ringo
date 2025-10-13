// lib/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase config (only public values are exposed to client)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  // databaseURL only if you plan to use realtime db on server
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Prevent re-initialization in Next.js (hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, auth, storage, database };
