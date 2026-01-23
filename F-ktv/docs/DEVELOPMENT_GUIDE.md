# 💻 开发者完整指南

欢迎加入启智商家后台管理系统的开发团队！本指南将帮助您快速上手项目开发，了解代码结构、开发规范和最佳实践。

---

## 📑 目录

- [开发环境搭建](#开发环境搭建)
- [项目结构详解](#项目结构详解)
- [开发规范](#开发规范)
- [组件开发指南](#组件开发指南)
- [状态管理指南](#状态管理指南)
- [API调用规范](#api调用规范)
- [样式开发指南](#样式开发指南)
- [动画开发指南](#动画开发指南)
- [测试开发指南](#测试开发指南)
- [性能优化指南](#性能优化指南)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)

---

## 开发环境搭建

### 1. 系统要求

**最低要求**：
- Node.js 18.0+
- npm 8.0+ / yarn 1.22+ / pnpm 7.0+
- Git 2.30+

**推荐配置**：
- Node.js 20.x LTS
- pnpm 8.x（性能最优）
- VS Code 1.80+

### 2. 必备工具

#### VS Code 扩展
\`\`\`json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense",
    "eamodio.gitlens",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-typescript-next"
  ]
}
\`\`\`

#### Chrome 扩展
- React Developer Tools
- Redux DevTools（如使用Redux）
- Lighthouse（性能分析）

### 3. 项目克隆与安装

\`\`\`bash
# 克隆项目
git clone https://github.com/your-org/ktv-admin-system.git
cd ktv-admin-system

# 安装依赖（推荐使用pnpm）
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn install
\`\`\`

### 4. 环境变量配置

\`\`\`bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local
# 最小化配置（使用Mock数据）
NEXT_PUBLIC_APP_NAME=启智KTV商家后台
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
\`\`\`

### 5. 启动开发服务器

\`\`\`bash
# 启动开发服务器
pnpm dev

# 或使用npm
npm run dev

# 指定端口启动
PORT=3001 pnpm dev
\`\`\`

访问 `http://localhost:3000` 查看应用。

---

## 项目结构详解

\`\`\`
ktv-admin-system/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # 认证相关路由组
│   │   └── login/                # 登录页
│   ├── dashboard/                # 主应用路由组
│   │   ├── layout.tsx            # 仪表盘布局
│   │   ├── page.tsx              # 仪表盘首页
│   │   ├── sales/                # 销售管理
│   │   ├── products/             # 商品管理
│   │   ├── warehouse/            # 仓库管理
│   │   ├── reports/              # 报表中心
│   │   ├── employees/            # 员工管理
│   │   ├── members/              # 会员管理
│   │   ├── ai-ops/               # AI运营系统
│   │   └── settings/             # 系统设置
│   ├── api/                      # API路由
│   │   ├── auth/                 # 认证API
│   │   ├── sales/                # 销售API
│   │   ├── products/             # 商品API
│   │   └── ai-ops/               # AI运营API
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页（重定向到登录）
│   └── globals.css               # 全局样式
│
├── components/                   # React组件
│   ├── dashboard/                # 仪表盘组件
│   │   ├── stat-card.tsx         # 统计卡片
│   │   ├── recent-sales.tsx      # 最近销售
│   │   └── ...
│   ├── sales/                    # 销售管理组件
│   ├── products/                 # 商品管理组件
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx            # 顶栏
│   │   ├── sidebar.tsx           # 侧边栏
│   │   └── page-transition.tsx   # 页面过渡
│   ├── common/                   # 通用组件
│   │   ├── data-table.tsx        # 数据表格
│   │   ├── search-bar.tsx        # 搜索栏
│   │   └── loading.tsx           # 加载组件
│   └── ui/                       # shadcn/ui组件
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/                          # 核心库
│   ├── stores/                   # Zustand状态管理
│   │   ├── useRoomStore.ts
│   │   ├── useOrderStore.ts
│   │   ├── useEmployeeStore.ts
│   │   └── ...
│   ├── api/                      # API客户端
│   │   ├── client.ts             # 基础客户端
│   │   └── types.ts              # API类型定义
│   ├── hooks/                    # 自定义Hooks
│   │   ├── use-mobile.ts
│   │   ├── use-toast.ts
│   │   └── use-debounce.ts
│   ├── utils/                    # 工具函数
│   │   ├── cn.ts                 # className合并
│   │   ├── format.ts             # 格式化函数
│   │   └── validation.ts         # 验证函数
│   └── ai-ops/                   # AI运营系统
│       ├── profit-intelligence-engine.ts
│       ├── customer-intelligence-promotion.ts
│       └── ...
│
├── public/                       # 静态资源
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/                       # 样式文件
│   └── globals.css               # 全局样式
│
├── docs/                         # 项目文档
│   ├── INDEX.md
│   ├── README.md
│   ├── DEVELOPMENT_GUIDE.md      # 本文档
│   └── ...
│
├── __tests__/                    # 测试文件
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # E2E测试
│
├── .env.example                  # 环境变量模板
├── .env.local                    # 本地环境变量（不提交）
├── .eslintrc.json                # ESLint配置
├── .prettierrc                   # Prettier配置
├── next.config.mjs               # Next.js配置
├── tailwind.config.ts            # Tailwind配置
├── tsconfig.json                 # TypeScript配置
├── package.json                  # 依赖配置
└── README.md                     # 项目说明
\`\`\`

### 核心目录说明

#### `app/` - 应用路由
- 使用Next.js 15 App Router
- 每个文件夹代表一个路由
- `layout.tsx` 定义布局
- `page.tsx` 定义页面内容
- `loading.tsx` 定义加载状态
- `error.tsx` 定义错误页面

#### `components/` - React组件
- 按功能模块组织
- 可复用组件放在 `common/`
- UI基础组件放在 `ui/`（shadcn/ui）
- 业务组件按模块放置

#### `lib/` - 核心库
- `stores/` - 全局状态管理
- `api/` - API客户端封装
- `hooks/` - 自定义React Hooks
- `utils/` - 工具函数
- `ai-ops/` - AI运营系统核心逻辑

---

## 开发规范

### 1. 代码风格

#### TypeScript规范
\`\`\`typescript
// ✅ 好的做法：使用显式类型
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}

// ❌ 避免：使用any
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then(res => res.json())
}
\`\`\`

#### 命名规范
\`\`\`typescript
// 组件：PascalCase
export function StatCard() {}

// 函数/变量：camelCase
const handleClick = () => {}
const userName = 'John'

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'

// 类型/接口：PascalCase
interface UserProfile {}
type ResponseData = {}

// 文件名：kebab-case
// stat-card.tsx
// user-profile.tsx
// api-client.ts
\`\`\`

### 2. 组件规范

#### 函数组件结构
\`\`\`typescript
'use client' // 如果需要客户端组件

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useEmployeeStore } from '@/lib/stores/useEmployeeStore'

// 类型定义
interface EmployeeListProps {
  initialData?: Employee[]
  onSelect?: (employee: Employee) => void
}

/**
 * 员工列表组件
 * 
 * 显示员工列表，支持搜索、筛选和排序
 * 
 * @param initialData - 初始员工数据
 * @param onSelect - 选择员工回调
 */
export function EmployeeList({ 
  initialData = [], 
  onSelect 
}: EmployeeListProps) {
  // 1. Hooks（状态、效果、上下文）
  const [searchTerm, setSearchTerm] = useState('')
  const { employees, fetchEmployees } = useEmployeeStore()
  
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])
  
  // 2. 事件处理函数
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  
  const handleEmployeeClick = (employee: Employee) => {
    onSelect?.(employee)
  }
  
  // 3. 计算值/派生状态
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // 4. 渲染逻辑
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索员工..."
        className="w-full px-4 py-2 border rounded"
      />
      
      <div className="grid gap-4">
        {filteredEmployees.map(employee => (
          <Button
            key={employee.id}
            onClick={() => handleEmployeeClick(employee)}
          >
            {employee.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
\`\`\`

### 3. 注释规范

\`\`\`typescript
/**
 * 多行注释用于函数/组件说明
 * 包含功能描述、参数说明、返回值说明
 */

// 单行注释用于代码逻辑说明
// 所有注释必须使用中文

// ✅ 好的注释
// 根据用户角色过滤可见菜单项
const visibleMenuItems = menuItems.filter(item => 
  hasPermission(user.role, item.permission)
)

// ❌ 不好的注释
// filter menu
const visibleMenuItems = menuItems.filter(item => 
  hasPermission(user.role, item.permission)
)
\`\`\`

---

## 组件开发指南

### 1. 使用shadcn/ui组件

\`\`\`typescript
// ✅ 直接导入shadcn/ui组件
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>标题</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="输入内容" />
        <Button>提交</Button>
      </CardContent>
    </Card>
  )
}
\`\`\`

### 2. 表单处理

\`\`\`typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// 定义表单验证规则
const formSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
})

type FormValues = z.infer<typeof formSchema>

export function EmployeeForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  })
  
  const onSubmit = (data: FormValues) => {
    console.log('表单提交:', data)
    // 处理提交逻辑
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="请输入姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="请输入邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
\`\`\`

### 3. 数据表格

\`\`\`typescript
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface Employee {
  id: string
  name: string
  role: string
  status: 'active' | 'inactive'
}

interface EmployeeTableProps {
  data: Employee[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EmployeeTable({ data, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>姓名</TableHead>
          <TableHead>角色</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.role}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded ${
                employee.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {employee.status === 'active' ? '在职' : '离职'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit(employee.id)}
                >
                  编辑
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDelete(employee.id)}
                >
                  删除
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
\`\`\`

---

## 状态管理指南

### 1. 使用Zustand

\`\`\`typescript
// lib/stores/useEmployeeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Employee {
  id: string
  name: string
  email: string
}

interface EmployeeStore {
  // 状态
  employees: Employee[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchEmployees: () => Promise<void>
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [],
      loading: false,
      error: null,
      
      fetchEmployees: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/employees')
          const data = await response.json()
          set({ employees: data, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '获取失败',
            loading: false 
          })
        }
      },
      
      addEmployee: async (employee) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
          })
          const newEmployee = await response.json()
          set(state => ({
            employees: [...state.employees, newEmployee],
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '添加失败',
            loading: false 
          })
        }
      },
      
      updateEmployee: async (id, data) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/api/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          const updatedEmployee = await response.json()
          set(state => ({
            employees: state.employees.map(emp =>
              emp.id === id ? updatedEmployee : emp
            ),
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '更新失败',
            loading: false 
          })
        }
      },
      
      deleteEmployee: async (id) => {
        set({ loading: true, error: null })
        try {
          await fetch(`/api/employees/${id}`, { method: 'DELETE' })
          set(state => ({
            employees: state.employees.filter(emp => emp.id !== id),
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '删除失败',
            loading: false 
          })
        }
      }
    }),
    {
      name: 'employee-storage',
      // 只持久化部分状态
      partialize: (state) => ({ 
        employees: state.employees 
      })
    }
  )
)
\`\`\`

### 2. 在组件中使用

\`\`\`typescript
'use client'

import { useEffect } from 'react'
import { useEmployeeStore } from '@/lib/stores/useEmployeeStore'
import { Button } from '@/components/ui/button'

export function EmployeeList() {
  // 选择性订阅状态
  const employees = useEmployeeStore(state => state.employees)
  const loading = useEmployeeStore(state => state.loading)
  const fetchEmployees = useEmployeeStore(state => state.fetchEmployees)
  const deleteEmployee = useEmployeeStore(state => state.deleteEmployee)
  
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])
  
  if (loading) {
    return <div>加载中...</div>
  }
  
  return (
    <div>
      {employees.map(employee => (
        <div key={employee.id}>
          <span>{employee.name}</span>
          <Button onClick={() => deleteEmployee(employee.id)}>
            删除
          </Button>
        </div>
      ))}
    </div>
  )
}
\`\`\`

---

## API调用规范

### 1. API客户端封装

\`\`\`typescript
// lib/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

class APIClient {
  private client: AxiosInstance
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    
    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        // 统一错误处理
        if (error.response?.status === 401) {
          // 未认证，跳转登录
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config)
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config)
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config)
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config)
  }
}

export const apiClient = new APIClient()
\`\`\`

### 2. 使用API客户端

\`\`\`typescript
// lib/api/employees.ts
import { apiClient } from './client'

export interface Employee {
  id: string
  name: string
  email: string
}

export const employeeAPI = {
  // 获取员工列表
  getEmployees: () => {
    return apiClient.get<Employee[]>('/employees')
  },
  
  // 获取单个员工
  getEmployee: (id: string) => {
    return apiClient.get<Employee>(`/employees/${id}`)
  },
  
  // 创建员工
  createEmployee: (data: Omit<Employee, 'id'>) => {
    return apiClient.post<Employee>('/employees', data)
  },
  
  // 更新员工
  updateEmployee: (id: string, data: Partial<Employee>) => {
    return apiClient.put<Employee>(`/employees/${id}`, data)
  },
  
  // 删除员工
  deleteEmployee: (id: string) => {
    return apiClient.delete(`/employees/${id}`)
  }
}
\`\`\`

---

## 样式开发指南

### 1. Tailwind CSS 使用

\`\`\`typescript
// ✅ 使用Tailwind类名
export function Card() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2">标题</h3>
      <p className="text-gray-600">内容</p>
    </div>
  )
}

// ✅ 响应式设计
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 内容 */}
    </div>
  )
}

// ✅ 条件类名（使用cn工具函数）
import { cn } from '@/lib/utils'

export function Button({ 
  variant = 'default',
  className 
}: {
  variant?: 'default' | 'primary' | 'danger'
  className?: string
}) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium transition-colors',
        {
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'default',
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger'
        },
        className
      )}
    >
      按钮
    </button>
  )
}
\`\`\`

### 2. 自定义样式

\`\`\`typescript
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 全局基础样式 */
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  /* 自定义组件样式 */
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

@layer utilities {
  /* 自定义工具类 */
  .text-balance {
    text-wrap: balance;
  }
}
\`\`\`

---

## 动画开发指南

### 1. Framer Motion基础

\`\`\`typescript
'use client'

import { motion } from 'framer-motion'

// 淡入动画
export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// 滑入动画
export function SlideIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// 列表渐入动画
export function StaggeredList({ items }: { items: any[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}
\`\`\`

### 2. 页面切换动画

\`\`\`typescript
// components/layout/page-transition.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
\`\`\`

---

## 测试开发指南

### 1. 组件单元测试

\`\`\`typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>点击我</Button>)
    
    fireEvent.click(screen.getByText('点击我'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>点击我</Button>)
    expect(screen.getByText('点击我')).toBeDisabled()
  })
})
\`\`\`

### 2. API测试

\`\`\`typescript
// __tests__/api/employees.test.ts
import { employeeAPI } from '@/lib/api/employees'

// Mock fetch
global.fetch = jest.fn()

describe('Employee API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('fetches employees successfully', async () => {
    const mockEmployees = [
      { id: '1', name: '张三', email: 'zhang@example.com' }
    ]
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees
    })
    
    const employees = await employeeAPI.getEmployees()
    expect(employees).toEqual(mockEmployees)
  })
})
\`\`\`

---

## 性能优化指南

### 1. 代码分割

\`\`\`typescript
// 动态导入组件
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <div>加载中...</div>,
  ssr: false // 禁用服务端渲染
})
\`\`\`

### 2. 图片优化

\`\`\`typescript
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority // 优先加载
      placeholder="blur" // 模糊占位符
    />
  )
}
\`\`\`

### 3. 虚拟滚动

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function VirtualList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  })
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

---

## 调试技巧

### 1. React DevTools

\`\`\`bash
# 安装Chrome扩展后，在浏览器中打开DevTools
# Components标签: 查看组件树和props
# Profiler标签: 分析性能瓶颈
\`\`\`

### 2. Console调试

\`\`\`typescript
// 使用console.log调试
console.log('当前状态:', state)
console.table(employees) // 表格形式显示数组数据
console.time('fetchData') // 开始计时
await fetchData()
console.timeEnd('fetchData') // 结束计时

// 使用console.trace查看调用栈
console.trace('函数调用路径')

// 条件断点
if (process.env.NODE_ENV === 'development') {
  console.log('开发模式调试信息')
}
\`\`\`

### 3. VS Code调试配置

\`\`\`json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
\`\`\`

### 4. 网络请求调试

\`\`\`typescript
// 在API客户端中添加日志
this.client.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API请求:', config.method?.toUpperCase(), config.url)
      console.log('请求数据:', config.data)
    }
    return config
  }
)

this.client.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API响应:', response.config.url)
      console.log('响应数据:', response.data)
    }
    return response.data
  }
)
\`\`\`

---

## 常见问题

### Q1: 如何添加新的页面？

**A**: 在 `app/` 目录下创建新文件夹和 `page.tsx`：

\`\`\`typescript
// app/new-feature/page.tsx
export default function NewFeaturePage() {
  return (
    <div>
      <h1>新功能页面</h1>
    </div>
  )
}
\`\`\`

### Q2: 如何添加新的API路由？

**A**: 在 `app/api/` 目录下创建 `route.ts`：

\`\`\`typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(request: Request) {
  const data = await request.json()
  return NextResponse.json({ success: true, data })
}
\`\`\`

### Q3: 如何处理环境变量？

**A**: 在 `.env.local` 中添加变量，使用 `NEXT_PUBLIC_` 前缀的变量可在客户端访问：

\`\`\`env
# 服务端变量
DATABASE_URL=mysql://...

# 客户端变量（必须以NEXT_PUBLIC_开头）
NEXT_PUBLIC_API_URL=https://api.example.com
\`\`\`

\`\`\`typescript
// 服务端使用
const dbUrl = process.env.DATABASE_URL

// 客户端使用
const apiUrl = process.env.NEXT_PUBLIC_API_URL
\`\`\`

### Q4: 如何优化大列表性能？

**A**: 使用虚拟滚动或分页：

\`\`\`typescript
// 方式1: 虚拟滚动（参考上文虚拟滚动示例）

// 方式2: 分页
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function PaginatedList({ items }: { items: any[] }) {
  const [page, setPage] = useState(1)
  const pageSize = 20
  
  const paginatedItems = items.slice(
    (page - 1) * pageSize,
    page * pageSize
  )
  
  return (
    <>
      {paginatedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      <div className="flex gap-2 mt-4">
        <Button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          上一页
        </Button>
        <span>第 {page} 页</span>
        <Button 
          disabled={page * pageSize >= items.length}
          onClick={() => setPage(p => p + 1)}
        >
          下一页
        </Button>
      </div>
    </>
  )
}
\`\`\`

### Q5: 如何实现深色模式？

**A**: 使用 `next-themes`：

\`\`\`bash
npm install next-themes
\`\`\`

\`\`\`typescript
// components/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

// 主题切换按钮
'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      切换主题
    </Button>
  )
}
\`\`\`

### Q6: 如何处理文件上传？

**A**: 使用 FormData：

\`\`\`typescript
// 客户端上传
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  
  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      console.log('上传成功:', data)
    } catch (error) {
      console.error('上传失败:', error)
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? '上传中...' : '上传'}
      </Button>
    </div>
  )
}

// 服务端处理
// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: '没有文件' }, { status: 400 })
  }
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  // 保存文件
  const filename = Date.now() + '-' + file.name
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  await writeFile(filepath, buffer)
  
  return NextResponse.json({ 
    success: true, 
    url: `/uploads/${filename}` 
  })
}
\`\`\`

### Q7: 如何实现防抖和节流？

**A**: 创建自定义Hook：

\`\`\`typescript
// lib/hooks/use-debounce.ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// 使用示例
import { useState } from 'react'
import { useDebounce } from '@/lib/hooks/use-debounce'

export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
      console.log('搜索:', debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  )
}
\`\`\`

### Q8: 如何处理表单验证？

**A**: 参考上文"表单处理"章节，使用 React Hook Form + Zod。

### Q9: 如何实现国际化（i18n）？

**A**: 使用 `next-intl`：

\`\`\`bash
npm install next-intl
\`\`\`

\`\`\`typescript
// 配置文件
// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

export default withNextIntl({
  // Next.js配置
})

// 使用
'use client'

import { useTranslations } from 'next-intl'

export function Welcome() {
  const t = useTranslations('Index')
  
  return <h1>{t('title')}</h1>
}
\`\`\`

### Q10: 如何处理错误边界？

**A**: 创建 `error.tsx`：

\`\`\`typescript
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('页面错误:', error)
  }, [error])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">出错了！</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <Button onClick={reset}>重试</Button>
    </div>
  )
}
\`\`\`

---

## 🎓 学习资源

### 官方文档
- [Next.js 15文档](https://nextjs.org/docs)
- [React 19文档](https://react.dev)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [TypeScript手册](https://www.typescriptlang.org/docs)
- [Framer Motion文档](https://www.framer.com/motion)

### 推荐教程
- [Next.js学习路径](https://nextjs.org/learn)
- [React官方教程](https://react.dev/learn)
- [TypeScript深入理解](https://www.typescriptlang.org/docs/handbook/intro.html)

### 社区资源
- [Next.js GitHub](https://github.com/vercel/next.js)
- [shadcn/ui组件库](https://ui.shadcn.com)
- [Tailwind CSS Playground](https://play.tailwindcss.com)

---

## 📞 获取帮助

### 遇到问题时
1. 查阅本指南
2. 查看[FAQ文档](./FAQ.md)
3. 搜索[故障排查指南](./TROUBLESHOOTING.md)
4. 查看项目Issue
5. 联系技术支持团队

### 技术支持渠道
- 📧 邮件: dev-support@yyc3.com
- 💬 内部IM: 开发者交流群
- 📖 文档中心: [docs/INDEX.md](./INDEX.md)

---

## ✅ 检查清单

### 开发前
- [ ] 已安装所有必备工具
- [ ] 已配置环境变量
- [ ] 已熟悉项目结构
- [ ] 已阅读开发规范

### 开发中
- [ ] 代码符合TypeScript规范
- [ ] 组件有明确的类型定义
- [ ] 使用了正确的命名规范
- [ ] 添加了必要的注释
- [ ] 样式使用Tailwind CSS
- [ ] 状态管理使用Zustand
- [ ] API调用使用统一客户端

### 提交前
- [ ] 代码通过ESLint检查
- [ ] 代码已格式化（Prettier）
- [ ] 添加了单元测试
- [ ] 测试全部通过
- [ ] 功能已在本地验证
- [ ] 提交信息清晰明确

---

**祝您开发愉快！** 🎉

如有任何问题，请随时查阅文档或联系团队成员。

---

**最后更新**: 2025-01-18  
**文档版本**: v1.0  
**维护者**: 开发团队  
**适用版本**: v4.0

© 2025 启智网络科技有限公司
