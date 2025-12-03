# 🗄️ 数据库设计文档

本文档详细说明启智KTV商家后台管理系统的完整数据库设计，包括三个核心数据库：`yyc3_yy`（业务主库）、`yyc3_hr`（人力资源）、`yyc3_audit`（审计日志）。

---

## 📑 目录

- [数据库架构](#数据库架构)
- [yyc3_yy 业务主库](#yyc3_yy-业务主库)
- [yyc3_hr 人力资源库](#yyc3_hr-人力资源库)
- [yyc3_audit 审计日志库](#yyc3_audit-审计日志库)
- [索引设计](#索引设计)
- [关系图谱](#关系图谱)
- [数据迁移](#数据迁移)
- [性能优化](#性能优化)
- [备份策略](#备份策略)

---

## 数据库架构

### 总体设计

\`\`\`
┌─────────────────────────────────────────────────────┐
│                   MySQL 8.0+                        │
├─────────────────┬─────────────────┬─────────────────┤
│   yyc3_yy       │   yyc3_hr       │   yyc3_audit    │
│  (业务主库)      │  (人力资源)      │  (审计日志)      │
├─────────────────┼─────────────────┼─────────────────┤
│ • 商品管理       │ • 员工信息       │ • 操作日志       │
│ • 订单管理       │ • 考勤打卡       │ • 数据变更       │
│ • 会员管理       │ • 薪资管理       │ • 登录日志       │
│ • 包厢管理       │ • 绩效考核       │ • 系统审计       │
│ • 库存管理       │ • 培训记录       │                 │
│ • 支付记录       │ • 招聘管理       │                 │
│ • AI运营数据     │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
\`\`\`

### 环境配置

\`\`\`ini
# yyc3_yy 数据库连接
YYC3_YY_DB_HOST=localhost
YYC3_YY_DB_PORT=3306
YYC3_YY_DB_USER=devuser
YYC3_YY_DB_PASSWORD=devpassword
YYC3_YY_DB_NAME=yyc3_yy

# yyc3_hr 数据库连接
HR_DB_HOST=localhost
HR_DB_NAME=yyc3_hr
HR_DB_USER=hr_admin
HR_DB_PASSWORD=secure_hr_pass

# yyc3_audit 数据库连接
AUDIT_DB_NAME=yyc3_audit
AUDIT_DB_USER=audit_user
AUDIT_DB_PASSWORD=secure_audit_pass
\`\`\`

---

## yyc3_yy 业务主库

### 1. 用户认证表

#### users (用户表)

\`\`\`sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `role` ENUM('admin', 'manager', 'employee', 'cashier') NOT NULL DEFAULT 'employee' COMMENT '角色',
  `department` VARCHAR(50) DEFAULT NULL COMMENT '部门',
  `status` ENUM('active', 'inactive', 'locked') NOT NULL DEFAULT 'active' COMMENT '状态',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
\`\`\`

#### user_permissions (用户权限表)

\`\`\`sql
CREATE TABLE `user_permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `permission` VARCHAR(100) NOT NULL COMMENT '权限标识',
  `resource` VARCHAR(100) DEFAULT NULL COMMENT '资源标识',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_permission` (`permission`),
  CONSTRAINT `fk_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户权限表';
\`\`\`

#### user_sessions (用户会话表)

\`\`\`sql
CREATE TABLE `user_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `token` VARCHAR(500) NOT NULL COMMENT 'JWT Token',
  `refresh_token` VARCHAR(500) DEFAULT NULL COMMENT '刷新Token',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`(255)),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话表';
\`\`\`

### 2. 商品管理表

#### categories (商品分类表)

\`\`\`sql
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `code` VARCHAR(50) DEFAULT NULL COMMENT '分类编码',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';
\`\`\`

#### products (商品表)

\`\`\`sql
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `barcode` VARCHAR(50) DEFAULT NULL COMMENT '条形码',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `alias` VARCHAR(200) DEFAULT NULL COMMENT '商品别名',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  `unit` VARCHAR(20) NOT NULL DEFAULT '个' COMMENT '单位',
  `original_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '原价',
  `sale_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '售价',
  `member_price` DECIMAL(10,2) DEFAULT NULL COMMENT '会员价',
  `cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '成本',
  `min_stock` INT NOT NULL DEFAULT 0 COMMENT '最低库存',
  `can_discount` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否可打折',
  `is_gift` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否赠品',
  `is_sale_product` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否促销商品',
  `is_recommended` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否推荐',
  `show_to_consumer` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否对消费者可见',
  `image` VARCHAR(500) DEFAULT NULL COMMENT '商品图片',
  `description` TEXT DEFAULT NULL COMMENT '商品描述',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `flavors` JSON DEFAULT NULL COMMENT '口味选项',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_barcode` (`barcode`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`),
  KEY `idx_sale_price` (`sale_price`),
  FULLTEXT KEY `ft_name_alias` (`name`, `alias`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';
\`\`\`

#### suppliers (供应商表)

\`\`\`sql
CREATE TABLE `suppliers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `code` VARCHAR(50) NOT NULL COMMENT '供应商编码',
  `name` VARCHAR(200) NOT NULL COMMENT '供应商名称',
  `contact_person` VARCHAR(100) DEFAULT NULL COMMENT '联系人',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `bank_account` VARCHAR(100) DEFAULT NULL COMMENT '银行账号',
  `tax_number` VARCHAR(50) DEFAULT NULL COMMENT '税号',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';
\`\`\`

### 3. 库存管理表

#### warehouses (仓库表)

\`\`\`sql
CREATE TABLE `warehouses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '仓库ID',
  `code` VARCHAR(50) NOT NULL COMMENT '仓库编码',
  `name` VARCHAR(200) NOT NULL COMMENT '仓库名称',
  `type` ENUM('main', 'branch', 'virtual') NOT NULL DEFAULT 'main' COMMENT '仓库类型',
  `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `manager_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '管理员ID',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_manager_id` (`manager_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库表';
\`\`\`

#### inventory (库存表)

\`\`\`sql
CREATE TABLE `inventory` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '库存ID',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `warehouse_id` BIGINT UNSIGNED NOT NULL COMMENT '仓库ID',
  `quantity` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `available_quantity` INT NOT NULL DEFAULT 0 COMMENT '可用数量',
  `locked_quantity` INT NOT NULL DEFAULT 0 COMMENT '锁定数量',
  `avg_cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '平均成本',
  `last_inbound_date` DATETIME DEFAULT NULL COMMENT '最后入库时间',
  `last_outbound_date` DATETIME DEFAULT NULL COMMENT '最后出库时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_warehouse` (`product_id`, `warehouse_id`),
  KEY `idx_warehouse_id` (`warehouse_id`),
  KEY `idx_quantity` (`quantity`),
  CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_inventory_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='库存表';
\`\`\`

#### inventory_transactions (库存流水表)

\`\`\`sql
CREATE TABLE `inventory_transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `transaction_number` VARCHAR(50) NOT NULL COMMENT '流水单号',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `warehouse_id` BIGINT UNSIGNED NOT NULL COMMENT '仓库ID',
  `type` ENUM('inbound', 'outbound') NOT NULL COMMENT '类型',
  `sub_type` ENUM('purchase', 'return', 'transfer', 'sale', 'loss', 'adjustment') NOT NULL COMMENT '子类型',
  `quantity` INT NOT NULL COMMENT '数量',
  `before_quantity` INT NOT NULL COMMENT '变动前数量',
  `after_quantity` INT NOT NULL COMMENT '变动后数量',
  `cost` DECIMAL(10,2) DEFAULT NULL COMMENT '成本',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联单据ID',
  `operator_id` BIGINT UNSIGNED NOT NULL COMMENT '操作人ID',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_transaction_number` (`transaction_number`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_warehouse_id` (`warehouse_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_transactions_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_transactions_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='库存流水表';
\`\`\`

### 4. 包厢管理表

#### rooms (包厢表)

\`\`\`sql
CREATE TABLE `rooms` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '包厢ID',
  `number` VARCHAR(50) NOT NULL COMMENT '包厢号',
  `name` VARCHAR(100) DEFAULT NULL COMMENT '包厢名称',
  `type` ENUM('small', 'medium', 'large', 'vip', 'private') NOT NULL COMMENT '包厢类型',
  `area` VARCHAR(50) DEFAULT NULL COMMENT '区域',
  `floor` INT DEFAULT NULL COMMENT '楼层',
  `capacity` INT NOT NULL COMMENT '容纳人数',
  `hourly_rate` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '时租价格',
  `member_hourly_rate` DECIMAL(10,2) DEFAULT NULL COMMENT '会员时租价格',
  `min_consumption` DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低消费',
  `member_min_consumption` DECIMAL(10,2) DEFAULT NULL COMMENT '会员最低消费',
  `features` JSON DEFAULT NULL COMMENT '特色设施',
  `equipment` JSON DEFAULT NULL COMMENT '设备清单',
  `status` ENUM('available', 'occupied', 'cleaning', 'maintenance', 'reserved') NOT NULL DEFAULT 'available' COMMENT '状态',
  `current_order_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '当前订单ID',
  `last_cleaned_at` DATETIME DEFAULT NULL COMMENT '最后清洁时间',
  `maintenance_schedule` DATETIME DEFAULT NULL COMMENT '维护计划',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_number` (`number`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_area_floor` (`area`, `floor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='包厢表';
\`\`\`

#### room_usage_history (包厢使用历史表)

\`\`\`sql
CREATE TABLE `room_usage_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '历史ID',
  `room_id` BIGINT UNSIGNED NOT NULL COMMENT '包厢ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `start_time` DATETIME NOT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `duration` INT DEFAULT NULL COMMENT '时长(分钟)',
  `guest_count` INT DEFAULT NULL COMMENT '客人数量',
  `revenue` DECIMAL(10,2) DEFAULT 0.00 COMMENT '收入',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_start_time` (`start_time`),
  CONSTRAINT `fk_usage_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='包厢使用历史表';
\`\`\`

### 5. 订单管理表

#### orders (订单表)

\`\`\`sql
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_number` VARCHAR(50) NOT NULL COMMENT '订单号',
  `order_type` ENUM('dine_in', 'takeout', 'delivery', 'room_service') NOT NULL COMMENT '订单类型',
  `room_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '包厢ID',
  `customer_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '会员ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `status` ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '小计',
  `discount_type` ENUM('percentage', 'amount', 'none') DEFAULT 'none' COMMENT '折扣类型',
  `discount_value` DECIMAL(10,2) DEFAULT 0.00 COMMENT '折扣值',
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '折扣金额',
  `service_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '服务费',
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '税费',
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '总金额',
  `payment_status` ENUM('unpaid', 'partial', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid' COMMENT '支付状态',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT '支付方式',
  `delivery_address` JSON DEFAULT NULL COMMENT '配送地址',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_number` (`order_number`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_orders_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';
\`\`\`

#### order_items (订单明细表)

\`\`\`sql
CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `quantity` INT NOT NULL COMMENT '数量',
  `unit_price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `discount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '折扣',
  `actual_price` DECIMAL(10,2) NOT NULL COMMENT '实际价格',
  `flavors` JSON DEFAULT NULL COMMENT '口味',
  `status` ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';
\`\`\`

#### order_timeline (订单时间线表)

\`\`\`sql
CREATE TABLE `order_timeline` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '时间线ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `action` VARCHAR(100) NOT NULL COMMENT '操作',
  `operator_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '操作人ID',
  `operator_name` VARCHAR(100) DEFAULT NULL COMMENT '操作人姓名',
  `details` TEXT DEFAULT NULL COMMENT '详情',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_timeline_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单时间线表';
\`\`\`

### 6. 会员管理表

#### members (会员表)

\`\`\`sql
CREATE TABLE `members` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  `member_number` VARCHAR(50) NOT NULL COMMENT '会员号',
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `gender` ENUM('male', 'female') DEFAULT NULL COMMENT '性别',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `level_id` BIGINT UNSIGNED NOT NULL COMMENT '等级ID',
  `points` INT NOT NULL DEFAULT 0 COMMENT '积分',
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '余额',
  `total_consumption` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费',
  `total_orders` INT NOT NULL DEFAULT 0 COMMENT '订单数量',
  `avg_order_value` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '平均客单价',
  `last_visit` DATETIME DEFAULT NULL COMMENT '最后到访',
  `join_date` DATE NOT NULL COMMENT '加入日期',
  `expiry_date` DATE DEFAULT NULL COMMENT '到期日期',
  `status` ENUM('active', 'inactive', 'expired', 'blacklist') NOT NULL DEFAULT 'active' COMMENT '状态',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_member_number` (`member_number`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_level_id` (`level_id`),
  KEY `idx_status` (`status`),
  KEY `idx_points` (`points`),
  KEY `idx_balance` (`balance`),
  KEY `idx_join_date` (`join_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员表';
\`\`\`

#### member_levels (会员等级表)

\`\`\`sql
CREATE TABLE `member_levels` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '等级ID',
  `name` VARCHAR(50) NOT NULL COMMENT '等级名称',
  `code` VARCHAR(50) NOT NULL COMMENT '等级编码',
  `discount_rate` DECIMAL(5,2) NOT NULL DEFAULT 100.00 COMMENT '折扣率(%)',
  `min_consumption` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '最低消费要求',
  `points_rate` DECIMAL(5,2) NOT NULL DEFAULT 1.00 COMMENT '积分比例',
  `benefits` JSON DEFAULT NULL COMMENT '会员权益',
  `color` VARCHAR(20) DEFAULT NULL COMMENT '等级颜色',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '等级图标',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员等级表';
\`\`\`

#### member_balance_log (会员余额日志表)

\`\`\`sql
CREATE TABLE `member_balance_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `member_id` BIGINT UNSIGNED NOT NULL COMMENT '会员ID',
  `type` ENUM('recharge', 'consume', 'refund', 'adjustment', 'gift') NOT NULL COMMENT '类型',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额',
  `before_balance` DECIMAL(10,2) NOT NULL COMMENT '变动前余额',
  `after_balance` DECIMAL(10,2) NOT NULL COMMENT '变动后余额',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT '支付方式',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联单据ID',
  `operator_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '操作人ID',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_balance_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员余额日志表';
\`\`\`

#### member_points_log (会员积分日志表)

\`\`\`sql
CREATE TABLE `member_points_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `member_id` BIGINT UNSIGNED NOT NULL COMMENT '会员ID',
  `type` ENUM('earn', 'spend', 'expire', 'adjustment', 'gift') NOT NULL COMMENT '类型',
  `points` INT NOT NULL COMMENT '积分',
  `before_points` INT NOT NULL COMMENT '变动前积分',
  `after_points` INT NOT NULL COMMENT '变动后积分',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联单据ID',
  `expire_date` DATE DEFAULT NULL COMMENT '过期日期',
  `operator_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '操作人ID',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_type` (`type`),
  KEY `idx_expire_date` (`expire_date`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_points_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员积分日志表';
\`\`\`

### 7. 支付管理表

#### payments (支付表)

\`\`\`sql
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '支付ID',
  `payment_number` VARCHAR(50) NOT NULL COMMENT '支付单号',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `member_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '会员ID',
  `payment_method` ENUM('cash', 'card', 'wechat', 'alipay', 'member') NOT NULL COMMENT '支付方式',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `status` ENUM('pending', 'success', 'failed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `transaction_id` VARCHAR(100) DEFAULT NULL COMMENT '第三方交易号',
  `qr_code_url` VARCHAR(500) DEFAULT NULL COMMENT '二维码URL',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `refunded_at` DATETIME DEFAULT NULL COMMENT '退款时间',
  `refund_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退款金额',
  `refund_reason` TEXT DEFAULT NULL COMMENT '退款原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_number` (`payment_number`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_payment_method` (`payment_method`),
  KEY `idx_status` (`status`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付表';
\`\`\`

### 8. AI运营系统表

#### ai_recommendations (AI推荐表)

\`\`\`sql
CREATE TABLE `ai_recommendations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '推荐ID',
  `module` VARCHAR(50) NOT NULL COMMENT '模块(M7.1-M7.9)',
  `type` VARCHAR(50) NOT NULL COMMENT '推荐类型',
  `target_type` VARCHAR(50) NOT NULL COMMENT '目标类型',
  `target_id` VARCHAR(100) NOT NULL COMMENT '目标ID',
  `content` JSON NOT NULL COMMENT '推荐内容',
  `confidence` DECIMAL(5,4) NOT NULL DEFAULT 0.0000 COMMENT '置信度',
  `priority` ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium' COMMENT '优先级',
  `status` ENUM('pending', 'active', 'completed', 'expired') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `executed_at` DATETIME DEFAULT NULL COMMENT '执行时间',
  `result` JSON DEFAULT NULL COMMENT '执行结果',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `expires_at` DATETIME DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`id`),
  KEY `idx_module` (`module`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI推荐表';
\`\`\`

#### ai_predictions (AI预测表)

\`\`\`sql
CREATE TABLE `ai_predictions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '预测ID',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `prediction_type` VARCHAR(50) NOT NULL COMMENT '预测类型',
  `target_date` DATE NOT NULL COMMENT '目标日期',
  `prediction_data` JSON NOT NULL COMMENT '预测数据',
  `actual_data` JSON DEFAULT NULL COMMENT '实际数据',
  `accuracy` DECIMAL(5,2) DEFAULT NULL COMMENT '准确率(%)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_module` (`module`),
  KEY `idx_target_date` (`target_date`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI预测表';
\`\`\`

#### marketing_campaigns (营销活动表)

\`\`\`sql
CREATE TABLE `marketing_campaigns` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `campaign_number` VARCHAR(50) NOT NULL COMMENT '活动编号',
  `name` VARCHAR(200) NOT NULL COMMENT '活动名称',
  `type` VARCHAR(50) NOT NULL COMMENT '活动类型',
  `channels` JSON NOT NULL COMMENT '推送渠道',
  `target_audience` JSON NOT NULL COMMENT '目标受众',
  `content` JSON NOT NULL COMMENT '活动内容',
  `budget` DECIMAL(10,2) DEFAULT 0.00 COMMENT '预算',
  `actual_cost` DECIMAL(10,2) DEFAULT 0.00 COMMENT '实际成本',
  `target_reach` INT DEFAULT 0 COMMENT '目标触达',
  `actual_reach` INT DEFAULT 0 COMMENT '实际触达',
  `conversion_count` INT DEFAULT 0 COMMENT '转化数量',
  `conversion_rate` DECIMAL(5,2) DEFAULT 0.00 COMMENT '转化率(%)',
  `revenue` DECIMAL(10,2) DEFAULT 0.00 COMMENT '收入',
  `roi` DECIMAL(10,2) DEFAULT 0.00 COMMENT '投资回报率',
  `start_date` DATETIME NOT NULL COMMENT '开始时间',
  `end_date` DATETIME NOT NULL COMMENT '结束时间',
  `status` ENUM('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_number` (`campaign_number`),
  KEY `idx_status` (`status`),
  KEY `idx_start_date` (`start_date`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='营销活动表';
\`\`\`

---

## yyc3_hr 人力资源库

### 1. 员工信息表

#### hr_employees (员工信息表)

\`\`\`sql
CREATE TABLE `hr_employees` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '员工ID',
  `employee_number` VARCHAR(50) NOT NULL COMMENT '工号',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联用户ID(yyc3_yy.users)',
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `id_card` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `gender` ENUM('male', 'female') DEFAULT NULL COMMENT '性别',
  `birthday` DATE DEFAULT NULL COMMENT '出生日期',
  `nationality` VARCHAR(50) DEFAULT '中国' COMMENT '国籍',
  `education` ENUM('primary', 'middle', 'high', 'associate', 'bachelor', 'master', 'doctor') DEFAULT NULL COMMENT '学历',
  `marital_status` ENUM('single', 'married', 'divorced', 'widowed') DEFAULT NULL COMMENT '婚姻状况',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `department_id` BIGINT UNSIGNED NOT NULL COMMENT '部门ID',
  `position` VARCHAR(100) NOT NULL COMMENT '职位',
  `employee_type` ENUM('full_time', 'part_time', 'contract', 'intern') NOT NULL DEFAULT 'full_time' COMMENT '员工类型',
  `work_location` VARCHAR(200) DEFAULT NULL COMMENT '工作地点',
  `hire_date` DATE NOT NULL COMMENT '入职日期',
  `probation_end_date` DATE DEFAULT NULL COMMENT '试用期结束日期',
  `contract_start_date` DATE DEFAULT NULL COMMENT '合同开始日期',
  `contract_end_date` DATE DEFAULT NULL COMMENT '合同结束日期',
  `resignation_date` DATE DEFAULT NULL COMMENT '离职日期',
  `status` ENUM('active', 'inactive', 'on_leave', 'resigned') NOT NULL DEFAULT 'active' COMMENT '状态',
  `emergency_contact_name` VARCHAR(100) DEFAULT NULL COMMENT '紧急联系人',
  `emergency_contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '紧急联系电话',
  `emergency_contact_relationship` VARCHAR(50) DEFAULT NULL COMMENT '紧急联系人关系',
  `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `bank_name` VARCHAR(100) DEFAULT NULL COMMENT '开户银行',
  `bank_account` VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
  `social_security_number` VARCHAR(50) DEFAULT NULL COMMENT '社保号',
  `provident_fund_account` VARCHAR(50) DEFAULT NULL COMMENT '公积金账号',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_number` (`employee_number`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_status` (`status`),
  KEY `idx_hire_date` (`hire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工信息表';
\`\`\`

#### hr_departments (部门表)

\`\`\`sql
CREATE TABLE `hr_departments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '上级部门ID',
  `name` VARCHAR(100) NOT NULL COMMENT '部门名称',
  `code` VARCHAR(50) NOT NULL COMMENT '部门编码',
  `manager_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '部门经理ID',
  `description` TEXT DEFAULT NULL COMMENT '部门描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_manager_id` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';
\`\`\`

### 2. 考勤管理表

#### hr_attendance (考勤记录表)

\`\`\`sql
CREATE TABLE `hr_attendance` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '考勤ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `date` DATE NOT NULL COMMENT '日期',
  `shift_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '班次ID',
  `check_in_time` DATETIME DEFAULT NULL COMMENT '签到时间',
  `check_in_location` VARCHAR(200) DEFAULT NULL COMMENT '签到地点',
  `check_in_latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '签到纬度',
  `check_in_longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '签到经度',
  `check_out_time` DATETIME DEFAULT NULL COMMENT '签退时间',
  `check_out_location` VARCHAR(200) DEFAULT NULL COMMENT '签退地点',
  `check_out_latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '签退纬度',
  `check_out_longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '签退经度',
  `work_hours` DECIMAL(5,2) DEFAULT 0.00 COMMENT '工作时长(小时)',
  `overtime_hours` DECIMAL(5,2) DEFAULT 0.00 COMMENT '加班时长(小时)',
  `status` ENUM('normal', 'late', 'early', 'absent', 'leave') NOT NULL DEFAULT 'normal' COMMENT '状态',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_date` (`employee_id`, `date`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='考勤记录表';
\`\`\`

#### hr_shifts (班次表)

\`\`\`sql
CREATE TABLE `hr_shifts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '班次ID',
  `name` VARCHAR(100) NOT NULL COMMENT '班次名称',
  `code` VARCHAR(50) NOT NULL COMMENT '班次编码',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `work_hours` DECIMAL(5,2) NOT NULL COMMENT '工作时长(小时)',
  `late_tolerance` INT NOT NULL DEFAULT 0 COMMENT '迟到容忍(分钟)',
  `early_tolerance` INT NOT NULL DEFAULT 0 COMMENT '早退容忍(分钟)',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班次表';
\`\`\`

#### hr_leaves (请假记录表)

\`\`\`sql
CREATE TABLE `hr_leaves` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '请假ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `leave_type` ENUM('annual', 'sick', 'personal', 'maternity', 'paternity', 'marriage', 'bereavement', 'other') NOT NULL COMMENT '请假类型',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `end_date` DATE NOT NULL COMMENT '结束日期',
  `duration` DECIMAL(5,2) NOT NULL COMMENT '时长(天)',
  `reason` TEXT NOT NULL COMMENT '请假原因',
  `attachments` JSON DEFAULT NULL COMMENT '附件',
  `status` ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `approver_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '审批人ID',
  `approved_at` DATETIME DEFAULT NULL COMMENT '审批时间',
  `reject_reason` TEXT DEFAULT NULL COMMENT '拒绝原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_start_date` (`start_date`),
  CONSTRAINT `fk_leaves_employee` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='请假记录表';
\`\`\`

### 3. 薪资管理表

#### hr_salaries (薪资表)

\`\`\`sql
CREATE TABLE `hr_salaries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '薪资ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `year_month` VARCHAR(7) NOT NULL COMMENT '年月(YYYY-MM)',
  `base_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '基本工资',
  `performance_bonus` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '绩效奖金',
  `attendance_bonus` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '全勤奖',
  `overtime_pay` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '加班费',
  `commission` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '提成',
  `allowances` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '津贴补助',
  `gross_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '应发工资',
  `social_security` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '社保',
  `provident_fund` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '公积金',
  `income_tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '个人所得税',
  `deductions` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '其他扣款',
  `net_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '实发工资',
  `payment_status` ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
  `payment_date` DATE DEFAULT NULL COMMENT '支付日期',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_yearmonth` (`employee_id`, `year_month`),
  KEY `idx_year_month` (`year_month`),
  KEY `idx_payment_status` (`payment_status`),
  CONSTRAINT `fk_salaries_employee` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='薪资表';
\`\`\`

### 4. 绩效考核表

#### hr_performance (绩效记录表)

\`\`\`sql
CREATE TABLE `hr_performance` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '绩效ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `period` VARCHAR(20) NOT NULL COMMENT '考核周期',
  `period_type` ENUM('monthly', 'quarterly', 'annual') NOT NULL COMMENT '周期类型',
  `kpi_scores` JSON NOT NULL COMMENT 'KPI得分',
  `total_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '总分',
  `rating` ENUM('excellent', 'good', 'average', 'poor') DEFAULT NULL COMMENT '评级',
  `feedback` TEXT DEFAULT NULL COMMENT '评价反馈',
  `reviewer_id` BIGINT UNSIGNED NOT NULL COMMENT '考核人ID',
  `status` ENUM('draft', 'submitted', 'reviewed', 'confirmed') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_period` (`period`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_performance_employee` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='绩效记录表';
\`\`\`

### 5. 培训管理表

#### hr_trainings (培训记录表)

\`\`\`sql
CREATE TABLE `hr_trainings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '培训ID',
  `name` VARCHAR(200) NOT NULL COMMENT '培训名称',
  `type` ENUM('onboarding', 'skill', 'management', 'safety', 'other') NOT NULL COMMENT '培训类型',
  `trainer` VARCHAR(100) DEFAULT NULL COMMENT '培训师',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `end_date` DATE NOT NULL COMMENT '结束日期',
  `location` VARCHAR(200) DEFAULT NULL COMMENT '培训地点',
  `description` TEXT DEFAULT NULL COMMENT '培训描述',
  `capacity` INT DEFAULT NULL COMMENT '容纳人数',
  `status` ENUM('scheduled', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_start_date` (`start_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='培训记录表';
\`\`\`

#### hr_training_participants (培训参与者表)

\`\`\`sql
CREATE TABLE `hr_training_participants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `training_id` BIGINT UNSIGNED NOT NULL COMMENT '培训ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `attendance_status` ENUM('registered', 'attended', 'absent', 'cancelled') NOT NULL DEFAULT 'registered' COMMENT '出席状态',
  `score` DECIMAL(5,2) DEFAULT NULL COMMENT '考核分数',
  `passed` TINYINT(1) DEFAULT NULL COMMENT '是否通过',
  `certificate_url` VARCHAR(500) DEFAULT NULL COMMENT '证书URL',
  `feedback` TEXT DEFAULT NULL COMMENT '反馈',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_training_employee` (`training_id`, `employee_id`),
  KEY `idx_employee_id` (`employee_id`),
  CONSTRAINT `fk_participants_training` FOREIGN KEY (`training_id`) REFERENCES `hr_trainings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_participants_employee` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='培训参与者表';
\`\`\`

---

## yyc3_audit 审计日志库

### 1. 操作日志表

#### audit_logs (操作日志表)

\`\`\`sql
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `username` VARCHAR(100) DEFAULT NULL COMMENT '用户名',
  `action` VARCHAR(100) NOT NULL COMMENT '操作动作',
  `resource_type` VARCHAR(50) NOT NULL COMMENT '资源类型',
  `resource_id` VARCHAR(100) DEFAULT NULL COMMENT '资源ID',
  `method` VARCHAR(10) NOT NULL COMMENT '请求方法',
  `url` VARCHAR(500) NOT NULL COMMENT '请求URL',
  `ip_address` VARCHAR(45) NOT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `request_body` JSON DEFAULT NULL COMMENT '请求体',
  `response_code` INT DEFAULT NULL COMMENT '响应码',
  `response_message` TEXT DEFAULT NULL COMMENT '响应消息',
  `duration_ms` INT DEFAULT NULL COMMENT '耗时(毫秒)',
  `status` ENUM('success', 'failed', 'error') NOT NULL COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_resource_type` (`resource_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';
\`\`\`

### 2. 数据变更日志表

#### audit_data_changes (数据变更日志表)

\`\`\`sql
CREATE TABLE `audit_data_changes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '变更ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `database_name` VARCHAR(100) NOT NULL COMMENT '数据库名',
  `table_name` VARCHAR(100) NOT NULL COMMENT '表名',
  `operation` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL COMMENT '操作类型',
  `record_id` VARCHAR(100) NOT NULL COMMENT '记录ID',
  `before_data` JSON DEFAULT NULL COMMENT '变更前数据',
  `after_data` JSON DEFAULT NULL COMMENT '变更后数据',
  `changed_fields` JSON DEFAULT NULL COMMENT '变更字段',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_table_name` (`table_name`),
  KEY `idx_operation` (`operation`),
  KEY `idx_record_id` (`record_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据变更日志表';
\`\`\`

### 3. 登录日志表

#### audit_login_logs (登录日志表)

\`\`\`sql
CREATE TABLE `audit_login_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `username` VARCHAR(100) NOT NULL COMMENT '用户名',
  `login_type` ENUM('password', 'sms', 'wechat', 'other') NOT NULL COMMENT '登录方式',
  `ip_address` VARCHAR(45) NOT NULL COMMENT 'IP地址',
  `location` VARCHAR(200) DEFAULT NULL COMMENT '登录地点',
  `device_type` VARCHAR(50) DEFAULT NULL COMMENT '设备类型',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `status` ENUM('success', 'failed') NOT NULL COMMENT '状态',
  `fail_reason` VARCHAR(500) DEFAULT NULL COMMENT '失败原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';
\`\`\`

### 4. 系统审计表

#### audit_system_events (系统事件表)

\`\`\`sql
CREATE TABLE `audit_system_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '事件ID',
  `event_type` VARCHAR(100) NOT NULL COMMENT '事件类型',
  `severity` ENUM('info', 'warning', 'error', 'critical') NOT NULL DEFAULT 'info' COMMENT '严重程度',
  `module` VARCHAR(100) NOT NULL COMMENT '模块',
  `message` TEXT NOT NULL COMMENT '消息',
  `details` JSON DEFAULT NULL COMMENT '详情',
  `stack_trace` TEXT DEFAULT NULL COMMENT '堆栈跟踪',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
  `resolved` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已解决',
  `resolved_at` DATETIME DEFAULT NULL COMMENT '解决时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_severity` (`severity`),
  KEY `idx_module` (`module`),
  KEY `idx_resolved` (`resolved`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统事件表';
\`\`\`

---

## 索引设计

### 索引设计原则

1. **主键索引**: 所有表使用自增BIGINT作为主键
2. **唯一索引**: 用于保证数据唯一性（如用户名、手机号、订单号等）
3. **普通索引**: 用于提高查询性能（如状态、日期、外键等）
4. **全文索引**: 用于全文搜索（如商品名称、描述）
5. **组合索引**: 根据查询频率设计（如员工ID+日期、商品ID+仓库ID）

### 关键索引说明

#### yyc3_yy 核心索引

\`\`\`sql
-- 用户表
ALTER TABLE users ADD INDEX idx_role_status (role, status);
ALTER TABLE users ADD INDEX idx_last_login (last_login_at);

-- 商品表
ALTER TABLE products ADD INDEX idx_category_status (category_id, status);
ALTER TABLE products ADD INDEX idx_price_range (sale_price, status);

-- 订单表
ALTER TABLE orders ADD INDEX idx_customer_date (customer_id, created_at);
ALTER TABLE orders ADD INDEX idx_status_date (status, created_at);
ALTER TABLE orders ADD INDEX idx_payment_status (payment_status, status);

-- 库存表
ALTER TABLE inventory ADD INDEX idx_warehouse_quantity (warehouse_id, quantity);
ALTER TABLE inventory ADD INDEX idx_low_stock (quantity, product_id);

-- 包厢表
ALTER TABLE rooms ADD INDEX idx_status_type (status, type);

-- 会员表
ALTER TABLE members ADD INDEX idx_level_status (level_id, status);
ALTER TABLE members ADD INDEX idx_points_balance (points, balance);
\`\`\`

#### yyc3_hr 核心索引

\`\`\`sql
-- 员工表
ALTER TABLE hr_employees ADD INDEX idx_department_status (department_id, status);
ALTER TABLE hr_employees ADD INDEX idx_hire_date (hire_date);

-- 考勤表
ALTER TABLE hr_attendance ADD INDEX idx_employee_date (employee_id, date);
ALTER TABLE hr_attendance ADD INDEX idx_date_status (date, status);

-- 薪资表
ALTER TABLE hr_salaries ADD INDEX idx_yearmonth_status (year_month, payment_status);
\`\`\`

#### yyc3_audit 核心索引

\`\`\`sql
-- 操作日志表
ALTER TABLE audit_logs ADD INDEX idx_user_action (user_id, action);
ALTER TABLE audit_logs ADD INDEX idx_resource (resource_type, resource_id);
ALTER TABLE audit_logs ADD INDEX idx_date_status (created_at, status);

-- 数据变更表
ALTER TABLE audit_data_changes ADD INDEX idx_table_operation (table_name, operation);
ALTER TABLE audit_data_changes ADD INDEX idx_record (table_name, record_id);
\`\`\`

---

## 关系图谱

### yyc3_yy 核心关系

\`\`\`
users (用户)
  ├─→ user_permissions (权限)
  ├─→ user_sessions (会话)
  ├─→ orders (订单，作为员工)
  └─→ audit_logs (操作日志)

products (商品)
  ├─→ categories (分类)
  ├─→ inventory (库存)
  ├─→ order_items (订单明细)
  └─→ suppliers (供应商，多对多)

orders (订单)
  ├─→ order_items (订单明细)
  ├─→ order_timeline (时间线)
  ├─→ payments (支付)
  ├─→ members (会员)
  ├─→ rooms (包厢)
  └─→ users (员工)

members (会员)
  ├─→ member_levels (等级)
  ├─→ member_balance_log (余额日志)
  ├─→ member_points_log (积分日志)
  └─→ orders (订单)

rooms (包厢)
  ├─→ orders (订单)
  └─→ room_usage_history (使用历史)

warehouses (仓库)
  ├─→ inventory (库存)
  └─→ inventory_transactions (流水)
\`\`\`

### yyc3_hr 核心关系

\`\`\`
hr_employees (员工)
  ├─→ hr_departments (部门)
  ├─→ hr_attendance (考勤)
  ├─→ hr_leaves (请假)
  ├─→ hr_salaries (薪资)
  ├─→ hr_performance (绩效)
  └─→ hr_training_participants (培训)

hr_trainings (培训)
  └─→ hr_training_participants (参与者)
\`\`\`

### 跨库关联

\`\`\`
yyc3_yy.users.id → yyc3_hr.hr_employees.user_id
yyc3_yy.users.id → yyc3_audit.audit_logs.user_id
yyc3_yy.users.id → yyc3_audit.audit_data_changes.user_id
\`\`\`

**注意**: 跨库关联使用应用层JOIN，不使用物理外键。

---

## 数据迁移

### 初始化脚本

#### 1. 创建数据库

\`\`\`sql
-- 创建 yyc3_yy 数据库
CREATE DATABASE IF NOT EXISTS `yyc3_yy` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 创建 yyc3_hr 数据库
CREATE DATABASE IF NOT EXISTS `yyc3_hr` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 创建 yyc3_audit 数据库
CREATE DATABASE IF NOT EXISTS `yyc3_audit` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;
\`\`\`

#### 2. 创建用户并授权

\`\`\`sql
-- 创建用户
CREATE USER IF NOT EXISTS 'devuser'@'localhost' IDENTIFIED BY 'devpassword';
CREATE USER IF NOT EXISTS 'hr_admin'@'localhost' IDENTIFIED BY 'secure_hr_pass';
CREATE USER IF NOT EXISTS 'audit_user'@'localhost' IDENTIFIED BY 'secure_audit_pass';

-- 授权 yyc3_yy
GRANT ALL PRIVILEGES ON yyc3_yy.* TO 'devuser'@'localhost';

-- 授权 yyc3_hr
GRANT ALL PRIVILEGES ON yyc3_hr.* TO 'hr_admin'@'localhost';

-- 授权 yyc3_audit
GRANT ALL PRIVILEGES ON yyc3_audit.* TO 'audit_user'@'localhost';

FLUSH PRIVILEGES;
\`\`\`

#### 3. 导入表结构

\`\`\`bash
# 导入 yyc3_yy 表结构
mysql -u devuser -p yyc3_yy < scripts/sql/yyc3_yy_schema.sql

# 导入 yyc3_hr 表结构
mysql -u hr_admin -p yyc3_hr < scripts/sql/yyc3_hr_schema.sql

# 导入 yyc3_audit 表结构
mysql -u audit_user -p yyc3_audit < scripts/sql/yyc3_audit_schema.sql
\`\`\`

### 初始化数据

#### 插入默认管理员

\`\`\`sql
USE yyc3_yy;

-- 插入默认管理员 (密码: admin123，需使用bcrypt加密)
INSERT INTO users (username, password, name, phone, email, role, status)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '系统管理员', '13800138000', 'admin@ktv.com', 'admin', 'active');

-- 插入会员等级
INSERT INTO member_levels (name, code, discount_rate, min_consumption, points_rate, sort_order)
VALUES 
  ('普通会员', 'NORMAL', 100.00, 0.00, 1.00, 1),
  ('银卡会员', 'SILVER', 95.00, 1000.00, 1.20, 2),
  ('金卡会员', 'GOLD', 90.00, 5000.00, 1.50, 3),
  ('钻石会员', 'DIAMOND', 85.00, 10000.00, 2.00, 4),
  ('至尊会员', 'PLATINUM', 80.00, 50000.00, 3.00, 5);

-- 插入商品分类
INSERT INTO categories (name, code, sort_order)
VALUES
  ('酒水', 'DRINKS', 1),
  ('小食', 'SNACKS', 2),
  ('果盘', 'FRUITS', 3),
  ('套餐', 'PACKAGES', 4);

-- 插入仓库
INSERT INTO warehouses (code, name, type, status)
VALUES ('WH001', '主仓库', 'main', 'active');
\`\`\`

#### 插入测试数据

\`\`\`sql
-- 插入测试商品
INSERT INTO products (barcode, name, category_id, unit, original_price, sale_price, member_price, cost, status)
SELECT 
  CONCAT('BAR', LPAD(n, 6, '0')),
  CONCAT('商品', n),
  (n % 4) + 1,
  '个',
  ROUND(20 + RAND() * 80, 2),
  ROUND(15 + RAND() * 60, 2),
  ROUND(12 + RAND() * 50, 2),
  ROUND(8 + RAND() * 30, 2),
  'active'
FROM (
  SELECT @row := @row + 1 AS n
  FROM (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) t1,
       (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) t2,
       (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) t3,
       (SELECT @row := 0) t4
  LIMIT 100
) numbers;

-- 插入包厢
INSERT INTO rooms (number, name, type, area, floor, capacity, hourly_rate, member_hourly_rate, status)
VALUES
  ('A001', '豪华包厢A', 'vip', 'A区', 1, 8, 200.00, 180.00, 'available'),
  ('A002', '豪华包厢B', 'vip', 'A区', 1, 8, 200.00, 180.00, 'available'),
  ('B001', '标准包厢A', 'medium', 'B区', 2, 6, 150.00, 135.00, 'available'),
  ('B002', '标准包厢B', 'medium', 'B区', 2, 6, 150.00, 135.00, 'available'),
  ('C001', '小包厢A', 'small', 'C区', 3, 4, 100.00, 90.00, 'available');
\`\`\`

### 数据迁移工具

\`\`\`bash
# 创建迁移脚本目录
mkdir -p scripts/migrations

# 迁移脚本命名规范：YYYYMMDDHHMMSS_description.sql
# 例如：20250118120000_create_users_table.sql
\`\`\`

---

## 性能优化

### 1. 查询优化

#### 使用索引

\`\`\`sql
-- ❌ 避免：全表扫描
SELECT * FROM orders WHERE DATE(created_at) = '2025-01-18';

-- ✅ 推荐：使用索引
SELECT * FROM orders 
WHERE created_at >= '2025-01-18 00:00:00' 
  AND created_at < '2025-01-19 00:00:00';
\`\`\`

#### 避免SELECT *

\`\`\`sql
-- ❌ 避免
SELECT * FROM products WHERE status = 'active';

-- ✅ 推荐
SELECT id, name, sale_price, stock FROM products WHERE status = 'active';
\`\`\`

#### 使用LIMIT分页

\`\`\`sql
-- ✅ 分页查询
SELECT id, name, phone FROM members 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
\`\`\`

### 2. 表结构优化

#### 垂直分表

\`\`\`sql
-- 将大字段分离到扩展表
CREATE TABLE products_extended (
  product_id BIGINT UNSIGNED NOT NULL,
  description TEXT,
  specifications JSON,
  images JSON,
  PRIMARY KEY (product_id),
  CONSTRAINT fk_extended_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;
\`\`\`

#### 读写分离

\`\`\`ini
# 主库：写操作
MASTER_DB_HOST=master.db.local

# 从库：读操作
SLAVE_DB_HOST=slave.db.local
\`\`\`

### 3. 缓存策略

#### Redis缓存热点数据

\`\`\`typescript
// 缓存商品信息
const cacheKey = `product:${productId}`
await redis.setex(cacheKey, 3600, JSON.stringify(product))

// 缓存包厢状态
const roomCacheKey = `rooms:status`
await redis.setex(roomCacheKey, 60, JSON.stringify(roomsStatus))
\`\`\`

### 4. 分区表

#### 按时间分区（订单表）

\`\`\`sql
-- 创建分区表
CREATE TABLE orders_partitioned (
  -- 字段定义同orders表
  ...
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
\`\`\`

### 5. 定期维护

\`\`\`sql
-- 分析表
ANALYZE TABLE orders, order_items, products;

-- 优化表
OPTIMIZE TABLE audit_logs;

-- 检查碎片
SELECT 
  TABLE_NAME,
  DATA_FREE / 1024 / 1024 AS data_free_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'yyc3_yy'
  AND DATA_FREE > 0
ORDER BY DATA_FREE DESC;
\`\`\`

---

## 备份策略

### 1. 全量备份

\`\`\`bash
#!/bin/bash
# 每日全量备份脚本

BACKUP_DIR="/data/backups/mysql"
DATE=$(date +%Y%m%d)

# 备份 yyc3_yy
mysqldump -u devuser -p'devpassword' \
  --single-transaction \
  --routines \
  --triggers \
  yyc3_yy > ${BACKUP_DIR}/yyc3_yy_${DATE}.sql

# 备份 yyc3_hr
mysqldump -u hr_admin -p'secure_hr_pass' \
  --single-transaction \
  yyc3_hr > ${BACKUP_DIR}/yyc3_hr_${DATE}.sql

# 备份 yyc3_audit
mysqldump -u audit_user -p'secure_audit_pass' \
  --single-transaction \
  yyc3_audit > ${BACKUP_DIR}/yyc3_audit_${DATE}.sql

# 压缩备份文件
gzip ${BACKUP_DIR}/*_${DATE}.sql

# 删除7天前的备份
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete
\`\`\`

### 2. 增量备份

\`\`\`bash
# 启用binlog
[mysqld]
server-id=1
log_bin=/var/log/mysql/mysql-bin.log
binlog_format=ROW
expire_logs_days=7

# 备份binlog
mysqlbinlog mysql-bin.000001 > binlog_backup.sql
\`\`\`

### 3. 备份恢复

\`\`\`bash
# 恢复全量备份
gunzip < yyc3_yy_20250118.sql.gz | mysql -u devuser -p yyc3_yy

# 恢复增量备份
mysqlbinlog binlog_backup.sql | mysql -u devuser -p yyc3_yy
\`\`\`

### 4. 云备份

\`\`\`bash
# 上传到阿里云OSS
ossutil cp ${BACKUP_DIR}/yyc3_yy_${DATE}.sql.gz \
  oss://ktv-backups/mysql/

# 上传到AWS S3
aws s3 cp ${BACKUP_DIR}/yyc3_yy_${DATE}.sql.gz \
  s3://ktv-backups/mysql/
\`\`\`

---

## 监控与告警

### 1. 性能监控

\`\`\`sql
-- 查看慢查询
SELECT * FROM mysql.slow_log 
WHERE query_time > 1
ORDER BY start_time DESC 
LIMIT 10;

-- 查看表大小
SELECT 
  TABLE_NAME,
  ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS size_mb,
  TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'yyc3_yy'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 查看索引使用情况
SELECT 
  TABLE_NAME,
  INDEX_NAME,
  SEQ_IN_INDEX,
  COLUMN_NAME
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'yyc3_yy'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
\`\`\`

### 2. 连接监控

\`\`\`sql
-- 查看当前连接
SHOW PROCESSLIST;

-- 查看连接数统计
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
SHOW VARIABLES LIKE 'max_connections';
\`\`\`

### 3. 磁盘监控

\`\`\`bash
# 查看数据库目录大小
du -sh /var/lib/mysql/*

# 查看磁盘空间
df -h
\`\`\`

---

## 数据字典

完整的数据字典已生成，包含所有表的字段说明、类型、约束等信息。

可通过以下查询导出：

\`\`\`sql
SELECT 
  TABLE_NAME AS '表名',
  COLUMN_NAME AS '字段名',
  COLUMN_TYPE AS '类型',
  IS_NULLABLE AS '允许空',
  COLUMN_KEY AS '键',
  COLUMN_DEFAULT AS '默认值',
  COLUMN_COMMENT AS '说明'
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'yyc3_yy'
ORDER BY TABLE_NAME, ORDINAL_POSITION;
\`\`\`

---

## 附录

### 常用SQL示例

#### 1. 统计报表查询

\`\`\`sql
-- 今日销售统计
SELECT 
  COUNT(*) AS order_count,
  SUM(total) AS total_sales,
  AVG(total) AS avg_order_value
FROM orders
WHERE DATE(created_at) = CURDATE()
  AND status = 'completed';

-- 商品销售排行
SELECT 
  p.id,
  p.name,
  SUM(oi.quantity) AS total_quantity,
  SUM(oi.subtotal) AS total_sales
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND o.status = 'completed'
GROUP BY p.id, p.name
ORDER BY total_sales DESC
LIMIT 10;
\`\`\`

#### 2. 库存预警查询

\`\`\`sql
-- 低库存商品
SELECT 
  p.id,
  p.name,
  i.quantity,
  p.min_stock,
  (p.min_stock - i.quantity) AS shortage
FROM products p
JOIN inventory i ON p.id = i.product_id
WHERE i.quantity < p.min_stock
  AND p.status = 'active'
ORDER BY shortage DESC;
\`\`\`

#### 3. 会员分析查询

\`\`\`sql
-- 活跃会员统计
SELECT 
  ml.name AS level_name,
  COUNT(*) AS member_count,
  SUM(m.total_consumption) AS total_consumption,
  AVG(m.avg_order_value) AS avg_order_value
FROM members m
JOIN member_levels ml ON m.level_id = ml.id
WHERE m.status = 'active'
  AND m.last_visit >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY ml.id, ml.name
ORDER BY ml.sort_order;
\`\`\`

---

## 版本历史

### v1.0.0 (2025-01-18)
- 初始版本发布
- 完成三个核心数据库设计
- 包含完整的表结构、索引和关系

---

## 技术支持

如有数据库相关问题，请联系：

- 📧 邮件: db-support@yyc3.com
- 📖 文档: [docs/INDEX.md](./INDEX.md)
- 💬 反馈: 请在项目Issue中提交

---

**文档版本**: v1.0  
**最后更新**: 2025-01-18  
**维护者**: 数据库团队  
**审核状态**: ✅ 已完成

© 2025 启智网络科技有限公司
