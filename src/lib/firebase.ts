
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqhxk3nagz21ar8M3V0cg7Er0rHH88AXc",
  authDomain: "zyntarix--core.firebaseapp.com",
  projectId: "zyntarix--core",
  storageBucket: "zyntarix--core.firebasestorage.app",
  messagingSenderId: "401646215438",
  appId: "1:401646215438:web:11f0d10c4229518f71375f",
  measurementId: "G-FYBYPJGVS0"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Super Admin definition
export const ADMIN_EMAIL = "zyntarix.official@gmail.com";
