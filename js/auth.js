// Configuración
const API_BASE_URL = 'http://localhost:3000/api';

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
      
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const userData = {
        name: document.getElementById('register-name').value.trim(),
        email: document.getElementById('register-email').value.trim().toLowerCase(),
        password: password,
        phone: document.getElementById('register-phone')?.value.trim() || '',
        dataProcessingConsent: document.getElementById('data-processing-consent')?.checked || false
      };

      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      if (!userData.dataProcessingConsent) {
        throw new Error('Debes aceptar el tratamiento de datos para continuar');
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      // Guardar token y redirigir
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        showNotification('¡Cuenta creada con éxito!', 'success');
        setTimeout(() => window.location.href = 'account.html', 1500);
      } else {
        throw new Error('No se recibió el token de autenticación');
      }

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

      if (!credentials.email || !credentials.password) {
        throw new Error('Por favor ingresa tu correo y contraseña');
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y redirigir
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Si marcó "Recordarme", guardar refresh token en cookie segura
        if (credentials.remember && data.refreshToken) {
          const expires = new Date();
          expires.setDate(expires.getDate() + 30); // 30 días
          document.cookie = `refreshToken=${data.refreshToken}; path=/; expires=${expires.toUTCString()}; SameSite=Strict${location.protocol === 'https:' ? '; Secure' : ''}`;
        }

        showNotification('¡Bienvenid@ de nuevo!', 'success');
        setTimeout(() => {
          const redirectTo = getUrlParameter('redirect') || 'account.html';
          window.location.href = redirectTo;
        }, 1000);
      } else {
        throw new Error('No se recibió el token de autenticación');
      }

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
  // Si ya existe una notificación, la eliminamos
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Crear notificación
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Estilos CSS para la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s, transform 0.3s;
  `;

  // Colores según el tipo
  if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
  } else if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
  } else {
    notification.style.backgroundColor = '#2196F3';
  }

  // Añadir al DOM
  document.body.appendChild(notification);
  
  // Forzar reflow para la animación
  notification.offsetHeight;
  
  // Mostrar con animación
  notification.style.opacity = '1';
  notification.style.transform = 'translateY(0)';
  
  // Eliminar después de 5 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Obtener parámetros de la URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Verificar autenticación al cargar
function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  const publicPages = ['login.html', 'register.html', 'index.html', ''];
  const privatePages = ['account.html', 'checkout.html', 'profile.html'];
  
  // Si el token está presente pero es inválido
  if (token) {
    // Verificar si el token es válido (opcional)
    const isTokenValid = true; // Aquí podrías validar el token
    if (!isTokenValid) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
      return;
    }
  }

  // Redirecciones basadas en autenticación
  if (token && publicPages.includes(currentPage)) {
    // Si está autenticado y en una página pública, redirigir al dashboard
    window.location.href = 'account.html';
  } else if (!token && privatePages.includes(currentPage)) {
    // Si no está autenticado y en una página privada, redirigir a login
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
  }
}

// Cerrar sesión
async function logout() {
  try {
    // Opcional: Llamar al endpoint de logout del backend
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Limpiar almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Eliminar cookies de sesión
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirigir a la página de inicio de sesión
    window.location.href = 'login.html';
  }
}

// Hacer funciones accesibles globalmente
window.logout = logout;
window.checkAuth = checkAuth;
