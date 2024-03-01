// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d836d.firebaseapp.com",
  projectId: "mern-blog-d836d",
  storageBucket: "mern-blog-d836d.appspot.com",
  messagingSenderId: "13092670227",
  appId: "1:13092670227:web:6ae72413329b9529cea8e6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);