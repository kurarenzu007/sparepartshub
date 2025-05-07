const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await promisePool.query(`
      SELECT p.*, i.sku, i.supplier, i.low_stock_threshold as lowStock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
    `);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const [products] = await promisePool.query(`
      SELECT p.*, i.sku, i.supplier, i.low_stock_threshold as lowStock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.id = ?
    `, [productId]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, brand, price, stock, category, description, sku, lowStock, supplier } = req.body;

    // Insert into products table
    const [productResult] = await connection.query(
      'INSERT INTO products (name, brand, price, stock, category, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, brand, price, stock, category, description]
    );

    const productId = productResult.insertId;

    // Insert into inventory table
    await connection.query(
      'INSERT INTO inventory (product_id, sku, stock, low_stock_threshold, supplier) VALUES (?, ?, ?, ?, ?)',
      [productId, sku, stock, lowStock, supplier]
    );

    await connection.commit();

    res.status(201).json({ 
      id: productId, 
      message: 'Product created successfully',
      product: { name, brand, price, stock, category, description, sku, lowStock, supplier }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  } finally {
    connection.release();
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, brand, price, stock, category, description, sku, lowStock, supplier } = req.body;
    const productId = req.params.id;

    // Update products table
    const [productResult] = await connection.query(
      'UPDATE products SET name = ?, brand = ?, price = ?, stock = ?, category = ?, description = ? WHERE id = ?',
      [name, brand, price, stock, category, description, productId]
    );

    if (productResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update inventory table
    await connection.query(
      'UPDATE inventory SET sku = ?, stock = ?, low_stock_threshold = ?, supplier = ? WHERE product_id = ?',
      [sku, stock, lowStock, supplier, productId]
    );

    await connection.commit();
    
    res.json({ 
      message: 'Product updated successfully',
      product: { id: productId, name, brand, price, stock, category, description, sku, lowStock, supplier }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  } finally {
    connection.release();
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const productId = req.params.id;

    // Delete from inventory first (due to foreign key constraint)
    await connection.query('DELETE FROM inventory WHERE product_id = ?', [productId]);
    
    // Then delete from products
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [productId]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    await connection.commit();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  } finally {
    connection.release();
  }
});

module.exports = router; 