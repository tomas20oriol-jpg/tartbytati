import { auth, db } from './firebase.js';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

function requireAuth() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Necesitas iniciar sesión para acceder a tus datos.');
  }
  return user;
}

export async function addNote(text) {
  const user = requireAuth();
  const notesCollection = collection(db, 'users', user.uid, 'notes');

  return addDoc(notesCollection, {
    text,
    createdAt: serverTimestamp(),
    owner: user.uid,
  });
}

export async function listNotes() {
  const user = requireAuth();
  const notesCollection = collection(db, 'users', user.uid, 'notes');
  const snapshot = await getDocs(notesCollection);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Ejemplo de uso mínimo con elementos de la página.
const noteForm = document.querySelector('[data-note-form]');
if (noteForm) {
  noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = noteForm.querySelector('textarea[name="note"]');
    const text = input.value.trim();
    if (!text) return;

    try {
      await addNote(text);
      input.value = '';
      await renderNotes();
    } catch (error) {
      console.error('No se pudo guardar la nota:', error.message);
      alert('No se pudo guardar la nota: ' + error.message);
    }
  });
}

const notesList = document.querySelector('[data-notes]');
async function renderNotes() {
  if (!notesList) return;
  try {
    const notes = await listNotes();
    notesList.innerHTML = notes
      .map((note) => `<li><strong>${new Date(note.createdAt?.seconds ? note.createdAt.seconds * 1000 : Date.now()).toLocaleString()}</strong>: ${note.text}</li>`)
      .join('');
  } catch (error) {
    console.warn('No se pudieron listar las notas:', error.message);
  }
}

renderNotes();
