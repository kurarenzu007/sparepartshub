import React from 'react';
 import '../styles/OrderSuccessPopover.css';
 
 const OrderSuccessPopover = ({ orderNumber, onClose }) => {
   return (
     <div className="order-success-overlay">
       <div className="order-success-popover">
         <h2>Your Order is Being Processed</h2>
         <div className="check-icon">✓</div>
         <p className="order-number">Order Number #{orderNumber}</p>
         <p className="caution-message">
           ⚠️ Please keep your phone active so the rider can contact you ⚠️
         </p>
         <button className="close-button" onClick={onClose}>Close</button>
       </div>
     </div>
   );
 };
 
 export default OrderSuccessPopover; 