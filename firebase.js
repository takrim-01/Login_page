import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCk5-UUklx-rJCzeUP4lFJwIqGWhrWE6Nw",
  authDomain: "aera-3952a.firebaseapp.com",
  projectId: "aera-3952a",
  storageBucket: "aera-3952a.firebasestorage.app",
  messagingSenderId: "948547802963",
  appId: "1:948547802963:web:76b205958e94b6f88333a6",
  measurementId: "G-WWJE5PERW8"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.firebaseAuth    = auth;
window.fbSignIn        = signInWithEmailAndPassword;
window.fbSignUp        = createUserWithEmailAndPassword;
window.fbUpdateProfile = updateProfile;
