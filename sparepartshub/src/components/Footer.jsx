import React from 'react';
 
 const Footer = () => {
   return (
     <footer className="footer">
       <div className="footer-content">
         <div className="footer-columns">
           <div className="footer-column">
             <h3>About Us</h3>
             <p>TJC Auto Supply provides high-quality auto parts at competitive prices.</p>
           </div>
           <div className="footer-column">
             <h3>Customer Service</h3>
             <ul>
               <li>Contact Us</li>
               <li>FAQ</li>
               <li>Shipping Policy</li>
               <li>Return Policy</li>
             </ul>
           </div>
           <div className="footer-column">
             <h3>My Account</h3>
             <ul>
               <li>Order History</li>
               <li>Wish List</li>
               <li>Newsletter</li>
             </ul>
           </div>
           <div className="footer-column">
             <h3>Contact Information</h3>
             <p>TCJ AUTO SUPPLY</p>
             <p>Pampangga, Philippines</p>
             <p>Phone: (123) 456-7890</p>
             <p>Email: @cvsu.edu.ph</p>
           </div>
         </div>
         <div className="footer-bottom">
           <p>© 2025 TJC Auto Supply. All rights reserved.</p>
         </div>
       </div>
     </footer>
   );
 };
 
 export default Footer;