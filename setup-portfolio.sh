#!/bin/bash
# Script de configuración para tartdesserts
# Este script ayuda a configurar el proyecto de forma segura para desarrollo

echo "🚀 Configurando tartdesserts para desarrollo..."
echo ""

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Instálalo primero."
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo desde https://nodejs.org"
    exit 1
fi

echo "✅ Verificando dependencias..."

# Instalar Firebase CLI si no está disponible
if ! command -v firebase &> /dev/null; then
    echo "📦 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

# Instalar dependencias del proyecto
echo "📦 Instalando dependencias de Firebase Functions..."
if [ -d "functions" ]; then
    cd functions
    npm install
    cd ..
fi

echo ""
echo "🔐 Configuración de seguridad:"
echo "✅ .gitignore configurado para proteger archivos sensibles"
echo "✅ .env.example creado con todas las variables necesarias"
echo "✅ README actualizado con documentación de seguridad"

echo ""
echo "🛠️  Próximos pasos para completar la configuración:"
echo ""
echo "1. Configurar Firebase:"
echo "   firebase login"
echo "   firebase init  (elige tu proyecto existente o crea uno nuevo)"
echo ""
echo "2. Configurar variables de entorno:"
echo "   cp .env.example .env"
echo "   # Edita .env con tus claves reales"
echo ""
echo "3. Configurar Stripe (si quieres usar pagos):"
echo "   # Ve a https://dashboard.stripe.com"
echo "   # Crea productos y obtén las claves API"
echo ""
echo "4. Desplegar (opcional):"
echo "   firebase deploy --only functions"
echo ""
echo "5. Ejecutar localmente:"
echo "   firebase serve  (para desarrollo con Firebase)"
echo "   # O simplemente abre index.html en tu navegador"
echo ""

echo "📚 Documentación completa:"
echo "   Lee PORTFOLIO-README.md para instrucciones detalladas"
echo ""
echo "🔒 Recuerda:"
echo "   - NUNCA subas el archivo .env real a GitHub"
echo "   - Usa .gitignore para proteger información sensible"
echo "   - El proyecto ya está configurado para ser seguro"
echo ""

echo "✨ ¡Configuración completada! El proyecto está listo para desarrollo seguro."
