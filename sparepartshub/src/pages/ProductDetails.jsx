import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import { getProduct, getProducts } from '../services/api';
import '../styles/App.css';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);
        
        // Fetch all products for related products
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: product?.brand || 'Products', link: '/products' },
    { label: product?.name || 'Product Details' }
  ];

  if (loading) {
    return (
      <div className="app-container">
        <Header cartItems={cartItems.length} onCartClick={() => setShowCart(!showCart)} />
        <div className="loading">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="app-container">
        <Header cartItems={cartItems.length} onCartClick={() => setShowCart(!showCart)} />
        <div className="product-not-found">
          <h2>{error || 'Product not found'}</h2>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  const handleAddToCart = () => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const handleUpdateQuantity = (index, change) => {
    const newCart = [...cartItems];
    const item = newCart[index];
    newCart[index] = {
      ...item,
      quantity: Math.max(1, Math.min(item.stock, item.quantity + change))
    };
    setCartItems(newCart);
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const handleBuyNow = () => {
    if (product) {
      const itemToBuy = {
        ...product,
        quantity: quantity
      };
      navigate("/checkout", { state: { cartItems: [itemToBuy] } });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="app-container">
      <Header cartItems={cartItems.length} onCartClick={toggleCart} />
      <Breadcrumb items={breadcrumbItems} />
      
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
                      src={`http://localhost:5000/uploads/${item.image_path}`} 
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
                <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
              </div>
            </>
          )}
        </div>
      )}

      <main className="product-details-container">
        <div className="product-details-content">
          {/* Left side - Image */}
          <div className="product-image-container">
            <img 
               src={`http://localhost:5000${product.image_path}`}
              alt={product.name} 
              className="product-detail-image" 
            />
          </div>

          {/* Right side - Product Info */}
          <div className="product-info-container">
            <h1 className="product-name2">{product.name}</h1>
            <div className="brand-container">
              <span className="brand-name">{product.brand}</span>
              <hr className="brand-divider" />
            </div>
            
            <div className="price-container">
              <span className="price">₱ {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="quantity-container">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <FiMinus />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  <FiPlus />
                </button>
              </div>
              <p className="stock-info">{product.stock} units available</p>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>You may also like</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                className="related-product-card"
                onClick={() => navigate(`/product-details/${relatedProduct.id}`)}
              >
                <img 
                  src={`http://localhost:5000/uploads/${relatedProduct.image_path}`} 
                  alt={relatedProduct.name} 
                  className="related-product-image" 
                />
                <div className="related-product-info">
                  <div className="related-product-brand">{relatedProduct.brand}</div>
                  <div className="related-product-name">{relatedProduct.name}</div>
                  <div className="related-product-price">
                    ₱ {relatedProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Product Description Section */}
      <section className="product-description-section">
        <h2>Description</h2>
        <div className="product-description-container">
          <h3 className="description-title">{product.name}</h3>
          <div className="description-content">
            <p>{product.description}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;