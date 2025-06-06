-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS after_order_delivered;

-- Create a new trigger that works with both 'Delivered' and 'COMPLETED' statuses
DELIMITER //
CREATE TRIGGER after_order_completed
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF (NEW.status = 'Delivered' OR NEW.status = 'COMPLETED') AND 
       (OLD.status IS NULL OR (OLD.status != 'Delivered' AND OLD.status != 'COMPLETED')) THEN
        -- Check if this order already exists in sales to prevent duplicates
        SET @sale_exists = (SELECT COUNT(*) FROM sales WHERE id = NEW.id);
        
        IF @sale_exists = 0 THEN
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
    END IF;
END//
DELIMITER ;
