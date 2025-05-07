import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/users";

const SimpleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem 1.5rem",
          borderRadius: "12px",
          minWidth: "320px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const emptyUser = {
  customer_id: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  address: "",
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null); // null for add, user object for edit
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

  // Modal open/close
  const openAddModal = () => {
    setForm(emptyUser);
    setEditUser(null);
    setModalOpen(true);
  };
  const openEditModal = (user) => {
    setForm(user);
    setEditUser(user);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyUser);
    setEditUser(null);
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
      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (!window.confirm("Delete this user?")) return;
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

  // Responsive table styles
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 24,
    fontSize: 16,
  };
  const thtd = {
    padding: "10px 8px",
    border: "1px solid #eee",
    textAlign: "left",
  };
  const actionsStyle = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>User Management</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <button
          onClick={openAddModal}
          style={{
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Add User
        </button>
        <button
          onClick={fetchUsers}
          style={{
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Refresh
        </button>
      </div>
      {error && (
        <div style={{ color: "#c62828", marginBottom: 12, fontWeight: 500 }}>{error}</div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={thtd}>Customer ID</th>
              <th style={thtd}>First Name</th>
              <th style={thtd}>Last Name</th>
              <th style={thtd}>Phone Number</th>
              <th style={thtd}>Address</th>
              <th style={thtd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td style={thtd}>{user.customer_id}</td>
                  <td style={thtd}>{user.first_name}</td>
                  <td style={thtd}>{user.last_name}</td>
                  <td style={thtd}>{user.phone_number}</td>
                  <td style={thtd}>{user.address}</td>
                  <td style={thtd}>
                    <div style={actionsStyle}>
                      <button
                        onClick={() => openEditModal(user)}
                        style={{
                          background: "#FFC107",
                          color: "#333",
                          border: "none",
                          borderRadius: 5,
                          padding: "6px 14px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        style={{
                          background: "#f44336",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "6px 14px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <SimpleModal isOpen={modalOpen} onClose={closeModal}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>{editUser ? "Edit User" : "Add User"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            name="customer_id"
            placeholder="Customer ID"
            value={form.customer_id}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {editUser ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              style={{
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 5,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
};

export default UsersPage;