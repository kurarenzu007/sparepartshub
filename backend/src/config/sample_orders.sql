-- Insert sample orders
INSERT INTO orders (
    id, 
    order_date, 
    customer_name, 
    customer_phone, 
    items_count, 
    total_amount, 
    payment_method, 
    payment_status, 
    status
) VALUES 
('ORD-1001', NOW() - INTERVAL 1 DAY, 'Juan Dela Cruz', '09123456789', 3, 1500.75, 'Cash on Delivery', 'Pending', 'Pending'),
('ORD-1002', NOW() - INTERVAL 2 DAY, 'Maria Santos', '09234567890', 1, 499.99, 'GCash', 'Paid', 'Completed'),
('ORD-1003', NOW() - INTERVAL 3 DAY, 'Carlos Reyes', '09345678901', 2, 890.00, 'GCash', 'Paid', 'Cancelled'),
('ORD-1004', NOW() - INTERVAL 4 DAY, 'Ana Lopez', '09456789012', 4, 2100.50, 'Cash on Delivery', 'Paid', 'Completed'),
('ORD-1005', NOW() - INTERVAL 5 DAY, 'Mark Rivera', '09567890123', 5, 3200.00, 'GCash', 'Paid', 'Pending'),
('ORD-1006', NOW() - INTERVAL 6 DAY, 'Jasmine Cruz', '09678901234', 2, 1450.00, 'GCash', 'Paid', 'Pending'),
('ORD-1007', NOW() - INTERVAL 7 DAY, 'Enzo Ramos', '09789012345', 3, 2100.00, 'GCash', 'Paid', 'Completed'),
('ORD-1008', NOW() - INTERVAL 8 DAY, 'Rico Santos', '09890123456', 1, 780.00, 'Cash on Delivery', 'Pending', 'Cancelled'),
('ORD-1009', NOW() - INTERVAL 9 DAY, 'Leah Mendoza', '09901234567', 2, 1100.00, 'GCash', 'Paid', 'Pending'),
('ORD-1010', NOW() - INTERVAL 10 DAY, 'Tanya Flores', '09012345678', 6, 3600.00, 'GCash', 'Paid', 'Completed');

-- Insert sample order items
INSERT INTO order_items (
    order_id, 
    product_name, 
    quantity, 
    unit_price
) VALUES 
('ORD-1001', 'Brake Pads', 1, 500.25),
('ORD-1001', 'Oil Filter', 1, 300.50),
('ORD-1001', 'Spark Plugs', 1, 700.00),
('ORD-1002', 'Headlight Assembly', 1, 499.99),
('ORD-1003', 'Alternator', 1, 650.00),
('ORD-1003', 'Battery', 1, 240.00),
('ORD-1004', 'Shock Absorber', 2, 800.25),
('ORD-1004', 'Wheel Bearing', 2, 250.00),
('ORD-1005', 'Timing Belt', 1, 1200.00),
('ORD-1005', 'Water Pump', 1, 800.00),
('ORD-1005', 'Radiator', 1, 700.00),
('ORD-1005', 'Thermostat', 2, 250.00),
('ORD-1006', 'Fuel Pump', 1, 950.00),
('ORD-1006', 'Fuel Filter', 1, 500.00),
('ORD-1007', 'Clutch Kit', 1, 1500.00),
('ORD-1007', 'Flywheel', 1, 600.00),
('ORD-1008', 'CV Joint', 1, 780.00),
('ORD-1009', 'Oxygen Sensor', 2, 550.00),
('ORD-1010', 'Starter Motor', 1, 1200.00),
('ORD-1010', 'Ignition Coil', 4, 600.00);
