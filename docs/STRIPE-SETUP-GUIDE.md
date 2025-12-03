# 🚀 Guía de Configuración de Stripe para tartdesserts

## 📋 Lo que necesitas para activar los pagos:

### 1. **Cuenta y Claves API de Stripe**

**PASO 1: Crear/Acceder a cuenta Stripe**
- Ve a [https://dashboard.stripe.com](https://dashboard.stripe.com)
- Inicia sesión o crea una cuenta nueva
- Completa la información de tu negocio (tartdesserts)

**PASO 2: Obtener Claves API**
- En el menú lateral izquierdo: **Developers** > **API keys**
- Copia estas claves:
  - **Publishable key** (pk_test_... o pk_live_...)
  - **Secret key** (sk_test_... o sk_live_...)

### 2. **Crear Productos y Precios**

**PASO 3: Crear productos**
- Ve a **Products** en el menú lateral
- Haz clic en **"Add product"**
- Crea 3 productos:

**Producto 1: Suscripción Mensual**
- Name: "Suscripción Mensual - tartdesserts"
- Type: Service
- Price: 2.99€
- Billing: Monthly

**Producto 2: Suscripción Anual**
- Name: "Suscripción Anual - tartdesserts"
- Type: Service
- Price: 20.00€
- Billing: Yearly

**Producto 3: Productos Individuales**
- Name: "Productos Individuales - tartdesserts"
- Type: Service
- **No crees precio aún** (se hará dinámicamente)

**PASO 4: Copiar IDs de Precios**
- En cada producto, ve a la pestaña **Pricing**
- Copia el **Price ID** (price_...)
- Necesitarás:
  - `price_id_mensual`
  - `price_id_anual`

### 3. **Configurar Webhooks**

**PASO 5: Crear webhook endpoint**
- Ve a **Developers** > **Webhooks**
- Haz clic en **"Add endpoint"**
- URL: `https://us-central1-tartdesserts-3b414.cloudfunctions.net/stripeWebhook`
- Eventos a escuchar:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `invoice.payment_succeeded`
  - `customer.subscription.deleted`

**PASO 6: Copiar Webhook Secret**
- Stripe te dará un **Webhook signing secret** (whsec_...)
- Guárdalo para el siguiente paso

### 4. **Actualizar Variables de Entorno**

**PASO 7: Editar archivo .env**
Reemplaza los valores placeholder en `c:\Users\tomas\tartdesserts\.env`:

```env
# Reemplaza con tus claves reales:
STRIPE_PUBLISHABLE_KEY=pk_test_tu_publishable_key_aqui
STRIPE_SECRET_KEY=sk_test_tu_secret_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Reemplaza con los IDs reales de precios:
STRIPE_PRICE_MONTHLY=price_tu_id_mensual_real
STRIPE_PRICE_ANNUAL=price_tu_id_anual_real
```

### 5. **Configurar Firebase Functions**

**PASO 8: Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

**PASO 9: Configurar proyecto Firebase**
```bash
# Iniciar sesión en Firebase
firebase login

# Configurar variables de entorno de Firebase Functions
firebase functions:config:set stripe.secret_key="sk_test_tu_clave_secreta"
firebase functions:config:set stripe.webhook_secret="whsec_tu_webhook_secret"
firebase functions:config:set stripe.success_url="https://tomas20oriol-jpg.github.io/tartdesserts/account.html?success=true"
firebase functions:config:set stripe.cancel_url="https://tomas20oriol-jpg.github.io/tartdesserts/subscription.html"
```

**PASO 10: Desplegar funciones**
```bash
# Desde el directorio raíz del proyecto
firebase deploy --only functions
```

### 6. **Actualizar Frontend**

**PASO 11: Actualizar checkout.html**
- Abre `checkout.html`
- Busca las líneas con `price_tu_id_mensual_aqui` y `price_tu_id_anual_aqui`
- Reemplázalas con los IDs reales de precios de Stripe

**PASO 12: Actualizar checkout-cart.html**
- Abre `checkout-cart.html`
- Ya está configurado para usar Payment Intents dinámicamente

### 7. **Probar el Sistema**

**PASO 13: Probar suscripción**
1. Ve a `https://tomas20oriol-jpg.github.io/tartdesserts/subscription.html`
2. Haz clic en "Suscríbete" > "Plan Mensual"
3. Completa el formulario
4. Debería redirigir a Stripe Checkout
5. Completa el pago de prueba

**PASO 14: Probar pedido individual**
1. Ve a `https://tomas20oriol-jpg.github.io/tartdesserts/productos.html`
2. Añade productos al carrito
3. Ve al checkout
4. Completa el formulario
5. Debería procesar el pago

## 🔧 Comandos Útiles

```bash
# Ver logs de Firebase Functions
firebase functions:log

# Ejecutar emulador local (para desarrollo)
firebase emulators:start --only functions

# Ver estado del despliegue
firebase functions:list
```

## ⚠️ Notas Importantes

- **Modo de Prueba**: Usa las claves `pk_test_` y `sk_test_` hasta que estés listo para producción
- **Webhooks**: Asegúrate de que la URL del webhook sea exactamente la que te proporcione Firebase después del deploy
- **URLs de Redirección**: Las URLs de éxito y cancelación están configuradas para tu sitio en GitHub Pages
- **Moneda**: Todo está configurado para EUR (€) ya que es España

## 🎯 Estado del Sistema

Una vez completados todos los pasos:
- ✅ Suscripciones procesadas con Stripe Checkout
- ✅ Pedidos individuales con Payment Intent
- ✅ Estados actualizados automáticamente en Firestore
- ✅ Webhooks manejando eventos de pago
- ✅ Páginas de éxito y error configuradas

¿En qué paso necesitas ayuda específica?
