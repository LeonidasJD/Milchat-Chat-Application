import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApiKey = process.env.FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "milchat-82eed.firebaseapp.com",
  projectId: "milchat-82eed",
  storageBucket: "milchat-82eed.firebasestorage.app",
  messagingSenderId: "181540813779",
  appId: "1:181540813779:web:00b962f79f27fa6e7c8d26",
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db = getFirestore(app);
