// ===========================
// Global State Store (Pub/Sub Pattern)
// ===========================

// 1. The initial state is loaded from localStorage to maintain persistence.
const initialState = {
    cart: JSON.parse(localStorage.getItem('tartdessertsCart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    isCartOpen: false,
};

// 2. The global store object holds the state and the list of subscribers.
const store = {
    state: initialState,
    subscribers: [],

    // Method for UI components to subscribe to state changes.
    subscribe(callback) {
        this.subscribers.push(callback);
        // Return an unsubscribe function for cleanup.
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    },

    // The ONLY way to update the state.
    setState(newState) {
        // Merge the new state with the old state.
        this.state = { ...this.state, ...newState };
        
        // Persist critical parts of the state to localStorage.
        localStorage.setItem('tartdessertsCart', JSON.stringify(this.state.cart));
        if (this.state.user) {
            localStorage.setItem('user', JSON.stringify(this.state.user));
        } else {
            localStorage.removeItem('user');
        }

        // Notify all subscribers about the state change.
        this.subscribers.forEach(callback => callback(this.state));
    },

    // Getter for convenience.
    getState() {
        return this.state;
    }
};

// 3. Actions: Public functions that components can call to update the state.
// They provide a clean API and contain the logic for state changes.

export function addToCart(name, price, type, quantity = 1) {
    try {
        if (!name || typeof price !== 'number' || price <= 0 || !type || quantity <= 0) {
            console.error('Invalid cart item:', { name, price, type, quantity });
            return false;
        }

        const currentState = store.getState();
        const cart = [...currentState.cart];

        // Find if item already exists in cart
        const existingItemIndex = cart.findIndex(item => 
            item.name === name && item.type === type && item.price === price
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.push({ 
                name, 
                price: parseFloat(price.toFixed(2)), // Ensure consistent decimal places
                type, 
                quantity: Math.max(1, Math.floor(quantity)) // Ensure quantity is at least 1
            });
        }

        // Update state and open cart
        store.setState({ 
            cart,
            isCartOpen: true,
            lastUpdated: Date.now()
        });
        
        console.log('Item added to cart:', { name, price, type, quantity });
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

export function updateCartItemQuantity(index, newQuantity) {
    try {
        const currentState = store.getState();
        const cart = [...currentState.cart];

        if (!cart[index]) {
            console.error('Item not found in cart at index:', index);
            return false;
        }

        if (newQuantity > 0) {
            // Update quantity
            cart[index].quantity = Math.floor(newQuantity);
        } else {
            // Remove item if quantity is 0 or less
            const [removed] = cart.splice(index, 1);
            console.log('Item removed from cart:', removed);
        }

        store.setState({ 
            cart,
            lastUpdated: Date.now()
        });
        return true;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return false;
    }
}

export function clearCart() {
    store.setState({ cart: [] });
}

export function toggleCart(isOpen) {
    const currentState = store.getState();
    const newState = {
        isCartOpen: isOpen !== undefined ? isOpen : !currentState.isCartOpen
    };
    store.setState(newState);
    return newState.isCartOpen;
}

export function setUser(user) {
    store.setState({ user });
}

export function clearUser() {
    store.setState({ user: null });
}

// Export the store itself so components can subscribe.
export default store;