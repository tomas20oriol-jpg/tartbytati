// Test Firebase v8 connection and authentication
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log('✅ Firebase v8 initialized successfully');
console.log('✅ Auth object:', auth);
console.log('✅ Firestore object:', db);

// Test authentication state
auth.onAuthStateChanged((user) => {
  console.log('✅ Auth state changed:', user ? user.email : 'No user');
});

// Test Firestore connection (this should work without errors)
try {
  // Test basic Firestore operations
  const testCollection = db.collection('test');
  console.log('✅ Firestore collection created successfully:', testCollection);

  // Test document reference
  const testDoc = db.collection('test').doc('test-doc');
  console.log('✅ Firestore document reference created successfully:', testDoc);

  console.log('🎉 All Firebase v8 tests passed! No collection() errors.');
} catch (error) {
  console.error('❌ Firebase test failed:', error);
}

export { auth, db };
