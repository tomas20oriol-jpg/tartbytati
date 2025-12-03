// Firebase public web configuration (client-side only; no server secrets here).
// Estas claves son identificadores públicos para el SDK web.
const firebaseConfig = {
  apiKey: "AIzaSyCPE5bk4zESRhzts3xod2YqrUE09j8RfBQ",
  authDomain: "tartdesserts-3b414.firebaseapp.com",
  projectId: "tartdesserts-3b414",
  storageBucket: "tartdesserts-3b414.firebasestorage.app",
  messagingSenderId: "534807668671",
  appId: "1:534807668671:web:c2ad9d868c1a930f86e30a",
  measurementId: "G-CWFFD5JD20",
};

// Haz la configuración visible globalmente para scripts tradicionales y módulos.
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

// Inicialización ligera: usa Firebase compat si ya está cargado (v8),
// o importa dinámicamente el SDK modular para habilitar Analytics en páginas simples.
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
