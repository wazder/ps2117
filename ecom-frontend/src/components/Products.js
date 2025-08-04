import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { showToast } from './Toast';
import './Products.css';
import api from '../utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const initialProductState = useMemo(() => ({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    base64Image: ''
  }), []);
  
  const [newProduct, setNewProduct] = useState(initialProductState);

  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
      setError('');
    } catch (err) {
      console.error('Products fetch error:', err);
      setError('Failed to fetch products. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
    };
    loadData();
  }, [fetchProducts, fetchCategories]);

  const handleInputChange = useCallback((e) => {
    setNewProduct(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // 10MB boyut kontrolü (10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast('Image size must be less than 10MB', 'error');
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct(prev => ({
          ...prev,
          base64Image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (showUpdateForm && selectedProductId) {
        const response = await api.put(`/api/products/${selectedProductId}`, newProduct);
        setProducts(products.map(p => p.id === selectedProductId ? response.data : p));
        setShowUpdateForm(false);
        showToast('Product updated successfully!', 'success');
      } else {
        const response = await api.post('/api/products', newProduct);
        setProducts(prev => [...prev, response.data]);
        setShowAddForm(false);
        showToast('Product added successfully!', 'success');
      }
      setNewProduct(initialProductState);
      setSelectedProductId(null);
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage = showUpdateForm ? 'Failed to update product' : 'Failed to add product';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedProductId) {
      try {
        await api.delete(`/api/products/${selectedProductId}`);
        setProducts(products.filter(product => product.id !== selectedProductId));
        setShowDeleteModal(false);
        setSelectedProductId(null);
        showToast('Product deleted successfully!', 'success');
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete product');
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleUpdate = useCallback((product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      base64Image: product.base64Image || ''
    });
    setSelectedProductId(product.id);
    setShowUpdateForm(true);
  }, []);

  const handleDeleteClick = useCallback((productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
  }, []);

  const handleCancelUpdate = useCallback(() => {
    setShowUpdateForm(false);
    setNewProduct(initialProductState);
    setSelectedProductId(null);
  }, [initialProductState]);

  const handleAddToCart = useCallback((product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      showToast('Product added to cart!', 'success');
      
      // Trigger a custom event to update cart badge
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Add to cart error:', err);
      showToast('Failed to add product to cart', 'error');
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.categoryId.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        <div className="user-info">
          Welcome, {user.firstName} {user.lastName}
        </div>
      </div>

      <div className="products-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {user.role === 'ADMIN' && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-product-btn"
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {(showAddForm || showUpdateForm) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{showUpdateForm ? 'Update Product' : 'Add New Product'}</h3>
              <button 
                onClick={showUpdateForm ? handleCancelUpdate : () => setShowAddForm(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity:</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={newProduct.stockQuantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category:</label>
                <select
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (showUpdateForm ? 'Update Product' : 'Add Product')}
            </button>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-products">
                  {searchTerm || selectedCategory ? 'No products match your filters' : 'No products available'}
                </td>
              </tr>
            ) : (
              currentProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.base64Image && (
                      <img 
                        src={product.base64Image} 
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.categoryName}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="add-to-cart-btn"
                        title="Add to Cart"
                        disabled={product.stockQuantity === 0}
                      >
                        🛒
                      </button>
                      {user.role === 'ADMIN' && (
                        <>
                          <button 
                            onClick={() => handleUpdate(product)}
                            className="edit-btn"
                            title="Edit Product"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(product.id)}
                            className="delete-btn"
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;