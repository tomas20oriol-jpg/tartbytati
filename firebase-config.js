// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPE5bk4zESRhzts3xod2YqrUE09j8RfBQ",
  authDomain: "tartdesserts-3b414.firebaseapp.com",
  projectId: "tartdesserts-3b414",
  storageBucket: "tartdesserts-3b414.appspot.com",
  messagingSenderId: "534807668671",
  appId: "1:534807668671:web:c2ad9d868c1a930f86e30a"
};

// Initialize Firebase (si es necesario en el servidor)
let firebaseApp = null;
if (typeof window === 'undefined') { // Solo inicializar en servidor si es necesario
  const { initializeApp } = require('firebase/app');
  firebaseApp = initializeApp(firebaseConfig);
}

module.exports = { firebaseConfig, firebaseApp };
