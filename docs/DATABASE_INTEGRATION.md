# 数据库集成文档

## 概述

本系统已集成MySQL数据库（yyc3_yy），支持完整的CRUD操作和事务处理。

## 数据库配置

### 环境变量

在 `.env.local` 文件中配置以下环境变量：

\`\`\`env
YYC3_YY_DB_HOST=your-host
YYC3_YY_DB_PORT=3306
YYC3_YY_DB_USER=your-user
YYC3_YY_DB_PASSWORD=your-password
YYC3_YY_DB_NAME=yyc3_yy
\`\`\`

### 连接池配置

系统使用 `mysql2/promise` 创建连接池，配置如下：

- 最大连接数：10
- 启用Keep-Alive
- 自动重连

## 数据库架构

### 核心表结构

#### products（商品表）

\`\`\`sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  alias VARCHAR(100),
  category VARCHAR(50),
  unit VARCHAR(20),
  original_price DECIMAL(10,2),
  price DECIMAL(10,2) NOT NULL,
  member_price DECIMAL(10,2),
  stock INT DEFAULT 0,
  min_stock INT DEFAULT 0,
  image VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_category (category),
  INDEX idx_status (status)
);
\`\`\`

#### orders（订单表）

\`\`\`sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  store_id VARCHAR(50),
  room_id VARCHAR(50),
  order_no VARCHAR(50) UNIQUE,
  type VARCHAR(20),
  total_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  status VARCHAR(20),
  payment_method VARCHAR(20),
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_order_no (order_no),
  INDEX idx_status (status)
);
\`\`\`

#### members（会员表）

\`\`\`sql
CREATE TABLE members (
  id VARCHAR(50) PRIMARY KEY,
  card_no VARCHAR(50) UNIQUE,
  name VARCHAR(50),
  phone VARCHAR(20),
  level VARCHAR(20),
  balance DECIMAL(10,2) DEFAULT 0,
  points INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_card_no (card_no),
  INDEX idx_phone (phone)
);
\`\`\`

## 数据仓库层（Repository Pattern）

### ProductRepository

提供商品数据访问方法：

- `findAll(params)` - 分页查询商品列表
- `findById(id)` - 根据ID查询商品
- `create(product)` - 创建商品
- `update(id, product)` - 更新商品
- `delete(id)` - 删除商品
- `updateStock(updates)` - 批量更新库存

### 使用示例

\`\`\`typescript
import { productRepository } from '@/lib/db/repositories/product-repository'

// 查询商品列表
const result = await productRepository.findAll({
  page: 1,
  pageSize: 10,
  category: '啤酒',
  search: '青岛',
})

// 创建商品
const product = await productRepository.create({
  name: '青岛啤酒',
  category: '啤酒',
  price: 10,
  // ...其他字段
})

// 更新库存
await productRepository.updateStock([
  { id: 'prod_1', quantity: -5 },
  { id: 'prod_2', quantity: 10 },
])
\`\`\`

## 事务处理

使用 `transaction` 函数处理需要原子性的操作：

\`\`\`typescript
import { transaction } from '@/lib/db/mysql'

await transaction(async (connection) => {
  // 扣减库存
  await connection.execute(
    'UPDATE products SET stock = stock - ? WHERE id = ?',
    [quantity, productId]
  )
  
  // 创建订单
  await connection.execute(
    'INSERT INTO orders (...) VALUES (...)',
    [...]
  )
})
\`\`\`

## 健康检查

系统提供数据库健康检查接口：

\`\`\`typescript
import { healthCheck } from '@/lib/db/mysql'

const isHealthy = await healthCheck()
\`\`\`

## 迁移和初始化

### 数据库迁移

创建迁移脚本在 `scripts/migrations/` 目录：

\`\`\`typescript
// scripts/migrations/001_create_products.ts
import { query } from '@/lib/db/mysql'

export async function up() {
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      ...
    )
  `)
}

export async function down() {
  await query('DROP TABLE IF EXISTS products')
}
\`\`\`

### 初始化数据

创建种子数据脚本在 `scripts/seeds/` 目录：

\`\`\`typescript
// scripts/seeds/products.ts
import { productRepository } from '@/lib/db/repositories/product-repository'

export async function seed() {
  await productRepository.create({
    name: '青岛啤酒',
    // ...
  })
}
\`\`\`

## 性能优化

### 索引策略

- 为常用查询字段添加索引
- 使用复合索引优化多条件查询
- 定期分析慢查询日志

### 连接池优化

- 根据并发量调整连接池大小
- 监控连接池使用情况
- 设置合理的超时时间

### 查询优化

- 使用分页避免大量数据查询
- 只查询需要的字段
- 使用JOIN代替多次查询

## 监控和日志

### 查询日志

所有数据库查询都会记录日志：

\`\`\`typescript
console.log('[v0] 执行查询:', sql, params)
\`\`\`

### 错误处理

数据库错误会被捕获并记录：

\`\`\`typescript
try {
  await query(sql, params)
} catch (error) {
  console.error('[v0] 数据库错误:', error)
  throw error
}
\`\`\`

## 最佳实践

1. **使用参数化查询**防止SQL注入
2. **使用事务**保证数据一致性
3. **合理使用索引**提升查询性能
4. **定期备份数据**防止数据丢失
5. **监控慢查询**及时优化性能
6. **使用连接池**提高并发性能
7. **实施读写分离**应对高并发场景

## 故障排查

### 连接失败

检查：
- 数据库服务是否启动
- 网络连接是否正常
- 用户名密码是否正确
- 防火墙设置

### 查询慢

检查：
- 是否缺少索引
- 是否有N+1查询问题
- 数据量是否过大
- 是否需要分页

### 死锁

检查：
- 事务是否过长
- 锁的顺序是否一致
- 是否需要优化事务逻辑
