import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5tl2KeZzL6K4zNcSuloN9y3SdRgzvXco",
  authDomain: "lab4-crud.firebaseapp.com",
  projectId: "lab4-crud",
  storageBucket: "lab4-crud.firebasestorage.app",
  messagingSenderId: "540746200690",
  appId: "1:540746200690:web:3c2069e3976050e33974eb"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);