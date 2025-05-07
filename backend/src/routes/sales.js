const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

// Get all sales
router.get('/', async (req, res) => {
  try {
    const [sales] = await promisePool.query(`
      SELECT * FROM sales
      ORDER BY transaction_date DESC
    `);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Error fetching sales data' });
  }
});

// Get single sale
router.get('/:id', async (req, res) => {
  try {
    const [sales] = await promisePool.query(
      'SELECT * FROM sales WHERE id = ?',
      [req.params.id]
    );

    if (sales.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sales[0]);
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Error fetching sale data' });
  }
});

// Create new sale
router.post('/', async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, transaction_date, customer_name, products, quantity, amount, status } = req.body;

    const [result] = await connection.query(
      `INSERT INTO sales (id, transaction_date, customer_name, products, quantity, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, transaction_date, customer_name, products, quantity, amount, status]
    );

    await connection.commit();
    
    res.status(201).json({ 
      message: 'Sale created successfully',
      sale: { id, transaction_date, customer_name, products, quantity, amount, status }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Error creating sale' });
  } finally {
    connection.release();
  }
});

// Update sale status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const [result] = await promisePool.query(
      'UPDATE sales SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json({ 
      message: 'Sale status updated successfully',
      sale: { id: req.params.id, status }
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Error updating sale' });
  }
});

module.exports = router; 