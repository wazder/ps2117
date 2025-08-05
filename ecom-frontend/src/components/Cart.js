import React, { useState, useEffect } from 'react';
import { showToast } from './Toast';
import api from '../utils/api';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // const user = JSON.parse(localStorage.getItem('user') || '{}'); // Not currently used

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Please provide a shipping address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: shippingAddress
      };

      await api.post('/api/orders', orderData);

      clearCart();
      setShippingAddress('');
      setShowCheckout(false);
      showToast && showToast('Order placed successfully!', 'success');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
        </div>
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <div className="cart-actions">
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.base64Image && (
                  <img src={item.base64Image} alt={item.name} />
                )}
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price}</p>
              </div>
              
              <div className="item-controls">
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Items ({cartItems.length}):</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${getTotalPrice()}</span>
            </div>
            
            <button 
              onClick={() => setShowCheckout(!showCheckout)}
              className="checkout-btn"
            >
              {showCheckout ? 'Cancel Checkout' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="checkout-section">
          <h3>Checkout</h3>
          <div className="checkout-form">
            <div className="form-group">
              <label>Shipping Address:</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your shipping address..."
                rows="4"
                required
              />
            </div>
            
            <div className="checkout-actions">
              <button 
                onClick={handleCheckout} 
                disabled={loading}
                className="place-order-btn"
              >
                {loading ? 'Placing Order...' : `Place Order ($${getTotalPrice()})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;