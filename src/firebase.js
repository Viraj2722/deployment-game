import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOErigwqHVOSDWuwdZtUhe6_4kG5I7Wro",
  authDomain: "csigame.firebaseapp.com",
  projectId: "csigame",
  storageBucket: "csigame.appspot.com", 
  messagingSenderId: "1056204497965",
  appId: "1:1056204497965:web:2cd0e49e8808fdb12504a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };