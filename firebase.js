// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ5owKD2WANbDKw97rtHgKiN9t0A3aEqY",
  authDomain: "pantry-tracker-a179b.firebaseapp.com",
  projectId: "pantry-tracker-a179b",
  storageBucket: "pantry-tracker-a179b.appspot.com",
  messagingSenderId: "57494534300",
  appId: "1:57494534300:web:591e0b2e894e962ccb5559",
  measurementId: "G-WBL3M256LT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {
    app,
    firestore,
    auth
};
