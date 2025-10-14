// ===========================
// Cookie Consent Banner (GDPR Compliant)
// ===========================

(function() {
  'use strict';
  
  const COOKIE_NAME = 'tartbytati_cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;
  
  // Check if consent has already been given
  function hasConsent() {
    return getCookie(COOKIE_NAME) !== null;
  }
  
  // Get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  // Set cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }
  
  // Get consent preferences
  function getConsentPreferences() {
    const consent = getCookie(COOKIE_NAME);
    if (!consent) return null;
    
    try {
      return JSON.parse(decodeURIComponent(consent));
    } catch (e) {
      return null;
    }
  }
  
  // Save consent preferences
  function saveConsent(preferences) {
    const value = encodeURIComponent(JSON.stringify(preferences));
    setCookie(COOKIE_NAME, value, COOKIE_EXPIRY_DAYS);
    
    // Apply preferences
    applyConsent(preferences);
    
    // Hide banner
    hideBanner();
  }
  
  // Apply consent preferences
  function applyConsent(preferences) {
    // Store in localStorage for easy access
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    
    // Enable/disable analytics
    if (preferences.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
    
    // Enable/disable marketing
    if (preferences.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }
  }
  
  // Analytics functions (Google Analytics, etc.)
  function enableAnalytics() {
    // Example: Load Google Analytics
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');
    console.log('Analytics enabled');
  }
  
  function disableAnalytics() {
    // Disable Google Analytics
    // window['ga-disable-GA_MEASUREMENT_ID'] = true;
    console.log('Analytics disabled');
  }
  
  // Marketing functions (Facebook Pixel, Google Ads, etc.)
  function enableMarketing() {
    // Example: Load Facebook Pixel
    console.log('Marketing enabled');
  }
  
  function disableMarketing() {
    console.log('Marketing disabled');
  }
  
  // Create banner HTML
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h3>🍪 Usamos cookies</h3>
          <p>Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes aceptar todas las cookies o configurar tus preferencias.</p>
        </div>
        <div class="cookie-banner-actions">
          <button id="cookie-settings-btn" class="cookie-btn cookie-btn-secondary">
            Configurar
          </button>
          <button id="cookie-reject-btn" class="cookie-btn cookie-btn-secondary">
            Rechazar
          </button>
          <button id="cookie-accept-btn" class="cookie-btn cookie-btn-primary">
            Aceptar todas
          </button>
        </div>
        <a href="politica-cookies.html" class="cookie-policy-link" target="_blank">
          Política de Cookies
        </a>
      </div>
      
      <!-- Settings Modal -->
      <div id="cookie-settings-modal" class="cookie-modal" style="display: none;">
        <div class="cookie-modal-content">
          <div class="cookie-modal-header">
            <h3>Configuración de Cookies</h3>
            <button id="cookie-modal-close" class="cookie-modal-close">✕</button>
          </div>
          
          <div class="cookie-modal-body">
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Cookies Esenciales</h4>
                  <p>Necesarias para el funcionamiento básico del sitio web. No se pueden desactivar.</p>
                </div>
                <label class="cookie-switch">
                  <input type="checkbox" checked disabled>
                  <span class="cookie-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Cookies de Análisis</h4>
                  <p>Nos ayudan a entender cómo los visitantes interactúan con la web, recopilando información de forma anónima.</p>
                </div>
                <label class="cookie-switch">
                  <input type="checkbox" id="analytics-toggle">
                  <span class="cookie-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Cookies de Marketing</h4>
                  <p>Se utilizan para rastrear a los visitantes en las webs y mostrar anuncios relevantes y atractivos.</p>
                </div>
                <label class="cookie-switch">
                  <input type="checkbox" id="marketing-toggle">
                  <span class="cookie-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="cookie-modal-footer">
            <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary">
              Guardar Preferencias
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add event listeners
    document.getElementById('cookie-accept-btn').addEventListener('click', acceptAll);
    document.getElementById('cookie-reject-btn').addEventListener('click', rejectAll);
    document.getElementById('cookie-settings-btn').addEventListener('click', showSettings);
    document.getElementById('cookie-modal-close').addEventListener('click', hideSettings);
    document.getElementById('cookie-save-preferences').addEventListener('click', savePreferences);
  }
  
  // Accept all cookies
  function acceptAll() {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    });
  }
  
  // Reject all non-essential cookies
  function rejectAll() {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    });
  }
  
  // Show settings modal
  function showSettings() {
    document.getElementById('cookie-settings-modal').style.display = 'flex';
  }
  
  // Hide settings modal
  function hideSettings() {
    document.getElementById('cookie-settings-modal').style.display = 'none';
  }
  
  // Save custom preferences
  function savePreferences() {
    const analytics = document.getElementById('analytics-toggle').checked;
    const marketing = document.getElementById('marketing-toggle').checked;
    
    saveConsent({
      essential: true,
      analytics: analytics,
      marketing: marketing,
      timestamp: new Date().toISOString()
    });
    
    hideSettings();
  }
  
  // Hide banner
  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.animation = 'slideDown 0.4s ease-out';
      setTimeout(() => {
        banner.remove();
      }, 400);
    }
  }
  
  // Initialize
  function init() {
    // Check if consent already given
    if (hasConsent()) {
      const preferences = getConsentPreferences();
      if (preferences) {
        applyConsent(preferences);
      }
      return;
    }
    
    // Show banner after a short delay
    setTimeout(() => {
      createBanner();
    }, 1000);
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose function to revoke consent (for settings page)
  window.revokeCookieConsent = function() {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.removeItem('cookieConsent');
    location.reload();
  };
  
})();
