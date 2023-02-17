import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";

import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBy4ht3ot7ZxrfYeHqLLVjpx_R3ZyyebFQ",
  authDomain: "reactnative-6d76f.firebaseapp.com",
  projectId: "reactnative-6d76f",
  storageBucket: "reactnative-6d76f.appspot.com",
  messagingSenderId: "1073067977345",
  appId: "1:1073067977345:web:504ece4eeb8d7e80093b80",
  measurementId: "G-L8GPPXBGEY",
};

let app;
let auth;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth();
}
export { app, auth };
export const db = getFirestore(app);
