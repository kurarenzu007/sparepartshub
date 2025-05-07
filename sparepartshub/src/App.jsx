import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Homepage from './pages/Homepage';
 import Checkout from './pages/Checkout';
 import ProductDetails from './pages/ProductDetails';
 import BrandPage from './pages/BrandPage';
 import Login from './pages/Login';
 import CreateAccount from './pages/CreateAccount';
 import RecoverPassword from './pages/RecoverPassword';
 import MyAccount from './pages/MyAccount';
 import AdminPanel from './pages/AdminPanel';
 import './styles/App.css';
 
 const App = () => {
  return (
    <Router basename="/autoparts-tcj">
     <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/product-details/:id" element={<ProductDetails />} />
      <Route path="/brands/:brand" element={<BrandPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/admin-panel" element={<AdminPanel />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
     </Routes>
    </Router>
  );
 };
 
 export default App;