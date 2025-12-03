import store, { addToCart, toggleCart } from './store.js';

// DOM Elements
const quantityInput = document.getElementById('product-quantity');
const decreaseBtn = document.getElementById('decrease-qty');
const increaseBtn = document.getElementById('increase-qty');
const addToCartBtn = document.getElementById('add-to-cart-detail');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');

// Initialize product data from the page
const product = {
    name: productTitle.textContent,
    price: parseFloat(productPrice.textContent.replace('€', '').trim().replace(',', '.')),
    type: 'product',
};

// Update the product data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Update product data from the page
    product.name = productTitle.textContent;
    product.price = parseFloat(
        productPrice.textContent
            .replace('€', '')
            .trim()
            .replace(',', '.')
    );
    
    // Set the product data on the Add to Cart button
    addToCartBtn.dataset.product = product.name;
    addToCartBtn.dataset.price = product.price;
    
    // Update copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = `© ${new Date().getFullYear()} tartdesserts. Todos los derechos reservados.`;
    }
});

// Quantity controls
decreaseBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
        quantityInput.value = value - 1;
    }
});

increaseBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value < 50) { // Max 50 items
        quantityInput.value = value + 1;
    }
});

// Add to cart functionality
addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const quantity = parseInt(quantityInput.value);
    
    // Add the item to the cart
    const success = addToCart(
        product.name,
        product.price,
        product.type,
        quantity
    );
    
    if (success) {
        // Show feedback to the user
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = '¡Añadido! ✓';
        addToCartBtn.classList.add('added-to-cart');
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            addToCartBtn.textContent = originalText;
            addToCartBtn.classList.remove('added-to-cart');
        }, 2000);
        
        // Open the cart
        toggleCart(true);
    }
});

// Allow manual input with validation
quantityInput.addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
        e.target.value = 1;
    } else if (value > 50) {
        e.target.value = 50;
    }
});

// Prevent form submission when pressing Enter
quantityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
