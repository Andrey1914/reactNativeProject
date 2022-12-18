import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBy4ht3ot7ZxrfYeHqLLVjpx_R3ZyyebFQ",
  authDomain: "reactnative-6d76f.firebaseapp.com",
  projectId: "reactnative-6d76f",
  storageBucket: "reactnative-6d76f.appspot.com",
  messagingSenderId: "1073067977345",
  appId: "1:1073067977345:web:504ece4eeb8d7e80093b80",
  measurementId: "G-L8GPPXBGEY",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
