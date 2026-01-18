// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAcGBGJzK9kbRbnAVIZP58f33ENuObaDA",
  authDomain: "tammersign-nhl.firebaseapp.com",
  projectId: "tammersign-nhl",
  storageBucket: "tammersign-nhl.firebasestorage.app",
  messagingSenderId: "92435604957",
  appId: "1:92435604957:web:9b2161bf40044d33fa4234",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
