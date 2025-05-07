import React, { useState } from 'react';
import '../styles/MyAccount.css';
import defaultAvatar from '../assets/default-avatar.png';
import Header from '../components/Header';

const MyAccount = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      region: 'Region, Province, City, Baranggay',
      postalCode: '1000',
      streetAddress: 'Street Name, Building, House No.',
      isDefault: true
    },
    {
      id: 2,
      region: 'Region, Province, City, Baranggay',
      postalCode: '2000',
      streetAddress: 'Street Name, Building, House No.',
      isDefault: false
    }
  ]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [addressForm, setAddressForm] = useState({
    region: '',
    postalCode: '',
    streetAddress: '',
    isDefault: false
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setShowPasswordConfirm(true);
  };

  const handleConfirmPasswordChange = (confirmed) => {
    if (confirmed) {
      // Handle password change logic here
      console.log('Password change confirmed');
    }
    setShowPasswordConfirm(false);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    // Create new address object
    const newAddress = {
      id: Date.now(), // Use timestamp as unique ID
      ...addressForm
    };
    
    // Update addresses array
    let updatedAddresses = [...addresses];
    
    // If new address is default, update other addresses
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    // Add new address to array
    updatedAddresses.push(newAddress);
    
    // Update state
    setAddresses(updatedAddresses);
    
    // Reset form and close modal
    setAddressForm({
      region: '',
      postalCode: '',
      streetAddress: '',
      isDefault: false
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prevAddresses => prevAddresses.filter(address => address.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="profile-content">
            <h2>Profile</h2>
            <div className="profile-form">
              <div className="form-field">
                <div className="customer-id">Customer ID: 123456789</div>
              </div>
              <div className="form-field">
                <label>First Name</label>
                <input type="text" className="profile-input" placeholder="First Name" />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input type="text" className="profile-input" placeholder="Last Name" />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input type="text" className="profile-input" placeholder="09123456789" />
              </div>
              <button className="save-button">Save</button>
            </div>
          </div>
        );
      case 'password':
        return (
          <div className="section-content">
            <h2>Change Password</h2>
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-field">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="profile-input"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="profile-input"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-field">
                <label>Re-enter New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="profile-input"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <button type="submit" className="save-button">Save Changes</button>
            </form>

            {showPasswordConfirm && (
              <div className="popover-overlay">
                <div className="popover-content">
                  <h3>Are you sure to change password?</h3>
                  <div className="popover-buttons">
                    <button 
                      className="confirm-button"
                      onClick={() => handleConfirmPasswordChange(true)}
                    >
                      Yes
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={() => handleConfirmPasswordChange(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'address':
        return (
          <div className="section-content">
            <div className="section-header">
              <h2>My Addresses</h2>
              <button 
                className="add-address-button"
                onClick={() => setShowAddressForm(true)}
              >
                + Add New Address
              </button>
            </div>

            {/* Address list */}
            <div className="address-list">
              {addresses.map(address => (
                <div key={address.id} className="address-item">
                  <div className="address-details">
                    <p>{address.region}</p>
                    <p>{address.streetAddress}</p>
                    {address.isDefault && (
                      <div className="default-address-tag">Default Address</div>
                    )}
                  </div>
                  <div className="address-actions">
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddressForm && (
              <div className="popover-overlay">
                <div className="popover-content address-form">
                  <h3>New Address</h3>
                  <form onSubmit={handleAddressSubmit}>
                    <div className="form-field">
                      <label>Region, Province, City, Baranggay</label>
                      <input
                        type="text"
                        name="region"
                        className="profile-input"
                        placeholder="Region, Province, City, Baranggay"
                        value={addressForm.region}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        className="profile-input"
                        placeholder="Postal Code"
                        value={addressForm.postalCode}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>Street Name, Building, House No.</label>
                      <input
                        type="text"
                        name="streetAddress"
                        className="profile-input"
                        placeholder="Street Name, Building, House No."
                        value={addressForm.streetAddress}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="form-field checkbox-field">
                      <input
                        type="checkbox"
                        name="isDefault"
                        id="defaultAddress"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                      />
                      <label htmlFor="defaultAddress">Save as Default Address</label>
                    </div>
                    <div className="popover-buttons">
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="save-button">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="account-container">
        <div className="account-sidebar">
          <div className="user-info">
            <img src={defaultAvatar} alt="User Avatar" className="user-avatar" />
            <div className="username">Username</div>
            <div className="edit-profile">Edit Profile</div>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button 
              className={`nav-item ${activeSection === 'password' ? 'active' : ''}`}
              onClick={() => setActiveSection('password')}
            >
              Password
            </button>
            <button 
              className={`nav-item ${activeSection === 'address' ? 'active' : ''}`}
              onClick={() => setActiveSection('address')}
            >
              Address
            </button>
          </nav>
          <button className="logout-button">Logout</button>
        </div>
        <div className="account-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default MyAccount;