// Firebase configuration template for tartdesserts
// 1. Copy this file to config.js
// 2. Fill in your actual Firebase project configuration.
// 3. Make sure config.js is in your .gitignore file (already added in the repo).

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Expose config globally for inline scripts that expect it
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
}

// Support CommonJS environments (e.g., server-side scripts)
if (typeof module !== 'undefined') {
  module.exports = { firebaseConfig };
}
