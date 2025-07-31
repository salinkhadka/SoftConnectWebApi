// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAO_TynZthss9lGX8gHVOYCeZZivOLOLsQ",
  authDomain: "softconnect-1082b.firebaseapp.com",
  projectId: "softconnect-1082b",
  storageBucket: "softconnect-1082b.firebasestorage.app",
  messagingSenderId: "1038978543621",
  appId: "1:1038978543621:web:37f9f89b3390eb21946c6c",
  measurementId: "G-XK9XWZ13D1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Set up Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔥 ADD THIS LINE to force account selection
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, provider };