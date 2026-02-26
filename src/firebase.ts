import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDu0wzw-Ho3Iueu7tuzUls79hUqoraXHJI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sorifbazar-ae928.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sorifbazar-ae928",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sorifbazar-ae928.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "607704820078",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:607704820078:web:de466f7154a5e47c80f97f",
  measurementId: "G-TRX9QJVN67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Database Design & Initialization
 * Firestore is schema-less, meaning collections are created automatically 
 * when the first document is added. 
 * 
 * The data structure is defined in src/types.ts:
 * - 'ads' collection: Stores all advertisements
 * - 'users' collection: (Optional) Can be used for extended user profiles
 */

export default app;
