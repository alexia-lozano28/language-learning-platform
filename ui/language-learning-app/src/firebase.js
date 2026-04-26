// Import the functions you need from the SDKs you need
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDiTLaI9EL3j4MI4JYEGERtIJsdpvDhzs",
  authDomain: "language-platform-f9769.firebaseapp.com",
  projectId: "language-platform-f9769",
  // storageBucket: "language-platform-f9769.firebasestorage.app",
  storageBucket: "language-platform-f9769.appspot.com", // ✅ BIEN
  messagingSenderId: "888869663031",
  appId: "1:888869663031:web:16bf8be3f13d63f40aeab2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);