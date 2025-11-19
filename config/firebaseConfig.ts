// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXjRBot2yTKMNj0z4YK86nAnVL_cDiukM",
  authDomain: "pbpmobile-51a40.firebaseapp.com",
  projectId: "pbpmobile-51a40",
  storageBucket: "pbpmobile-51a40.firebasestorage.app",
  messagingSenderId: "1042420101172",
  appId: "1:1042420101172:web:321f6a297a7b131cad1a61",
  measurementId: "G-7V9F1G19FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);


export default app;
