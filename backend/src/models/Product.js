const db = require('../config/database');

class Product {
    static async getAll() {
        const query = `
            SELECT p.*, i.sku, i.stock as inventory_stock, i.low_stock_threshold, i.supplier
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT p.*, i.sku, i.stock as inventory_stock, i.low_stock_threshold, i.supplier
            FROM products p
            LEFT JOIN inventory i ON p.id = i.product_id
            WHERE p.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    static async create(productData) {
        const { name, brand, price, stock, category, description, sku, low_stock_threshold, supplier } = productData;
        
        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Insert into products table
            const [productResult] = await connection.query(
                'INSERT INTO products (name, brand, price, stock, category, description) VALUES (?, ?, ?, ?, ?, ?)',
                [name, brand, price, stock, category, description]
            );

            const productId = productResult.insertId;

            // Insert into inventory table
            await connection.query(
                'INSERT INTO inventory (product_id, sku, stock, low_stock_threshold, supplier) VALUES (?, ?, ?, ?, ?)',
                [productId, sku, stock, low_stock_threshold, supplier]
            );

            await connection.commit();
            return productId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, productData) {
        const { name, brand, price, stock, category, description, sku, low_stock_threshold, supplier } = productData;
        
        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Update products table
            await connection.query(
                'UPDATE products SET name = ?, brand = ?, price = ?, stock = ?, category = ?, description = ? WHERE id = ?',
                [name, brand, price, stock, category, description, id]
            );

            // Update inventory table
            await connection.query(
                'UPDATE inventory SET sku = ?, stock = ?, low_stock_threshold = ?, supplier = ? WHERE product_id = ?',
                [sku, stock, low_stock_threshold, supplier, id]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Delete from inventory first (due to foreign key constraint)
            await connection.query('DELETE FROM inventory WHERE product_id = ?', [id]);
            
            // Then delete from products
            await connection.query('DELETE FROM products WHERE id = ?', [id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Product; 