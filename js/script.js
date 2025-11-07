// ===========================
// tartdesserts - Main JavaScript
// ===========================
import store, { addToCart, updateCartItemQuantity, clearCart } from './store.js';
import { initAuth, updateAuthUI } from './firebase-auth.js';

// Re-export toggleCart for direct access in event listeners
const { toggleCart } = store;


// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing application...');
  
  // 1. Initialize core functionality
  initSmoothScroll();
  highlightActiveNav();
  initScrollAnimations();
  setCopyrightYear();
  handleExternalLinks();
  initProductDetail();

  // 2. Subscribe to store changes first
  store.subscribe(renderCart);
  store.subscribe(updateAuthUI);
  
  // 3. Initialize state-dependent UI after subscriptions
  initUnifiedCart();
  
  // Add global error handler for cart operations
  window.handleCartError = function(error) {
    console.error('Cart operation failed:', error);
    // You could show a user-friendly notification here
    alert('Hubo un error al actualizar el carrito. Por favor, inténtalo de nuevo.');
  };

  // 3. Initial render based on the current state
  console.log('Performing initial render...');
  renderCart(store.getState());
  updateAuthUI(store.getState());

  // 4. Initialize Firebase Auth logic (if available on the page)
  if (typeof initAuth === 'function') {
    console.log('Initializing Firebase Auth...');
    initAuth();
  }
  
  console.log('Application initialization complete');

  // 3.5 Re-attach event listeners for any dynamically added 'Add to Cart' buttons
  document.addEventListener('click', function(event) {
    const addToCartBtn = event.target.closest('.add-to-cart');
    if (addToCartBtn) {
      const productName = addToCartBtn.getAttribute('data-product');
      const productPrice = parseFloat(addToCartBtn.getAttribute('data-price'));
      const type = addToCartBtn.getAttribute('data-type') || 'product';
      const quantity = parseInt(addToCartBtn.getAttribute('data-quantity') || '1');
      
      addToCart(productName, productPrice, type, quantity);
      
      // Visual feedback
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = '¡Añadido!';
      addToCartBtn.classList.add('added');
      
      setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.classList.remove('added');
      }, 2000);
    }
  });

  // 4. Initialize Firebase Auth logic (if available on the page)
  if (typeof initAuth === 'function') {
    initAuth();
  }

  console.log('tartdesserts website loaded successfully!');
});

// Check authentication status
function checkAuthStatus() {
  // Check Firebase Auth state
  if (typeof window.firebaseAuth !== 'undefined') {
    return window.firebaseAuth.currentUser !== null;
  }

  // Fallback to localStorage
  return localStorage.getItem('user') !== null;
}

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
// Dynamic Copyright Year
// ===========================
function setCopyrightYear() {
  const copyrightElement = document.getElementById('copyright-year');
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.innerHTML = `&copy; ${currentYear} tartdesserts. Todos los derechos reservados.`;
  }
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
  console.log('Initializing unified cart...');
  
  // Cart UI elements
  const cartToggle = document.getElementById('cart-toggle');
  const closeCart = document.getElementById('close-cart');
  const cartOverlay = document.getElementById('cart-overlay');
  const clearCartBtn = document.getElementById('clear-cart');
  const orderCartBtn = document.getElementById('order-cart');
  
  // Cart toggle functionality
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      store.setState({ isCartOpen: true });
    });
  }
  
  if (closeCart) {
    closeCart.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      store.setState({ isCartOpen: false });
    });
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      store.setState({ isCartOpen: false });
    });
  }
  
  // Handle all add to cart buttons with event delegation
  document.addEventListener('click', (e) => {
    // Handle product add to cart
    const addToCartBtn = e.target.closest('.btn-add-to-box, .btn-add-recipe, .add-to-cart, .add-to-cart-btn, .btn-add-to-cart');
    if (addToCartBtn) {
      e.preventDefault();
      
      const isRecipe = addToCartBtn.classList.contains('btn-add-recipe');
      const productName = addToCartBtn.getAttribute('data-product') || 
                         addToCartBtn.getAttribute('data-recipe');
      const productPrice = parseFloat(
        addToCartBtn.getAttribute('data-price') || '0'
      );
      const quantity = parseInt(
        addToCartBtn.getAttribute('data-quantity') || '1'
      );
      
      if (!productName || isNaN(productPrice)) {
        console.error('Invalid product data:', { productName, productPrice });
        return;
      }
      
      try {
        // Add to cart
        const success = addToCart(
          productName, 
          productPrice, 
          isRecipe ? 'recipe' : 'product', 
          quantity
        );
        
        if (success) {
          // Visual feedback
          const originalText = addToCartBtn.textContent;
          const originalHTML = addToCartBtn.innerHTML;
          
          addToCartBtn.textContent = '¡Añadido!';
          addToCartBtn.classList.add('added');
          
          // Show cart after adding item
          store.setState({ isCartOpen: true });
          
          setTimeout(() => {
            addToCartBtn.innerHTML = originalHTML; // Preserve any HTML in the button
            addToCartBtn.classList.remove('added');
          }, 2000);
        } else {
          console.error('Failed to add item to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  });
  
  // Clear cart button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (store.getState().cart.length > 0) {
        if (confirm('¿Estás seguro de que quieres vaciar la cesta?')) {
          clearCart();
        }
      }
    });
  }
  
  // Order button - Redirect to checkout
  if (orderCartBtn) {
    orderCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { cart } = store.getState();
      
      if (cart.length === 0) {
        alert('Tu cesta está vacía. Añade productos antes de hacer el pedido.');
        return;
      }
      
      // Optional: Validate cart before proceeding
      const isValid = cart.every(item => 
        item.name && item.price > 0 && item.quantity > 0
      );
      
      if (!isValid) {
        console.error('Invalid cart items detected:', cart);
        alert('Hay un problema con los productos en tu cesta. Por favor, inténtalo de nuevo.');
        return;
      }
      
      // Proceed to checkout
      window.location.href = 'checkout-cart.html';
    });
  }
}

// UI update function for the cart
// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format price with error handling
function formatPrice(price) {
  const num = parseFloat(price);
  if (isNaN(num)) return '0,00 €';
  return num.toFixed(2).replace('.', ',') + ' €';
}

// Cache DOM elements for better performance
const cartElements = {
  floatingCart: null,
  cartOverlay: null,
  cartItemsContainer: null,
  cartCountBadge: null,
  totalItemsSpan: null,
  totalPriceSpan: null,
  initialized: false
};

function getCartElements() {
  if (!cartElements.initialized) {
    cartElements.floatingCart = document.getElementById('floating-cart');
    cartElements.cartOverlay = document.getElementById('cart-overlay');
    cartElements.cartItemsContainer = document.getElementById('cart-items');
    cartElements.cartCountBadge = document.getElementById('cart-count');
    cartElements.totalItemsSpan = document.getElementById('cart-total-items');
    cartElements.totalPriceSpan = document.getElementById('cart-total-price');
    cartElements.initialized = true;
  }
  return cartElements;
}

function renderCart(state) {
  const { cart, isCartOpen, isLoading = false } = state;
  const {
    floatingCart,
    cartOverlay,
    cartItemsContainer,
    cartCountBadge,
    totalItemsSpan,
    totalPriceSpan
  } = getCartElements();
  
  // Debug log in development only
  if (process.env.NODE_ENV !== 'production') {
    console.log('Updating cart UI', { cart, isCartOpen, isLoading });
  }

  // Toggle cart visibility with ARIA attributes
  if (floatingCart) {
    floatingCart.classList.toggle('active', isCartOpen);
    floatingCart.setAttribute('aria-hidden', !isCartOpen);
    
    if (cartOverlay) {
      cartOverlay.classList.toggle('active', isCartOpen);
      cartOverlay.setAttribute('aria-hidden', !isCartOpen);
    }
    
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    
    // Set focus to cart when opened for better keyboard navigation
    if (isCartOpen) {
      setTimeout(() => {
        const focusable = floatingCart.querySelector('button, [href], [tabindex]');
        if (focusable) focusable.focus();
      }, 100);
    }
  }

  // Show loading state
  if (cartItemsContainer) {
    cartItemsContainer.setAttribute('aria-busy', isLoading);
    if (isLoading) {
      cartItemsContainer.innerHTML = '<div class="cart-loading">Actualizando carrito...</div>';
      return; // Don't update the rest while loading
    }
  }

  // Update cart count badge with proper ARIA label
  const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  if (cartCountBadge) {
    cartCountBadge.textContent = totalItems;
    cartCountBadge.classList.toggle('hidden', totalItems === 0);
    cartCountBadge.setAttribute('aria-label', `${totalItems} artículos en el carrito`);
  }

  // Render cart items with proper accessibility
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart" role="status" aria-live="polite">
          <p>Tu cesta está vacía</p>
        </div>`;
    } else {
      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      
      cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.setAttribute('role', 'listitem');
        
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity, 10) || 1;
        const itemTotal = (price * quantity).toFixed(2);
        
        itemElement.innerHTML = `
          <div class="cart-item-info">
            <div class="cart-item-name">${escapeHtml(item.name)}</div>
            <div class="cart-item-price">${formatPrice(price)}</div>
          </div>
          <div class="box-item-quantity" role="group" aria-label="Cantidad">
            <button 
              class="quantity-btn" 
              onclick="window.decreaseQuantity(${index})"
              aria-label="Reducir cantidad"
              ${quantity <= 1 ? 'disabled' : ''}
            >−</button>
            <span class="quantity-number" aria-live="polite">${quantity}</span>
            <button 
              class="quantity-btn" 
              onclick="window.increaseQuantity(${index})"
              aria-label="Aumentar cantidad"
            >+</button>
          </div>
          <button 
            class="remove-cart-item" 
            onclick="window.removeCartItem(${index})"
            aria-label="Eliminar artículo"
          >✕</button>
          <div class="cart-item-total" aria-hidden="true">
            Total: ${formatPrice(itemTotal)}
          </div>
        `;
        
        fragment.appendChild(itemElement);
      });
      
      // Clear and append new items in one operation
      cartItemsContainer.innerHTML = '';
      cartItemsContainer.appendChild(fragment);
      
      // Add ARIA live region for screen readers
      const status = document.createElement('div');
      status.className = 'sr-only';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.textContent = `Carrito actualizado: ${totalItems} artículos`;
      cartItemsContainer.appendChild(status);
    }
  }

  // Update totals with proper formatting
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity, 10) || 0;
    return sum + (price * quantity);
  }, 0);
  
  if (totalItemsSpan) {
    totalItemsSpan.textContent = totalItems;
    totalItemsSpan.setAttribute('aria-label', `${totalItems} artículos`);
  }
  
  if (totalPriceSpan) {
    totalPriceSpan.textContent = formatPrice(totalPrice);
    totalPriceSpan.setAttribute('aria-label', `Total: ${formatPrice(totalPrice)}`);
  }
}

  // Global functions for cart operations
window.increaseQuantity = function(index) {
    try {
        const currentState = store.getState();
        if (!currentState.cart[index]) {
            console.error('Cannot increase quantity: item not found at index', index);
            return;
        }
        const currentQuantity = currentState.cart[index].quantity;
        if (!updateCartItemQuantity(index, currentQuantity + 1)) {
            throw new Error('Failed to update cart item quantity');
        }
    } catch (error) {
        console.error('Error in increaseQuantity:', error);
        window.handleCartError?.(error);
    }
};

window.decreaseQuantity = function(index) {
    try {
        const currentState = store.getState();
        if (!currentState.cart[index]) {
            console.error('Cannot decrease quantity: item not found at index', index);
            return;
        }
        const currentQuantity = currentState.cart[index].quantity;
        if (!updateCartItemQuantity(index, currentQuantity - 1)) {
            throw new Error('Failed to update cart item quantity');
        }
    } catch (error) {
        console.error('Error in decreaseQuantity:', error);
        window.handleCartError?.(error);
    }
};

window.removeCartItem = function(index) {
    try {
        if (!updateCartItemQuantity(index, 0)) {
            throw new Error('Failed to remove item from cart');
        }
    } catch (error) {
        console.error('Error in removeCartItem:', error);
        window.handleCartError?.(error);
    }
};
  
// Product detail page functionality
function initProductDetail() {
  // Check if we're on product detail page
  const productId = new URLSearchParams(window.location.search).get('product');
  if (!productId) return;

  // Products data
  const products = {
    'cookie-red-velvet': {
      name: 'Cookie Red Velvet',
      price: 3.00,
      description: 'Nuestra Cookie Red Velvet es una delicia irresistible con su característico color rojo y su suave textura aterciopelada. Elaborada con cacao de calidad y generosos chips de chocolate blanco, cada bocado es una experiencia única.',
      description2: 'Perfecta para acompañar tu café o como un capricho dulce en cualquier momento del día. Su textura es crujiente por fuera y suave por dentro, con el equilibrio perfecto entre el sabor del red velvet y el dulzor del chocolate blanco.',
      features: [
        'Peso aproximado: 80-90g por cookie',
        'Ingredientes: Harina, mantequilla, azúcar, huevos, cacao, chips de chocolate blanco, colorante alimentario',
        'Conservación: 5-7 días en recipiente hermético',
        'Alérgenos: Gluten, lácteos, huevo'
      ],
      image: 'assets/images/cookie-red-velvet.jpg',
      allergens: 'Gluten, lácteos, huevo'
    },
    'cookie-churro': {
      name: 'Cookie de Churro',
      price: 3.00,
      description: 'Nuestra Cookie de Churro captura perfectamente el sabor auténtico de un churro tradicional en una textura crujiente por fuera y suave por dentro.',
      description2: 'Elaborada con canela de calidad y azúcar glass, cada bocado te transportará a una churrería tradicional. Perfecta para los amantes de los sabores tradicionales con un toque innovador.',
      features: [
        'Peso aproximado: 80-90g por cookie',
        'Ingredientes: Harina, mantequilla, azúcar, huevos, canela, azúcar glass',
        'Conservación: 5-7 días en recipiente hermético',
        'Alérgenos: Gluten, lácteos, huevo'
      ],
      image: 'assets/images/cookie-churro.jpg',
      allergens: 'Gluten, lácteos, huevo'
    },
    'cookie-lotus': {
      name: 'Cookie Lotus',
      price: 3.00,
      description: 'Una explosión de sabor caramelizado con galletas Lotus Biscoff trituradas que le dan un toque único y adictivo.',
      description2: 'La combinación perfecta entre la suavidad de nuestra cookie base y el sabor característico de las galletas Lotus caramelizadas. Ideal para los amantes de los sabores intensos y dulces.',
      features: [
        'Peso aproximado: 80-90g por cookie',
        'Ingredientes: Harina, mantequilla, azúcar, huevos, galletas Lotus Biscoff, especias',
        'Conservación: 5-7 días en recipiente hermético',
        'Alérgenos: Gluten, lácteos, huevo, soja'
      ],
      image: 'assets/images/cookie-lotus.jpg',
      allergens: 'Gluten, lácteos, huevo, soja'
    },
    'brownie-clasico': {
      name: 'Brownie Clásico',
      price: 2.50,
      description: 'El brownie perfecto: jugoso por dentro, crujiente por fuera, con un intenso sabor a chocolate que deleitará a los amantes del cacao.',
      description2: 'Elaborado con chocolate de la mejor calidad, este brownie tiene la textura ideal que todos buscan. Ni muy seco ni muy húmedo, solo perfecto.',
      features: [
        'Peso aproximado: 100g por porción',
        'Ingredientes: Chocolate negro, mantequilla, azúcar, huevos, harina, cacao',
        'Conservación: 4-5 días en recipiente hermético',
        'Alérgenos: Gluten, lácteos, huevo'
      ],
      image: 'assets/images/brownie-clasico.jpg',
      allergens: 'Gluten, lácteos, huevo'
    },
    'brookie-clasico': {
      name: 'Brookie Clásico',
      price: 3.50,
      description: 'La fusión perfecta entre dos mundos: la mitad superior es una cookie crujiente y la mitad inferior es un brownie jugoso.',
      description2: 'Lo mejor de ambos mundos en un solo producto. La textura crujiente de la cookie se combina perfectamente con la jugosidad del brownie para crear una experiencia única.',
      features: [
        'Peso aproximado: 120g por pieza',
        'Ingredientes: Harina, chocolate, mantequilla, azúcar, huevos, cacao',
        'Conservación: 4-5 días en recipiente hermético',
        'Alérgenos: Gluten, lácteos, huevo'
      ],
      image: 'assets/images/brookie-clasico.jpg',
      allergens: 'Gluten, lácteos, huevo'
    }
  };

  // Update page with product data
  function updateProductPage() {
    if (!products[productId]) {
      // Redirect to products page if product not found
      window.location.href = 'productos.html';
      return;
    }

    const product = products[productId];

    // Update title
    document.title = `${product.name} - tartdesserts`;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${product.name} - tartdesserts`;

    // Update content
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productImage = document.getElementById('product-image');

    if (productTitle) productTitle.textContent = product.name;
    if (productPrice) productPrice.textContent = `${product.price.toFixed(2)} €`;
    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.name;
    }

    // Update descriptions
    const descriptionDiv = document.getElementById('product-description');
    if (descriptionDiv) {
      descriptionDiv.innerHTML = `
        <p>${product.description}</p>
        <p>${product.description2}</p>
      `;
    }

    // Update features
    const featuresList = document.getElementById('product-features');
    if (featuresList) {
      featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    }

    // Update add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    if (addToCartBtn) {
      addToCartBtn.dataset.product = product.name;
      addToCartBtn.dataset.price = product.price.toFixed(2);
    }
  }

  // Initialize product page
  updateProductPage();

  // Quantity selector functionality
  const decreaseQty = document.getElementById('decrease-qty');
  const increaseQty = document.getElementById('increase-qty');
  const quantityInput = document.getElementById('product-quantity');
  const addToCartDetail = document.getElementById('add-to-cart-detail');

  if (decreaseQty) {
    decreaseQty.addEventListener('click', function() {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }

  if (increaseQty) {
    increaseQty.addEventListener('click', function() {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue < 50) {
        quantityInput.value = currentValue + 1;
      }
    });
  }

  if (addToCartDetail) {
    addToCartDetail.addEventListener('click', function() {
      const quantity = parseInt(quantityInput.value);
      const productName = this.dataset.product;
      const productPrice = parseFloat(this.dataset.price);

      // Add the product with the selected quantity
      addToCart(productName, productPrice, 'product', quantity);

      // Show feedback
      const originalText = this.textContent;
      this.textContent = '✓ Añadido a la cesta';
      setTimeout(() => {
        this.textContent = originalText;
      }, 2000);
    });
  }
}
