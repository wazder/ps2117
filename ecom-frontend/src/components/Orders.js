import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';
import { showToast } from './Toast';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('my'); // 'my', 'all', 'pending'
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);
  const isAdmin = user.role === 'ADMIN';

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = '/api/orders/my-orders';
      
      if (isAdmin) {
        switch (viewMode) {
          case 'all':
            endpoint = '/api/orders/admin/all';
            break;
          case 'pending':
            endpoint = '/api/orders/admin/pending';
            break;
          default:
            endpoint = '/api/orders/my-orders';
        }
      }
      
      const response = await api.get(endpoint);
      setOrders(response.data);
      setError('');
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [viewMode, isAdmin]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await api.put(`/api/orders/${orderId}/status?status=${newStatus}`);
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      console.error('Update order error:', err);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This will restore the product stock.')) {
      return;
    }
    
    try {
      await api.delete(`/api/orders/${orderId}`);
      showToast('Order deleted successfully', 'success');
      fetchOrders();
    } catch (err) {
      console.error('Delete order error:', err);
      showToast('Failed to delete order', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#17a2b8';
      case 'SHIPPED': return '#6f42c1';
      case 'DELIVERED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>
          {viewMode === 'my' ? 'My Orders' : 
           viewMode === 'all' ? 'All Orders (Admin)' : 
           'Pending Orders (Admin)'}
        </h2>
        <div className="user-info">
          {user.firstName} {user.lastName}
          {isAdmin && <span className="admin-badge">ADMIN</span>}
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="admin-controls">
          <div className="view-mode-selector">
            <button 
              className={viewMode === 'my' ? 'active' : ''}
              onClick={() => setViewMode('my')}
            >
              {isAdmin ? 'Orders' : 'My Orders'}
            </button>
            <button 
              className={viewMode === 'pending' ? 'active' : ''}
              onClick={() => setViewMode('pending')}
            >
              Pending Orders ({stats.pending})
            </button>
            <button 
              className={viewMode === 'all' ? 'active' : ''}
              onClick={() => setViewMode('all')}
            >
              All Orders ({stats.total})
            </button>
          </div>
          
          {viewMode !== 'my' && (
            <div className="order-stats">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.delivered}</div>
                <div className="stat-label">Delivered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders found</h3>
          <p>
            {viewMode === 'pending' ? 'No pending orders at the moment.' :
             viewMode === 'all' ? 'No orders in the system yet.' :
             "You haven't placed any orders yet."}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{formatDate(order.orderDate)}</p>
                  {isAdmin && viewMode !== 'my' && (
                    <p className="order-customer">Customer: {order.username}</p>
                  )}
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                  <div className="order-total">
                    ${order.totalAmount}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {isAdmin && viewMode !== 'my' && (
                <div className="admin-actions">
                  <div className="status-controls">
                    <label>Update Status:</label>
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    {updatingOrder === order.id && <span className="updating">Updating...</span>}
                  </div>
                  <button 
                    className="delete-order-btn"
                    onClick={() => deleteOrder(order.id)}
                    title="Delete order and restore stock"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}

              <div className="order-items">
                <h4>Items:</h4>
                <div className="items-list">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        {item.productImage && (
                          <img 
                            src={item.productImage} 
                            alt={item.productName}
                            className="product-image"
                          />
                        )}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.productName}</div>
                        <div className="item-quantity">Quantity: {item.quantity}</div>
                        <div className="item-price">
                          ${item.unitPrice} x {item.quantity} = ${item.totalPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.shippingAddress && (
                <div className="shipping-info">
                  <h4>Shipping Address:</h4>
                  <p>{order.shippingAddress}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;