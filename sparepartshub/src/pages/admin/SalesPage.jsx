import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import '../../styles/AdminPanel.css';
import '../../styles/SalesPage.css'; // Import the CSS file for styling

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch sales data
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/sales');
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      const data = await response.json();
      setSalesData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSales();
  }, []);

  // Calculate statistics
  const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.amount), 0);
  const completedSales = salesData.filter(sale => sale.status === 'Completed').length;
  const averageSale = salesData.length > 0 ? totalSales / salesData.length : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="admin-header">
        <h1>Sales Management</h1>
        <div className="action-buttons">
          <button 
            className="secondary-btn"
            onClick={fetchSales}
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="sales-summary">
        <div className="summary-card">
          <FiDollarSign className="summary-icon" />
          <div className="summary-info">
            <h3>Total Sales</h3>
            <p>₱ {totalSales.toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card">
          <FiShoppingCart className="summary-icon" />
          <div className="summary-info">
            <h3>Completed Orders</h3>
            <p>{completedSales}</p>
          </div>
        </div>
        <div className="summary-card">
          <FiTrendingUp className="summary-icon" />
          <div className="summary-info">
            <h3>Average Sale</h3>
            <p>₱ {averageSale.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Transaction Date</th>
              <th>Customer Name</th>
              <th>Products</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length > 0 ? (
              salesData.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{new Date(sale.transaction_date).toLocaleDateString()}</td>
                  <td>{sale.customer_name}</td>
                  <td>
                    {(() => {
                      try {
                        const products = JSON.parse(sale.products);
                        return (
                          <ul className="product-list">
                            {Array.isArray(products) && products.map((product, index) => (
                              <li key={index}>{product.name} (x{product.quantity})</li>
                            ))}
                          </ul>
                        );
                      } catch (e) {
                        return sale.products; // Fallback to raw data if parsing fails
                      }
                    })()}
                  </td>
                  <td>{sale.quantity}</td>
                  <td>₱ {Number(sale.amount).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${sale.status.toLowerCase()}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No sales data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;