import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FiLogOut, FiGrid, FiBox, FiDollarSign, FiSettings, FiPackage, FiUsers, FiShoppingCart } from 'react-icons/fi';
import DashboardPage from './admin/DashboardPage';
import ProductsPage from './admin/ProductsPage';
import SalesPage from './admin/SalesPage';
import SettingsPage from './admin/SettingsPage';
import OrdersPage from './admin/OrdersPage';
import InventoryPage from './admin/InventoryPage';
import UsersPage from './admin/UsersPage';
import tcjLogo from '../assets/tcj_logo2.png';
import defaultAvatar from '../assets/alden.jpg';
import '../styles/AdminPanel.css';
import '../styles/AdminSidebar.css';
import '../styles/InventoryPage.css'; // Import the new CSS file

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Menu items configuration
  const menuItems = [
    { id: 'dashboard', icon: <FiGrid />, label: 'Dashboard', component: <DashboardPage /> },
    { id: 'products', icon: <FiBox />, label: 'Products', component: <ProductsPage /> },
    { id: 'inventory', icon: <FiPackage />, label: 'Inventory', component: <InventoryPage /> },
    { id: 'orders', icon: <FiShoppingCart />, label: 'Orders', component: <OrdersPage /> },
    { id: 'sales', icon: <FiDollarSign />, label: 'Sales', component: <SalesPage /> },
    { id: 'users', icon: <FiUsers />, label: 'Users', component: <UsersPage /> },
    { id: 'settings', icon: <FiSettings />, label: 'Settings', component: <SettingsPage /> }

  ];
  
  // Handle navigation between sections
  const handleNavigation = (id) => {
    setActiveSection(id);
  };
  
  // Find the active component to render
  const activeComponent = menuItems.find(item => item.id === activeSection)?.component || <DashboardPage />;
  
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="logo-container">
          <img src={tcjLogo} alt="TJC Auto Supply Logo" className="shop-logo" />
        </div>
        <div className="admin-info">
          <img src={defaultAvatar} alt="Admin Avatar" className="admin-avatar" />
          <div className="admin-name">Admin</div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-button">
          <FiLogOut /> Logout
        </button>
      </div>
      
      {/* Content Area */}
      <div className="admin-content">
        {activeComponent}
      </div>
    </div>
  );
};

export default AdminPanel;