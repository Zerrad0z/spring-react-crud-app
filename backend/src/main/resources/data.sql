-- =====================================================
-- Spring Boot Data Initialization Script
-- File: src/main/resources/data.sql
-- =====================================================

-- Insert sample categories (only if they don't exist)
INSERT INTO categories (name, description)
SELECT 'Electronics', 'Electronic devices and gadgets'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electronics');

INSERT INTO categories (name, description)
SELECT 'Clothing', 'Apparel and fashion items'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Clothing');

INSERT INTO categories (name, description)
SELECT 'Books', 'Educational and entertainment books'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Books');

INSERT INTO categories (name, description)
SELECT 'Home & Garden', 'Home improvement and gardening supplies'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Home & Garden');

INSERT INTO categories (name, description)
SELECT 'Sports', 'Sports equipment and accessories'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sports');

-- Insert sample users (only if they don't exist)
-- Password "123" encoded with BCrypt
INSERT INTO users (username, password, role)
SELECT 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, password, role)
SELECT 'user', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user');

-- Insert sample products (only if they don't exist)
-- Electronics
INSERT INTO products (name, price, category_id)
SELECT 'iPhone 15 Pro', 999.99, c.id FROM categories c WHERE c.name = 'Electronics'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 15 Pro');

INSERT INTO products (name, price, category_id)
SELECT 'Samsung Galaxy S24', 899.99, c.id FROM categories c WHERE c.name = 'Electronics'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy S24');

INSERT INTO products (name, price, category_id)
SELECT 'MacBook Air M2', 1199.99, c.id FROM categories c WHERE c.name = 'Electronics'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'MacBook Air M2');

INSERT INTO products (name, price, category_id)
SELECT 'Dell XPS 13', 999.99, c.id FROM categories c WHERE c.name = 'Electronics'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dell XPS 13');

INSERT INTO products (name, price, category_id)
SELECT 'Sony WH-1000XM5', 399.99, c.id FROM categories c WHERE c.name = 'Electronics'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sony WH-1000XM5');

-- Clothing
INSERT INTO products (name, price, category_id)
SELECT 'Nike Air Max 270', 150.00, c.id FROM categories c WHERE c.name = 'Clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nike Air Max 270');

INSERT INTO products (name, price, category_id)
SELECT 'Levi''s 501 Jeans', 89.99, c.id FROM categories c WHERE c.name = 'Clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Levi''s 501 Jeans');

INSERT INTO products (name, price, category_id)
SELECT 'Adidas Ultraboost 22', 180.00, c.id FROM categories c WHERE c.name = 'Clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Adidas Ultraboost 22');

INSERT INTO products (name, price, category_id)
SELECT 'Calvin Klein T-Shirt', 29.99, c.id FROM categories c WHERE c.name = 'Clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Calvin Klein T-Shirt');

INSERT INTO products (name, price, category_id)
SELECT 'North Face Jacket', 199.99, c.id FROM categories c WHERE c.name = 'Clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'North Face Jacket');

-- Books
INSERT INTO products (name, price, category_id)
SELECT 'Clean Code', 45.99, c.id FROM categories c WHERE c.name = 'Books'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Clean Code');

INSERT INTO products (name, price, category_id)
SELECT 'Design Patterns', 54.99, c.id FROM categories c WHERE c.name = 'Books'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Design Patterns');

INSERT INTO products (name, price, category_id)
SELECT 'Spring Boot in Action', 49.99, c.id FROM categories c WHERE c.name = 'Books'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Spring Boot in Action');

INSERT INTO products (name, price, category_id)
SELECT 'JavaScript: The Good Parts', 39.99, c.id FROM categories c WHERE c.name = 'Books'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'JavaScript: The Good Parts');

INSERT INTO products (name, price, category_id)
SELECT 'Effective Java', 52.99, c.id FROM categories c WHERE c.name = 'Books'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Effective Java');

-- Home & Garden
INSERT INTO products (name, price, category_id)
SELECT 'Dyson V15 Vacuum', 749.99, c.id FROM categories c WHERE c.name = 'Home & Garden'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dyson V15 Vacuum');

INSERT INTO products (name, price, category_id)
SELECT 'KitchenAid Stand Mixer', 379.99, c.id FROM categories c WHERE c.name = 'Home & Garden'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'KitchenAid Stand Mixer');

INSERT INTO products (name, price, category_id)
SELECT 'Weber Genesis Grill', 899.99, c.id FROM categories c WHERE c.name = 'Home & Garden'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Weber Genesis Grill');

INSERT INTO products (name, price, category_id)
SELECT 'Roomba i7+', 599.99, c.id FROM categories c WHERE c.name = 'Home & Garden'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Roomba i7+');

INSERT INTO products (name, price, category_id)
SELECT 'Philips Hue Starter Kit', 199.99, c.id FROM categories c WHERE c.name = 'Home & Garden'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Philips Hue Starter Kit');

-- Sports
INSERT INTO products (name, price, category_id)
SELECT 'Wilson Tennis Racket', 129.99, c.id FROM categories c WHERE c.name = 'Sports'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wilson Tennis Racket');

INSERT INTO products (name, price, category_id)
SELECT 'Nike Basketball', 89.99, c.id FROM categories c WHERE c.name = 'Sports'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nike Basketball');

INSERT INTO products (name, price, category_id)
SELECT 'Spalding NBA Ball', 69.99, c.id FROM categories c WHERE c.name = 'Sports'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Spalding NBA Ball');

INSERT INTO products (name, price, category_id)
SELECT 'Under Armour Gym Bag', 79.99, c.id FROM categories c WHERE c.name = 'Sports'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Under Armour Gym Bag');

INSERT INTO products (name, price, category_id)
SELECT 'Fitbit Charge 5', 179.99, c.id FROM categories c WHERE c.name = 'Sports'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fitbit Charge 5');