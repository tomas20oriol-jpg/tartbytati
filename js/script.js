// ===========================
// tartdesserts - Main JavaScript
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // Initialize Firebase Auth (if available)
  if (typeof window.firebaseAuth !== 'undefined') {
    initFirebaseAuth();
  }

  // Smooth scrolling for anchor links
  initSmoothScroll();

  // Add active state to navigation
  highlightActiveNav();

  // Add animation on scroll
  initScrollAnimations();

  // Initialize product detail page if applicable
  initProductDetail();

  console.log('tartdesserts website loaded successfully!');
});

// Initialize Firebase Auth
function initFirebaseAuth() {
  // Import auth functions if available
  if (window.firebaseAuth && window.firebaseDb) {
    import('./firebase-auth.js').then(({ initAuth }) => {
      initAuth();
    }).catch(err => {
      console.log('Firebase Auth not available on this page');
    });
  }
}

// Update authentication UI elements
function updateAuthUI() {
  const loginLink = document.getElementById('login-link');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name-display');

  // Check if user is authenticated
  const isLoggedIn = checkAuthStatus();

  if (isLoggedIn && loginLink) {
    // User is logged in - show "MI CUENTA"
    loginLink.textContent = 'MI CUENTA';
    loginLink.href = 'account.html';

    // Show user info if available
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && userName) {
      userName.textContent = user.name || 'Usuario';
      userName.style.display = 'inline';
    }
  } else {
    // User is not logged in - show "LOGIN"
    if (loginLink) {
      loginLink.textContent = 'LOGIN';
      loginLink.href = 'login.html';
    }
    if (userName) {
      userName.style.display = 'none';
    }
  }
}

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
  let cart = JSON.parse(localStorage.getItem('tartdessertsCart')) || [];
  
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
    localStorage.setItem('tartdessertsCart', JSON.stringify(cart));
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
  
  // Order button - Redirect to checkout
  if (orderCartBtn) {
    orderCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (cart.length === 0) {
        alert('Tu cesta está vacía. Añade productos antes de hacer el pedido.');
        return;
      }
      
      // Save cart with new key for checkout page
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Redirect to checkout
      window.location.href = 'checkout-cart.html';
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

      // Add multiple items to cart
      for (let i = 0; i < quantity; i++) {
        // Trigger the existing add to cart functionality
        const event = new CustomEvent('addToCart', {
          detail: { name: productName, price: productPrice }
        });
        document.dispatchEvent(event);
      }

      // Show feedback
      const originalText = this.textContent;
      this.textContent = '✓ Añadido a la cesta';
      setTimeout(() => {
        this.textContent = originalText;
      }, 2000);
    });
  }
}
