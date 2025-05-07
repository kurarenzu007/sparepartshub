const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const [inventory] = await promisePool.query(`
      SELECT p.*, i.sku, i.supplier, i.low_stock_threshold as lowStock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
    `);
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Error fetching inventory' });
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const [inventory] = await promisePool.query(`
      SELECT p.*, i.sku, i.supplier, i.low_stock_threshold as lowStock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.id = ?
    `, [productId]);

    if (inventory.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(inventory[0]);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Error fetching inventory item' });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { sku, stock, lowStock, supplier } = req.body;
    const productId = req.params.id;

    // Update inventory table
    const [result] = await connection.query(
      'UPDATE inventory SET sku = ?, stock = ?, low_stock_threshold = ?, supplier = ? WHERE product_id = ?',
      [sku, stock, lowStock, supplier, productId]
    );

    if (result.affectedRows === 0) {
      // If no inventory record exists, create one
      await connection.query(
        'INSERT INTO inventory (product_id, sku, stock, low_stock_threshold, supplier) VALUES (?, ?, ?, ?, ?)',
        [productId, sku, stock, lowStock, supplier]
      );
    }

    await connection.commit();
    
    res.json({ 
      message: 'Inventory updated successfully',
      inventory: { id: productId, sku, stock, lowStock, supplier }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Error updating inventory' });
  } finally {
    connection.release();
  }
});

module.exports = router; 