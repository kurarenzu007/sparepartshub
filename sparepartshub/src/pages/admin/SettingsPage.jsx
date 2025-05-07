import React, { useState } from 'react';
import { FiUser, FiSettings, FiBriefcase, FiSave, FiLock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import '../../styles/SettingsPage.css';

const SettingsPage = () => {
  // Admin profile state
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    email: 'admin@tcjauto.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Business information state
  const [businessInfo, setBusinessInfo] = useState({
    name: 'TCJ Auto Supply',
    address: '123 Main Street, San Juan, Metro Manila',
    contactNumber: '+63 912 345 6789',
    email: 'info@tcjauto.com'
  });

  // Handle admin profile changes
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle business info changes
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submissions
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Logic to update admin profile would go here
    alert('Admin profile updated successfully!');
  };

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    // Logic to update business information would go here
    alert('Business information updated successfully!');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Settings</h1>
      </div>
      
      <div className="settings-container">
        {/* Admin Profile Section */}
        <div className="settings-section">
          <h2><FiUser /> Admin Profile</h2>
          <form onSubmit={handleAdminSubmit}>
            <div className="settings-group">
              <label>Admin Name</label>
              <input 
                type="text" 
                name="name"
                value={adminProfile.name} 
                onChange={handleAdminChange}
                placeholder="Enter admin name"
              />
            </div>
            
            <div className="settings-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={adminProfile.email} 
                onChange={handleAdminChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="settings-group">
              <label>Change Password</label>
              <input 
                type="password" 
                name="currentPassword"
                value={adminProfile.currentPassword} 
                onChange={handleAdminChange}
                placeholder="Current password"
              />
              <input 
                type="password" 
                name="newPassword"
                value={adminProfile.newPassword} 
                onChange={handleAdminChange}
                placeholder="New password"
                className="mt-2"
              />
              <input 
                type="password" 
                name="confirmPassword"
                value={adminProfile.confirmPassword} 
                onChange={handleAdminChange}
                placeholder="Confirm new password"
                className="mt-2"
              />
            </div>
            
            <button type="submit" className="settings-button">
              <FiSave /> Save Admin Profile
            </button>
          </form>
        </div>
        
        {/* Business Information Section */}
        <div className="settings-section">
          <h2><FiBriefcase /> Business Information</h2>
          <form onSubmit={handleBusinessSubmit}>
            <div className="settings-group">
              <label>Business Name</label>
              <input 
                type="text" 
                name="name"
                value={businessInfo.name} 
                onChange={handleBusinessChange}
                placeholder="Enter business name"
              />
            </div>
            
            <div className="settings-group">
              <label>Address</label>
              <textarea 
                name="address"
                value={businessInfo.address} 
                onChange={handleBusinessChange}
                placeholder="Enter business address"
                rows="3"
              ></textarea>
            </div>
            
            <div className="settings-group">
              <label>Contact Number</label>
              <input 
                type="text" 
                name="contactNumber"
                value={businessInfo.contactNumber} 
                onChange={handleBusinessChange}
                placeholder="Enter contact number"
              />
            </div>
            
            <div className="settings-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={businessInfo.email} 
                onChange={handleBusinessChange}
                placeholder="Enter business email"
              />
            </div>
            
            <button type="submit" className="settings-button">
              <FiSave /> Save Business Information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;