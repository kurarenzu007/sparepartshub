import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import tcjLogo from '../assets/tcj_logo2.png';
import Header from '../components/Header';

const RecoverPassword = () => {
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
            <h2>Recover Password</h2>
            <p className="login-subtitle">Enter email</p>
            
            <form className="login-form">
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="login-input"
                />
              </div>
              
              <button type="submit" className="login-button">
                Recover
              </button>
              
              <div className="login-links">
                <div className="login-link-group">
                  <span>Remember your password? </span>
                  <Link to="/login" className="blue-link">Log in</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecoverPassword; 