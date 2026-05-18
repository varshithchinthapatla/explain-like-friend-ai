import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9KWIagsUFVRmwwZpxxN8_aeqBjHWKDvI",
  authDomain: "explain-like-friend-ai.firebaseapp.com",
  projectId: "explain-like-friend-ai",
  storageBucket: "explain-like-friend-ai.firebasestorage.app",
  messagingSenderId: "944767893929",
  appId: "1:944767893929:web:2f95db6c2bc6f0aaeec4b8",
  measurementId: "G-1459XRQ9HY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();