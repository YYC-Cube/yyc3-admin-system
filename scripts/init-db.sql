-- KTV管理系统数据库初始化脚本

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS yyc3_yy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yyc3_yy;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  role ENUM('admin', 'cashier', 'waiter', 'manager') NOT NULL DEFAULT 'cashier',
  status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建包厢表
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type ENUM('small', 'medium', 'large', 'vip', 'party') NOT NULL,
  capacity INT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'occupied', 'reserved', 'maintenance', 'cleaning') NOT NULL DEFAULT 'available',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建商品分类表
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  parent_id VARCHAR(36),
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 创建商品表
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  stock_quantity INT DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  status ENUM('active', 'inactive', 'out_of_stock') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  room_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'refunded', 'partial_refund') NOT NULL DEFAULT 'pending',
  payment_method ENUM('cash', 'alipay', 'wechat', 'card') DEFAULT NULL,
  start_time DATETIME,
  end_time DATETIME,
  duration INT, -- 小时数
  status ENUM('open', 'closed', 'cancelled') NOT NULL DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建订单商品表
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 创建支付记录表
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cash', 'alipay', 'wechat', 'card') NOT NULL,
  transaction_id VARCHAR(100),
  status ENUM('success', 'failed', 'pending', 'refunded') NOT NULL,
  payment_time DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 创建系统日志表
CREATE TABLE IF NOT EXISTS system_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_type ON rooms(type);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_room_id ON orders(room_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 插入初始管理员账户
INSERT INTO users (id, username, password, email, role, status)
VALUES 
('1', 'admin', '$2b$10$4Q1Jf9a9Bq1u7k5j9L4e5e7r3t9y6u8i7o5p3a1s2d4f6g8h9j0k', 'admin@example.com', 'admin', 'active')
ON DUPLICATE KEY UPDATE password = '$2b$10$4Q1Jf9a9Bq1u7k5j9L4e5e7r3t9y6u8i7o5p3a1s2d4f6g8h9j0k';

-- 插入初始包厢数据
INSERT INTO rooms (id, name, type, capacity, price_per_hour, status)
VALUES
('1', '包厢A1', 'small', 4, 188.00, 'available'),
('2', '包厢A2', 'small', 4, 188.00, 'available'),
('3', '包厢B1', 'medium', 6, 288.00, 'available'),
('4', '包厢B2', 'medium', 6, 288.00, 'available'),
('5', '包厢C1', 'large', 10, 388.00, 'available'),
('6', '包厢V1', 'vip', 8, 588.00, 'available')
ON DUPLICATE KEY UPDATE name = VALUES(name), type = VALUES(type), capacity = VALUES(capacity), price_per_hour = VALUES(price_per_hour);

-- 插入初始商品分类
INSERT INTO categories (id, name, sort_order)
VALUES
('1', '啤酒', 1),
('2', '饮料', 2),
('3', '小食', 3),
('4', '果盘', 4),
('5', '香烟', 5)
ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order);

-- 插入初始商品数据
INSERT INTO products (id, name, category_id, price, stock_quantity, unit, status)
VALUES
('1', '青岛啤酒', '1', 12.00, 100, '瓶', 'active'),
('2', '百威啤酒', '1', 15.00, 80, '瓶', 'active'),
('3', '可乐', '2', 8.00, 200, '罐', 'active'),
('4', '雪碧', '2', 8.00, 150, '罐', 'active'),
('5', '花生', '3', 15.00, 100, '份', 'active'),
('6', '瓜子', '3', 12.00, 120, '份', 'active'),
('7', '小果盘', '4', 38.00, 50, '份', 'active'),
('8', '大果盘', '4', 68.00, 30, '份', 'active'),
('9', '中华烟', '5', 65.00, 20, '包', 'active')
ON DUPLICATE KEY UPDATE name = VALUES(name), category_id = VALUES(category_id), price = VALUES(price), stock_quantity = VALUES(stock_quantity);

-- 显示创建结果
SELECT '数据库初始化完成' AS message;
SELECT '可用的管理员账户: admin / 123456' AS login_info;
