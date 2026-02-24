import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPCTHlhmOwqCi-YdgiVSG2-WpfZs7jaTU",
  authDomain: "smart-grocery-store-f29e8.firebaseapp.com",
  projectId: "smart-grocery-store-f29e8",
  storageBucket: "smart-grocery-store-f29e8.firebasestorage.app",
  messagingSenderId: "660201987730",
  appId: "1:660201987730:web:9ed1177f2df6e1bc22104b",
  measurementId: "G-F5DT7Y4S5F"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber };
