// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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


// Initialize Firebaseconst app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export {
    app,
    firestore
}