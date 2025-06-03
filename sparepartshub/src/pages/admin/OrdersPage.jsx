import { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Edit, Eye, X, RefreshCw, AlertCircle } from "lucide-react";
import axios from "axios";
import "../../styles/OrdersPage.css";
// API URL for orders
const API_URL = "http://localhost:5000/api";


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({ orderId: null, newStatus: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState({ orderId: null, newStatus: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ordersPerPage = 5;

  // Fetch orders from the backend
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      // Use mock data if API fails (for development)
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      // If status is already Delivered or CANCELLED, don't allow changes
      if (order.status === 'Delivered' || order.status === 'CANCELLED') {
        return;
      }
      
      // Show confirmation dialog for status changes
      setPendingStatusUpdate({ orderId, newStatus });
      setShowStatusConfirm(true);
    } catch (err) {
      console.error('Error in handleStatusChange:', err);
      alert('Failed to change status. Please try again.');
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrder = async (order) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${order.id}`);
      setEditingOrder(response.data);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching order for edit:', err);
      alert('Failed to load order for editing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusChange = async () => {
    const { orderId, newStatus } = pendingStatusChange;
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setShowConfirmModal(false);
      
      // Show success message
      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const cancelBulkStatusChange = () => {
    setShowConfirmModal(false);
    setPendingStatusChange({ orderId: null, newStatus: null });
  };

  const handleEditStatusUpdate = async () => {
    if (pendingStatusUpdate.orderId && pendingStatusUpdate.newStatus) {
      try {
        await axios.put(`${API_URL}/orders/${pendingStatusUpdate.orderId}/status`, { 
          status: pendingStatusUpdate.newStatus 
        });
        
        // Update local state
        const updatedOrders = orders.map(order => 
          order.id === pendingStatusUpdate.orderId 
            ? { ...order, status: pendingStatusUpdate.newStatus } 
            : order
        );
        
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
        
        // Update the editing order if it's the same one
        if (editingOrder && editingOrder.id === pendingStatusUpdate.orderId) {
          setEditingOrder(prev => ({
            ...prev,
            status: pendingStatusUpdate.newStatus
          }));
        }
        
        // Show success message
        const successMessage = pendingStatusUpdate.newStatus === 'Delivered'
          ? `Order #${pendingStatusUpdate.orderId} marked as delivered and added to sales records!`
          : `Order #${pendingStatusUpdate.orderId} status updated to ${pendingStatusUpdate.newStatus}`;
        
        alert(successMessage);
      } catch (err) {
        console.error("Error updating order status:", err);
        const errorMessage = pendingStatusUpdate.newStatus === 'Delivered'
          ? 'Failed to mark order as delivered and create sales record. Please try again.'
          : 'Failed to update order status. Please try again.';
        alert(errorMessage);
      } finally {
        setShowStatusConfirm(false);
        setPendingStatusUpdate({ orderId: null, newStatus: '' });
      }
    }
  };

  const cancelStatusUpdate = () => {
    setShowStatusConfirm(false);
  };

  useEffect(() => {
    let result = [...orders];

    if (searchTerm) {
      result = result.filter(order =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(order => order.status === statusFilter);
    }

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortConfig]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for status changes - show confirmation
    if (name === 'status') {
      setPendingStatusUpdate({
        orderId: editingOrder.id,
        newStatus: value
      });
      setShowStatusConfirm(true);
      return;
    }
    
    setEditingOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const confirmStatusChange = () => {
    if (pendingStatusUpdate.orderId && pendingStatusUpdate.newStatus) {
      setEditingOrder(prev => ({
        ...prev,
        status: pendingStatusUpdate.newStatus
      }));
    }
    setShowStatusConfirm(false);
  };
  
  const cancelStatusChange = () => {
    setShowStatusConfirm(false);
  };



  const handleSaveChanges = async () => {
    try {
      await axios.put(`${API_URL}/orders/${editingOrder.id}`, editingOrder);
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.id === editingOrder.id) {
          return editingOrder;
        }
        return order;
      });
      setOrders(updatedOrders);
      
      // Show success message
      alert(`Order #${editingOrder.id} updated successfully`);
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order. Please try again.");
    } finally {
      setShowEditModal(false);
    }
  };

  // Safe date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const StatusBadge = ({ status, orderId, onChange }) => {
    const badgeClass = {
      PENDING: "bg-warning text-dark",
      COMPLETED: "bg-success text-white",
      CANCELLED: "bg-danger text-white"
    }[status] || "bg-secondary text-white";
    
    // Disable the dropdown if status is COMPLETED or CANCELLED
    const isLocked = status === 'COMPLETED' || status === 'CANCELLED';

    return (
      <div className="position-relative">
        <select 
          value={status}
          onChange={(e) => onChange(orderId, e.target.value)}
          className={`form-select form-select-sm ${badgeClass} ${isLocked ? 'pe-4' : ''}`}
          style={{
            minWidth: '120px',
            border: 'none',
            boxShadow: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            backgroundImage: isLocked ? 'none' : 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1em',
            paddingRight: isLocked ? '0.75rem' : '1.5rem',
            cursor: isLocked ? 'default' : 'pointer',
            opacity: isLocked ? 1 : 1,
          }}
          disabled={isLocked}
          title={isLocked ? 'This status cannot be changed' : 'Change status'}
        >
          <option value="PENDING" className="bg-warning text-dark">PENDING</option>
          <option value="COMPLETED" className="bg-success text-white">COMPLETED</option>
          <option value="CANCELLED" className="bg-danger text-white">CANCELLED</option>
        </select>
      </div>
    );
  };

  const TableHeader = ({ column, label }) => (
    <th
      onClick={() => requestSort(column)}
      className="text-start text-secondary cursor-pointer"
      style={{ cursor: 'pointer' }}
    >
      {label} {sortConfig.key === column ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
    </th>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Orders</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw size={18} className="me-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <AlertCircle size={18} className="me-2" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by customer or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading orders...</p>
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <TableHeader column="id" label="Order ID" />
              <TableHeader column="customer" label="Customer" />
              <TableHeader column="date" label="Date" />
              <TableHeader column="items" label="Items" />
              <TableHeader column="total" label="Total (₱)" />
              <TableHeader column="payment_method" label="Payment" />
              <th>Payment Status</th>
              <TableHeader column="status" label="Status" />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? currentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_name || order.customerName || order.customer || 'N/A'}</td>
                <td>{formatDate(order.order_date)}</td>
                <td>{order.items_count} items</td>
                <td>₱{Number(order.total_amount).toFixed(2)}</td>
                <td>{order.payment_method}</td>
                <td>
                  <span className={`badge ${order.payment_status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td>
                  <StatusBadge 
                    status={order.status} 
                    orderId={order.id}
                    onChange={handleStatusChange}
                  />
                </td>
                <td>
                  <button 
                    className="btn btn-outline-primary btn-sm me-2" 
                    title="View"
                    onClick={() => handleViewOrder(order.id)}
                    disabled={loading}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm" 
                    title="Edit"
                    onClick={() => handleEditOrder(order)}
                    disabled={loading}
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}

      {/* Status Change Confirmation Modal */}
      {showStatusConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Status Change</h5>
              <button className="btn-close" onClick={cancelStatusChange}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to change the order status to <strong>{pendingStatusUpdate.newStatus}</strong>?</p>
              <p className="text-muted">This action cannot be undone and will be recorded in the order history.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelStatusUpdate}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleEditStatusUpdate}>
                Confirm Status Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Update Modal */}
      {showEditModal && editingOrder && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order#{editingOrder.id.toString().padStart(4, '0')}</h5>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editingOrder.customer_name || editingOrder.customerName || editingOrder.customer || ''} 
                  readOnly 
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Order Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formatDate(editingOrder.order_date)} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Total Order</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={`₱${Number(editingOrder.total_amount || 0).toFixed(2)}`} 
                    readOnly 
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Payment Status</label>
                  <select 
                    name="payment_status"
                    className="form-select"
                    value={editingOrder.payment_status || 'PAID'}
                    onChange={handleInputChange}
                    disabled={editingOrder.payment_method !== 'Cash on Delivery'}
                  >
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Order Status</label>
                  <div className="d-flex align-items-center">
                    <select 
                      name="status"
                      className="form-select"
                      value={editingOrder.status}
                      onChange={handleInputChange}
                      disabled={editingOrder.status === 'COMPLETED' || editingOrder.status === 'CANCELLED'}
                    >
                      <option value="PENDING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    {(editingOrder.status === 'COMPLETED' || editingOrder.status === 'CANCELLED') && (
                      <span className="ms-2 text-muted" title="This status cannot be changed">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                    )}
                  </div>
                  <small className="text-muted">
                    {editingOrder.status === 'COMPLETED' || editingOrder.status === 'CANCELLED' 
                      ? 'This status cannot be changed' 
                      : 'Changing status requires confirmation'}
                  </small>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Brgy. Lantic, Carmona, Cavite" 
                  readOnly
                />
              </div>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Quantity</th>
                      <th>Product Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(editingOrder.items)].map((_, index) => (
                      <tr key={index}>
                        <td>{index === 0 ? 1 : index === 1 ? 3 : index === 2 ? 6 : 10}</td>
                        <td>{`Spareparts ${index + 1}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button className="btn btn-primary" onClick={() => setShowEditModal(false)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h5 className="modal-title">Confirm Status Change</h5>
              <button className="btn-close" onClick={cancelStatusChange}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to change the order status to <strong>{pendingStatusChange.newStatus}</strong>?</p>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={cancelStatusChange}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmStatusChange}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order View Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content view-modal">
            <div className="modal-header view-header">
              <h5 className="modal-title">OrderID#{selectedOrder.id.toString().padStart(4, '0')}</h5>
              <button className="btn-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body view-body">
              <div className="view-row">
                <div className="view-field">
                  <label className="view-label">Customer Name</label>
                  <div className="view-value">{selectedOrder.customer_name}</div>
                </div>
                <div className="view-field">
                  <label className="view-label">Order Date</label>
                  <div className="view-value">{formatDate(selectedOrder.order_date)}</div>
                </div>
              </div>
              
              <div className="view-row">
                <div className="view-field">
                  <label className="view-label">Email</label>
                  <div className="view-value">juan@email.com</div>
                </div>
                <div className="view-field">
                  <label className="view-label">Contact</label>
                  <div className="view-value">09123456789</div>
                </div>
              </div>
              
              <div className="view-row">
                <div className="view-field">
                  <label className="view-label">Delivery Method</label>
                  <div className="view-value">Cash on Delivery</div>
                </div>
                <div className="view-field">
                  <label className="view-label">Mode of Payment</label>
                  <div className="view-value">{selectedOrder.payment_method}</div>
                </div>
              </div>
              
              <div className="view-row full-width">
                <div className="view-field">
                  <label className="view-label">Delivery Address</label>
                  <div className="view-value">Brgy. Lantic, Carmona, Cavite</div>
                </div>
              </div>
              
              <div className="view-table">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Quantity</th>
                      <th>Product Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(selectedOrder.items)].map((_, index) => (
                      <tr key={index}>
                        <td>{index === 0 ? 1 : index === 1 ? 3 : index === 2 ? 6 : 10}</td>
                        <td>{`Spareparts ${index + 1}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer view-footer">
              <button className="btn btn-primary" onClick={() => setShowViewModal(false)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
