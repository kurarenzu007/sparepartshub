import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiPackage, FiDollarSign, FiUsers, FiRefreshCw } from 'react-icons/fi';
import '../../styles/AdminPanel.css';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch sales data
      const salesResponse = await fetch('http://localhost:5000/api/sales');
      const salesData = await salesResponse.json();
      
      // Fetch inventory data
      const inventoryResponse = await fetch('http://localhost:5000/api/inventory');
      const inventoryData = await inventoryResponse.json();

      // Fetch users data
      const usersResponse = await fetch('http://localhost:5000/api/users');
      const usersData = await usersResponse.json();

      // Calculate statistics
      const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.amount), 0);
      const totalOrders = salesData.length;
      const totalProducts = inventoryData.length;
      const totalUsers = usersData.length;

      setStats({
        totalSales,
        totalOrders,
        totalProducts,
        totalUsers
      });

      // Get recent orders (last 5)
      const recentOrders = salesData
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
        .slice(0, 5);

      setRecentOrders(recentOrders);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      title: 'Total Sales', 
      value: `₱ ${stats.totalSales.toLocaleString()}`, 
      icon: <FiDollarSign />, 
      color: '#4CAF50' 
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders.toString(), 
      icon: <FiShoppingCart />, 
      color: '#2196F3' 
    },
    { 
      title: 'Total Products', 
      value: stats.totalProducts.toString(), 
      icon: <FiPackage />, 
      color: '#FF9800' 
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toString(), 
      icon: <FiUsers />, 
      color: '#9C27B0' 
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-header">
        <h1>Dashboard</h1>
        <div className="action-buttons">
          <button 
            className="secondary-btn"
            onClick={fetchDashboardData}
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        {/* Sales Trend Chart */}
        <div className="chart-container">
          <h2>Sales Trend</h2>
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Monthly Sales',
                data: [12000, 19000, 15000, 21000, 18000, 22000],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Sales Trend'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '₱' + value.toLocaleString();
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Inventory Status Chart */}
        <div className="chart-container">
          <h2>Inventory Status</h2>
          <Bar
            data={{
              labels: ['Engine Parts', 'Brake Parts', 'Suspension', 'Electrical'],
              datasets: [{
                label: 'Stock Level',
                data: [85, 59, 90, 81],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(153, 102, 255, 0.5)'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Inventory Levels by Category'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        {/* Order Status Distribution */}
        <div className="chart-container">
          <h2>Order Status Distribution</h2>
          <Pie
            data={{
              labels: ['Completed', 'Pending', 'Cancelled'],
              datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(255, 206, 86, 0.5)'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Order Status Distribution'
                }
              }
            }}
          />
        </div>

        {/* Recent Orders Table */}
        <div className="chart-container">
          <h2>Recent Orders</h2>
          <div className="recent-orders">
            {recentOrders.length > 0 ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{new Date(order.transaction_date).toLocaleDateString()}</td>
                      <td>{order.customer_name}</td>
                      <td>₱ {Number(order.amount).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;