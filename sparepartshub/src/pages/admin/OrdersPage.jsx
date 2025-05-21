import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit, Eye, X } from "lucide-react";
import "../../styles/OrdersPage.css";
const initialOrders = [
  {
    id: 1001,
    customer: "Juan Dela Cruz",
    date: "2025-05-20",
    items: 3,
    total: 1500.75,
    payment_method: "Cash on Delivery",
    status: "PENDING",
  },
  {
    id: 1002,
    customer: "Maria Santos",
    date: "2025-05-19",
    items: 1,
    total: 499.99,
    payment_method: "GCash",
    status: "COMPLETED",
  },
  {
    id: 1003,
    customer: "Carlos Reyes",
    date: "2025-05-18",
    items: 2,
    total: 890.00,
    payment_method: "Credit Card",
    status: "CANCELLED",
  },
  {
    id: 1004,
    customer: "Ana Lopez",
    date: "2025-05-17",
    items: 4,
    total: 2100.50,
    payment_method: "Cash on Delivery",
    status: "COMPLETED",
  },
  {
    id: 1005,
    customer: "Mark Rivera",
    date: "2025-05-16",
    items: 5,
    total: 3200.00,
    payment_method: "GCash",
    status: "PENDING",
  },
  {
    id: 1006,
    customer: "Jasmine Cruz",
    date: "2025-05-15",
    items: 2,
    total: 1450.00,
    payment_method: "Credit Card",
    status: "PENDING",
  },
  {
    id: 1007,
    customer: "Enzo Ramos",
    date: "2025-05-14",
    items: 3,
    total: 2100.00,
    payment_method: "GCash",
    status: "COMPLETED",
  },
  {
    id: 1008,
    customer: "Rico Santos",
    date: "2025-05-13",
    items: 1,
    total: 780.00,
    payment_method: "Cash on Delivery",
    status: "CANCELLED",
  },
  {
    id: 1009,
    customer: "Leah Mendoza",
    date: "2025-05-12",
    items: 2,
    total: 1100.00,
    payment_method: "GCash",
    status: "PENDING",
  },
  {
    id: 1010,
    customer: "Tanya Flores",
    date: "2025-05-11",
    items: 6,
    total: 3600.00,
    payment_method: "Credit Card",
    status: "COMPLETED",
  }
];


export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersPerPage = 5;

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

  const StatusBadge = ({ status }) => {
    const badgeClass = {
      PENDING: "bg-warning text-dark",
      COMPLETED: "bg-success text-white",
      CANCELLED: "bg-danger text-white"
    }[status] || "bg-secondary text-white";

    return <span className={`badge ${badgeClass} px-3 py-2`}>{status}</span>;
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
        <button className="btn btn-primary d-flex align-items-center">
          <Edit size={18} className="me-2" />
          New Order
        </button>
      </div>

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
              <TableHeader column="status" label="Status" />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? currentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id.toString().padStart(4, '0')}</td>
                <td>{order.customer}</td>
                <td>{format(new Date(order.date), "MMM dd, yyyy")}</td>
                <td>{order.items} items</td>
                <td>₱{order.total.toFixed(2)}</td>
                <td>{order.payment_method}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>
                  <button 
                    className="btn btn-outline-primary btn-sm me-2" 
                    title="View"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowViewModal(true);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm" 
                    title="Edit"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowEditModal(true);
                    }}
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

      {/* Order Update Modal */}
      {showEditModal && selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order#{selectedOrder.id.toString().padStart(4, '0')}</h5>
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
                  value={selectedOrder.customer} 
                  readOnly 
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Order Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={format(new Date(selectedOrder.date), "MMMM dd, yyyy")} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Total Order</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={`₱${selectedOrder.total.toFixed(2)}`} 
                    readOnly 
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Payment</label>
                  <select className="form-select">
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Verifying">Verifying</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Order Status</label>
                  <select className="form-select">
                    <option value="PENDING">Processing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Brgy. Lantic, Carmona, Cavite" 
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
            <div className="modal-footer">
              <button className="btn btn-success" onClick={() => setShowEditModal(false)}>Save Changes</button>
              <button className="btn btn-primary" onClick={() => setShowEditModal(false)}>Back</button>
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
                  <div className="view-value">{selectedOrder.customer}</div>
                </div>
                <div className="view-field">
                  <label className="view-label">Order Date</label>
                  <div className="view-value">{format(new Date(selectedOrder.date), "MMMM dd, yyyy")}</div>
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
