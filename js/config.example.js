// Firebase configuration template for tartdesserts
// 1. Copy this file to config.js (or edit config.js directly).
// 2. Fill in your actual Firebase project configuration from the Firebase console.

export const firebaseConfig = {
  apiKey: "YOUR_PUBLIC_WEB_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdefghijklmnop",
};

// Expose config globally for inline scripts that expect it
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
}

export default firebaseConfig;
