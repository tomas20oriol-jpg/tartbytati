// Firebase Authentication Functions - Modular (v9+)
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { setUser, clearUser } from './store.js';

// Login with email and password
export async function loginWithEmail(auth, email, password) {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Login successful:', user.email);

    // The onAuthStateChanged listener will handle setting the user state.

    return { success: true, user };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Register new user
export async function registerWithEmail(auth, db, name, email, password) {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Registration successful:', user.email);

    // Update profile with display name
    await updateProfile(user, {
      displayName: name
    });

    // Create user document in Firestore
    const userInfo = {
      uid: user.uid,
      name: name,
      email: email,
      // ... other default fields
    };
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userInfo);

    return { success: true, user };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Login with Google
export async function loginWithGoogle(auth) {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('Google login successful:', user.email);

    // The onAuthStateChanged listener will handle setting the user state.

    return { success: true, user };
  } catch (error) {
    console.error('Error en login con Google:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Login with Facebook
export async function loginWithFacebook(auth) {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('Facebook login successful:', user.email);

    // The onAuthStateChanged listener will handle setting the user state.

    return { success: true, user };
  } catch (error) {
    console.error('Error en login con Facebook:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Logout
export async function logout(auth) {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    await signOut(auth);
    // The onAuthStateChanged listener will clear the user state.
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
}

// Load user profile (simplified)
export async function loadUserProfile(db, uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    }
    
    // Fallback
    return {
      uid: uid,
      subscription: {
        type: 'free',
        status: 'active'
      },
      preferences: {
        newsletter: false,
        notifications: true
      }
    };
  } catch (error) {
    console.error('Error cargando perfil:', error);
    return null;
  }
}

// Update user subscription
export async function updateUserSubscription(uid, subscriptionData) {
  // This should now be a Firebase Function that updates Firestore,
  // and the change will be reflected automatically on the client.
}

// Get current user
export function getCurrentUser(auth) {
  return auth ? auth.currentUser : null;
}

// Check if user is authenticated
export function isAuthenticated(auth) {
  return auth ? auth.currentUser !== null : false;
}

// Get user subscription status
export function getUserSubscription(state) {
  return state.user ? state.user.subscription : null;
}

// This function now lives in the store and is called by the listener
export function updateAuthUI(state) {
  const loginLink = document.getElementById('login-link');
  const userNameDisplay = document.getElementById('user-name-display');
  const user = state.user;

  if (loginLink) {
    if (user) {
      loginLink.textContent = 'MI CUENTA';
      loginLink.href = 'account.html';
      if (userNameDisplay) {
        userNameDisplay.textContent = user.name || user.email.split('@')[0];
        userNameDisplay.style.display = 'inline';
      }
    } else {
      loginLink.textContent = 'LOGIN';
      loginLink.href = 'login.html';
      if (userNameDisplay) {
        userNameDisplay.style.display = 'none';
      }
    }
  }
}

// Initialize auth state listener
export function initAuth(auth, db) {
  if (auth) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // When auth state changes, get the full profile from Firestore
        const profile = await loadUserProfile(db, user.uid);
        // And update our global state store
        setUser(profile || { uid: user.uid, email: user.email, name: user.displayName });
      } else {
        // If user logs out, clear the user from our global state
        clearUser();
      }
    });
  }
}

// Error message translations
export function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El email ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/network-request-failed': 'Error de conexión',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde',
    'auth/popup-closed-by-user': 'Ventana de login cerrada por el usuario'
  };

  return errorMessages[errorCode] || 'Error desconocido';
}
