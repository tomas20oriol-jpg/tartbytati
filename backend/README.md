# tartdesserts Backend API

Backend seguro y compliant con todas las normativas legales para tartdesserts.

## 🔒 Características de Seguridad

### Implementadas
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Bcrypt** para hash de contraseñas (12 rounds)
- ✅ **Rate Limiting** para prevenir ataques de fuerza bruta
- ✅ **Helmet.js** para headers de seguridad HTTP
- ✅ **CORS** configurado correctamente
- ✅ **XSS Protection** contra ataques de scripting
- ✅ **NoSQL Injection Protection** con mongo-sanitize
- ✅ **HPP** prevención de contaminación de parámetros
- ✅ **Account Locking** después de múltiples intentos fallidos
- ✅ **HTTPS Ready** (configurar en producción)
- ✅ **Secure Cookies** con httpOnly y sameSite
- ✅ **Input Validation** con express-validator
- ✅ **Error Handling** sin exponer información sensible

## 📋 Cumplimiento Legal

### GDPR (Reglamento General de Protección de Datos)
- ✅ Consentimiento explícito para procesamiento de datos
- ✅ Derecho al olvido (soft delete + anonymization)
- ✅ Derecho de acceso a datos personales
- ✅ Derecho de portabilidad de datos
- ✅ Registro de consentimientos con fecha
- ✅ Gestión de cookies con consentimiento

### LOPD (Ley Orgánica de Protección de Datos - España)
- ✅ Cumplimiento con normativa española
- ✅ Información clara sobre uso de datos
- ✅ Medidas de seguridad técnicas y organizativas

### Otras Normativas
- ✅ Política de privacidad
- ✅ Términos y condiciones
- ✅ Política de cookies
- ✅ Aviso legal

## 🚀 Instalación

### Requisitos
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm o yarn

### Pasos

1. **Instalar dependencias**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. **Iniciar MongoDB**
```bash
# Local
mongod

# O usar MongoDB Atlas (recomendado para producción)
```

4. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📁 Estructura del Proyecto

```
backend/
├── controllers/        # Lógica de negocio
│   └── auth.js        # Autenticación
├── middleware/        # Middleware personalizado
│   ├── auth.js       # Protección de rutas
│   └── errorHandler.js
├── models/           # Modelos de MongoDB
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/           # Definición de rutas
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── subscriptions.js
│   └── payments.js
├── utils/            # Utilidades
│   └── sendEmail.js
├── .env.example      # Variables de entorno ejemplo
├── package.json
├── server.js         # Punto de entrada
└── README.md
```

## 🔐 API Endpoints

### Autenticación

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "María García",
  "email": "maria@example.com",
  "password": "password123",
  "dataProcessingConsent": true,
  "gdprConsent": {
    "marketing": false,
    "analytics": true
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "maria@example.com",
  "password": "password123"
}
```

#### Obtener usuario actual
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Cerrar sesión
```http
GET /api/auth/logout
```

#### Olvidé mi contraseña
```http
POST /api/auth/forgotpassword
Content-Type: application/json

{
  "email": "maria@example.com"
}
```

#### Restablecer contraseña
```http
PUT /api/auth/resetpassword/:resettoken
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### Productos

```http
GET /api/products              # Obtener todos los productos
GET /api/products/:id          # Obtener un producto
POST /api/products             # Crear producto (Admin)
PUT /api/products/:id          # Actualizar producto (Admin)
DELETE /api/products/:id       # Eliminar producto (Admin)
```

### Pedidos

```http
GET /api/orders                # Obtener pedidos del usuario
POST /api/orders               # Crear pedido
GET /api/orders/:id            # Obtener un pedido
GET /api/orders/admin/all      # Todos los pedidos (Admin)
```

### Suscripciones

```http
GET /api/subscriptions/status  # Estado de suscripción
POST /api/subscriptions/create # Crear suscripción
POST /api/subscriptions/cancel # Cancelar suscripción
GET /api/subscriptions/recipes # Obtener recetas (requiere suscripción)
```

### Pagos

```http
POST /api/payments/create-payment-intent  # Crear intención de pago Stripe
POST /api/payments/webhook                # Webhook de Stripe
GET /api/payments/history                 # Historial de pagos
```

## 🛡️ Medidas de Seguridad Implementadas

### 1. Autenticación y Autorización
- JWT con expiración configurable
- Refresh tokens (implementar si es necesario)
- Roles de usuario (user, admin)
- Verificación de email obligatoria
- Bloqueo de cuenta tras intentos fallidos

### 2. Protección de Contraseñas
- Hash con bcrypt (12 rounds)
- Validación de fortaleza mínima
- No se almacenan en texto plano
- Reset seguro con tokens temporales

### 3. Rate Limiting
- Límite general: 100 req/15min
- Login: 5 intentos/15min
- Previene ataques de fuerza bruta

### 4. Headers de Seguridad (Helmet)
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

### 5. Validación de Datos
- Sanitización de inputs
- Validación con express-validator
- Prevención de NoSQL injection
- Prevención de XSS

### 6. Cookies Seguras
- httpOnly: true
- secure: true (en producción)
- sameSite: 'strict'

## 🌐 Despliegue en Producción

### Variables de Entorno Críticas

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=clave_muy_segura_y_larga
COOKIE_SECURE=true
CORS_ORIGIN=https://www.tartdesserts.com
```

### Checklist de Producción

- [ ] Configurar HTTPS (Let's Encrypt)
- [ ] Usar MongoDB Atlas o servidor dedicado
- [ ] Configurar dominio y DNS
- [ ] Habilitar logs de producción
- [ ] Configurar backups automáticos
- [ ] Implementar monitoreo (PM2, New Relic)
- [ ] Configurar firewall
- [ ] Revisar todas las variables de entorno
- [ ] Probar rate limiting
- [ ] Configurar CDN para assets
- [ ] Implementar CI/CD

### Servicios Recomendados

- **Hosting**: Railway, Render, DigitalOcean, AWS
- **Base de Datos**: MongoDB Atlas
- **Email**: SendGrid, Mailgun
- **Pagos**: Stripe
- **CDN**: Cloudflare
- **Monitoreo**: PM2, New Relic, Sentry

## 📧 Configuración de Email

### Gmail (Desarrollo)
1. Activar verificación en 2 pasos
2. Generar contraseña de aplicación
3. Usar en EMAIL_PASSWORD

### Producción
Usar servicios profesionales:
- SendGrid
- Mailgun
- Amazon SES

## 💳 Integración de Pagos (Stripe)

```javascript
// Ejemplo de creación de pago
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: 299, // 2.99€ en centavos
  currency: 'eur',
  customer: user.stripeCustomerId
});
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

## 📝 Logs

En desarrollo: logs en consola
En producción: usar Winston o Morgan con archivos

## 🆘 Soporte

Para problemas o preguntas:
- Email: soporte@tartdesserts.com
- Issues: GitHub repository

## 📄 Licencia

Propietario - tartdesserts © 2025
