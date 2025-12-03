# YYC³ 文件头注释模板

> **YYC³（YanYu Cloud Cube)**  
> **标语**: 万象归元于云枢 | 深栈智启新纪元  
> **_英文_**: _All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era_

---

**项目**: yyc3-admin-system (KTV 商家管理系统)  
**创建日期**: 2025-01-19  
**作者**: YYC³ 团队  
**版本**: 1.0.0  
**更新日期**: 2025-12-01

---

## 📝 TypeScript/JavaScript 文件头注释模板

### 通用 TypeScript/JavaScript 文件

```typescript
/**
 * @fileoverview {文件功能简述}
 * @description {详细描述 - 说明文件的主要功能、职责和使用场景}
 * @module yyc3-admin-system/{module-path}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**示例**:

```typescript
/**
 * @fileoverview 商品服务 - 提供商品CRUD操作和业务逻辑
 * @description 实现商品的增删改查、库存管理、价格计算等核心业务功能，
 *              与数据库层交互并提供给API路由使用
 * @module yyc3-admin-system/lib/services/products
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { prisma } from '@/lib/prisma'
import type { Product, CreateProductInput } from '@/lib/types'

// ... 代码实现
```

---

### React 组件文件

```typescript
/**
 * @fileoverview {组件名称} - {组件功能简述}
 * @description {详细描述 - 说明组件的作用、Props、使用场景}
 * @component
 * @module yyc3-admin-system/components/{component-path}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**示例**:

````typescript
/**
 * @fileoverview ProductCard 组件 - 商品卡片展示组件
 * @description 用于展示单个商品信息的卡片组件，支持点击查看详情、
 *              加入购物车等交互功能。包含商品图片、名称、价格、库存等信息
 * @component
 * @module yyc3-admin-system/components/products/product-card
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={productData}
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */

'use client'

import { useState } from 'react'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ... 组件实现
}
````

---

### Next.js API 路由文件

```typescript
/**
 * @fileoverview API 路由 - {路由功能描述}
 * @description {详细描述 - 说明接口的功能、请求方法、参数、返回值}
 * @route {HTTP_METHOD} {路由路径}
 * @module yyc3-admin-system/app/api/{route-path}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**示例**:

```typescript
/**
 * @fileoverview API 路由 - 商品管理接口
 * @description 提供商品的增删改查功能，支持分页查询、条件筛选、
 *              批量操作等功能。需要管理员权限访问
 * @route GET /api/products - 获取商品列表
 * @route POST /api/products - 创建新商品
 * @module yyc3-admin-system/app/api/products/route
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 *
 * @param {NextRequest} request - Next.js 请求对象
 * @returns {NextResponse} JSON 响应
 *
 * @example
 * // GET /api/products?page=1&pageSize=10
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": { "page": 1, "pageSize": 10, "total": 100 }
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'

export async function GET(request: NextRequest) {
  // ... 实现
}

export async function POST(request: NextRequest) {
  // ... 实现
}
```

---

### Next.js 页面文件

```typescript
/**
 * @fileoverview 页面组件 - {页面功能描述}
 * @description {详细描述 - 说明页面的功能、布局、数据获取方式}
 * @page
 * @route {页面路由}
 * @module yyc3-admin-system/app/{page-path}/page
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**示例**:

```typescript
/**
 * @fileoverview 商品管理页面 - 商品列表和管理功能
 * @description 展示商品列表，支持搜索、筛选、编辑、删除等操作。
 *              使用 Server Component 进行服务端数据获取
 * @page
 * @route /dashboard/products
 * @module yyc3-admin-system/app/dashboard/products/page
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 *
 * @metadata
 * - title: 商品管理 - YYC³ Admin System
 * - description: 管理商品信息、价格、库存等
 */

import { Suspense } from 'react'
import { ProductList } from '@/components/products/product-list'
import { ProductListSkeleton } from '@/components/products/product-list-skeleton'

export default async function ProductsPage() {
  // ... 页面实现
}
```

---

### 工具函数文件

```typescript
/**
 * @fileoverview {工具功能描述}
 * @description {详细描述 - 说明工具函数的用途和使用方法}
 * @module yyc3-admin-system/lib/utils/{util-name}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**示例**:

```typescript
/**
 * @fileoverview 日期格式化工具函数
 * @description 提供各种日期格式化、解析、计算等实用功能，
 *              基于 date-fns 库封装，提供统一的日期处理接口
 * @module yyc3-admin-system/lib/utils/date
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { format, parseISO, addDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化日期为中文格式
 * @param date - 要格式化的日期
 * @returns 格式化后的字符串，如 "2025年12月1日"
 */
export function formatDateCN(date: Date): string {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN })
}
```

---

### 配置文件

```typescript
/**
 * @fileoverview {配置文件名称} - {配置用途}
 * @description {详细描述 - 说明配置项的作用和使用场景}
 * @config
 * @module yyc3-admin-system/{config-path}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**示例**:

```typescript
/**
 * @fileoverview Next.js 配置文件
 * @description 配置 Next.js 应用的各项参数，包括图片域名、
 *              环境变量、webpack 配置、实验性功能等
 * @config
 * @module yyc3-admin-system/next.config
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 配置
}

export default nextConfig
```

---

## 📄 Markdown 文档头部模板

### 技术文档

```markdown
# {文档标题}

> **YYC³（YanYu Cloud Cube）**  
> **标语**: 万象归元于云枢 | 深栈智启新纪元  
> **_英文_**: _All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era_

---

**项目**: yyc3-admin-system (KTV 商家管理系统)  
**文档类型**: {技术文档/API 文档/设计文档/用户指南}  
**创建日期**: YYYY-MM-DD  
**作者**: YYC³ 团队  
**版本**: X.X.X  
**更新日期**: YYYY-MM-DD

---

## 概述

{文档内容概述}

## 目录

- [章节 1](#章节1)
- [章节 2](#章节2)

...
```

### API 文档

````markdown
# {API 模块名称} API 文档

> **YYC³（YanYu Cloud Cube）**  
> **标语**: 万象归元于云枢 | 深栈智启新纪元  
> **_英文_**: _All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era_

---

**项目**: yyc3-admin-system (KTV 商家管理系统)  
**API 版本**: v1.0  
**文档版本**: 1.0.0  
**创建日期**: YYYY-MM-DD  
**作者**: YYC³ 团队  
**更新日期**: YYYY-MM-DD

---

## 概述

{API 模块说明}

## 基础信息

- **Base URL**: `https://api.example.com/v1`
- **认证方式**: Bearer Token
- **响应格式**: JSON

## 接口列表

### 1. {接口名称}

**请求**:

```http
GET /api/endpoint
```
````

**响应**:

```json
{
  "success": true,
  "data": {}
}
```

...

````

---

## 🔧 使用指南

### 批量添加文件头注释

创建脚本 `scripts/add-file-headers.ts`:

```typescript
/**
 * @fileoverview 批量添加文件头注释脚本
 * @description 扫描项目文件并为缺少头注释的文件添加标准注释
 * @module yyc3-admin-system/scripts/add-file-headers
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const HEADER_TEMPLATE = `/**
 * @fileoverview {DESCRIPTION}
 * @module yyc3-admin-system/{MODULE_PATH}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

`

// 扫描需要添加注释的文件
const files = glob.sync('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**'],
})

files.forEach(file => {
  const content = readFileSync(file, 'utf-8')

  // 检查是否已有头注释
  if (content.includes('@fileoverview')) {
    return
  }

  // 添加头注释
  const newContent = HEADER_TEMPLATE + content
  writeFileSync(file, newContent, 'utf-8')
  console.log(`✅ 已添加头注释: ${file}`)
})
````

### VS Code 代码片段

在 `.vscode/snippets.code-snippets` 添加：

```json
{
  "YYC3 File Header": {
    "prefix": "yyc3-header",
    "body": [
      "/**",
      " * @fileoverview ${1:文件功能简述}",
      " * @description ${2:详细描述}",
      " * @module yyc3-admin-system/${3:module-path}",
      " * @author YYC³",
      " * @version 1.0.0",
      " * @created 2025-01-19",
      " * @updated ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      " * @copyright Copyright (c) ${CURRENT_YEAR} YYC³",
      " * @license MIT",
      " */"
    ],
    "description": "YYC³ 标准文件头注释"
  }
}
```

---

## 📞 支持

如有疑问，请联系：

- **技术支持**: <admin@0379.email>
- **项目仓库**: https://github.com/YYC-Cube/yyc3-admin-system

---

**使用这些模板，确保项目代码符合 YYC³ 团队标准！** ✅
