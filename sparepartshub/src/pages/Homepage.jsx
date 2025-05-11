import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/App.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BrandCarousel from '../components/brandCarousel';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import { getProducts } from '../services/api';
import tcjLogo from "../assets/tcj_logo.png"; // Import the fallback image

const HomePage = () => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };
  
  // Add product to cart
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Update quantity in cart
  const handleUpdateQuantity = (index, change) => {
    const newCart = [...cartItems];
    newCart[index] = {
      ...newCart[index],
      quantity: Math.max(1, newCart[index].quantity + change)
    };
    setCartItems(newCart);
  };

  // Remove product from cart
  const handleRemoveFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Toggle cart popover
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Calculate total price considering quantity
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-container">
      <Header cartItems={cartItems.length} onCartClick={toggleCart} />

      {/* Cart Popover */}
      {showCart && (
        <div className="cart-popover">
          <h4>Shopping Cart</h4>
          {cartItems.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <>
              <div className="cart-items-container">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img 
                      src={`http://localhost:5000${item.image_path}`} 
                      alt={item.name} 
                      className="cart-item-img" 
                     
                    />
                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <p>₱ {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-quantity">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(index, -1)}
                        >
                          <FiMinus />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(index, 1)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button className="remove-item-button" onClick={() => handleRemoveFromCart(index)}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ₱ {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* BRAND CAROUSEL */}
      <div>
        <BrandCarousel />
        <br /><br />
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Products Grid */}
        <div className="products-grid">
          {currentProducts.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => navigate(`/product-details/${product.id}`)}
            >
              <img 
                 src={`http://localhost:5000${product.image_path}`}
                alt={product.name} 
                className="product-image"
              />
              <div className="brand-name">{product.category}</div>
              <h3>{product.name}</h3>
              <div className="product-price">₱ {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <button
                className="add-to-cart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
