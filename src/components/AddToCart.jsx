import React, { useState } from 'react';

/**
 * AddToCart Component
 * 
 * Responsibilities:
 * 1. Displays all items added by the user in a modern cart list.
 * 2. Shows product image, name, unit price, quantity, and individual subtotal.
 * 3. Provides + and - buttons to increment or decrement product quantity.
 * 4. Provides a button to remove an item from the cart.
 * 5. Uses reduce() to calculate total item count and total cart price.
 * 6. Displays an attractive "Your cart is empty" view when cart has 0 items.
 * 7. Provides order summary with promo code support and checkout action.
 */
function AddToCart({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClearCart,
  onContinueShopping,
}) {
  // State for promo code input & discount
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  /**
   * 1. Calculate Total Items Count using reduce():
   * Sums the quantity property of every item in the cart array.
   */
  const totalItemsCount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  /**
   * 2. Calculate Subtotal Price of the Cart using reduce():
   * Multiplies each item's price by its quantity and accumulates the sum.
   */
  const cartSubtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Apply promo discount if any
  const discountAmount = (cartSubtotal * discountPercent) / 100;

  // Free shipping if subtotal is over $50, else $9.99
  const shippingFee = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 9.99;

  // Final Total calculation
  const finalTotal = cartSubtotal - discountAmount + shippingFee;

  /**
   * Handle applying promo code (e.g., 'NOVA15' gives 15% off)
   */
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();

    if (code === 'NOVA15') {
      setDiscountPercent(15);
      setPromoMessage({ text: '🎉 Coupon "NOVA15" applied! (15% OFF)', type: 'success' });
    } else if (code === 'SAVE25') {
      setDiscountPercent(25);
      setPromoMessage({ text: '🎉 Coupon "SAVE25" applied! (25% OFF)', type: 'success' });
    } else if (!code) {
      setPromoMessage({ text: 'Please enter a coupon code.', type: 'error' });
    } else {
      setPromoMessage({ text: 'Invalid code. Try "NOVA15" or "SAVE25".', type: 'error' });
    }
  };

  /**
   * Simulate a checkout process
   */
  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      onClearCart();
    }, 1500);
  };

  // Case 1: Checkout Success State
  if (checkoutComplete) {
    return (
      <div className="cart-empty-container">
        <div className="success-icon-badge">✨</div>
        <h2 className="empty-title">Order Confirmed!</h2>
        <p className="empty-subtitle">
          Thank you for shopping with <strong>NovaStore</strong>. Your order is being prepared and will ship right away.
        </p>
        <button
          className="primary-btn"
          onClick={() => {
            setCheckoutComplete(false);
            onContinueShopping();
          }}
        >
          ⚡ Continue Shopping
        </button>
      </div>
    );
  }

  // Case 2: Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="empty-cart-icon">🛒</div>
        <h2 className="empty-title">Your cart is empty</h2>
        <p className="empty-subtitle">
          Looks like you haven't added anything to your cart yet. Discover trending deals today!
        </p>
        <button className="primary-btn" onClick={onContinueShopping}>
          ⚡ Explore Products Now
        </button>
      </div>
    );
  }

  // Case 3: Cart has products
  return (
    <div className="cart-page-container">
      {/* Header bar for Cart */}
      <div className="cart-page-header">
        <div>
          <h1 className="cart-page-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            You have <strong>{totalItemsCount}</strong> item{totalItemsCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="cart-header-actions">
          <button className="text-link-btn" onClick={onContinueShopping}>
            ← Continue Shopping
          </button>
          <button
            className="clear-all-btn"
            onClick={onClearCart}
            title="Remove all items from your cart"
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>

      {/* Main Cart Content: 2-column layout */}
      <div className="cart-layout">
        {/* Left Column: List of Cart Items */}
        <div className="cart-items-list">
          {cart.map((item) => {
            // Calculate individual product subtotal
            const itemSubtotal = item.price * item.quantity;
            const productImage = item.image || item.thumbnail;

            return (
              <div key={item.id} className="cart-item-card">
                {/* Product Thumbnail */}
                <div className="cart-item-image-wrapper">
                  <img
                    src={productImage}
                    alt={item.title}
                    className="cart-item-image"
                  />
                </div>

                {/* Product Details */}
                <div className="cart-item-details">
                  <span className="cart-item-category">
                    {item.category?.replace('-', ' ')}
                  </span>
                  <h3 className="cart-item-title">{item.title}</h3>
                  <div className="cart-item-unit-price">
                    Unit Price: <strong>${item.price.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Quantity Controls: Decrement, Current Quantity, Increment */}
                <div className="cart-item-quantity-section">
                  <span className="qty-label">Quantity:</span>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn minus-btn"
                      onClick={() => onDecreaseQuantity(item.id)}
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn plus-btn"
                      onClick={() => onIncreaseQuantity(item.id)}
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal for this Product */}
                <div className="cart-item-subtotal-section">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-amount">
                    ${itemSubtotal.toFixed(2)}
                  </span>
                </div>

                {/* Remove Button */}
                <div className="cart-item-remove-section">
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveFromCart(item.id)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="order-summary-card">
          <h2 className="summary-title">Order Summary</h2>

          {/* Subtotal */}
          <div className="summary-row">
            <span className="summary-label">Items Subtotal ({totalItemsCount}):</span>
            <span className="summary-value">${cartSubtotal.toFixed(2)}</span>
          </div>

          {/* Discount if applied */}
          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label">Discount ({discountPercent}%):</span>
              <span className="summary-value discount-text">
                −${discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="summary-row">
            <span className="summary-label">Estimated Shipping:</span>
            <span className="summary-value">
              {shippingFee === 0 ? (
                <span className="free-shipping-badge">FREE</span>
              ) : (
                `$${shippingFee.toFixed(2)}`
              )}
            </span>
          </div>

          {/* Shipping progress helper */}
          {cartSubtotal < 50 && (
            <div className="shipping-hint">
              Add <strong>${(50 - cartSubtotal).toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>!
            </div>
          )}

          <hr className="summary-divider" />

          {/* Total Price */}
          <div className="summary-row total-row">
            <span className="total-label">Total Amount:</span>
            <span className="total-amount">${finalTotal.toFixed(2)}</span>
          </div>

          {/* Promo code form */}
          <form className="promo-form" onSubmit={handleApplyPromo}>
            <div className="promo-input-group">
              <input
                type="text"
                placeholder="Promo Code (NOVA15)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button type="submit" className="apply-btn">
                Apply
              </button>
            </div>
            {promoMessage.text && (
              <p className={`promo-message ${promoMessage.type}`}>
                {promoMessage.text}
              </p>
            )}
          </form>

          {/* Checkout Button */}
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <span className="btn-spinner"></span> Finalizing Order...
              </>
            ) : (
              <>
                🔒 Complete Purchase (${finalTotal.toFixed(2)})
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="trust-features">
            <div className="trust-item">
              <span>🛡️</span> 256-Bit Encrypted Payment
            </div>
            <div className="trust-item">
              <span>🚀</span> Express Courier Delivery
            </div>
            <div className="trust-item">
              <span>🔄</span> Hassle-Free 30-Day Returns
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AddToCart;
