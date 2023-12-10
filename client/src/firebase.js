// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sunriseestatemern.firebaseapp.com",
  projectId: "sunriseestatemern",
  storageBucket: "sunriseestatemern.appspot.com",
  messagingSenderId: "620898573200",
  appId: "1:620898573200:web:2c6fc86a25b86a68f7f115",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
