import React, { useState } from 'react';
import '../../styles/OrdersPage.css';

const OrdersPage = () => {
  const orders = [
    { id: 1, customer: 'Alice', total: 120.0, status: 'pending' },
    { id: 2, customer: 'Bob', total: 300.5, status: 'completed' },
    { id: 3, customer: 'Charlie', total: 90.75, status: 'cancelled' },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status) => {
    const className = `status-badge ${status}`;
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="orders-container">
      <h1>Orders Management</h1>
      <input
        type="text"
        placeholder="Search customer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>₱{order.total.toFixed(2)}</td>
              <td>{renderStatusBadge(order.status)}</td>
              <td className="actions">
                <button onClick={() => alert(`Viewing order #${order.id}`)}>👁</button>
                <button onClick={() => alert(`Updating order #${order.id}`)}>🔄</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
