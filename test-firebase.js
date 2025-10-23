// Test Firebase connection and authentication
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPE5bk4zESRhzts3xod2YqrUE09j8RfBQ",
  authDomain: "tartdesserts-3b414.firebaseapp.com",
  projectId: "tartdesserts-3b414",
  storageBucket: "tartdesserts-3b414.firebasestorage.app",
  messagingSenderId: "534807668671",
  appId: "1:534807668671:web:c2ad9d868c1a930f86e30a",
  measurementId: "G-CWFFD5JD20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase initialized:', app);
console.log('Auth initialized:', auth);
console.log('Firestore initialized:', db);

// Test authentication state
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user);
});

// Simplified login function (without Firestore update)
export async function testLogin(email, password) {
  try {
    console.log('Attempting login for:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Login successful:', user.email);
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

export { auth, db };
