#!/bin/bash
# Script de configuración rápida para el sistema de pagos de tartdesserts

echo "🚀 Configurando sistema de pagos para tartdesserts..."

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar si Stripe CLI está instalado (opcional)
if ! command -v stripe &> /dev/null; then
    echo "⚠️  Stripe CLI no está instalado. Puedes instalarlo para testing local."
fi

echo "📦 Instalando dependencias de Firebase Functions..."
cd functions
npm install

echo "🔧 Configurando Firebase Functions..."
cd ..
firebase functions:config:set stripe.secret_key="sk_test_tu_clave_secreta"
firebase functions:config:set stripe.webhook_secret="whsec_tu_webhook_secret"
firebase functions:config:set stripe.success_url="https://tomas20oriol-jpg.github.io/tartdesserts/account.html?success=true"
firebase functions:config:set stripe.cancel_url="https://tomas20oriol-jpg.github.io/tartdesserts/subscription.html"

echo "✅ Configuración básica completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura tus claves de Stripe en el archivo .env"
echo "2. Ejecuta: node functions/setup-stripe-products.js (para crear productos)"
echo "3. Despliega las funciones: firebase deploy --only functions"
echo "4. Configura el webhook en Stripe Dashboard"
echo ""
echo "📖 Lee PAGOS-README.md para instrucciones detalladas"
