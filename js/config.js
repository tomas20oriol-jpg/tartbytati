// Firebase public web configuration for tartdesserts.
// Replace the placeholders with the values from your Firebase console (Project settings > General > SDK setup and configuration).
// These keys are public identifiers for the client SDK and are safe to commit; do not place service-account keys here.

export const firebaseConfig = {
  apiKey: "YOUR_PUBLIC_WEB_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdefghijklmnop", // sustituye por tu appId real
};

// Expose globally for inline scripts that expect `window.firebaseConfig`.
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

export default firebaseConfig;
