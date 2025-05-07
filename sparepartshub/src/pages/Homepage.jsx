import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/App.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BrandCarousel from '../components/brandCarousel';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';

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

// Mock products data
const mockProducts = [
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

const HomePage = () => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products] = useState(mockProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();
  const { id } = useParams();

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

  const product = products.find(p => p.id === Number(id));

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
                src={product.image}
                alt={product.name} 
                className="product-image"
                onError={(e) => {
                  e.target.src = air_filter; // fallback image
                }}
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
