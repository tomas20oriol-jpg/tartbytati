# Plantilla segura para Firebase Web (Auth + Firestore)

Esta carpeta describe y aporta código listo para copiar en un proyecto web estático usando Firebase de forma segura. Todo el código es moderno (ES modules) y funciona directamente en el navegador con los SDK v11.

## Archivos incluidos

- `js/firebase.js`: inicializa la app de Firebase y expone `app`, `auth` y `db`.
- `js/auth-example.js`: ejemplo de inicio/cierre de sesión con email/contraseña y escucha de cambios de sesión.
- `js/firestore-example.js`: ejemplo de escritura/lectura en Firestore ligada al usuario autenticado.
- `firestore-rules.json`: reglas de seguridad recomendadas para proteger los datos de Firestore.

## Cómo usarlo en tu HTML

1. Copia tu configuración de Firebase en `js/firebase.js` (el objeto `firebaseConfig`). Las API keys públicas no son secretas, pero evita subir cuentas de servicio.
2. Añade en tu HTML etiquetas `script` con `type="module"` apuntando a los archivos:

```html
<script type="module" src="./js/firebase.js"></script>
<script type="module" src="./js/auth-example.js"></script>
<script type="module" src="./js/firestore-example.js"></script>
```

3. Crea un formulario sencillo para login y otra zona para notas (siguiendo los `data-` attributes usados en los ejemplos):

```html
<form data-sign-in-form>
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Contraseña" required />
  <button type="submit">Iniciar sesión</button>
</form>
<button data-sign-out>Cerrar sesión</button>
<p data-auth-status>Sin iniciar sesión</p>

<form data-note-form>
  <textarea name="note" placeholder="Añade una nota"></textarea>
  <button type="submit">Guardar</button>
</form>
<ul data-notes></ul>
```

4. Publica las reglas de Firestore con `firebase deploy --only firestore:rules` para bloquear accesos no autorizados.

## Reglas recomendadas (Firestore)

El archivo `firestore-rules.json` define un modelo privado por usuario: cada documento está dentro de `users/{uid}` y solo el dueño puede leer/escribirlo. El resto del acceso queda denegado por defecto.

```rust
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Datos privados de cada usuario
    match /users/{userId}/{document=**} {
      allow read, write: if isOwner(userId);
    }

    // Espacio público de solo lectura (opcional)
    match /public/{documentId} {
      allow read: if true;
      allow write: if false;
    }

    // Por defecto todo lo demás queda bloqueado
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## ¿Dónde van las claves privadas?

- **Frontend (este repo)**: solo necesita `firebaseConfig` (API key y dominios públicos). No coloques cuentas de servicio ni claves privadas aquí.
- **Backend**: las credenciales de administrador deben vivir en el servidor (Cloud Functions, Cloud Run, tu backend propio) y cargarse desde variables de entorno o proveedores de secretos (Secret Manager, Vault). Nunca se exponen en JavaScript que se sirva al navegador.

Con esta estructura tienes un punto de partida seguro para autenticación con email/contraseña y datos privados por usuario en Firestore.
