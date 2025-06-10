const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisePool } = require('../config/db');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

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

// Get product image
router.get('/:id/image', async (req, res) => {
  try {
    const [products] = await promisePool.query(
      'SELECT image_path FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (!products[0] || !products[0].image_path) {
      return res.status(404).send('Image not found');
    }
    
    // Handle both prefixed and non-prefixed image paths
    let imageRelativePath = products[0].image_path;
    if (!imageRelativePath.startsWith('/uploads/')) {
      imageRelativePath = '/uploads/' + imageRelativePath;
    }
    const imagePath = path.join(__dirname, '../..', imageRelativePath.startsWith('/') ? imageRelativePath.substring(1) : imageRelativePath);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image file not found');
    }
    
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching product image:', error);
    res.status(500).json({ error: 'Error fetching product image' });
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
router.post('/', upload.single('image'), async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, brand, price, stock, category, description, sku, lowStock, supplier } = req.body;
    
    // Store the filename without the /uploads/ prefix
    const imagePath = req.file ? req.file.filename : null;

    // Insert into products table
    const [productResult] = await connection.query(
      'INSERT INTO products (name, brand, price, stock, category, description, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, brand, price, stock, category, description, imagePath]
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
      product: { name, brand, price, stock, category, description, sku, lowStock, supplier, imagePath }
    });
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    await connection.rollback();
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  } finally {
    connection.release();
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, brand, price, stock, category, description, sku, lowStock, supplier } = req.body;
    const productId = req.params.id;
    const newImagePath = req.file ? req.file.filename : null;

    // First check if the product exists and get current image path
    const [existingProduct] = await connection.query(
      'SELECT id, image_path FROM products WHERE id = ?',
      [productId]
    );

    if (existingProduct.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    let query = `
      UPDATE products 
      SET name = ?, brand = ?, price = ?, stock = ?, 
          category = ?, description = ?
    `;
    
    let values = [name, brand, price, stock, category, description];

    // Only update image if a new one is provided
    if (newImagePath) {
      query += ', image_path = ?';
      values.push(newImagePath);
      
      // Delete old image file if it exists
      if (existingProduct[0].image_path) {
        const oldImagePath = path.join(__dirname, '../..', existingProduct[0].image_path.startsWith('/') ? existingProduct[0].image_path.substring(1) : existingProduct[0].image_path);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old image:', err);
          });
        }
      }
    }

    query += ' WHERE id = ?';
    values.push(productId);

    // Update products table
    await connection.query(query, values);

    // Update or insert inventory record
    const [inventoryResult] = await connection.query(
      'SELECT id FROM inventory WHERE product_id = ?',
      [productId]
    );

    if (inventoryResult.length > 0) {
      // Update existing inventory record
      await connection.query(
        'UPDATE inventory SET sku = ?, stock = ?, low_stock_threshold = ?, supplier = ? WHERE product_id = ?',
        [sku, stock, lowStock, supplier, productId]
      );
    } else {
      // Insert new inventory record
      await connection.query(
        'INSERT INTO inventory (product_id, sku, stock, low_stock_threshold, supplier) VALUES (?, ?, ?, ?, ?)',
        [productId, sku, stock, lowStock, supplier]
      );
    }

    await connection.commit();
    
    res.json({ 
      message: 'Product updated successfully',
      product: { 
        id: productId, 
        name, 
        brand, 
        price, 
        stock, 
        category, 
        description, 
        sku, 
        lowStock, 
        supplier,
        imagePath: newImagePath || existingProduct[0].image_path
      }
    });
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
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

    // Get the image path before deleting
    const [product] = await connection.query(
      'SELECT image_path FROM products WHERE id = ?',
      [productId]
    );

    // Delete from inventory first (due to foreign key constraint)
    await connection.query('DELETE FROM inventory WHERE product_id = ?', [productId]);
    
    // Then delete from products
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [productId]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the image file if it exists
    if (product[0]?.image_path) {
      const imagePath = path.join(__dirname, '../../uploads', product[0].image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image file:', err);
        });
      }
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