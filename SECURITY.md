# 🔒 Medidas de Seguridad - tartdesserts

Este documento describe las medidas de seguridad implementadas en el proyecto **tartdesserts** para proteger información sensible y permitir compartir el código de forma segura en GitHub.

## 🛡️ **Protección de Información Sensible**

### 1. **Archivo .gitignore**
El proyecto incluye un `.gitignore` completo que excluye:

- **Variables de entorno**: `.env`, `.env.local`, `.env.*.local`
- **Claves API**: Firebase, Stripe, y otras APIs
- **Logs y datos temporales**: `*.log`, `.firebase/`, `node_modules/`
- **Configuración sensible**: `firebase.json`, `.firebaserc`
- **Archivos de sistema**: `.DS_Store`, `Thumbs.db`, etc.

### 2. **Variables de Entorno**
- ✅ **Separación clara** entre configuración y código
- ✅ **Archivo `.env.example`** con todas las variables necesarias
- ✅ **Documentación completa** de qué necesita cada variable
- ✅ **Instrucciones de setup** para otros desarrolladores

## 🔐 **Configuración Segura para GitHub**

### Archivos Seguros (NO subidos a GitHub):
```bash
# ❌ NUNCA subas estos archivos:
.env                    # Variables de entorno reales
.env.local             # Configuración local
firebase-debug.log*    # Logs de Firebase
*.log                  # Cualquier archivo de log
node_modules/          # Dependencias (se instalan con npm)
```

### Archivos Seguros (SÍ subidos a GitHub):
```bash
# ✅ Estos archivos SÍ se pueden compartir:
.env.example           # Ejemplo de configuración
README.md             # Documentación
PORTFOLIO-README.md   # Documentación técnica completa
.gitignore            # Protección de archivos sensibles
js/script.js          # Código del frontend (sin claves)
functions/index.js    # Backend (usa variables de entorno)
```

## 🚀 **Configuración para Desarrollo Seguro**

### 1. **Para Ti (Desarrollador)**
```bash
# 1. Clona el repositorio
git clone https://github.com/tomas20oriol-jpg/tartdesserts.git

# 2. Configura variables de entorno
cp .env.example .env
# Edita .env con tus claves reales

# 3. El .gitignore ya protege tu .env
```

### 2. **Para Otros Desarrolladores**
```bash
# 1. Clonan el repositorio (sin información sensible)
git clone https://github.com/tomas20oriol-jpg/tartdesserts.git

# 2. Configuran sus propias variables
cp .env.example .env
# Editan .env con SUS propias claves

# 3. Instalan dependencias
cd functions && npm install && cd ..

# 4. Despliegan con sus cuentas
firebase login
firebase deploy
```

## 🔑 **Variables Sensibles Protegidas**

### Firebase Configuration
```bash
# ✅ Protegido en .env (no subido a GitHub)
FIREBASE_API_KEY=tu_api_key_real
FIREBASE_PROJECT_ID=tu_proyecto_real

# ✅ Visible en .env.example (para otros desarrolladores)
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your-project-id
```

### Stripe Configuration
```bash
# ✅ Protegido en .env (no subido a GitHub)
STRIPE_SECRET_KEY=sk_test_tu_clave_real
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_real

# ✅ Visible en .env.example (para otros desarrolladores)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 📋 **Mejores Prácticas Implementadas**

### 1. **Separación de Entornos**
- **Desarrollo**: Usa claves de prueba (`pk_test_...`, `sk_test_...`)
- **Producción**: Usa claves reales (`pk_live_...`, `sk_live_...`)
- **Variables diferentes** para cada entorno

### 2. **Documentación Clara**
- ✅ **README.md**: Explicación básica del proyecto
- ✅ **PORTFOLIO-README.md**: Documentación técnica completa
- ✅ **.env.example**: Todas las variables necesarias
- ✅ **setup-portfolio.sh**: Script de configuración automática

### 3. **Validación y Sanitización**
- ✅ **Frontend**: Validación de formularios
- ✅ **Backend**: Sanitización de datos en Firebase Functions
- ✅ **CORS**: Configuración segura de APIs

## 🚨 **Qué Hacer Si Encuentras Información Sensible**

Si accidentalmente subes información sensible:

1. **Elimínala inmediatamente**:
   ```bash
   git rm --cached archivo_sensible
   git commit -m "Remove sensitive file"
   git push
   ```

2. **Revoca las claves** en los servicios correspondientes (Firebase, Stripe)

3. **Actualiza las claves** y configura nuevas

4. **Verifica** que .gitignore esté funcionando

## 📚 **Recursos de Seguridad**

- [GitHub: Removing sensitive data](https://docs.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository)
- [Firebase: Security Rules](https://firebase.google.com/docs/rules)
- [Stripe: API Security](https://stripe.com/docs/security)
- [OWASP: Environment Variables](https://owasp.org/www-community/controls/Block_cipher)

## 🎯 **Para Portfolio/CV**

Este proyecto demuestra:

- ✅ **Mejores prácticas de seguridad** en desarrollo web
- ✅ **Gestión profesional** de información sensible
- ✅ **Documentación clara** para otros desarrolladores
- ✅ **Configuración de entornos** de desarrollo y producción
- ✅ **Uso correcto de .gitignore** y variables de entorno

---

## 🤝 **Contribuir de Forma Segura**

Si quieres contribuir o hacer fork:

1. **Configura tu propio proyecto** Firebase/Strip
2. **Usa tus propias claves** en tu .env
3. **Sigue las mejores prácticas** de seguridad
4. **Documenta** cualquier cambio que hagas

---

**📧 Contacto para preguntas de seguridad**: Si tienes dudas sobre la configuración segura, no dudes en preguntar.

**⚠️ Recuerda**: La seguridad es un proceso continuo. Revisa regularmente que no se filtre información sensible.
