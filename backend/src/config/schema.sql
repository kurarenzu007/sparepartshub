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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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


-- Insert some sample data
INSERT INTO products (name, brand, price, stock, category, description) VALUES
('Brake Pads', 'Toyota', 1200.00, 15, 'Brake System', 'High-quality brake pads for Toyota vehicles'),
('Engine Oil', 'Shell', 450.00, 30, 'Lubricants', '10W-40 Synthetic Engine Oil'),
('Air Filter', 'Honda', 350.00, 20, 'Filters', 'Premium air filter for Honda models'),
('Spark Plugs', 'NGK', 120.00, 50, 'Engine Parts', 'Iridium spark plugs'),
('Battery', 'Motolite', 4500.00, 8, 'Electrical', '12V 60Ah Maintenance Free Battery');

-- Insert corresponding inventory records
INSERT INTO inventory (product_id, sku, stock, low_stock_threshold, supplier) VALUES
(1, 'BRK-001', 15, 5, 'AutoParts Inc.'),
(2, 'LUB-001', 30, 10, 'Shell Philippines'),
(3, 'FLT-001', 20, 5, 'Honda Parts'),
(4, 'ENG-001', 50, 10, 'NGK Philippines'),
(5, 'BAT-001', 8, 3, 'Motolite'); 