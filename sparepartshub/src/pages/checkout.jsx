import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/checkout.css';
import CheckoutHeader from '../components/CheckoutHeader';
import gcash_logo from '../assets/gcash-logo.png'
import OrderSuccessPopover from '../components/OrderSuccessPopover';

const API_URL = 'http://localhost:5000/api'; // Define API_URL

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [showSuccessPopover, setShowSuccessPopover] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Add Font Awesome CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Log cart items when component mounts
  useEffect(() => {
    console.log('Cart Items:', cartItems);
  }, [cartItems]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    streetAddress: '', // Added streetAddress field
    postalCode: '',
    phone: '',
    paymentMethod: 'gcash'
  });
  const [shippingMethod, setShippingMethod] = useState('company');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach(item => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}`);
      subtotal += price * quantity;
    });
    console.log('Calculated subtotal:', subtotal);
    return subtotal;
  };

  const shippingFee = shippingMethod === 'standard' ? 100 : 0;
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingFee;

  // Log final calculations
  console.log('Final values:', { subtotal, shippingFee, total });

  const removeCartItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Generate a random order number
  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}${random}`;
  };

  const handlePlaceOrder = async () => {
    // Prepare order data for the backend
    const orderData = {
      order_number: generateOrderNumber(),
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_phone: formData.phone,
      items_count: cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0),
      total_amount: total,
      payment_method: formData.paymentMethod,
      payment_status: 'Pending', // Default payment status
      status: 'Pending', // Default order status
      items: cartItems.map(item => ({
        product_id: item.id, // Assuming item has an id for product_id
        product_name: item.name,
        quantity: parseInt(item.quantity) || 1,
        unit_price: parseFloat(item.price) || 0
      }))
    };

    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      if (response.data && response.data.orderId) {
        setOrderNumber(response.data.orderId); // Use orderId from backend response
        setShowSuccessPopover(true);

        // Clear cart and navigate after a delay
        setTimeout(() => {
          setCartItems([]);
          // Potentially navigate to an order confirmation page or home
          navigate('/'); 
        }, 3000);
      } else {
        // Handle case where orderId might be missing in response
        console.error('Order placed, but no orderId received:', response.data);
        alert('Order placed, but there was an issue retrieving your order number. Please contact support.');
      }
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
      alert('There was an issue placing your order. Please try again. Details: ' + (error.response && error.response.data && error.response.data.message ? error.response.data.message : error.message) );
    }
  };

  return (
    <div className="checkout-page">
      <CheckoutHeader />
      <div className="checkout-container">
        {/* Left Column - Form */}
        <div className="checkout-form">
          <div className="form-header">
            <h4>Have an account? <a href="/login">Login</a> (Optional)</h4>
          </div>

          <div className="form-section">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Contact Information</label>
            <input
              type="text"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email or Contact Number"
            />
          </div>

          <div className="form-section">
            <h3>Address</h3>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Region, Province, City, Barangay"
            />
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <input
              type="text"
              className="form-control"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="Street Name, Building, House No."
            />
          </div>

          <div className="form-section">
            <h3>Shipping Method</h3>
            <div className="shipping-method">
              <label className="shipping-option" onClick={() => setShippingMethod('company')}>
                <input
                  type="radio"
                  name="shipping"
                  value="company"
                  checked={shippingMethod === 'company'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div className="shipping-option-info">
                  <strong>Company Delivery</strong>
                  <p>We'll contact you for the delivery schedule.</p>
                </div>
                <span className="shipping-free">Free</span>
              </label>

              <label className="shipping-option" onClick={() => setShippingMethod('standard')}>
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === 'standard'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div className="shipping-option-info">
                  <strong>Standard Shipping</strong>
                  <p>Kindly Message us for Exact Shipping Fee</p>
                </div>
                <span className="shipping-option-price">₱ 100.00</span>
              </label>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-method">
              <label className="payment-option" onClick={() => setFormData({...formData, paymentMethod: 'gcash'})}>
                <input
                  type="radio"
                  name="payment"
                  value="gcash"
                  checked={formData.paymentMethod === 'gcash'}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                />
                <div className="payment-option-info">
                  <strong>GCash</strong>
                  <p>Pay using your GCash wallet</p>
                </div>
                <img src={gcash_logo} alt="GCash" className="payment-logo" />
              </label>

              <label className="payment-option" onClick={() => setFormData({...formData, paymentMethod: 'cod'})}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                />
                <div className="payment-option-info">
                  <strong>Cash on Delivery</strong>
                  <p>Pay when you receive your order</p>
                </div>
                <span className="cod-icon">₱</span>
              </label>
            </div>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            PLACE ORDER
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="order-summary">
          <div className="summary-header">
            <h3>Products Ordered</h3>
          </div>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="product-row">
                      <img src={`http://localhost:5000/uploads/${item.image_path}`}  alt={item.name} className="product-image" />
                      <div className="product-info">
                        <div className="product-brand">{item.brand}</div>
                        <div className="product-name">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>₱ {item.price.toLocaleString()}</td>
                  <td>{item.quantity || 1}</td>
                  <td>₱ {((item.quantity || 1) * item.price).toLocaleString()}</td>
                  <td>
                    <button 
                      className="remove-btn"
                      onClick={() => removeCartItem(index)}
                      aria-label="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary-totals">
            <div className="total-row">
              <span>Shipping fee</span>
              <span>₱ {shippingFee.toLocaleString()}</span>
            </div>
            <div className="total-row final">
              <span>TOTAL</span>
              <span>₱ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {showSuccessPopover && (
        <OrderSuccessPopover 
          orderNumber={orderNumber}
          onClose={() => {
            setShowSuccessPopover(false);
            setCartItems([]);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

export default Checkout;