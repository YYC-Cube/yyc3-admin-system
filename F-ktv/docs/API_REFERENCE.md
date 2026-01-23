# 📡 API完整参考文档

本文档提供启智KTV商家后台管理系统的完整API接口说明，所有接口均基于RESTful设计规范。

---

## 📑 目录

- [通用说明](#通用说明)
- [认证授权](#认证授权)
- [销售管理](#销售管理)
- [商品管理](#商品管理)
- [仓库管理](#仓库管理)
- [包厢管理](#包厢管理)
- [订单管理](#订单管理)
- [会员管理](#会员管理)
- [员工管理](#员工管理)
- [报表中心](#报表中心)
- [AI运营系统](#ai运营系统)
- [支付系统](#支付系统)
- [系统设置](#系统设置)
- [错误码说明](#错误码说明)

---

## 通用说明

### 基础URL

\`\`\`
开发环境: http://localhost:3000/api
生产环境: https://api.yourdomain.com
\`\`\`

### 请求格式

所有POST/PUT请求的Content-Type为 `application/json`

### 响应格式

\`\`\`typescript
interface ApiResponse<T> {
  code: number        // 状态码: 200成功, 其他为错误码
  message: string     // 响应消息
  data?: T           // 响应数据
  timestamp: string   // 时间戳
}
\`\`\`

### 认证方式

使用JWT Token进行身份认证，在请求头中携带：

\`\`\`
Authorization: Bearer {token}
\`\`\`

### 分页参数

\`\`\`typescript
interface PaginationParams {
  page: number      // 页码，从1开始
  pageSize: number  // 每页数量，默认20，最大100
  sortBy?: string   // 排序字段
  order?: 'asc' | 'desc'  // 排序方向
}
\`\`\`

### 分页响应

\`\`\`typescript
interface PaginatedResponse<T> {
  items: T[]        // 数据列表
  total: number     // 总数
  page: number      // 当前页码
  pageSize: number  // 每页数量
  totalPages: number // 总页数
}
\`\`\`

---

## 认证授权

### 登录

**接口**: `POST /api/auth/login`

**请求体**:
\`\`\`typescript
{
  username: string   // 用户名或手机号
  password: string   // 密码
  loginType?: 'password' | 'sms' | 'wechat'  // 登录方式
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "登录成功",
  data: {
    token: string           // JWT Token
    refreshToken: string    // 刷新Token
    user: {
      id: string
      username: string
      name: string
      role: string
      permissions: string[]
      avatar?: string
    },
    expiresIn: number      // Token有效期(秒)
  }
}
\`\`\`

**示例**:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
\`\`\`

### 刷新Token

**接口**: `POST /api/auth/refresh`

**请求体**:
\`\`\`typescript
{
  refreshToken: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    token: string
    expiresIn: number
  }
}
\`\`\`

### 登出

**接口**: `POST /api/auth/logout`

**请求头**: `Authorization: Bearer {token}`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "登出成功"
}
\`\`\`

### 获取当前用户信息

**接口**: `GET /api/auth/me`

**请求头**: `Authorization: Bearer {token}`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    id: string
    username: string
    name: string
    email: string
    phone: string
    role: string
    permissions: string[]
    avatar?: string
    department: string
    lastLoginAt: string
  }
}
\`\`\`

---

## 销售管理

### 获取销售概览

**接口**: `GET /api/sales/overview`

**查询参数**:
\`\`\`typescript
{
  startDate?: string  // YYYY-MM-DD
  endDate?: string    // YYYY-MM-DD
  storeId?: string    // 门店ID
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    totalSales: number        // 总销售额
    totalOrders: number       // 总订单数
    avgOrderValue: number     // 平均客单价
    salesGrowth: number       // 销售增长率(%)
    ordersGrowth: number      // 订单增长率(%)
    topProducts: Array<{
      id: string
      name: string
      sales: number
      quantity: number
    }>
    salesByHour: Array<{
      hour: number
      sales: number
      orders: number
    }>
    salesByCategory: Array<{
      category: string
      sales: number
      percentage: number
    }>
  }
}
\`\`\`

### 获取销售列表

**接口**: `GET /api/sales/list`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  startDate?: string
  endDate?: string
  status?: 'pending' | 'completed' | 'cancelled'
  customerId?: string
  employeeId?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      orderNumber: string
      customerId: string
      customerName: string
      employeeId: string
      employeeName: string
      totalAmount: number
      discountAmount: number
      actualAmount: number
      status: string
      paymentMethod: string
      createdAt: string
      items: Array<{
        productId: string
        productName: string
        quantity: number
        price: number
        subtotal: number
      }>
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
\`\`\`

### 创建销售订单

**接口**: `POST /api/sales/create`

**请求体**:
\`\`\`typescript
{
  customerId?: string      // 会员ID（可选）
  employeeId: string       // 员工ID
  items: Array<{
    productId: string
    quantity: number
    price: number          // 单价
    discount?: number      // 折扣
  }>,
  discountType?: 'percentage' | 'amount',
  discountValue?: number,
  paymentMethod: 'cash' | 'card' | 'wechat' | 'alipay' | 'member',
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "订单创建成功",
  data: {
    id: string
    orderNumber: string
    totalAmount: number
    actualAmount: number
    createdAt: string
  }
}
\`\`\`

---

## 商品管理

### 获取商品列表

**接口**: `GET /api/products`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  keyword?: string        // 搜索关键词
  categoryId?: string     // 分类ID
  status?: 'active' | 'inactive'
  minPrice?: number
  maxPrice?: number
  hasStock?: boolean     // 是否有库存
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      name: string
      alias?: string
      barcode: string
      categoryId: string
      categoryName: string
      unit: string
      originalPrice: number
      salePrice: number
      memberPrice: number
      cost: number
      stock: number
      minStock: number
      status: 'active' | 'inactive'
      image?: string
      description?: string
      tags: string[]
      canDiscount: boolean
      isGift: boolean
      createdAt: string
      updatedAt: string
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
\`\`\`

### 获取商品详情

**接口**: `GET /api/products/:id`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    // 包含商品完整信息
    id: string
    name: string
    // ... 其他字段同上
    supplier?: {
      id: string
      name: string
      contact: string
    }
    salesHistory: Array<{
      date: string
      quantity: number
      amount: number
    }>
  }
}
\`\`\`

### 创建商品

**接口**: `POST /api/products`

**请求体**:
\`\`\`typescript
{
  name: string
  alias?: string
  barcode?: string
  categoryId: string
  unit: string
  originalPrice: number
  salePrice: number
  memberPrice: number
  cost: number
  minStock?: number
  status?: 'active' | 'inactive'
  image?: string
  description?: string
  tags?: string[]
  canDiscount?: boolean
  isGift?: boolean
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "商品创建成功",
  data: {
    id: string
    // ... 完整商品信息
  }
}
\`\`\`

### 更新商品

**接口**: `PUT /api/products/:id`

**请求体**: 同创建商品，所有字段可选

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "商品更新成功",
  data: {
    // ... 更新后的商品信息
  }
}
\`\`\`

### 删除商品

**接口**: `DELETE /api/products/:id`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "商品删除成功"
}
\`\`\`

### 批量导入商品

**接口**: `POST /api/products/import`

**请求体**: `multipart/form-data`
\`\`\`typescript
{
  file: File  // Excel文件(.xlsx)
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "导入成功",
  data: {
    success: number    // 成功数量
    failed: number     // 失败数量
    errors: Array<{
      row: number
      message: string
    }>
  }
}
\`\`\`

### 批量更新商品价格

**接口**: `PUT /api/products/batch-update-price`

**请求体**:
\`\`\`typescript
{
  productIds: string[]
  priceType: 'sale' | 'member' | 'original'
  adjustType: 'percentage' | 'amount'
  adjustValue: number  // 调整值（百分比或金额）
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "价格更新成功",
  data: {
    updated: number
  }
}
\`\`\`

---

## 仓库管理

### 获取库存列表

**接口**: `GET /api/warehouse/inventory`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  warehouseId?: string
  productId?: string
  lowStock?: boolean     // 只显示低库存商品
  keyword?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      productId: string
      productName: string
      productBarcode: string
      warehouseId: string
      warehouseName: string
      quantity: number
      minStock: number
      maxStock: number
      avgCost: number      // 平均成本
      totalValue: number   // 库存总价值
      lastInboundDate: string
      lastOutboundDate: string
      status: 'normal' | 'low' | 'out'  // 正常/低库存/缺货
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number,
    summary: {
      totalProducts: number
      totalValue: number
      lowStockCount: number
      outOfStockCount: number
    }
  }
}
\`\`\`

### 入库

**接口**: `POST /api/warehouse/inbound`

**请求体**:
\`\`\`typescript
{
  warehouseId: string
  type: 'purchase' | 'return' | 'transfer' | 'adjustment'  // 采购入库/退货入库/调拨入库/盘点调整
  items: Array<{
    productId: string
    quantity: number
    cost: number       // 入库成本
    batchNumber?: string
    expiryDate?: string
  }>,
  supplierId?: string
  remark?: string
  attachments?: string[]  // 附件URL列表
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "入库成功",
  data: {
    id: string
    inboundNumber: string  // 入库单号
    totalQuantity: number
    totalValue: number
    createdAt: string
  }
}
\`\`\`

### 出库

**接口**: `POST /api/warehouse/outbound`

**请求体**:
\`\`\`typescript
{
  warehouseId: string
  type: 'sale' | 'transfer' | 'loss' | 'adjustment'  // 销售出库/调拨出库/报损出库/盘点调整
  items: Array<{
    productId: string
    quantity: number
    batchNumber?: string
  }>,
  orderId?: string      // 关联订单ID
  remark?: string
  attachments?: string[]
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "出库成功",
  data: {
    id: string
    outboundNumber: string
    totalQuantity: number
    createdAt: string
  }
}
\`\`\`

### 库存盘点

**接口**: `POST /api/warehouse/inventory-check`

**请求体**:
\`\`\`typescript
{
  warehouseId: string
  items: Array<{
    productId: string
    systemQuantity: number   // 系统数量
    actualQuantity: number   // 实际数量
    difference: number       // 差异
    remark?: string
  }>,
  checkType: 'full' | 'spot'  // 全盘/抽盘
  checkPerson: string
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "盘点完成",
  data: {
    id: string
    checkNumber: string
    totalDifference: number
    adjustmentGenerated: boolean  // 是否生成调整单
  }
}
\`\`\`

### 获取库存流水

**接口**: `GET /api/warehouse/transactions`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  warehouseId?: string
  productId?: string
  type?: 'inbound' | 'outbound'
  startDate?: string
  endDate?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      transactionNumber: string
      type: 'inbound' | 'outbound'
      subType: string
      productId: string
      productName: string
      quantity: number
      beforeQuantity: number
      afterQuantity: number
      cost?: number
      operator: string
      remark?: string
      createdAt: string
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
\`\`\`

---

## 包厢管理

### 获取包厢列表

**接口**: `GET /api/rooms`

**查询参数**:
\`\`\`typescript
{
  status?: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved'
  type?: 'small' | 'medium' | 'large' | 'vip' | 'private'
  area?: string
  floor?: number
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: Array<{
    id: string
    number: string         // 包厢号
    name: string          // 包厢名称
    type: string          // 包厢类型
    area: string          // 区域
    floor: number         // 楼层
    capacity: number      // 容纳人数
    status: string        // 状态
    features: string[]    // 特色设施
    hourlyRate: number    // 时租价格
    memberHourlyRate: number  // 会员时租价格
    minConsumption: number    // 最低消费
    currentOrder?: {
      id: string
      startTime: string
      duration: number
      amount: number
      customerId?: string
      customerName?: string
    }
    lastCleaned?: string  // 最后清洁时间
    maintenanceSchedule?: string  // 维护计划
  }>
}
\`\`\`

### 获取包厢详情

**接口**: `GET /api/rooms/:id`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    // 包含完整包厢信息
    id: string
    // ... 其他字段同上
    equipment: Array<{
      id: string
      name: string
      status: 'normal' | 'faulty'
      lastCheck: string
    }>
    usageHistory: Array<{
      date: string
      orders: number
      revenue: number
      utilizationRate: number
    }>
  }
}
\`\`\`

### 开台

**接口**: `POST /api/rooms/:id/start`

**请求体**:
\`\`\`typescript
{
  customerId?: string      // 会员ID（可选）
  guestCount: number       // 客人数量
  packageId?: string       // 套餐ID（可选）
  employeeId: string       // 服务员ID
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "开台成功",
  data: {
    orderId: string
    roomId: string
    startTime: string
  }
}
\`\`\`

### 换台

**接口**: `POST /api/rooms/:id/transfer`

**请求体**:
\`\`\`typescript
{
  orderId: string        // 当前订单ID
  targetRoomId: string   // 目标包厢ID
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "换台成功",
  data: {
    orderId: string
    newRoomId: string
  }
}
\`\`\`

### 结账

**接口**: `POST /api/rooms/:id/checkout`

**请求体**:
\`\`\`typescript
{
  orderId: string
  paymentMethod: 'cash' | 'card' | 'wechat' | 'alipay' | 'member'
  discountType?: 'percentage' | 'amount'
  discountValue?: number
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "结账成功",
  data: {
    orderId: string
    roomId: string
    startTime: string
    endTime: string
    duration: number       // 分钟
    roomCharge: number     // 房费
    itemsCharge: number    // 商品费用
    totalCharge: number    // 总费用
    discount: number       // 折扣
    actualAmount: number   // 实付金额
    paymentMethod: string
  }
}
\`\`\`

### 清洁完成

**接口**: `POST /api/rooms/:id/clean`

**请求体**:
\`\`\`typescript
{
  employeeId: string
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "清洁完成",
  data: {
    roomId: string
    status: 'available'
    cleanedAt: string
  }
}
\`\`\`

---

## 订单管理

### 获取订单列表

**接口**: `GET /api/orders`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  orderType?: 'dine_in' | 'takeout' | 'delivery' | 'room_service'
  customerId?: string
  employeeId?: string
  startDate?: string
  endDate?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      orderNumber: string
      orderType: string
      roomId?: string
      roomNumber?: string
      customerId?: string
      customerName?: string
      employeeId: string
      employeeName: string
      status: string
      items: Array<{
        id: string
        productId: string
        productName: string
        quantity: number
        price: number
        subtotal: number
        status: string
      }>,
      subtotal: number
      discount: number
      tax: number
      total: number
      paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded'
      paymentMethod?: string
      createdAt: string
      updatedAt: string
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
\`\`\`

### 获取订单详情

**接口**: `GET /api/orders/:id`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    // 完整订单信息
    id: string
    // ... 其他字段同上
    timeline: Array<{
      time: string
      action: string
      operator: string
      remark?: string
    }>
    payments: Array<{
      id: string
      amount: number
      method: string
      status: string
      transactionId?: string
      paidAt: string
    }>
  }
}
\`\`\`

### 创建订单

**接口**: `POST /api/orders`

**请求体**:
\`\`\`typescript
{
  orderType: 'dine_in' | 'takeout' | 'delivery' | 'room_service'
  roomId?: string
  customerId?: string
  employeeId: string
  items: Array<{
    productId: string
    quantity: number
    price?: number      // 可选，不传则使用商品默认价格
    flavors?: string[]  // 口味备注
    remark?: string     // 商品备注
  }>,
  deliveryAddress?: {
    contact: string
    phone: string
    address: string
  },
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "订单创建成功",
  data: {
    id: string
    orderNumber: string
    total: number
    createdAt: string
  }
}
\`\`\`

### 添加订单商品

**接口**: `POST /api/orders/:id/items`

**请求体**:
\`\`\`typescript
{
  items: Array<{
    productId: string
    quantity: number
    price?: number
    remark?: string
  }>
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "商品添加成功",
  data: {
    addedItems: Array<{
      id: string
      productName: string
      quantity: number
      subtotal: number
    }>,
    newTotal: number
  }
}
\`\`\`

### 更新订单状态

**接口**: `PUT /api/orders/:id/status`

**请求体**:
\`\`\`typescript
{
  status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "状态更新成功",
  data: {
    orderId: string
    status: string
    updatedAt: string
  }
}
\`\`\`

### 订单支付

**接口**: `POST /api/orders/:id/pay`

**请求体**:
\`\`\`typescript
{
  paymentMethod: 'cash' | 'card' | 'wechat' | 'alipay' | 'member'
  amount: number
  discountType?: 'percentage' | 'amount'
  discountValue?: number
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "支付成功",
  data: {
    orderId: string
    paymentId: string
    amount: number
    method: string
    transactionId?: string
    paidAt: string
  }
}
\`\`\`

### 取消订单

**接口**: `POST /api/orders/:id/cancel`

**请求体**:
\`\`\`typescript
{
  reason: string
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "订单已取消",
  data: {
    orderId: string
    cancelledAt: string
    refundAmount?: number
  }
}
\`\`\`

---

## 会员管理

### 获取会员列表

**接口**: `GET /api/members`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  keyword?: string       // 搜索姓名/手机号
  level?: string         // 会员等级
  status?: 'active' | 'inactive' | 'expired'
  minPoints?: number
  maxPoints?: number
  minBalance?: number
  maxBalance?: number
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      memberNumber: string    // 会员号
      name: string
      phone: string
      email?: string
      gender?: 'male' | 'female'
      birthday?: string
      level: string           // 会员等级
      points: number          // 积分
      balance: number         // 余额
      totalConsumption: number  // 累计消费
      totalOrders: number     // 订单数量
      avgOrderValue: number   // 平均客单价
      lastVisit?: string      // 最后到访
      status: 'active' | 'inactive' | 'expired'
      joinDate: string
      expiryDate?: string
      tags: string[]
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number,
    summary: {
      totalMembers: number
      activeMembers: number
      totalPoints: number
      totalBalance: number
    }
  }
}
\`\`\`

### 获取会员详情

**接口**: `GET /api/members/:id`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    // 完整会员信息
    id: string
    // ... 其他字段同上
    consumptionHistory: Array<{
      date: string
      orders: number
      amount: number
    }>
    pointsHistory: Array<{
      date: string
      type: 'earn' | 'spend' | 'expire'
      amount: number
      balance: number
      remark: string
    }>
    recentOrders: Array<{
      id: string
      orderNumber: string
      amount: number
      createdAt: string
    }>
  }
}
\`\`\`

### 创建会员

**接口**: `POST /api/members`

**请求体**:
\`\`\`typescript
{
  name: string
  phone: string
  email?: string
  gender?: 'male' | 'female'
  birthday?: string
  level?: string
  initialBalance?: number
  initialPoints?: number
  tags?: string[]
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "会员创建成功",
  data: {
    id: string
    memberNumber: string
    name: string
    phone: string
    level: string
    balance: number
    points: number
  }
}
\`\`\`

### 更新会员信息

**接口**: `PUT /api/members/:id`

**请求体**: 同创建会员，所有字段可选

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "会员信息更新成功",
  data: {
    // 更新后的会员信息
  }
}
\`\`\`

### 会员充值

**接口**: `POST /api/members/:id/recharge`

**请求体**:
\`\`\`typescript
{
  amount: number
  paymentMethod: 'cash' | 'card' | 'wechat' | 'alipay'
  giveAmount?: number     // 赠送金额
  givePoints?: number     // 赠送积分
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "充值成功",
  data: {
    memberId: string
    rechargeId: string
    amount: number
    giveAmount: number
    givePoints: number
    newBalance: number
    newPoints: number
  }
}
\`\`\`

### 会员消费

**接口**: `POST /api/members/:id/consume`

**请求体**:
\`\`\`typescript
{
  amount: number
  orderId: string
  earnPoints?: number     // 获得积分
  remark?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "消费成功",
  data: {
    memberId: string
    consumeId: string
    amount: number
    earnPoints: number
    newBalance: number
    newPoints: number
  }
}
\`\`\`

### 积分兑换

**接口**: `POST /api/members/:id/redeem`

**请求体**:
\`\`\`typescript
{
  rewardId: string       // 奖励ID
  points: number         // 消耗积分
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "兑换成功",
  data: {
    memberId: string
    redeemId: string
    rewardName: string
    pointsUsed: number
    newPoints: number
  }
}
\`\`\`

---

## 员工管理

### 获取员工列表

**接口**: `GET /api/employees`

**查询参数**: 继承通用分页参数，额外支持：
\`\`\`typescript
{
  keyword?: string
  department?: string
  role?: string
  status?: 'active' | 'inactive' | 'on_leave'
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    items: Array<{
      id: string
      employeeNumber: string
      name: string
      phone: string
      email?: string
      gender?: 'male' | 'female'
      department: string
      role: string
      position: string
      permissions: string[]
      status: 'active' | 'inactive' | 'on_leave'
      hireDate: string
      workShift?: string
      salary?: number
      avatar?: string
    }>,
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
\`\`\`

### 获取员工详情

**接口**: `GET /api/employees/:id`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    // 完整员工信息
    id: string
    // ... 其他字段同上
    attendanceRecords: Array<{
      date: string
      checkIn: string
      checkOut: string
      workHours: number
      status: 'normal' | 'late' | 'absent'
    }>
    performanceMetrics: {
      totalSales: number
      totalOrders: number
      avgRating: number
      customerSatisfaction: number
    }
  }
}
\`\`\`

### 创建员工

**接口**: `POST /api/employees`

**请求体**:
\`\`\`typescript
{
  name: string
  phone: string
  email?: string
  gender?: 'male' | 'female'
  idCard?: string
  department: string
  role: string
  position: string
  permissions: string[]
  hireDate: string
  workShift?: string
  salary?: number
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "员工创建成功",
  data: {
    id: string
    employeeNumber: string
    name: string
    department: string
    role: string
  }
}
\`\`\`

### 更新员工信息

**接口**: `PUT /api/employees/:id`

**请求体**: 同创建员工，所有字段可选

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "员工信息更新成功",
  data: {
    // 更新后的员工信息
  }
}
\`\`\`

### 员工打卡

**接口**: `POST /api/employees/:id/attendance`

**请求体**:
\`\`\`typescript
{
  type: 'check_in' | 'check_out'
  location?: {
    latitude: number
    longitude: number
    address: string
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "打卡成功",
  data: {
    employeeId: string
    type: string
    time: string
    location?: object
  }
}
\`\`\`

### 请假申请

**接口**: `POST /api/employees/:id/leave`

**请求体**:
\`\`\`typescript
{
  leaveType: 'annual' | 'sick' | 'personal' | 'other'
  startDate: string
  endDate: string
  duration: number      // 天数
  reason: string
  attachments?: string[]
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "请假申请已提交",
  data: {
    leaveId: string
    employeeId: string
    status: 'pending'
    createdAt: string
  }
}
\`\`\`

---

## 报表中心

### 销售报表

**接口**: `GET /api/reports/sales`

**查询参数**:
\`\`\`typescript
{
  startDate: string      // YYYY-MM-DD
  endDate: string
  groupBy?: 'day' | 'week' | 'month'  // 分组方式
  storeId?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    summary: {
      totalSales: number
      totalOrders: number
      avgOrderValue: number
      salesGrowth: number
      ordersGrowth: number
    },
    salesByDate: Array<{
      date: string
      sales: number
      orders: number
      avgValue: number
    }>,
    salesByCategory: Array<{
      category: string
      sales: number
      percentage: number
    }>,
    salesByPayment: Array<{
      method: string
      amount: number
      count: number
      percentage: number
    }>,
    topProducts: Array<{
      id: string
      name: string
      quantity: number
      sales: number
    }>,
    topEmployees: Array<{
      id: string
      name: string
      orders: number
      sales: number
    }>
  }
}
\`\`\`

### 商品分析报表

**接口**: `GET /api/reports/products`

**查询参数**:
\`\`\`typescript
{
  startDate: string
  endDate: string
  categoryId?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    topSelling: Array<{
      id: string
      name: string
      quantity: number
      sales: number
      profit: number
    }>,
    lowStock: Array<{
      id: string
      name: string
      stock: number
      minStock: number
    }>,
    profitAnalysis: Array<{
      id: string
      name: string
      sales: number
      cost: number
      profit: number
      profitMargin: number
    }>
  }
}
\`\`\`

### 会员分析报表

**接口**: `GET /api/reports/members`

**查询参数**:
\`\`\`typescript
{
  startDate: string
  endDate: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    summary: {
      totalMembers: number
      activeMembers: number
      newMembers: number
      memberGrowth: number
    },
    membersByLevel: Array<{
      level: string
      count: number
      percentage: number
      avgConsumption: number
    }>,
    memberRetention: {
      rate: number
      trend: Array<{
        month: string
        rate: number
      }>
    },
    topMembers: Array<{
      id: string
      name: string
      phone: string
      totalConsumption: number
      lastVisit: string
    }>
  }
}
\`\`\`

### 员工绩效报表

**接口**: `GET /api/reports/employees`

**查询参数**:
\`\`\`typescript
{
  startDate: string
  endDate: string
  department?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    employeePerformance: Array<{
      id: string
      name: string
      department: string
      sales: number
      orders: number
      avgOrderValue: number
      customerRating: number
      attendanceRate: number
    }>,
    departmentComparison: Array<{
      department: string
      employees: number
      sales: number
      orders: number
      avgPerformance: number
    }>
  }
}
\`\`\`

---

## AI运营系统

### M7.1 利润智能引擎

**接口**: `POST /api/ai-ops/profit-intelligence`

**请求体**:
\`\`\`typescript
{
  analysisType: 'product' | 'category' | 'time' | 'customer'
  dateRange: {
    startDate: string
    endDate: string
  },
  filters?: {
    categoryId?: string
    productIds?: string[]
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    profitability: {
      totalProfit: number
      profitMargin: number
      roi: number
    },
    recommendations: Array<{
      type: 'pricing' | 'cost' | 'promotion'
      item: string
      currentValue: number
      suggestedValue: number
      expectedImpact: number
      reason: string
    }>,
    insights: string[]
  }
}
\`\`\`

### M7.2 客户智能推送

**接口**: `POST /api/ai-ops/customer-intelligence`

**请求体**:
\`\`\`typescript
{
  targetType: 'segment' | 'individual' | 'dormant' | 'vip'
  campaignType: 'promotion' | 'retention' | 'reactivation'
  filters?: {
    memberLevel?: string
    minConsumption?: number
    lastVisitDays?: number
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    targetCustomers: number
    predictedResponse: {
      rate: number
      expectedRevenue: number
      roi: number
    },
    recommendations: Array<{
      customerId: string
      customerName: string
      recommendedOffer: string
      expectedValue: number
      priority: 'high' | 'medium' | 'low'
    }>,
    messageTemplate: string
  }
}
\`\`\`

### M7.3 多渠道营销

**接口**: `POST /api/ai-ops/multi-channel-marketing`

**请求体**:
\`\`\`typescript
{
  campaignName: string
  channels: Array<'sms' | 'email' | 'wechat' | 'push'>
  targetAudience: {
    segments: string[]
    filters: object
  },
  content: {
    title: string
    message: string
    images?: string[]
    link?: string
  },
  schedule?: {
    sendAt?: string
    frequency?: 'once' | 'daily' | 'weekly'
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "营销活动已创建",
  data: {
    campaignId: string
    targetSize: number
    estimatedReach: number
    estimatedCost: number
    scheduledAt: string
  }
}
\`\`\`

### M7.4 智能商品推荐

**接口**: `GET /api/ai-ops/product-recommendation`

**查询参数**:
\`\`\`typescript
{
  customerId?: string
  roomId?: string
  context?: 'ordering' | 'checkout' | 'browsing'
  limit?: number
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    recommendations: Array<{
      productId: string
      productName: string
      price: number
      memberPrice: number
      confidence: number      // 推荐置信度 0-1
      reason: string
      image?: string
    }>,
    bundleOffers: Array<{
      products: string[]
      totalPrice: number
      discountPrice: number
      savings: number
    }>
  }
}
\`\`\`

### M7.5 智能定价系统

**接口**: `POST /api/ai-ops/dynamic-pricing`

**请求体**:
\`\`\`typescript
{
  productId: string
  analysisType: 'demand' | 'competition' | 'optimization'
  factors?: {
    timeSlot?: string
    dayOfWeek?: number
    season?: string
    events?: string[]
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    currentPrice: number
    suggestedPrice: number
    priceRange: {
      min: number
      max: number
      optimal: number
    },
    demandForecast: {
      expected: number
      low: number
      high: number
    },
    revenueImpact: {
      current: number
      suggested: number
      increase: number
    },
    confidence: number
  }
}
\`\`\`

### M7.6 客流预测系统

**接口**: `GET /api/ai-ops/traffic-forecast`

**查询参数**:
\`\`\`typescript
{
  forecastDate: string
  timeSlots?: boolean      // 是否按时段预测
  includeEvents?: boolean  // 是否考虑特殊事件
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    date: string
    forecast: {
      totalVisitors: number
      peakTime: string
      peakVisitors: number
      confidence: number
    },
    hourlyForecast: Array<{
      hour: number
      visitors: number
      confidence: number
    }>,
    recommendations: Array<{
      type: 'staffing' | 'inventory' | 'marketing'
      action: string
      priority: string
    }>
  }
}
\`\`\`

### M7.7 智能营销助手

**接口**: `POST /api/ai-ops/marketing-assistant`

**请求体**:
\`\`\`typescript
{
  taskType: 'campaign_planning' | 'content_generation' | 'audience_segmentation'
  input: {
    goal?: string
    budget?: number
    targetAudience?: object
    context?: string
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    suggestions: Array<{
      title: string
      description: string
      expectedROI: number
      difficulty: 'easy' | 'medium' | 'hard'
      estimatedCost: number
      implementation: string[]
    }>,
    generatedContent?: {
      title: string
      body: string
      callToAction: string
      images?: string[]
    },
    audienceInsights?: {
      segments: Array<{
        name: string
        size: number
        characteristics: string[]
        recommendedChannel: string
      }>
    }
  }
}
\`\`\`

### M7.8 库存智能预测

**接口**: `GET /api/ai-ops/inventory-forecast`

**查询参数**:
\`\`\`typescript
{
  forecastDays: number     // 预测天数
  productIds?: string[]
  categoryId?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    products: Array<{
      productId: string
      productName: string
      currentStock: number
      forecastDemand: number
      suggestedOrder: number
      reorderPoint: number
      stockoutRisk: 'low' | 'medium' | 'high'
      daysOfStock: number
    }>,
    summary: {
      totalSuggestedOrders: number
      estimatedCost: number
      riskProducts: number
    }
  }
}
\`\`\`

### M7.9 AI综合数据中心

**接口**: `GET /api/ai-ops/data-center`

**查询参数**:
\`\`\`typescript
{
  modules?: string[]  // 指定要查询的模块，不传则返回所有
  dateRange?: {
    startDate: string
    endDate: string
  }
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    overview: {
      totalInsights: number
      activeCampaigns: number
      automationRate: number
      avgResponseTime: number
    },
    moduleStatus: Array<{
      module: string
      status: 'active' | 'inactive'
      lastUpdate: string
      performance: {
        accuracy: number
        usage: number
      }
    }>,
    insights: Array<{
      module: string
      type: 'alert' | 'opportunity' | 'recommendation'
      priority: 'high' | 'medium' | 'low'
      title: string
      description: string
      actionable: boolean
      createdAt: string
    }>,
    metrics: {
      aiAccuracy: number
      automationSavings: number
      revenueImpact: number
    }
  }
}
\`\`\`

---

## 支付系统

### 创建支付订单

**接口**: `POST /api/payment/create`

**请求体**:
\`\`\`typescript
{
  orderId: string
  amount: number
  paymentMethod: 'wechat' | 'alipay'
  returnUrl?: string
  notifyUrl?: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    paymentId: string
    qrCodeUrl?: string      // 二维码URL（扫码支付）
    paymentUrl?: string     // 支付URL（跳转支付）
    expiresAt: string
  }
}
\`\`\`

### 查询支付状态

**接口**: `GET /api/payment/:paymentId/status`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    paymentId: string
    orderId: string
    status: 'pending' | 'success' | 'failed' | 'cancelled'
    amount: number
    paidAmount?: number
    paidAt?: string
    transactionId?: string
  }
}
\`\`\`

### 支付回调（微信）

**接口**: `POST /api/payment/wechat-notify`

**说明**: 此接口由微信支付服务器调用，用于异步通知支付结果

### 支付回调（支付宝）

**接口**: `POST /api/payment/alipay-notify`

**说明**: 此接口由支付宝服务器调用，用于异步通知支付结果

### 退款

**接口**: `POST /api/payment/refund`

**请求体**:
\`\`\`typescript
{
  paymentId: string
  amount: number
  reason: string
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "退款申请已提交",
  data: {
    refundId: string
    status: 'pending' | 'success' | 'failed'
    expectedAt?: string
  }
}
\`\`\`

---

## 系统设置

### 获取系统配置

**接口**: `GET /api/settings`

**响应**:
\`\`\`typescript
{
  code: 200,
  data: {
    store: {
      name: string
      phone: string
      address: string
      openTime: string
      closeTime: string
      logo?: string
    },
    business: {
      currency: string
      timezone: string
      language: string
      taxRate: number
      serviceCharge: number
    },
    member: {
      pointsRate: number          // 积分比例
      pointsExpireDays: number    // 积分过期天数
      balanceExpireDays: number   // 余额过期天数
      levels: Array<{
        id: string
        name: string
        discount: number
        minConsumption: number
      }>
    },
    payment: {
      enabledMethods: string[]
      wechatPayEnabled: boolean
      alipayEnabled: boolean
    },
    notification: {
      smsEnabled: boolean
      emailEnabled: boolean
      pushEnabled: boolean
    }
  }
}
\`\`\`

### 更新系统配置

**接口**: `PUT /api/settings`

**请求体**: 同获取系统配置的data结构，所有字段可选

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "配置更新成功",
  data: {
    // 更新后的完整配置
  }
}
\`\`\`

### 上传文件

**接口**: `POST /api/upload`

**请求体**: `multipart/form-data`
\`\`\`typescript
{
  file: File
  type?: 'image' | 'document' | 'avatar'
}
\`\`\`

**响应**:
\`\`\`typescript
{
  code: 200,
  message: "上传成功",
  data: {
    url: string
    filename: string
    size: number
    mimeType: string
  }
}
\`\`\`

---

## 错误码说明

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |
| 503 | 服务不可用 |

### 业务错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户名或密码错误 |
| 1002 | Token已过期 |
| 1003 | Token无效 |
| 1004 | 权限不足 |
| 2001 | 商品不存在 |
| 2002 | 库存不足 |
| 2003 | 商品已下架 |
| 3001 | 订单不存在 |
| 3002 | 订单状态错误 |
| 3003 | 订单已取消 |
| 4001 | 会员不存在 |
| 4002 | 会员余额不足 |
| 4003 | 会员积分不足 |
| 5001 | 包厢不存在 |
| 5002 | 包厢已被占用 |
| 5003 | 包厢维护中 |
| 6001 | 支付失败 |
| 6002 | 支付超时 |
| 6003 | 退款失败 |
| 9001 | 参数缺失 |
| 9002 | 参数格式错误 |
| 9003 | 数据验证失败 |
| 9999 | 未知错误 |

### 错误响应示例

\`\`\`typescript
{
  code: 1001,
  message: "用户名或密码错误",
  timestamp: "2025-01-18T10:30:00Z",
  path: "/api/auth/login"
}
\`\`\`

---

## 附录

### 请求示例（完整）

\`\`\`bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# 获取商品列表（带认证）
curl -X GET "http://localhost:3000/api/products?page=1&pageSize=20" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"

# 创建订单
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "dine_in",
    "roomId": "room-001",
    "employeeId": "emp-001",
    "items": [
      {
        "productId": "prod-001",
        "quantity": 2,
        "price": 15
      }
    ]
  }'
\`\`\`

### Postman导入

您可以导入以下Postman Collection快速开始测试：

\`\`\`
[导入链接占位]
\`\`\`

### SDK支持

我们提供以下语言的SDK：

- JavaScript/TypeScript: `npm install @ktv-admin/sdk`
- Python: `pip install ktv-admin-sdk`
- Java: Maven Central

---

## 更新日志

### v1.0.0 (2025-01-18)
- 首次发布
- 完整的API文档
- 支持所有核心业务模块
- AI运营系统完整接口

---

## 技术支持

如有API相关问题，请联系：

- 📧 邮件: api-support@yyc3.com
- 📖 文档: [docs/INDEX.md](./INDEX.md)
- 💬 反馈: 请在项目Issue中提交

---

**文档版本**: v1.0  
**最后更新**: 2025-01-18  
**维护者**: API团队  

© 2025 启智网络科技有限公司
