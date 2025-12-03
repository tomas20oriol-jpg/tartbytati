import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

export async function signInWithEmailPassword(email, password) {
  if (!email || !password) {
    throw new Error('Introduce un email y una contraseña.');
  }

  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function signOutCurrentUser() {
  await signOut(auth);
}

export function listenToAuthChanges(onChange) {
  return onAuthStateChanged(auth, (user) => {
    if (typeof onChange === 'function') {
      onChange(user);
    }
  });
}

// Ejemplo de conexión con un formulario simple (usa type="module" en el HTML).
const signInForm = document.querySelector('[data-sign-in-form]');
if (signInForm) {
  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = signInForm.querySelector('input[name="email"]').value.trim();
    const password = signInForm.querySelector('input[name="password"]').value;

    try {
      const user = await signInWithEmailPassword(email, password);
      console.info(`Sesión iniciada como ${user.email}`);
    } catch (error) {
      console.error('No se pudo iniciar sesión:', error.message);
      alert('No se pudo iniciar sesión: ' + error.message);
    }
  });
}

const signOutButton = document.querySelector('[data-sign-out]');
if (signOutButton) {
  signOutButton.addEventListener('click', async () => {
    try {
      await signOutCurrentUser();
      console.info('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('No se pudo cerrar sesión:', error.message);
    }
  });
}

listenToAuthChanges((user) => {
  const authStatus = document.querySelector('[data-auth-status]');
  if (authStatus) {
    authStatus.textContent = user ? `Sesión activa: ${user.email}` : 'Sin iniciar sesión';
  }
});
