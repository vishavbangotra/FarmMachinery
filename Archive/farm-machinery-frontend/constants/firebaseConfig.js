import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-T33y2BOCd13gKyNHhEPBjIwMU8l6JF4",
  authDomain: "farmmachinery-dfe92.firebaseapp.com",
  projectId: "farmmachinery-dfe92",
  storageBucket: "farmmachinery-dfe92.firebasestorage.app",
  messagingSenderId: "16546252983",
  appId: "1:16546252983:web:cac46e4a2ce6bd18a4e532",
  measurementId: "G-G93NDJ7JTB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
