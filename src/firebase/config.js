import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBy4ht3ot7ZxrfYeHqLLVjpx_R3ZyyebFQ",
  authDomain: "reactnative-6d76f.firebaseapp.com",
  projectId: "reactnative-6d76f",
  storageBucket: "reactnative-6d76f.appspot.com",
  messagingSenderId: "1073067977345",
  appId: "1:1073067977345:web:504ece4eeb8d7e80093b80",
  measurementId: "G-L8GPPXBGEY",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);

export { app, firebase };
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
