import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiPackage, FiDollarSign, FiUsers, FiShoppingCart } from 'react-icons/fi';
import '../../styles/AdminPanel.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="nav-header">
          <h1>Admin Panel</h1>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/admin" end>
              <FiHome /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/inventory">
              <FiPackage /> Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders">
              <FiShoppingCart /> Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/sales">
              <FiDollarSign /> Sales
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <FiUsers /> Users
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;