// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Ensure you import getAuth
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Optional if using Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Ensure this is called
const auth = getAuth(app); // Make sure auth is created from the initialized app
const storage = getStorage(app);
const database = getDatabase(app); // Optional

// console.log(auth);
export { storage, database, auth };
