# Sistema de Pagos - tartdesserts

Este documento describe cómo configurar y usar el sistema de pagos integrado con Stripe para el proyecto tartdesserts.

## 🚀 Configuración Inicial

### 1. Configurar Stripe Account

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. Crea una cuenta si no tienes una
3. Obtén tus claves API:
   - **Publishable Key** (pk_test_... para pruebas)
   - **Secret Key** (sk_test_... para pruebas)
   - **Webhook Secret** (se genera al crear el webhook)

### 2. Configurar Variables de Entorno

Edita el archivo `.env` y reemplaza los valores placeholder:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_real
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_real
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_real

# Stripe Price IDs (obtén estos después de crear productos)
STRIPE_PRICE_MONTHLY=price_tu_id_mensual
STRIPE_PRICE_ANNUAL=price_tu_id_anual
```

### 3. Configurar Firebase Functions

```bash
# Instalar dependencias de Firebase Functions
cd functions
npm install

# Configurar variables de entorno de Firebase
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set stripe.success_url="https://tomas20oriol-jpg.github.io/tartdesserts/account.html?success=true"
firebase functions:config:set stripe.cancel_url="https://tomas20oriol-jpg.github.io/tartdesserts/subscription.html"
```

### 4. Crear Productos en Stripe

Ejecuta el script para crear productos y precios:

```bash
# En el directorio functions/
node setup-stripe-products.js
```

Esto creará:
- Producto de suscripción mensual (2.99€)
- Producto de suscripción anual (20.00€)
- Producto para pedidos individuales

### 5. Desplegar Firebase Functions

```bash
# Desplegar funciones
firebase deploy --only functions

# Configurar webhook en Stripe Dashboard
# URL: https://us-central1-[project-id].cloudfunctions.net/stripeWebhook
# Eventos: checkout.session.completed, payment_intent.succeeded, invoice.payment_succeeded, customer.subscription.deleted
```

## 💳 Flujos de Pago

### Suscripciones (checkout.html)

1. **Usuario selecciona plan** (mensual/anual)
2. **Completa formulario** con datos personales
3. **Elige método de pago** (tarjeta, PayPal, Bizum)
4. **Procesamiento**:
   - Se crea sesión de Stripe Checkout
   - Usuario es redirigido a Stripe
   - Al completar, webhook actualiza Firestore
   - Usuario regresa a account.html

### Pedidos Individuales (checkout-cart.html)

1. **Usuario añade productos** al carrito
2. **Completa checkout** con datos de entrega
3. **Procesamiento**:
   - Se crea Payment Intent
   - Se guarda pedido en Firestore
   - Se procesa pago con Stripe Elements
   - Se actualiza estado del pedido

## 🔧 Funciones Firebase Disponibles

### createSubscriptionCheckout
Crea una sesión de Stripe Checkout para suscripciones.

**Parámetros:**
- `priceId`: ID del precio en Stripe
- `planType`: 'monthly' o 'annual'
- `successUrl`: URL de éxito (opcional)
- `cancelUrl`: URL de cancelación (opcional)

### createPaymentIntent
Crea un Payment Intent para pagos directos.

**Parámetros:**
- `amount`: Cantidad en euros
- `currency`: 'eur' (por defecto)
- `metadata`: Metadatos adicionales

### stripeWebhook
Maneja webhooks de Stripe para actualizar estados en Firestore.

## 📋 Estados de Pedido/Suscripción

### Suscripciones (users collection)
```javascript
{
  subscribed: true,
  subscriptionPlan: 'monthly' | 'annual',
  subscriptionId: 'sub_stripe_id',
  subscriptionStatus: 'active' | 'cancelled' | 'past_due',
  subscriptionDate: timestamp,
  nextBillingDate: timestamp,
  stripeCustomerId: 'cus_stripe_id'
}
```

### Pedidos (orders collection)
```javascript
{
  userId: 'user_id',
  customer: { name, email, phone },
  deliveryMethod: 'pickup' | 'delivery',
  deliveryDate: 'YYYY-MM-DD',
  address: { street, city, postalCode },
  items: [{ name, price, quantity }],
  pricing: { subtotal, shipping, tax, total },
  paymentIntentId: 'pi_stripe_id',
  status: 'pending_payment' | 'paid' | 'cancelled' | 'completed',
  createdAt: timestamp
}
```

### Pagos (payments collection)
```javascript
{
  userId: 'user_id',
  paymentIntentId: 'pi_stripe_id',
  amount: 10.50,
  currency: 'eur',
  status: 'completed',
  createdAt: timestamp
}
```

## 🛠️ Desarrollo y Testing

### Modo Desarrollo
```bash
# Ejecutar emulador de Firebase Functions
firebase emulators:start --only functions

# El webhook local estará en: http://localhost:5001/[project-id]/us-central1/stripeWebhook
```

### Testing
```bash
# Ejecutar tests de funciones
cd functions
npm test
```

## 🔒 Seguridad

- Todas las claves secretas están en variables de entorno
- Webhooks verifican signatures de Stripe
- Firestore Rules protegen datos sensibles
- CORS configurado para dominios específicos
- Rate limiting implementado

## 📞 Soporte

Si encuentras problemas:

1. Revisa logs de Firebase Functions: `firebase functions:log`
2. Verifica configuración en Stripe Dashboard
3. Comprueba variables de entorno
4. Revisa Firestore Rules

## 🚦 Próximos Pasos

- [ ] Integrar Stripe Elements para pagos directos sin redirección
- [ ] Implementar PayPal como método de pago adicional
- [ ] Añadir Bizum como opción de pago
- [ ] Configurar notificaciones email para pedidos
- [ ] Implementar panel de administración para gestionar pedidos

## 📚 Referencias

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Firestore](https://firebase.google.com/docs/firestore)
