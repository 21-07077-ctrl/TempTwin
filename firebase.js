// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref as rtdbRef, set as rtdbSet, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHAEwVg_zCqTkqjYkF3XQkVNRFLiKJrDg",
  authDomain: "temperature-12e0b.firebaseapp.com",
  databaseURL: "https://temperature-12e0b-default-rtdb.firebaseio.com",
  projectId: "temperature-12e0b",
  storageBucket: "temperature-12e0b.appspot.com",
  messagingSenderId: "644938502811",
  appId: "1:644938502811:web:2f28f6cc780b74d2d96f38"
};

const app = initializeApp(firebaseConfig);

const dbRT = getDatabase(app);
const dbFS = getFirestore(app);

export { dbRT, rtdbRef, rtdbSet, onValue, dbFS, collection, doc, setDoc, getDocs };
