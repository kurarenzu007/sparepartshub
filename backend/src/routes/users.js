const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  const { customer_id, first_name, last_name, phone_number, address } = req.body;

  try {
    // Check if customer_id already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE customer_id = ?', [customer_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Customer ID already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (customer_id, first_name, last_name, phone_number, address) VALUES (?, ?, ?, ?, ?)',
      [customer_id, first_name, last_name, phone_number, address]
    );

    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { customer_id, first_name, last_name, phone_number, address } = req.body;

  try {
    // Check if customer_id already exists for other users
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE customer_id = ? AND id != ?',
      [customer_id, req.params.id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Customer ID already exists' });
    }

    await pool.query(
      'UPDATE users SET customer_id = ?, first_name = ?, last_name = ?, phone_number = ?, address = ? WHERE id = ?',
      [customer_id, first_name, last_name, phone_number, address, req.params.id]
    );

    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router; 