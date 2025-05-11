import React, { useState, useEffect } from 'react';
import '../styles/ProductModal.css';
import { FiX, FiUpload } from 'react-icons/fi';

const ProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    sku: '',
    lowStock: '',
    supplier: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        description: product.description || '',
        sku: product.sku || '',
        lowStock: product.lowStock || '',
        supplier: product.supplier || '',
        image: null
      });
      // Set image preview if product has an image
      if (product.image_path) {
        setImagePreview(`http://localhost:5000${product.image_path}`);
      }
    } else {
      setFormData({
        name: '',
        brand: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        sku: '',
        lowStock: '',
        supplier: '',
        image: null
      });
      setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, image: 'Please select an image file' });
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 10MB' });
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.lowStock) newErrors.lowStock = 'Low stock threshold is required';
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    
    // Only require image for new products
    if (!product && !formData.image && !imagePreview) {
      newErrors.image = 'Image is required for new products';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={errors.brand ? 'error' : ''}
            />
            {errors.brand && <span className="error-message">{errors.brand}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={errors.stock ? 'error' : ''}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              <option value="Engine Parts">Engine Parts</option>
              <option value="Brake System">Brake System</option>
              <option value="Transmission">Transmission</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body Parts">Body Parts</option>
              <option value="Exhaust System">Exhaust System</option>
              <option value="Cooling System">Cooling System</option>
              <option value="Filters">Filters</option>
              <option value="Lighting">Lighting</option>
              <option value="Fuel System">Fuel System</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sku">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={errors.sku ? 'error' : ''}
            />
            {errors.sku && <span className="error-message">{errors.sku}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lowStock">Low Stock Threshold</label>
            <input
              type="number"
              id="lowStock"
              name="lowStock"
              value={formData.lowStock}
              onChange={handleChange}
              min="0"
              className={errors.lowStock ? 'error' : ''}
            />
            {errors.lowStock && <span className="error-message">{errors.lowStock}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={errors.supplier ? 'error' : ''}
            />
            {errors.supplier && <span className="error-message">{errors.supplier}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image" className="image-upload-label">
                <FiUpload className="upload-icon" />
                <span>Choose Image</span>
              </label>
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  onError={(e) => e.target.style.display = 'none'} 
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;