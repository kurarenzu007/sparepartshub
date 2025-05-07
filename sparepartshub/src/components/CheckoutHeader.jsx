import React from 'react';
 import { Link } from 'react-router-dom';
 import '../styles/checkoutHeader.css';
 import tcjLogo from "../assets/tcj_logo.png";
 
 const CheckoutHeader = () => {
   return (
     <div className="checkout-header d-flex align-items-center p-3 bg-warning text-dark">
       <Link to="/">
         <img src={tcjLogo} alt="TCJ Auto Supply" className="logo-image me-3" />
       </Link>
 
       {/* Vertical Line */}
       <div className="vr mx-3"></div>  
 
       <span className="fs-5 fw-semibold">Checkout</span>
     </div>
   );
 };
 
 export default CheckoutHeader;