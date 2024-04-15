import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "instagram-next-419818.firebaseapp.com",
  projectId: "instagram-next-419818",
  storageBucket: "instagram-next-419818.appspot.com",
  messagingSenderId: "707678977861",
  appId: "1:707678977861:web:b5a1b5fd1e78fa3ef8082c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
