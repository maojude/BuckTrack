// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO5rRtqY1Z2kwYBYimKEseNomXxWDzMTs",
  authDomain: "bucktrack-v1.firebaseapp.com",
  projectId: "bucktrack-v1",
  storageBucket: "bucktrack-v1.firebasestorage.app",
  messagingSenderId: "306910393577",
  appId: "1:306910393577:web:9ff0d98530ef22d1d52c78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };