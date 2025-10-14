// auth.js - Manejo de autenticación
document.addEventListener('DOMContentLoaded', function() {
  initAuthTabs();
  initRegisterForm();
  initLoginForm();
  checkAuth();
});

// ======================
// 1. Registro de Usuario
// ======================
async function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Creando cuenta...';

    try {
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-password-confirm').value;
      
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

            const userData = {
        name: document.getElementById('register-name').value.trim(),
        email: document.getElementById('register-email').value.trim().toLowerCase(),
        password: password,
        phone: document.getElementById('register-phone')?.value.trim() || '',
        dataProcessingConsent: document.getElementById('data-processing-consent').checked,
        gdprConsent: {
          marketing: document.getElementById('marketing-consent').checked,
          analytics: false,
          consentDate: new Date().toISOString()
        }
      };
      // Validación básica
            if (!userData.dataProcessingConsent) {
        throw new Error('Debes aceptar el tratamiento de datos para continuar');
      }

      // Enviar al backend
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      // Guardar token y redirigir
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showNotification('¡Cuenta creada con éxito!', 'success');
      setTimeout(() => window.location.href = 'account.html', 1500);

    } catch (error) {
      showNotification(error.message, 'error');
      console.error('Error en registro:', error);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// ==================
// 2. Inicio de Sesión
// ==================
async function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Iniciando sesión...';

    try {
      const credentials = {
        email: document.getElementById('login-email').value.trim().toLowerCase(),
        password: document.getElementById('login-password').value,
        remember: document.getElementById('remember-me')?.checked || false
      };

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y redirigir
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Si marcó "Recordarme", guardar cookie
      if (credentials.remember) {
        document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
      }

      showNotification('¡Bienvenid@ de nuevo!', 'success');
      setTimeout(() => window.location.href = 'account.html', 1000);

    } catch (error) {
      showNotification(error.message, 'error');
      console.error('Error en login:', error);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// ==================
// 3. Utilidades
// ==================
function initAuthTabs() {
  // Cambiar entre pestañas de login/registro
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      // Actualizar pestañas activas
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Mostrar formulario correspondiente
      document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${target}-form`);
      });
    });
  });
}

function showNotification(message, type = 'info') {
  // Crear notificación
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Añadir al DOM
  document.body.appendChild(notification);
  
  // Eliminar después de 5 segundos
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Verificar autenticación al cargar
function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  
  // Si el usuario está autenticado y está en login/register, redirigir
  if (token && currentPage === 'login.html') {
    window.location.href = 'account.html';
  }
  
  // Si no está autenticado y está en una página privada, redirigir a login
  else if (!token && ['account.html', 'checkout.html'].includes(currentPage)) {
    window.location.href = 'login.html';
  }
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.href = 'login.html';
}

// Hacer logout accesible globalmente
window.logout = logout;

