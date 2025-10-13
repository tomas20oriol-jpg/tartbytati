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
  
  // Initialize unified cart
  initUnifiedCart();
  
  console.log('tartbytati website loaded successfully!');
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
// Unified Cart System (with localStorage)
// ===========================
function initUnifiedCart() {
  // Check if cart elements exist
  const floatingCart = document.getElementById('floating-cart');
  if (!floatingCart) return;
  
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('tartbytatiCart')) || [];
  
  // Get DOM elements
  const cartToggle = document.getElementById('cart-toggle');
  const closeCart = document.getElementById('close-cart');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCountBadge = document.getElementById('cart-count');
  const totalItemsSpan = document.getElementById('cart-total-items');
  const totalPriceSpan = document.getElementById('cart-total-price');
  const clearCartBtn = document.getElementById('clear-cart');
  const orderCartBtn = document.getElementById('order-cart');
  
  // Toggle cart visibility
  function toggleCart() {
    floatingCart.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = floatingCart.classList.contains('active') ? 'hidden' : '';
  }
  
  // Event listeners for cart toggle
  if (cartToggle) cartToggle.addEventListener('click', toggleCart);
  if (closeCart) closeCart.addEventListener('click', toggleCart);
  if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
  
  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('tartbytatiCart', JSON.stringify(cart));
  }
  
  // Add product buttons (productos.html)
  const productButtons = document.querySelectorAll('.btn-add-to-box');
  productButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const productName = this.getAttribute('data-product');
      const productPrice = parseFloat(this.getAttribute('data-price'));
      addToCart(productName, productPrice, 'product');
    });
  });
  
  // Add recipe buttons (recetas.html)
  const recipeButtons = document.querySelectorAll('.btn-add-recipe');
  recipeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const recipeName = this.getAttribute('data-recipe');
      const recipePrice = parseFloat(this.getAttribute('data-price'));
      addToCart(recipeName, recipePrice, 'recipe');
    });
  });
  
  // Clear cart button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      if (cart.length > 0) {
        if (confirm('¿Estás seguro de que quieres vaciar la cesta?')) {
          cart = [];
          saveCart();
          updateCartDisplay();
        }
      }
    });
  }
  
  // Order button - Send directly to WhatsApp
  if (orderCartBtn) {
    orderCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (cart.length === 0) {
        alert('Tu cesta está vacía. Añade productos antes de hacer el pedido.');
        return;
      }
      
      // Create WhatsApp message and open directly
      const message = createOrderMessage();
      const whatsappUrl = `https://wa.me/34697389330?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      toggleCart();
    });
  }
  
  // Add item to cart
  function addToCart(name, price, type) {
    // Find existing item by BOTH name AND type
    const existingItem = cart.find(item => item.name === name && item.type === type);
    
    if (type === 'recipe' && existingItem) {
      // Recipes can't be duplicated, just show cart
      toggleCart();
      return;
    }
    
    if (existingItem && type === 'product') {
      existingItem.quantity++;
    } else {
      cart.push({
        name: name,
        price: price,
        type: type,
        quantity: type === 'recipe' ? 1 : 1
      });
    }
    
    saveCart();
    updateCartDisplay();
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Añadido';
    btn.style.background = '#27ae60';
    if (type === 'recipe') btn.disabled = true;
    
    // Auto-open cart
    setTimeout(() => {
      toggleCart();
    }, 500);
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 1000);
  }
  
  // Update cart display
  function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update cart count badge
    if (cartCountBadge) {
      cartCountBadge.textContent = totalItems;
      if (totalItems === 0) {
        cartCountBadge.classList.add('hidden');
      } else {
        cartCountBadge.classList.remove('hidden');
      }
    }
    
    if (cart.length === 0) {
      if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart">Tu cesta está vacía</p>';
      if (totalItemsSpan) totalItemsSpan.textContent = '0';
      if (totalPriceSpan) totalPriceSpan.textContent = '0,00 €';
      
      // Re-enable recipe buttons
      const recipeButtons = document.querySelectorAll('.btn-add-recipe');
      recipeButtons.forEach(btn => btn.disabled = false);
      return;
    }
    
    // Build items HTML
    let itemsHTML = '';
    let totalPrice = 0;
    let needsSave = false;
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * (item.quantity || 1);
      totalPrice += itemTotal;
      
      // Ensure item has a type (for backwards compatibility)
      if (!item.type) {
        // If item has quantity property and it's a number, it's a product
        // Otherwise it's a recipe
        if (item.quantity !== undefined && typeof item.quantity === 'number') {
          item.type = 'product';
        } else {
          item.type = 'recipe';
          item.quantity = 1; // Ensure recipes have quantity 1
        }
        needsSave = true;
      }
      
      if (item.type === 'product') {
        itemsHTML += `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name} <span class="item-type-badge">Producto</span></div>
              <div class="cart-item-price">${item.price.toFixed(2)} € × ${item.quantity}</div>
            </div>
            <div class="box-item-quantity">
              <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
              <span class="quantity-number">${item.quantity}</span>
              <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
            </div>
            <button class="remove-cart-item" onclick="removeCartItem(${index})">✕</button>
          </div>
        `;
      } else {
        itemsHTML += `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name} <span class="item-type-badge recipe-badge">Receta</span></div>
              <div class="cart-item-price">${item.price.toFixed(2)} €</div>
            </div>
            <button class="remove-cart-item" onclick="removeCartItem(${index})">✕</button>
          </div>
        `;
      }
    });
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = itemsHTML;
    if (totalItemsSpan) totalItemsSpan.textContent = totalItems;
    if (totalPriceSpan) totalPriceSpan.textContent = totalPrice.toFixed(2).replace('.', ',') + ' €';
    
    // Save if we updated any item types
    if (needsSave) {
      saveCart();
    }
  }
  
  // Create order message
  function createOrderMessage() {
    let message = '¡Hola! Me gustaría hacer un pedido:\n\n';
    
    const products = cart.filter(item => item.type === 'product');
    const recipes = cart.filter(item => item.type === 'recipe');
    
    if (products.length > 0) {
      message += 'PRODUCTOS:\n';
      products.forEach(item => {
        message += `• ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)}€)\n`;
      });
      message += '\n';
    }
    
    if (recipes.length > 0) {
      message += 'RECETAS:\n';
      recipes.forEach(item => {
        message += `• ${item.name} - ${item.price.toFixed(2)}€\n`;
      });
      message += '\n';
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    message += `Total: ${totalPrice.toFixed(2)}€\n\n`;
    
    // Ask for additional information
    message += '--- POR FAVOR, COMPLETA ESTA INFORMACIÓN ---\n\n';
    
    message += 'Nombre completo: \n';
    message += 'Teléfono: \n';
    
    if (recipes.length > 0) {
      message += 'Email (para enviar las recetas): \n';
    }
    
    if (products.length > 0) {
      message += 'Método de entrega (Recogida en tienda / Envío): \n';
      message += 'Dirección de entrega (si aplica): \n';
      message += 'Fecha deseada de entrega: \n';
    }
    
    message += '\n¡Gracias!';
    
    return message;
  }
  
  // Global functions for onclick handlers
  window.increaseQuantity = function(index) {
    if (cart[index] && cart[index].type === 'product') {
      cart[index].quantity++;
      saveCart();
      updateCartDisplay();
    }
  };
  
  window.decreaseQuantity = function(index) {
    if (cart[index] && cart[index].type === 'product' && cart[index].quantity > 1) {
      cart[index].quantity--;
      saveCart();
      updateCartDisplay();
    }
  };
  
  window.removeCartItem = function(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    
    // Re-enable recipe button if it was a recipe
    if (removedItem.type === 'recipe') {
      const recipeButtons = document.querySelectorAll('.btn-add-recipe');
      recipeButtons.forEach(btn => {
        if (btn.getAttribute('data-recipe') === removedItem.name) {
          btn.disabled = false;
        }
      });
    }
  };
  
  // Initial display update
  updateCartDisplay();
}
