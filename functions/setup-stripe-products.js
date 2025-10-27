const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Script para crear productos y precios en Stripe
 * Ejecutar con: node setup-stripe-products.js
 */

async function createStripeProducts() {
  console.log('🚀 Configurando productos en Stripe...');

  try {
    // Crear producto para suscripción mensual
    const monthlyProduct = await stripe.products.create({
      name: 'Suscripción Mensual - tartdesserts',
      description: 'Acceso completo a todas las recetas de tartdesserts',
      type: 'service',
      metadata: {
        plan: 'monthly'
      }
    });

    // Crear precio para suscripción mensual (2.99€)
    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 299, // 2.99€ en céntimos
      currency: 'eur',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'monthly'
      }
    });

    console.log('✅ Producto mensual creado:', monthlyProduct.id);
    console.log('✅ Precio mensual creado:', monthlyPrice.id);

    // Crear producto para suscripción anual
    const annualProduct = await stripe.products.create({
      name: 'Suscripción Anual - tartdesserts',
      description: 'Acceso completo a todas las recetas de tartdesserts (Ahorra 40%)',
      type: 'service',
      metadata: {
        plan: 'annual'
      }
    });

    // Crear precio para suscripción anual (20.00€)
    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 2000, // 20.00€ en céntimos
      currency: 'eur',
      recurring: {
        interval: 'year'
      },
      metadata: {
        plan: 'annual'
      }
    });

    console.log('✅ Producto anual creado:', annualProduct.id);
    console.log('✅ Precio anual creado:', annualPrice.id);

    // Crear producto para productos individuales
    const individualProduct = await stripe.products.create({
      name: 'Productos Individuales - tartdesserts',
      description: 'Compra de productos individuales',
      type: 'service',
      metadata: {
        type: 'individual'
      }
    });

    console.log('✅ Producto individual creado:', individualProduct.id);

    console.log('\n🎉 Configuración completada!');
    console.log('\nIDs para usar en el código:');
    console.log('Plan Mensual:', monthlyPrice.id);
    console.log('Plan Anual:', annualPrice.id);
    console.log('Productos Individuales:', individualProduct.id);

    console.log('\n📝 Recuerda actualizar el archivo .env con estos IDs');

  } catch (error) {
    console.error('❌ Error configurando productos:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createStripeProducts();
}

module.exports = { createStripeProducts };
