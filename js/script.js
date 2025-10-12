// ===========================
// tartbytati - Main JavaScript
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scrolling for anchor links
  initSmoothScroll();
  
  // Add active state to navigation
  highlightActiveNav();
  
  // Add animation on scroll
  initScrollAnimations();
  
  // Initialize custom box builder
  initBoxBuilder();
  
  console.log('tartbytati website loaded successfully! 🍰');
});

// ===========================
// Smooth Scroll Function
// ===========================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just '#'
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        // Smooth scroll to target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
        
        // Focus target for accessibility
        target.focus();
      }
    });
  });
}

// ===========================
// Highlight Active Navigation
// ===========================
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    return; // Skip animations for older browsers
  }
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe feature cards and other elements
  const animatedElements = document.querySelectorAll('.feature, .contact-method, .about-text');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===========================
// Handle External Links
// ===========================
// Add visual indicator for external links
const externalLinks = document.querySelectorAll('a[target="_blank"]');
externalLinks.forEach(link => {
  link.setAttribute('rel', 'noopener noreferrer');
});

// ===========================
// Keyboard Navigation Enhancement
// ===========================
document.addEventListener('keydown', function(e) {
  // Skip to main content with 'S' key
  if (e.key === 's' || e.key === 'S') {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink && document.activeElement !== skipLink) {
      e.preventDefault();
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});

// ===========================
// Custom Box Builder
// ===========================
function initBoxBuilder() {
  // Check if we're on the products page
  const boxBuilder = document.querySelector('.box-builder');
  if (!boxBuilder) return;
  
  // Initialize box state
  let customBox = [];
  
  // Get DOM elements
  const boxItemsContainer = document.getElementById('box-items');
  const totalItemsSpan = document.getElementById('total-items');
  const totalPriceSpan = document.getElementById('total-price');
  const clearBoxBtn = document.getElementById('clear-box');
  const orderBoxBtn = document.getElementById('order-box');
  
  // Add event listeners to all "Add to box" buttons
  const addButtons = document.querySelectorAll('.btn-add-to-box');
  addButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const productName = this.getAttribute('data-product');
      const productPrice = parseFloat(this.getAttribute('data-price'));
      addToBox(productName, productPrice);
    });
  });
  
  // Clear box button
  clearBoxBtn.addEventListener('click', function() {
    if (customBox.length > 0) {
      if (confirm('¿Estás seguro de que quieres vaciar la caja?')) {
        customBox = [];
        updateBoxDisplay();
      }
    }
  });
  
  // Order box button
  orderBoxBtn.addEventListener('click', function(e) {
    if (customBox.length === 0) {
      e.preventDefault();
      alert('Tu caja está vacía. Añade productos antes de hacer el pedido.');
      return;
    }
    
    // Create WhatsApp message with box contents
    const message = createOrderMessage();
    const whatsappUrl = `https://wa.me/3469738933?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  });
  
  // Add product to box
  function addToBox(productName, productPrice) {
    const existingItem = customBox.find(item => item.name === productName);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      customBox.push({
        name: productName,
        price: productPrice,
        quantity: 1
      });
    }
    
    updateBoxDisplay();
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Añadido';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 1000);
  }
  
  // Update box display
  function updateBoxDisplay() {
    if (customBox.length === 0) {
      boxItemsContainer.innerHTML = '<p class="empty-box">Tu caja está vacía. Añade productos usando los botones "Añadir a caja"</p>';
      totalItemsSpan.textContent = '0';
      totalPriceSpan.textContent = '0,00';
      return;
    }
    
    // Build items HTML
    let itemsHTML = '';
    let totalItems = 0;
    let totalPrice = 0;
    
    customBox.forEach((item, index) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
      
      itemsHTML += `
        <div class="box-item">
          <div class="box-item-info">
            <div class="box-item-name">${item.name}</div>
            <div class="box-item-price">${item.price.toFixed(2)} € c/u</div>
          </div>
          <div class="box-item-quantity">
            <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
            <span class="quantity-number">${item.quantity}</span>
            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
          </div>
          <button class="remove-item" onclick="removeItem(${index})">Eliminar</button>
        </div>
      `;
    });
    
    boxItemsContainer.innerHTML = itemsHTML;
    totalItemsSpan.textContent = totalItems;
    totalPriceSpan.textContent = totalPrice.toFixed(2).replace('.', ',');
  }
  
  // Create order message for WhatsApp
  function createOrderMessage() {
    let message = '¡Hola! Me gustaría hacer un pedido personalizado:\n\n';
    
    customBox.forEach(item => {
      message += `• ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)}€)\n`;
    });
    
    const totalPrice = customBox.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ${totalPrice.toFixed(2)}€\n\n`;
    message += '¿Cuándo podría recogerlo? Gracias!';
    
    return message;
  }
  
  // Make functions global for onclick handlers
  window.increaseQuantity = function(index) {
    customBox[index].quantity++;
    updateBoxDisplay();
  };
  
  window.decreaseQuantity = function(index) {
    if (customBox[index].quantity > 1) {
      customBox[index].quantity--;
      updateBoxDisplay();
    }
  };
  
  window.removeItem = function(index) {
    customBox.splice(index, 1);
    updateBoxDisplay();
  };
}