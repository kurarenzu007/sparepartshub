import React, { useState } from 'react';
 import { useNavigate, useParams } from 'react-router-dom';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import Breadcrumb from '../components/Breadcrumb';
 import { FiSearch, FiMinus, FiPlus } from 'react-icons/fi';
 import { Trash2 } from 'lucide-react';
 import '../styles/BrandPage.css';
 
 // Import brand logos
 import honda_logo from '../assets/honda_logo.jpg';
 
 // Import product images for Honda products
 import air_filter from '../assets/air_filter.jpg';
 import alternator from '../assets/alternator.jpeg';
 import battery from '../assets/battery.jpg';
 import brake_caliper from '../assets/brake_caliper.jpg';
 
 const BrandPage = () => {
   const navigate = useNavigate();
   const { brand } = useParams();
   const [searchQuery, setSearchQuery] = useState('');
   const [cartItems, setCartItems] = useState([]);
   const [showCart, setShowCart] = useState(false);
 
   const breadcrumbItems = [
     { label: 'Home', link: '/' },
     { label: 'Honda' }
   ];
 
   // Categories for sidebar
   const categories = [
     { id: 1, name: 'Engine Parts', count: 150 },
     { id: 2, name: 'Brake System', count: 80 },
     { id: 3, name: 'Transmission', count: 45 },
     { id: 4, name: 'Suspension', count: 60 },
     { id: 5, name: 'Electrical', count: 120 },
     { id: 6, name: 'Body Parts', count: 200 },
     { id: 7, name: 'Exhaust System', count: 30 },
     { id: 8, name: 'Cooling System', count: 40 },
     { id: 9, name: 'Filters', count: 25 },
     { id: 10, name: 'Lighting', count: 90 }
   ];
 
   // Sample products for the brand
   const products = [
     {
       id: 1,
       name: "Honda Genuine Air Filter",
       price: 1200.00,
       image: air_filter,
       status: "In Stock"
     },
     {
       id: 2,
       name: "Honda OEM Alternator",
       price: 15000.00,
       image: alternator,
       status: "Out of Stock"
     },
     {
       id: 3,
       name: "Honda Battery",
       price: 8500.00,
       image: battery,
       status: "In Stock"
     },
     {
       id: 4,
       name: "Honda Brake Caliper",
       price: 12000.00,
       image: brake_caliper,
       status: "In Stock"
     }
   ];
 
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
 
   const handleSearch = (e) => {
     e.preventDefault();
     // Implement search functionality
     console.log('Searching for:', searchQuery);
   };
 
   // Handle quick view
   const handleQuickView = (product) => {
     navigate('/product-details', { state: { product } });
   };
 
   return (
     <div className="app-container brand-page">
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
                 <button className="checkout-button" onClick={() => navigate('/checkout', { state: { cartItems } })}>
                   Checkout
                 </button>
               </div>
             </>
           )}
         </div>
       )}
 
       {/* Brand Header */}
       <div className="brand-header">
         <img src={honda_logo} alt="Honda Logo" className="brand-logo" />
       </div>
 
       <div className="brand-page-content">
         {/* Sidebar */}
         <aside className="brand-sidebar">
           <h3>Categories</h3>
           <ul className="category-list">
             {categories.map(category => (
               <li key={category.id} className="category-item">
                 <a href="#" className="category-link">
                   {category.name}
                   <span className="category-count">({category.count})</span>
                 </a>
               </li>
             ))}
           </ul>
         </aside>
 
         {/* Main Content */}
         <main className="brand-main-content">
           {/* Search Bar */}
           <div className="search-container">
             <input
               type="text"
               placeholder="Search Honda parts..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="search-input"
             />
             <button type="button" className="search-button" onClick={handleSearch}>
               <FiSearch />
             </button>
           </div>
 
           {/* Products Grid */}
           <div className="brand-products-grid">
             {products.map(product => (
               <div key={product.id} className="brand-product-card">
                 <img src={product.image} alt={product.name} className="brand-product-image" />
                 <div className="brand-product-info">
                   <h3>{product.name}</h3>
                   <p className="brand-product-price">
                     ₱ {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                   </p>
                   <div className={`product-status ${product.status === "In Stock" ? "in-stock" : "out-of-stock"}`}>
                     {product.status}
                   </div>
                   <button 
                     className="add-to-cart-btn"
                     disabled={product.status === "Out of Stock"}
                     onClick={() => handleAddToCart(product)}
                   >
                     Add to Cart
                   </button>
                   <button 
                     className="quick-view-btn"
                     onClick={() => handleQuickView(product)}
                   >
                     Quick View
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </main>
       </div>
 
       <Footer />
     </div>
   );
 };
 
 export default BrandPage; 