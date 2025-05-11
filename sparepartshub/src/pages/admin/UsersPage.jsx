import React, { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Form, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UsersPage.css";

const API_URL = "http://localhost:5000/api/users";

const emptyUser = {
  customer_id: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  address: "",
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Modal handlers
  const handleClose = () => {
    setShowModal(false);
    setForm(emptyUser);
    setEditUser(null);
  };

  const handleShow = (user = null) => {
    if (user) {
      setForm(user);
      setEditUser(user);
    } else {
      setForm(emptyUser);
      setEditUser(null);
    }
    setShowModal(true);
  };

  // Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (editUser) {
        res = await fetch(`${API_URL}/${editUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save user");
      }
      handleClose();
      fetchUsers();
    } catch (err) {
      setError(err.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete user");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="users-container">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h2 className="page-title">User Management</h2>
          <div className="d-flex action-buttons">
            <Button 
              variant="success" 
              className="btn-custom btn-add"
              onClick={() => handleShow()}
            >
              Add User
            </Button>
            <Button 
              variant="primary" 
              className="btn-custom"
              onClick={fetchUsers}
            >
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="custom-alert mb-4">
            {error}
          </Alert>
        )}

        <div className="table-container">
          <Table className="custom-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <Spinner animation="border" className="loading-spinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.customer_id}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.address}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          className="btn-custom btn-edit"
                          onClick={() => handleShow(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="btn-custom btn-delete"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
      
<Modal 
  show={showModal} 
  onHide={handleClose} 
  centered 
  className="custom-modal"
  size="md"
>
  <Modal.Header closeButton>
    <Modal.Title>{editUser ? "Edit User" : "Add User"}</Modal.Title>
  </Modal.Header>
  <Form onSubmit={handleSubmit}>
    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label>Customer ID</Form.Label>
        <Form.Control
          type="text"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button 
        variant="secondary" 
        onClick={handleClose} 
        disabled={loading}
        className="btn-custom"
      >
        Cancel
      </Button>
      <Button 
        variant="primary" 
        type="submit" 
        disabled={loading}
        className="btn-custom"
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            {editUser ? "Updating..." : "Adding..."}
          </>
        ) : (
          editUser ? "Update" : "Add"
        )}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>
    </Container>
  );
};

export default UsersPage;