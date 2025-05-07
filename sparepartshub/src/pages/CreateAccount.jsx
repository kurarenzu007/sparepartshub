import React from 'react';
 import { Link } from 'react-router-dom';
 import '../styles/CreateAccount.css';
 import tcjLogo from '../assets/tcj_logo2.png';
 import Header from '../components/Header';
 
 const CreateAccount = () => {
   return (
     <>
       <Header cartItems={0} />
       <div className="create-account-container">
         <div className="create-account-left">
           <img src={tcjLogo} alt="TJC Auto Supply" className="create-account-logo" />
           <h1 className="create-account-brand-text">SPAREPARTS HUB</h1>
         </div>
         
         <div className="create-account-right">
           <div className="create-account-form-container">
             <h2>Create Account</h2>
             <p className="create-account-subtitle">Please fill in the information below:</p>
             
             <form className="create-account-form">
               <div className="form-group">
                 <input 
                   type="text" 
                   placeholder="First Name"
                   className="create-account-input"
                 />
               </div>
 
               <div className="form-group">
                 <input 
                   type="text" 
                   placeholder="Last Name"
                   className="create-account-input"
                 />
               </div>
 
               <div className="form-group">
                 <input 
                   type="text" 
                   placeholder="Email / Number"
                   className="create-account-input"
                 />
               </div>
               
               <div className="form-group">
                 <input 
                   type="password" 
                   placeholder="Password"
                   className="create-account-input"
                 />
               </div>
 
               <div className="form-group">
                 <input 
                   type="password" 
                   placeholder="Confirm Password"
                   className="create-account-input"
                 />
               </div>
               
               <button type="submit" className="create-account-button">
                 Create Account
               </button>
               
               <div className="create-account-links">
                 <div className="create-account-link-group">
                   <span>Already have an account? </span>
                   <Link to="/login" className="blue-link">Login here</Link>
                 </div>
               </div>
             </form>
           </div>
         </div>
       </div>
     </>
   );
 };
 
 export default CreateAccount; 