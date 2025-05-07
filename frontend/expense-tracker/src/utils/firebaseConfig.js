// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8vYGXU-yT2MT3lBE6Bbg7r0O1KUCHSdA",
    authDomain: "bucktrack-final.firebaseapp.com",
    projectId: "bucktrack-final",
    storageBucket: "bucktrack-final.firebasestorage.app",
    messagingSenderId: "191175339154",
    appId: "1:191175339154:web:e4f1f636bf7145d6034a4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };