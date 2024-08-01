// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "CLIENT_ONE",
    authDomain: "CLIENT_TWO",
    projectId: "CLIENT_THREE",
    storageBucket: "CLIENT_FOUR",
    messagingSenderId: "CLIENT_FIVE",
    appId: "CLIENT_SIX",
    measurementId: "CLIENT_SEVEN"
  };

// Initialize Firebaseconst app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export {
    app,
    firestore
}