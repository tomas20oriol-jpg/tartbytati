// Copia este archivo como `config.js` si necesitas editar la configuración en local.
// Solo contiene identificadores públicos del SDK web (no incluyas cuentas de servicio).
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID",
};

if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

// Inicializa Firebase automáticamente si el SDK compat (v8) ya está cargado,
// o importa el SDK modular para habilitar Analytics en páginas simples.
(async () => {
  try {
    if (typeof firebase !== "undefined" && firebase?.apps) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      if (firebase.analytics) {
        firebase.analytics();
      }
      return;
    }

    const { initializeApp, getApps } = await import(
      "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
    );
    const { getAnalytics, isSupported } = await import(
      "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js"
    );

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    if (typeof window !== "undefined") {
      window.firebaseApp = app;
    }

    if (await isSupported()) {
      const analytics = getAnalytics(app);
      if (typeof window !== "undefined") {
        window.firebaseAnalytics = analytics;
      }
    }
  } catch (error) {
    console.warn("Firebase bootstrap skipped", error);
  }
})();
