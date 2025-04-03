// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBT6QZjIfBExNkO9GtVxwM9ICCSjnV5NzI",
  authDomain: "ghostline-d6445.firebaseapp.com",
  projectId: "ghostline-d6445",
  storageBucket: "ghostline-d6445.firebasestorage.app",
  messagingSenderId: "1041894226431",
  appId: "1:1041894226431:web:82c0e215ff50b55076cfca"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };