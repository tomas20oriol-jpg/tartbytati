import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración pública de Firebase (las API keys web no son secretas).
export const firebaseConfig = {
  apiKey: "AIzaSyCPE5bk4zESRhzts3xod2YqrUE09j8RfBQ",
  authDomain: "tartdesserts-3b414.firebaseapp.com",
  projectId: "tartdesserts-3b414",
  storageBucket: "tartdesserts-3b414.firebasestorage.app",
  messagingSenderId: "534807668671",
  appId: "1:534807668671:web:c2ad9d868c1a930f86e30a",
  measurementId: "G-CWFFD5JD20",
};

// Inicializa la app una sola vez, incluso si el bundle importa este archivo varias veces.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
