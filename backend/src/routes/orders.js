const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT * FROM orders 
      ORDER BY order_date DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get a specific order with its items
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get order details
    const [orders] = await promisePool.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get order items
    const [items] = await promisePool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    
    // Combine order with its items
    const order = {
      ...orders[0],
      items
    };
    
    res.json(order);
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const {
    order_number,
    customer_name,
    customer_phone,
    items_count,
    total_amount,
    payment_method,
    payment_status,
    status,
    items
  } = req.body;
  
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert order
    const [result] = await connection.query(
      `INSERT INTO orders 
       (id, customer_name, customer_phone, items_count, total_amount, payment_method, payment_status, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [order_number, customer_name, customer_phone, items_count, total_amount, payment_method, payment_status || 'Pending', status || 'Pending']
    );
    
    // Insert order items
    if (items && items.length > 0) {
      const itemValues = items.map(item => [
        order_number,
        item.product_name,
        item.quantity,
        item.unit_price
      ]);
      
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_name, quantity, unit_price) 
         VALUES ?`,
        [itemValues]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId: order_number
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const connection = await promisePool.getConnection();
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  try {
    await connection.beginTransaction();
    
    // Update order status
    const [result] = await connection.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If status is Delivered, create a sales record
    if (status === 'Delivered') {
      // Get the order details
      const [orders] = await connection.query(
        'SELECT * FROM orders WHERE id = ?',
        [id]
      );
      
      if (orders.length > 0) {
        const order = orders[0];
        
        // Get order items
        const [items] = await connection.query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [id]
        );
        
        // Create sales record
        await connection.query(
          `INSERT INTO sales 
           (order_id, transaction_date, customer_name, total_amount, payment_method, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            new Date(),
            order.customer_name,
            order.total_amount,
            order.payment_method,
            'Delivered'
          ]
        );
      }
    }
    
    await connection.commit();
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error(`Error updating order ${id} status:`, error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  } finally {
    connection.release();
  }
});

// Update order
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    customer_name,
    customer_phone,
    items_count,
    total_amount,
    payment_method,
    payment_status,
    status
  } = req.body;
  
  try {
    const [result] = await promisePool.query(
      `UPDATE orders 
       SET customer_name = ?, 
           customer_phone = ?, 
           items_count = ?, 
           total_amount = ?, 
           payment_method = ?, 
           payment_status = ?, 
           status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [customer_name, customer_phone, items_count, total_amount, payment_method, payment_status, status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

module.exports = router;
