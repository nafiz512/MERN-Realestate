// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-babe2.firebaseapp.com",
  projectId: "realestate-babe2",
  storageBucket: "realestate-babe2.firebasestorage.app",
  messagingSenderId: "651169324642",
  appId: "1:651169324642:web:9e5042ffdd67843e443b3b",
  measurementId: "G-747RMKQ0CT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
