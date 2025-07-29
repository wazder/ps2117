import React, { useState, useEffect } from 'react';
import './Toast.css';

let showToast = null;

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToast = (message, type = 'info') => {
      const id = Date.now();
      const newToast = { id, message, type };
      
      setToasts(prev => [...prev, newToast]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 4000);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button 
            className="toast-close" 
            onClick={() => removeToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export { showToast };
export default Toast;