import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2rGDwZjOO5r9y4Ikr2KAah82oGpa4Tp4",
  authDomain: "peak7theaters-fdcc5.firebaseapp.com",
  projectId: "peak7theaters-fdcc5",
  storageBucket: "peak7theaters-fdcc5.appspot.com",
  messagingSenderId: "946805274533",
  appId: "1:946805274533:web:1d6a1f793b2afd1fc51a4c",
  measurementId: "G-8SF6KD3N6X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
