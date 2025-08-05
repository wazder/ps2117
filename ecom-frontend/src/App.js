import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Orders from './components/Orders';
import Cart from './components/Cart';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <h1>ecom177</h1>
            {isAuthenticated && (
              <nav className="nav-links">
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/orders" className="nav-link">
                  {user.role === 'ADMIN' ? 'Orders' : 'My Orders'}
                </Link>
                <Link to="/cart" className="nav-link">
                  Cart 
                  {(() => {
                    const cart = localStorage.getItem('cart');
                    const cartItems = cart ? JSON.parse(cart) : [];
                    return cartItems.length > 0 && (
                      <span className="cart-badge">
                        {cartItems.length}
                      </span>
                    );
                  })()}
                </Link>
              </nav>
            )}
          </div>
          {isAuthenticated && (
            <div className="header-right">
{/*
              <span className="user-greeting">
                Hello, {user.firstName || user.username}!
              </span>
*/}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </header>
        
        <main>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/products" 
                element={isAuthenticated ? <Products /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/orders" 
                element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/cart" 
                element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} 
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Toast />
      </div>
    </Router>
  );
}

export default App;