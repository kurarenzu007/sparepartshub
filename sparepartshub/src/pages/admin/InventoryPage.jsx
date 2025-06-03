import React, { useState, useEffect } from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiFilter, 
  FiRotateCw, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiDollarSign, 
  FiPackage, 
  FiShoppingBag, 
  FiTruck
} from 'react-icons/fi';
import axios from 'axios';
import './InventoryPage.css';

const InventoryModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="inventory-modal-overlay">
      <div className="inventory-modal">
        <div className="inventory-modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <FiEdit />
            </div>
            <h2>{title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="inventory-modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    brand: '',
    category: '',
    sku: '',
    stock: 0,
    lowStock: 5,
    price: 0,
    supplier: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      setInventory(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory data');
      setLoading(false);
    }
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(inventory.map(item => item.category))];
  
  // Handle filtering and search
  const filteredInventory = inventory.filter(item => {
    if (!item) return false;
    
    const nameMatch = item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const categoryMatch = filterCategory === '' || (item.category && item.category === filterCategory);
    const statusMatch = filterStatus === '' || 
      (filterStatus === 'low' && item.stock <= item.lowStock) ||
      (filterStatus === 'in' && item.stock > item.lowStock);

    return nameMatch && categoryMatch && statusMatch;
  });

  // Calculate statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.stock <= item.lowStock).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const averageStock = Math.round(inventory.reduce((sum, item) => sum + item.stock, 0) / totalItems) || 0;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'lowStock' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  // Update inventory item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/products/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          id: selectedItem.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }

      await fetchInventory();
      setShowEditModal(false);
      setSelectedItem(null);
      setSuccessMessage('Item updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.message || 'Failed to update item');
    }
  };

  // Delete inventory item
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setSuccessMessage('Item deleted successfully!');
        // Refresh inventory data
        await fetchInventory();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error deleting item:', err);
      }
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterStatus('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  };

  // Open edit modal
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name || '',
      brand: item.brand || '',
      category: item.category || '',
      sku: item.sku || '',
      stock: item.stock || 0,
      lowStock: item.lowStock || 5,
      price: item.price || 0,
      supplier: item.supplier || '',
      description: item.description || ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="admin-header">
        <h1>Inventory Management</h1>
        <div className="action-buttons">
          <button 
            className="secondary-btn"
            onClick={fetchInventory}
          >
            <FiRotateCw /> Refresh
          </button>
        </div>
      </div>
      {/* Inventory Summary Cards */}
      <div className="inventory-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiPackage />
          </div>
          <div className="summary-info">
            <h3>Total Items</h3>
            <p>{inventory.length}</p>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">
            <FiAlertCircle />
          </div>
          <div className="summary-info">
            <h3>Low Stock Items</h3>
            <p>{inventory.filter(item => item.stock <= item.lowStock).length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="inventory-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <div className="filter-group">
            <label><FiFilter /> Category:</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label><FiFilter /> Status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="low">Low Stock</option>
              <option value="in">In Stock</option>
            </select>
          </div>
          <button className="reset-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Brand</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.sku || '-'}</td>
                  <td>{item.category}</td>
                  <td className="stock-cell">
                    <span>{item.stock}</span>
                    <small>Min: {item.lowStock}</small>
                  </td>
                  <td>₱{item.price ? item.price.toLocaleString() : '0.00'}</td>
                  <td>
                    <span className={`status-badge ${item.stock <= item.lowStock ? 'warning' : 'success'}`}>
                      {item.stock <= item.lowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        title="Edit"
                        onClick={() => handleEditClick(item)}
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="delete-btn" 
                        title="Delete"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No inventory items found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Item Modal */}
      <InventoryModal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        title="Update Inventory Item"
      >
        {selectedItem && (
          <form onSubmit={handleUpdateItem} className="inventory-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={newItem.name || ''} 
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input 
                  type="text" 
                  value={newItem.brand || ''} 
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input 
                  type="text" 
                  value={newItem.sku || '-'} 
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  value={newItem.category || ''} 
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label>Current Stock</label>
                <input 
                  type="number" 
                  name="stock"
                  value={newItem.stock || 0} 
                  onChange={handleInputChange}
                  min="0"
                  className="editable-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Low Stock Level</label>
                <input 
                  type="number" 
                  name="lowStock"
                  value={newItem.lowStock || 0} 
                  onChange={handleInputChange}
                  min="0"
                  className="editable-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₱)</label>
                <input 
                  type="text" 
                  value={newItem.price ? `₱${newItem.price.toLocaleString()}` : '₱0.00'} 
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input 
                  type="text" 
                  value={newItem.supplier || 'N/A'} 
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea 
                  value={newItem.description || 'No description available.'} 
                  readOnly
                  className="readonly-field"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Update Inventory
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </InventoryModal>
    </div>
  );
};

export default InventoryPage;