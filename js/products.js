import store, { addToCart as addToCartAction } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all quantity selectors on the page
  const quantitySelectors = document.querySelectorAll('.quantity-selector');
  
  quantitySelectors.forEach(selector => {
    const input = selector.querySelector('.quantity-input');
    const decreaseBtn = selector.querySelector('[data-action="decrease"]');
    const increaseBtn = selector.querySelector('[data-action="increase"]');
    const addToCartBtn = selector.closest('.product-card')?.querySelector('.add-to-cart-btn');
    
    // Set initial values
    let quantity = parseInt(input.value) || 1;
    
    // Update input value
    const updateInput = () => {
      input.value = quantity;
      
      // Update the data-quantity attribute on the parent product card
      const productCard = selector.closest('.product-card');
      if (productCard) {
        productCard.setAttribute('data-quantity', quantity);
      }
    };
    
    // Decrease quantity
    const decreaseQuantity = () => {
      if (quantity > 1) {
        quantity--;
        updateInput();
      }
    };
    
    // Increase quantity
    const increaseQuantity = () => {
      if (quantity < 50) { // Max 50 items
        quantity++;
        updateInput();
      }
    };
    
    // Handle manual input
    const handleInput = (e) => {
      let value = parseInt(e.target.value);
      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > 50) {
        value = 50;
      }
      quantity = value;
      updateInput();
    };
    
    // Add to cart functionality
    const handleAddToCart = () => {
      const productCard = selector.closest('.product-card');
      if (!productCard) return;
      
      const productName = productCard.querySelector('.product-title')?.textContent || 'Producto';
      const productPrice = parseFloat(productCard.dataset.price) || 0;
      const productType = productCard.dataset.type || 'product';
      
      addToCartAction(productName, productPrice, productType, quantity);
      
      // Show feedback
      if (addToCartBtn) {
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = '¡Añadido! ✓';
        addToCartBtn.classList.add('added-to-cart');
        
        setTimeout(() => {
          addToCartBtn.textContent = originalText;
          addToCartBtn.classList.remove('added-to-cart');
        }, 2000);
      }
    };
    
    // Event listeners
    decreaseBtn?.addEventListener('click', decreaseQuantity);
    increaseBtn?.addEventListener('click', increaseQuantity);
    input?.addEventListener('input', handleInput);
    
    // If there's an add to cart button in the product card, use it
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleAddToCart();
      });
    }
    
    // Also allow adding to cart when clicking the increase button
    increaseBtn?.addEventListener('click', (e) => {
      if (e.shiftKey) { // Hold shift to add to cart
        e.preventDefault();
        handleAddToCart();
      }
    });
    
    // Initialize
    updateInput();
  });
  
  // Update copyright year
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = `© ${new Date().getFullYear()} tartdesserts. Todos los derechos reservados.`;
  }
});
