// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_KEapfEjuaNznyqAqXIOnro6AAbfV8A0",
  authDomain: "wod-app-b4006.firebaseapp.com",
  projectId: "wod-app-b4006",
  storageBucket: "wod-app-b4006.firebasestorage.app",
  messagingSenderId: "1030888066866",
  appId: "1:1030888066866:web:490d9d675acb7df4e1112b",
  measurementId: "G-1Y0G7MD9WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);