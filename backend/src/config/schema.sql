-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tcj_autoparts;
USE tcj_autoparts;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    image VARCHAR(244), NOT NULL
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    supplier VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sales Table
CREATE TABLE sales (
    id VARCHAR(20) PRIMARY KEY,  -- For order numbers like "ORD-2401"
    transaction_date DATE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    products TEXT NOT NULL,      -- Storing products as text, could be JSON in the future
    quantity INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


--orders table

CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY,  -- Format: ORD-2401 (same as sales.id)
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    items_count INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,  -- 'Cash on Delivery' or 'GCash'
    payment_status VARCHAR(20) DEFAULT 'Pending',  -- 'Pending', 'Paid', 'Failed'
    status VARCHAR(20) DEFAULT 'Pending',  -- 'Pending', 'Processing', 'Delivered', 'Cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items (if you need to track individual products)
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(20) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
--connect the orders to sales table
DELIMITER //
CREATE TRIGGER after_order_delivered
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'Delivered' AND (OLD.status IS NULL OR OLD.status != 'Delivered') THEN
        -- Insert into sales table
        INSERT INTO sales (
            id,
            transaction_date,
            customer_name,
            products,
            quantity,
            amount,
            status,
            created_at,
            updated_at
        )
        SELECT 
            o.id,
            o.order_date,
            o.customer_name,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'name', oi.product_name,
                    'quantity', oi.quantity,
                    'price', oi.unit_price
                )
            ),
            o.items_count,
            o.total_amount,
            'Completed',
            o.created_at,
            o.updated_at
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = NEW.id
        GROUP BY o.id;
    END IF;
END;//
DELIMITER ;


ALTER TABLE sales ADD COLUMN payment_method VARCHAR(50) NULL;