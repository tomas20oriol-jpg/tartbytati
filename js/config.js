// Firebase public web configuration for tartdesserts.
// Estas claves son identificadores públicos del SDK web; no incluyas llaves privadas de servidor aquí.
export const firebaseConfig = {
  apiKey: "AIzaSyCPE5bk4zESRhzts3xod2YqrUE09j8RfBQ",
  authDomain: "tartdesserts-3b414.firebaseapp.com",
  projectId: "tartdesserts-3b414",
  storageBucket: "tartdesserts-3b414.firebasestorage.app",
  messagingSenderId: "534807668671",
  appId: "1:534807668671:web:c2ad9d868c1a930f86e30a",
  measurementId: "G-CWFFD5JD20",
};

// Expose globally for inline scripts that expect `window.firebaseConfig`.
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

export default firebaseConfig;
