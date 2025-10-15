// Firebase configuration
// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase (si es necesario en el servidor)
let firebaseApp = null;
if (typeof window === 'undefined') { // Solo inicializar en servidor si es necesario
  const { initializeApp } = require('firebase/app');
  firebaseApp = initializeApp(firebaseConfig);
}

module.exports = { firebaseConfig, firebaseApp };
