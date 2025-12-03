# tartdesserts - Portfolio Project

## 🚀 Demo en Vivo

**¡Ve el proyecto funcionando!**

- **Sitio web**: [https://tomas20oriol-jpg.github.io/tartdesserts](https://tomas20oriol-jpg.github.io/tartdesserts)
- **Funcionalidades**: E-commerce completo con carrito, autenticación Firebase, y sistema de pagos Stripe

## 📋 Descripción del Proyecto

**tartdesserts** es una plataforma de e-commerce para una pastelería artesanal que incluye:

- ✅ **Frontend moderno** con HTML5, CSS3, JavaScript vanilla
- ✅ **Sistema de autenticación** con Firebase Auth (Google, Email/Password)
- ✅ **Carrito de compras** con localStorage y gestión de estado
- ✅ **Integración con Stripe** para pagos y suscripciones
- ✅ **Firebase Functions** para backend serverless
- ✅ **Responsive design** para todos los dispositivos
- ✅ **Webhooks** para procesamiento automático de pagos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Functions (Node.js)
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Pagos**: Stripe API
- **Deployment**: GitHub Pages + Firebase Hosting

## � Documentación detallada (`/docs`)

Además de este README, encontrarás guías específicas en la carpeta `docs/`:

| Archivo | Descripción |
| --- | --- |
| `AUTHENTICATION-SETUP.md` | Configuración de Firebase Auth y flujo de login/logout. |
| `FIREBASE_FIX_README.md` | Notas de mantenimiento para Hosting/Firestore. |
| `PAGOS-README.md` | Guía de integración completa con Stripe (checkout, suscripciones, webhooks). |
| `SECURITY.md` | Checklist de seguridad (env, CORS, políticas de cookies, mejores prácticas). |
| `STRIPE-SETUP-GUIDE.md` | Pasos rápidos para crear productos, price IDs y webhooks en Stripe. |
| `README.frontend.md` | Referencia rápida del frontend estático anterior (scripts y estilos). |

## �🚀 Instalación Rápida para Desarrolladores

### 1. Clonar el repositorio
```bash
git clone https://github.com/tomas20oriol-jpg/tartdesserts.git
cd tartdesserts
```

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus propias claves
nano .env
```

### 3. Instalar dependencias (Firebase Functions)
```bash
cd functions
npm install
cd ..
```

### 4. Configurar Firebase
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Configurar proyecto (elige tu proyecto o crea uno nuevo)
firebase init

# Configurar variables de entorno
firebase functions:config:set stripe.secret_key="tu_stripe_secret_key"
firebase functions:config:set stripe.webhook_secret="tu_webhook_secret"
```

### 5. Ejecutar en desarrollo
```bash
# Backend (emulador de Firebase Functions)
cd functions
npm run serve

# Frontend estático
cd ..
python -m http.server 8000   # o cualquier servidor local
```

## 🔧 Configuración

### Variables de Entorno Requeridas

Crea un archivo `.env` con:

```env
# Firebase Configuration
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com

# Stripe Configuration (para producción)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URLs de Stripe
STRIPE_SUCCESS_URL=https://tuproyecto.github.io/success
STRIPE_CANCEL_URL=https://tuproyecto.github.io/cancel

# Stripe Price IDs
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
```

### Configuración de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. Crea productos para suscripciones mensuales y anuales
3. Configura webhooks para estos eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`

## 📁 Estructura del Proyecto

```
tartdesserts/
├── .env.example          # Variables de entorno de ejemplo
├── .gitignore           # Archivos a ignorar en git
├── firebase.json        # Configuración de Firebase
├── functions/           # Firebase Functions
│   ├── index.js        # Funciones del backend
│   └── package.json    # Dependencias de functions
├── js/                 # JavaScript del frontend
│   ├── script.js       # Lógica principal
│   ├── firebase-auth.js # Funciones de autenticación
│   └── cookies.js      # Gestión de cookies
├── css/                # Hojas de estilo
├── assets/             # Imágenes y recursos
├── *.html              # Páginas del sitio
└── README.md           # Este archivo
```

## 🎯 Características Destacadas

### Frontend
- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **Carrito Unificado**: Funciona en todas las páginas
- **Sistema de Autenticación**: Login/logout con múltiples proveedores
- **Animaciones Smooth**: Experiencia de usuario fluida

### Backend
- **Serverless**: Firebase Functions para procesamiento
- **Pagos Seguros**: Integración completa con Stripe
- **Webhooks**: Actualización automática de estados
- **Base de Datos**: Firestore para datos en tiempo real

### Seguridad
- **Variables de Entorno**: Toda configuración sensible protegida
- **Validación**: Sanitización de datos en frontend y backend
- **CORS**: Configuración segura de APIs
- **HTTPS**: Todas las conexiones seguras

## 🚀 Deployment

### GitHub Pages (Frontend)
```bash
# El frontend ya está desplegado automáticamente en:
# https://tomas20oriol-jpg.github.io/tartdesserts
```

### Firebase Functions (Backend)
```bash
# Desplegar functions
firebase deploy --only functions

# Ver logs
firebase functions:log
```

## 🧪 Testing

Para probar el proyecto localmente:

1. **Configura Firebase Emulators** (opcional)
2. **Usa tarjetas de prueba de Stripe** en modo sandbox
3. **Prueba el flujo completo**: registro → carrito → pago → suscripción

## 📝 Notas para Portfolio

Este proyecto demuestra:

- ✅ **Desarrollo Full-Stack** con JavaScript moderno
- ✅ **Integración de APIs** (Stripe, Firebase)
- ✅ **Gestión de Estado** compleja (carrito, autenticación)
- ✅ **Mejores Prácticas** de seguridad y performance
- ✅ **UI/UX Design** responsive y accesible
- ✅ **DevOps** con deployment automatizado

## 🤝 Contribuir

Si quieres contribuir o hacer fork:

1. Lee las mejores prácticas de seguridad
2. Usa variables de entorno para configuración
3. Mantén la estructura del proyecto
4. Documenta cualquier cambio

## 📄 Licencia

Este proyecto es para fines de portfolio y demostración.

---

**¡Gracias por revisar mi proyecto!** 🚀

¿Tienes preguntas sobre la implementación? ¡No dudes en contactar!
