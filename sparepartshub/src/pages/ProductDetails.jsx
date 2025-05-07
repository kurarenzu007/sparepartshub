import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import '../styles/App.css';
import '../styles/ProductDetails.css';


// Import product images
import air_filter from '../assets/air_filter.jpg';
import alternator from '../assets/alternator.jpeg';
import battery from '../assets/battery.jpg';
import belt from '../assets/belt.jpg';
import brake_caliper from '../assets/brake_caliper.jpg';
import clutch_kit from '../assets/clutch_kit.jpg';
import exhaust from '../assets/exhaust.jpg';
import fuel_injector from '../assets/fuel_injector.png';
import headlight from '../assets/headlight.jpg';
import oilFilter from '../assets/oilFilter.jpg';
import radiator from '../assets/radiator.jpg';
import shock_absorber from '../assets/shock_absorber.jpg';
import spark_plug from '../assets/spark_plug.jpg';
import steering_pump from '../assets/steering_pump.jpg';
import turbocharger from '../assets/turbocharger.jpg';

// Sample products data
const products = [
  {
    id: 1,
    name: "Premium Air Filter",
    brand: "Bosch",
    price: 1299.99,
    stock: 50,
    category: "Engine",
    description: "High-performance air filter for improved engine efficiency and air flow. Compatible with most modern vehicles.",
    image: air_filter
  },
  {
    id: 2,
    name: "High Output Alternator",
    brand: "Denso",
    price: 8999.99,
    stock: 15,
    category: "Electrical",
    description: "Premium alternator with increased power output for vehicles with high electrical demands.",
    image: alternator
  },
  {
    id: 3,
    name: "Maintenance-Free Battery",
    brand: "Motolite",
    price: 4999.99,
    stock: 30,
    category: "Electrical",
    description: "Long-lasting maintenance-free battery with superior cold-cranking performance.",
    image: battery
  },
  {
    id: 4,
    name: "Timing Belt Kit",
    brand: "Gates",
    price: 3499.99,
    stock: 25,
    category: "Engine",
    description: "Complete timing belt kit including belt, tensioner, and idler pulleys.",
    image: belt
  },
  {
    id: 5,
    name: "Performance Brake Caliper",
    brand: "Brembo",
    price: 12999.99,
    stock: 10,
    category: "Brakes",
    description: "High-performance brake caliper for improved stopping power and heat dissipation.",
    image: brake_caliper
  },
  {
    id: 6,
    name: "Heavy Duty Clutch Kit",
    brand: "Exedy",
    price: 15999.99,
    stock: 8,
    category: "Transmission",
    description: "Complete clutch kit designed for high-torque applications and heavy-duty use.",
    image: clutch_kit
  },
  {
    id: 7,
    name: "Performance Exhaust System",
    brand: "Magnaflow",
    price: 24999.99,
    stock: 5,
    category: "Exhaust",
    description: "Stainless steel exhaust system for improved flow and performance.",
    image: exhaust
  },
  {
    id: 8,
    name: "Direct Injection Fuel Injector",
    brand: "Bosch",
    price: 2999.99,
    stock: 40,
    category: "Fuel System",
    description: "Precision fuel injector for optimal fuel delivery and engine performance.",
    image: fuel_injector
  },
  {
    id: 9,
    name: "LED Headlight Assembly",
    brand: "Philips",
    price: 7999.99,
    stock: 20,
    category: "Lighting",
    description: "Complete LED headlight assembly with improved visibility and energy efficiency.",
    image: headlight
  },
  {
    id: 10,
    name: "Synthetic Oil Filter",
    brand: "Mann-Filter",
    price: 999.99,
    stock: 100,
    category: "Engine",
    description: "High-quality oil filter designed for synthetic oil and extended service intervals.",
    image: oilFilter
  },
  {
    id: 11,
    name: "Aluminum Radiator",
    brand: "Koyo",
    price: 11999.99,
    stock: 12,
    category: "Cooling",
    description: "High-performance aluminum radiator for improved cooling efficiency.",
    image: radiator
  },
  {
    id: 12,
    name: "Performance Shock Absorber",
    brand: "KYB",
    price: 4999.99,
    stock: 25,
    category: "Suspension",
    description: "Premium shock absorber for improved ride comfort and handling.",
    image: shock_absorber
  },
  {
    id: 13,
    name: "Iridium Spark Plug",
    brand: "NGK",
    price: 499.99,
    stock: 200,
    category: "Ignition",
    description: "Long-lasting iridium spark plug for improved ignition and fuel efficiency.",
    image: spark_plug
  },
  {
    id: 14,
    name: "Power Steering Pump",
    brand: "Aisin",
    price: 8999.99,
    stock: 15,
    category: "Steering",
    description: "High-quality power steering pump for smooth and responsive steering.",
    image: steering_pump
  },
  {
    id: 15,
    name: "Performance Turbocharger",
    brand: "Garrett",
    price: 34999.99,
    stock: 5,
    category: "Forced Induction",
    description: "High-performance turbocharger for increased power and efficiency.",
    image: turbocharger
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: product?.brand || 'Products', link: '/products' },
    { label: product?.name || 'Product Details' }
  ];

  if (!product) {
    return (
      <div className="app-container">
        <Header cartItems={cartItems.length} onCartClick={() => setShowCart(!showCart)} />
        <div className="product-not-found">
          <h2>Product not found</h2>
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

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
                    <img src={item.image} alt={item.name} className="cart-item-img" />
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
            <img src={product.image} alt={product.name} className="product-detail-image" />
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
              <button className="buy-now-btn" onClick={handleCheckout}>
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
                <img src={relatedProduct.image} alt={relatedProduct.name} className="related-product-image" />
                <div className="related-product-info">
                  <div className="related-product-brand">{relatedProduct.brand}</div>
                  <div className="related-product-name">{relatedProduct.name}</div>
                  <div className="related-product-price">₱ {relatedProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
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