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
  
  // Log the incoming request
  console.log('\n===== NEW ORDER STATUS UPDATE REQUEST =====');
  console.log(`[${new Date().toISOString()}] Updating order ${id} to status: ${status}`);
  
  // Validate input
  if (!status) {
    console.error('ERROR: Status is required');
    return res.status(400).json({ 
      success: false, 
      message: 'Status is required',
      orderId: id
    });
  }
  
  const connection = await promisePool.getConnection().catch(err => {
    console.error('ERROR: Failed to get database connection:', err);
    return null;
  });
  
  if (!connection) {
    return res.status(500).json({
      success: false,
      message: 'Could not connect to database',
      orderId: id
    });
  }
  
  try {
    // Start transaction
    console.log('Starting database transaction...');
    await connection.beginTransaction();
    
    // 1. Update the order status
    console.log(`Updating order ${id} status to: ${status}`);
    const [updateResult] = await connection.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    
    console.log('Update result:', updateResult);
    
    if (updateResult.affectedRows === 0) {
      console.error(`ERROR: No order found with ID: ${id}`);
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        orderId: id
      });
    }
    
    console.log(`Successfully updated order ${id} status to ${status}`);
    
    // 2. Check if we need to create a sales record
    const statusUpper = status.toUpperCase();
    console.log(`Checking if status ${statusUpper} requires sales record...`);
    
    if (statusUpper === 'DELIVERED' || statusUpper === 'COMPLETED') {
      console.log('Status requires sales record. Processing...');
      
      // Check if sales record already exists
      console.log(`Checking for existing sales record for order ${id}...`);
      const [existingSales] = await connection.query(
        'SELECT id FROM sales WHERE id = ?',
        [id]
      );
      
      if (existingSales.length > 0) {
        console.log(`Sales record already exists for order ${id}. Skipping creation.`);
      } else {
        console.log(`No existing sales record found for order ${id}. Creating new one...`);
        
        // Get order details
        console.log(`Fetching order details for order ${id}...`);
        const [orders] = await connection.query(
          'SELECT * FROM orders WHERE id = ?',
          [id]
        );
        
        if (orders.length === 0) {
          throw new Error(`Order ${id} not found after update`);
        }
        
        const order = orders[0];
        console.log('Order details:', {
          id: order.id,
          customer: order.customer_name,
          total: order.total_amount,
          payment: order.payment_method,
          date: order.order_date
        });
        
        // Get order items
        console.log(`Fetching order items for order ${id}...`);
        const [items] = await connection.query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [id]
        );
        
        console.log(`Found ${items.length} order items`);
        
        if (items.length === 0) {
          console.warn('WARNING: No order items found for order', id);
        }
        
        // Prepare products data
        const productsData = items.map(item => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
          total: item.quantity * item.unit_price
        }));
        
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const calculatedTotal = productsData.reduce((sum, item) => sum + item.total, 0);
        
        console.log('Products data:', productsData);
        console.log(`Total quantity: ${totalQuantity}, Calculated total: ${calculatedTotal}`);
        
        // Create sales record
        const salesRecord = {
          id: order.id,
          transaction_date: order.order_date || new Date(),
          customer_name: order.customer_name || 'Unknown Customer',
          products: JSON.stringify(productsData),
          quantity: totalQuantity,
          amount: order.total_amount || calculatedTotal,
          payment_method: order.payment_method || 'unknown',
          status: 'Completed'
        };
        
        console.log('Prepared sales record:', salesRecord);
        
        // Insert sales record
        console.log('Inserting sales record...');
        const [salesResult] = await connection.query(
          `INSERT INTO sales (
            id, 
            transaction_date, 
            customer_name, 
            products, 
            quantity, 
            amount, 
            payment_method, 
            status, 
            created_at, 
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            salesRecord.id,
            salesRecord.transaction_date,
            salesRecord.customer_name,
            salesRecord.products,
            salesRecord.quantity,
            salesRecord.amount,
            salesRecord.payment_method,
            salesRecord.status
          ]
        );
        
        console.log('Sales record inserted successfully:', salesResult);
        console.log(`Sales record created for order ${id}`);
      }
    } else {
      console.log(`Status ${status} does not require sales record.`);
    }
    
    // Commit transaction
    console.log('Committing transaction...');
    await connection.commit();
    console.log('Transaction committed successfully');
    
    // Send success response
    res.json({
      success: true,
      message: 'Order status updated successfully',
      orderId: id,
      status: status
    });
    
  } catch (error) {
    // Error handling
    console.error('ERROR in order status update:', error);
    
    // Attempt to rollback
    try {
      console.log('Attempting to rollback transaction...');
      await connection.rollback();
      console.log('Transaction rolled back');
    } catch (rollbackError) {
      console.error('ERROR rolling back transaction:', rollbackError);
    }
    
    // Send error response
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
      orderId: id,
      status: status
    });
    
  } finally {
    // Always release the connection
    console.log('Releasing database connection...');
    connection.release().catch(err => {
      console.error('Error releasing database connection:', err);
    });
    console.log('Database connection released');
    console.log('===== REQUEST COMPLETE =====\n');
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
