// Firebase Authentication Functions - Simplified for v8 compatibility
// This file provides simple authentication functions without ES6 modules

// Firebase will be initialized in each HTML file
// Functions will use the global firebase object

// Login with email and password
async function loginWithEmail(email, password) {
  try {
    if (!window.firebaseAuth) {
      throw new Error('Firebase Auth not initialized');
    }

    await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    const user = window.firebaseAuth.currentUser;

    console.log('Login successful:', user.email);

    // Update localStorage with user info
    const userInfo = {
      uid: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email,
      subscription: {
        type: 'free',
        status: 'active'
      },
      preferences: {
        newsletter: false,
        notifications: true
      }
    };

    localStorage.setItem('user', JSON.stringify(userInfo));

    return { success: true, user };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Register new user
async function registerWithEmail(name, email, password) {
  try {
    if (!window.firebaseAuth) {
      throw new Error('Firebase Auth not initialized');
    }

    await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = window.firebaseAuth.currentUser;

    console.log('Registration successful:', user.email);

    // Update profile with display name
    await user.updateProfile({
      displayName: name
    });

    // Save user info to localStorage
    const userInfo = {
      uid: user.uid,
      name: name,
      email: email,
      subscription: {
        type: 'free',
        status: 'active'
      },
      preferences: {
        newsletter: false,
        notifications: true
      }
    };

    localStorage.setItem('user', JSON.stringify(userInfo));

    return { success: true, user };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Login with Google
async function loginWithGoogle() {
  try {
    if (!window.firebaseAuth) {
      throw new Error('Firebase Auth not initialized');
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    await window.firebaseAuth.signInWithPopup(provider);
    const user = window.firebaseAuth.currentUser;

    console.log('Google login successful:', user.email);

    // Save user info to localStorage
    const userInfo = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      subscription: {
        type: 'free',
        status: 'active'
      },
      preferences: {
        newsletter: false,
        notifications: true
      }
    };

    localStorage.setItem('user', JSON.stringify(userInfo));

    return { success: true, user };
  } catch (error) {
    console.error('Error en login con Google:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Login with Facebook
async function loginWithFacebook() {
  try {
    if (!window.firebaseAuth) {
      throw new Error('Firebase Auth not initialized');
    }

    const provider = new firebase.auth.FacebookAuthProvider();
    await window.firebaseAuth.signInWithPopup(provider);
    const user = window.firebaseAuth.currentUser;

    console.log('Facebook login successful:', user.email);

    // Save user info to localStorage
    const userInfo = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      subscription: {
        type: 'free',
        status: 'active'
      },
      preferences: {
        newsletter: false,
        notifications: true
      }
    };

    localStorage.setItem('user', JSON.stringify(userInfo));

    return { success: true, user };
  } catch (error) {
    console.error('Error en login con Facebook:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Logout
async function logout() {
  try {
    if (!window.firebaseAuth) {
      throw new Error('Firebase Auth not initialized');
    }

    await window.firebaseAuth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
}

// Load user profile (simplified)
async function loadUserProfile(uid) {
  try {
    // Return user info from localStorage for now
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (userData.uid === uid) {
      return userData;
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
async function updateUserSubscription(uid, subscriptionData) {
  try {
    // Update localStorage for now
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    currentUser.subscription = subscriptionData;
    localStorage.setItem('user', JSON.stringify(currentUser));

    return { success: true };
  } catch (error) {
    console.error('Error actualizando suscripción:', error);
    return { success: false, error: error.message };
  }
}

// Get current user
function getCurrentUser() {
  if (window.firebaseAuth) {
    return window.firebaseAuth.currentUser;
  }
  return null;
}

// Check if user is authenticated
function isAuthenticated() {
  if (window.firebaseAuth) {
    return window.firebaseAuth.currentUser !== null;
  }
  return false;
}

// Get user subscription status
function getUserSubscription() {
  if (window.firebaseAuth && window.firebaseAuth.currentUser && localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData.subscription;
  }
  return null;
}

// Initialize auth state listener
function initAuth() {
  if (window.firebaseAuth) {
    window.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
        // Load user profile into localStorage if not exists
        if (!localStorage.getItem('user')) {
          const userInfo = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            subscription: {
              type: 'free',
              status: 'active'
            },
            preferences: {
              newsletter: false,
              notifications: true
            }
          };
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
      } else {
        console.log('Usuario no autenticado');
        localStorage.removeItem('user');
      }
    });
  }
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
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde',
    'auth/popup-closed-by-user': 'Ventana de login cerrada por el usuario'
  };

  return errorMessages[errorCode] || 'Error desconocido';
}

// Make functions globally available
window.loginWithEmail = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.loginWithFacebook = loginWithFacebook;
window.logout = logout;
window.loadUserProfile = loadUserProfile;
window.updateUserSubscription = updateUserSubscription;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.getUserSubscription = getUserSubscription;
window.initAuth = initAuth;
window.getErrorMessage = getErrorMessage;

console.log('Firebase Auth functions loaded globally');
