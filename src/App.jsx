import React, { useState } from 'react';
import Ecommerce from './components/Ecommerce.jsx';
import AddToCart from './components/AddToCart.jsx';
import './App.css';

/**
 * Main App Component
 * 
 * Responsibilities:
 * 1. Holds the shared state:
 *    - `cart`: Array of items currently in the user's cart.
 *    - `activeView`: Which screen is active ('ecommerce' or 'cart').
 *    - `toast`: Notification popup when an item is added to cart.
 * 2. Provides handler functions:
 *    - `handleAddToCart`: Adds a product or increments quantity if it already exists (using find()).
 *    - `handleIncreaseQuantity`: Increments quantity by 1.
 *    - `handleDecreaseQuantity`: Decrements quantity by 1 (or removes if reaches 0).
 *    - `handleRemoveFromCart`: Removes a product completely (using filter()).
 *    - `handleClearCart`: Empties the cart.
 * 3. Connects the Ecommerce and AddToCart components by passing state and functions via props.
 */
function App() {
  // State 1: Shopping cart items array
  const [cart, setCart] = useState([]);

  // State 2: Active view navigation ('ecommerce' or 'cart')
  const [activeView, setActiveView] = useState('ecommerce');

  // State 3: Toast notification message for user feedback
  const [toast, setToast] = useState(null);

  /**
   * Helper function to show a temporary toast notification
   */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /**
   * Add a product to the cart.
   * Requirement: Prevent duplicate cart entries by increasing the quantity of an existing product.
   * Uses JavaScript find() to check for an existing item.
   */
  const handleAddToCart = (productToAdd) => {
    setCart((prevCart) => {
      // 1. Check if the product is already in the cart using find()
      const existingItem = prevCart.find((item) => item.id === productToAdd.id);

      if (existingItem) {
        // 2. If it already exists, map over the array and increment its quantity
        return prevCart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 3. If it's a new product, append it to the cart with quantity: 1
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });

    showToast(`Added "${productToAdd.title}" to cart!`);
  };

  /**
   * Increment the quantity of a product in the cart by 1.
   * Uses map() to locate the item by ID and increment its quantity.
   */
  const handleIncreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  /**
   * Decrement the quantity of a product in the cart by 1.
   * If quantity is 1 and user clicks minus, we remove the product using filter().
   */
  const handleDecreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  /**
   * Remove a product completely from the cart.
   * Uses JavaScript filter() to return all items except the one matching productId.
   */
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.id === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.title}" from cart.`);
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  /**
   * Clear all items from the cart.
   */
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      setCart([]);
      showToast('Shopping cart cleared.');
    }
  };

  /**
   * Calculate the total count of items in the cart using reduce().
   * This is displayed on the cart badge in the navigation bar.
   */
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-root">
      {/* Top Header & Navigation Bar */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Brand Logo & Name */}
          <div
            className="navbar-brand"
            onClick={() => setActiveView('ecommerce')}
            role="button"
            tabIndex={0}
            title="NovaStore Home"
          >
            <span className="brand-icon">⚡</span>
            <span className="brand-text">NovaStore</span>
          </div>

          {/* Navigation Links */}
          <nav className="navbar-nav">
            <button
              className={`nav-link ${activeView === 'ecommerce' ? 'active' : ''}`}
              onClick={() => setActiveView('ecommerce')}
            >
              <span className="nav-icon">📦</span>
              <span>Products</span>
            </button>

            <button
              className={`nav-link cart-nav-btn ${activeView === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveView('cart')}
              aria-label={`Shopping Cart with ${totalCartCount} items`}
            >
              <span className="nav-icon">🛒</span>
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="navbar-cart-badge">{totalCartCount}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area: Renders Ecommerce or AddToCart based on activeView */}
      <main className="main-content">
        {activeView === 'ecommerce' ? (
          <Ecommerce
            onAddToCart={handleAddToCart}
            cart={cart}
          />
        ) : (
          <AddToCart
            cart={cart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onContinueShopping={() => setActiveView('ecommerce')}
          />
        )}
      </main>

      {/* Toast Notification Popup */}
      {toast && (
        <div className="toast-notification" role="status">
          <span className="toast-icon">✨</span>
          <span className="toast-text">{toast}</span>
        </div>
      )}

      {/* Modern Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} NovaStore Online. Powered by FakeStore API & React.</p>
          <div className="footer-links">
            <span>Free Shipping Worldwide</span> •
            <span>24/7 Concierge Support</span> •
            <span>Certified Safe Checkout</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
