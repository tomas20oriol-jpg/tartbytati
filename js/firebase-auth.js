// Firebase Authentication Functions
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Initialize Firebase (already done in index.html)
const auth = window.firebaseAuth;
const db = window.firebaseDb;

// Authentication state observer
let currentUser = null;

export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      console.log('Usuario autenticado:', user.email);
      // Load user profile from Firestore
      loadUserProfile(user.uid);
    } else {
      currentUser = null;
      console.log('Usuario no autenticado');
    }
  });
}

// Login with email and password
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date()
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Register new user
export async function registerWithEmail(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      createdAt: new Date(),
      subscription: {
        type: 'free',
        status: 'active',
        startDate: new Date(),
        endDate: null
      },
      preferences: {
        newsletter: false,
        notifications: true
      }
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Login with Google
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        subscription: {
          type: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: null
        }
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error en login con Google:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Login with Facebook
export async function loginWithFacebook() {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        subscription: {
          type: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: null
        }
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error en login con Facebook:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
}

// Load user profile from Firestore
export async function loadUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userInfo = {
        uid: uid,
        name: userData.name,
        email: userData.email,
        subscription: userData.subscription,
        preferences: userData.preferences
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      return userInfo;
    }
  } catch (error) {
    console.error('Error cargando perfil:', error);
    return null;
  }
}

// Update user subscription
export async function updateUserSubscription(uid, subscriptionData) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      subscription: subscriptionData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error actualizando suscripción:', error);
    return { success: false, error: error.message };
  }
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}

// Check if user is authenticated
export function isAuthenticated() {
  return currentUser !== null;
}

// Get user subscription status
export function getUserSubscription() {
  if (currentUser && localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData.subscription;
  }
  return null;
}

// Error message translations
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El email ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/network-request-failed': 'Error de conexión',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde'
  };

  return errorMessages[errorCode] || 'Error desconocido';
}
