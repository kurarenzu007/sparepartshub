import React, { useState } from 'react';
 import { Search, ShoppingCart } from 'lucide-react';
 import tcjLogo from "../assets/tcj_logo.png"; // Use correct relative path
 import { useNavigate, Link } from 'react-router-dom';
 
 const Header = ({ cartItems, onCartClick }) => {
   const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();
 
   const handleLogoClick = () => {
     navigate('/');
   };

     // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    
    if (searchQuery.trim()) {
      // Navigate to search results page with the query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

 
   return (
     <header className="header">
       <div className="header-content">
         {/* Logo */}
         <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
           <img src={tcjLogo} alt="TCJ Auto Supply" className="logo-image" />
         </div>
         
      {/* Search Bar - Now wrapped in a form for proper submission */}
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="search-button" aria-label="Submit search">
            <Search size={20} />
          </button>
        </form>
         {/* User and Cart */}
         <div className="user-cart">
           <div className="account">
             <div><Link to="/login" className="account-link">Login / Signup</Link></div>
             <div><Link to="/my-account" className="account-link">My account</Link></div>
           </div>
           {/* Make the cart clickable */}
           <div className={`cart ${cartItems > 0 ? 'has-items' : ''}`} onClick={onCartClick}>
             <ShoppingCart size={24} />
             {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
           </div>
         </div>
       </div>
       
       {/* Empty Navigation Space */}
       <nav className="navigation">
         <div className="nav-content"></div>
       </nav>
     </header>
   );
 };
 
 export default Header;
 