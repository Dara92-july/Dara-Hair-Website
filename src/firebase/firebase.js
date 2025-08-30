// src/firebase.js (or firebase.jsx if you're using JSX)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrqJaS_dKN5zGXw3tJUMBGKEvkptps1_8",
  authDomain: "dara-hair.firebaseapp.com",
  projectId: "dara-hair",
  storageBucket: "dara-hair.appspot.com",
  messagingSenderId: "34393128953",
  appId: "1:34393128953:web:4327d4a3edcb3bf1d74728",
  measurementId: "G-6FVNQN6WBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Explicit exports
export { db, auth };