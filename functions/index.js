const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);
const cors = require('cors');

// Inicializar Firebase Admin
admin.initializeApp();

// Configurar CORS
const corsHandler = cors({ origin: true });

/**
 * Crear Payment Intent para pagos con tarjeta
 */
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { amount, currency = 'eur', metadata = {} } = data;

  try {
    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a céntimos
      currency,
      metadata: {
        userId: context.auth.uid,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Error creando Payment Intent:', error);
    throw new functions.https.HttpsError('internal', 'Error al crear el pago');
  }
});

/**
 * Crear sesión de Stripe Checkout para suscripciones
 */
exports.createSubscriptionCheckout = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { priceId, planType, successUrl, cancelUrl } = data;

  try {
    // URLs de éxito y cancelación
    const baseSuccessUrl = successUrl || functions.config().stripe.success_url;
    const baseCancelUrl = cancelUrl || functions.config().stripe.cancel_url;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseSuccessUrl}?session_id={CHECKOUT_SESSION_ID}&plan=${planType}`,
      cancel_url: baseCancelUrl,
      client_reference_id: context.auth.uid,
      metadata: {
        userId: context.auth.uid,
        planType
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: context.auth.token.email,
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    };
  } catch (error) {
    console.error('Error creando sesión de checkout:', error);
    throw new functions.https.HttpsError('internal', 'Error al crear la sesión de pago');
  }
});

/**
 * Webhook para manejar eventos de Stripe
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.get('stripe-signature');
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Manejar sesión de checkout completada
 */
async function handleCheckoutSessionCompleted(session) {
  const userId = session.client_reference_id;

  try {
    // Actualizar estado de suscripción en Firestore
    await admin.firestore().collection('users').doc(userId).update({
      subscribed: true,
      subscriptionPlan: session.metadata.planType,
      subscriptionId: session.subscription,
      subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
      subscriptionStatus: 'active',
      stripeCustomerId: session.customer
    });

    console.log(`Suscripción activada para usuario ${userId}`);
  } catch (error) {
    console.error('Error actualizando suscripción:', error);
  }
}

/**
 * Manejar pago exitoso con Payment Intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  const userId = paymentIntent.metadata.userId;

  try {
    // Actualizar estado de pago en Firestore
    await admin.firestore().collection('payments').add({
      userId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'completed',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Pago completado para usuario ${userId}`);
  } catch (error) {
    console.error('Error registrando pago:', error);
  }
}

/**
 * Manejar pago de factura exitoso (suscripciones)
 */
async function handleInvoicePaymentSucceeded(invoice) {
  const userId = invoice.customer_metadata?.userId;

  if (userId) {
    try {
      // Actualizar próxima fecha de pago
      await admin.firestore().collection('users').doc(userId).update({
        nextBillingDate: admin.firestore.Timestamp.fromDate(new Date(invoice.period_end * 1000)),
        subscriptionStatus: 'active'
      });

      console.log(`Factura pagada para usuario ${userId}`);
    } catch (error) {
      console.error('Error actualizando factura:', error);
    }
  }
}

/**
 * Manejar cancelación de suscripción
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    // Buscar usuario por customer ID
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('stripeCustomerId', '==', subscription.customer)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await userDoc.ref.update({
        subscriptionStatus: 'cancelled',
        subscriptionEndDate: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Suscripción cancelada para usuario ${userDoc.id}`);
    }
  } catch (error) {
    console.error('Error cancelando suscripción:', error);
  }
}
