import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiAlertTriangle, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiBarChart2,
  FiX
} from 'react-icons/fi';
import axios from 'axios';
import './InventoryPage.css';

const InventoryModal = ({ isOpen, onClose, title, children, type }) => {
  if (!isOpen) return null;

  return (
    <div className="inventory-modal-overlay">
      <div className={`inventory-modal ${type}`}>
        <div className="inventory-modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              {type === 'add' ? <FiPlus /> : <FiEdit />}
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
  const [showAddModal, setShowAddModal] = useState(false);
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
      [name]: name === 'stock' || name === 'lowStock' || name === 'price' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  // Add new inventory item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newItem);
      setShowAddModal(false);
      setNewItem({
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
      setSuccessMessage('Item added successfully!');
      // Refresh inventory data
      await fetchInventory();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add new item');
      console.error('Error adding item:', err);
    }
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
        <p>Loading inventory data...</p>
      </div>
    );
  }

  const renderForm = (onSubmit) => (
    <form onSubmit={onSubmit} className="inventory-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Product Name</label>
          <input 
            type="text" 
            name="name" 
            value={newItem.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Brand</label>
          <input 
            type="text" 
            name="brand" 
            value={newItem.brand} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>SKU</label>
          <input 
            type="text" 
            name="sku" 
            value={newItem.sku} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input 
            type="text" 
            name="category" 
            value={newItem.category} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Current Stock</label>
          <input 
            type="number" 
            name="stock" 
            value={newItem.stock} 
            onChange={handleInputChange} 
            required 
            min="0" 
          />
        </div>
        <div className="form-group">
          <label>Low Stock Level</label>
          <input 
            type="number" 
            name="lowStock" 
            value={newItem.lowStock} 
            onChange={handleInputChange} 
            required 
            min="0" 
          />
        </div>
        <div className="form-group">
          <label>Price (₱)</label>
          <input 
            type="number" 
            name="price" 
            value={newItem.price} 
            onChange={handleInputChange} 
            required 
            min="0" 
            step="0.01" 
          />
        </div>
        <div className="form-group">
          <label>Supplier</label>
          <input 
            type="text" 
            name="supplier" 
            value={newItem.supplier} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <textarea 
            name="description" 
            value={newItem.description} 
            onChange={handleInputChange} 
            required 
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}>Cancel</button>
      </div>
    </form>
  );

  return (
    <div className="admin-panel">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="admin-header">
        <h1>Inventory Management</h1>
        <div className="action-buttons">
          <button 
            className="primary-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus /> Add New Item
          </button>
          <button 
            className="secondary-btn"
            onClick={fetchInventory}
          >
            <FiRefreshCw /> Refresh
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
            <p>{totalItems}</p>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">
            <FiAlertTriangle />
          </div>
          <div className="summary-info">
            <h3>Low Stock Items</h3>
            <p>{lowStockItems}</p>
          </div>
        </div>
        <div className="summary-card success">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-info">
            <h3>Total Inventory Value</h3>
            <p>₱ {totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card info">
          <div className="summary-icon">
            <FiBarChart2 />
          </div>
          <div className="summary-info">
            <h3>Average Stock Level</h3>
            <p>{averageStock} units</p>
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
              <th>Value</th>
              <th>Supplier</th>
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
                  <td>₱ {item.price.toLocaleString()}</td>
                  <td>₱ {(item.stock * item.price).toLocaleString()}</td>
                  <td>{item.supplier || '-'}</td>
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
                <td colSpan="10" className="no-results">
                  No inventory items match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      <InventoryModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Inventory Item"
        type="add"
      >
        {renderForm(handleAddItem)}
      </InventoryModal>

      {/* Edit Item Modal */}
      <InventoryModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Inventory Item"
        type="edit"
      >
        {renderForm(handleUpdateItem)}
      </InventoryModal>
    </div>
  );
};

export default InventoryPage;