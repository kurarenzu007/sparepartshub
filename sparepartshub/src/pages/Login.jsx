import React, { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import '../styles/Login.css';
 import tcjLogo from '../assets/tcj_logo2.png';
 import Header from '../components/Header';
 
 const Login = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
     username: '',
     password: ''
   });
   const [error, setError] = useState('');
 
   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: value
     }));
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
     setError('');
 
     // Check for admin credentials
     if (formData.username === 'admin' && formData.password === 'admin') {
       navigate('/admin-panel'); // Updated route to match AdminPanel.jsx
       return;
     }
 
     // Handle regular user login here
     // For now, just show an error
     setError('Invalid credentials');
   };
 
   return (
     <>
       <Header cartItems={0} />
       <div className="login-container">
         <div className="login-left">
           <img src={tcjLogo} alt="TJC Auto Supply" className="login-logo" />
           <h1 className="login-brand-text">SPAREPARTS HUB</h1>
         </div>
         
         <div className="login-right">
           <div className="login-form-container">
             <h2>Login Account</h2>
             <p className="login-subtitle">Login your e-mail and password</p>
             
             <form className="login-form" onSubmit={handleSubmit}>
               {error && <div className="error-message">{error}</div>}
               <div className="form-group">
                 <input 
                   type="text" 
                   name="username"
                   placeholder="Email / Number"
                   className="login-input"
                   value={formData.username}
                   onChange={handleInputChange}
                 />
               </div>
               
               <div className="form-group">
                 <input 
                   type="password" 
                   name="password"
                   placeholder="Password"
                   className="login-input"
                   value={formData.password}
                   onChange={handleInputChange}
                 />
               </div>
               
               <button type="submit" className="login-button">
                 Login
               </button>
               
               <div className="login-links">
                 <div className="login-link-group">
                   <span>New customer? </span>
                   <Link to="/register" className="blue-link">Create your account</Link>
                 </div>
                 
                 <div className="login-link-group">
                   <span>Lost password? </span>
                   <Link to="/recover-password" className="blue-link">Recover password</Link>
                 </div>
               </div>
             </form>
           </div>
         </div>
       </div>
     </>
   );
 };
 
 export default Login; 