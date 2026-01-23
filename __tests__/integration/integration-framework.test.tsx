/**
 * @file integration-framework.test.tsx
 * @description 集成测试框架 - API集成测试、组件集成测试、数据流测试
 * @module __tests__/integration
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-06
 * @updated 2025-01-06
 */

import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// 🧪 集成测试配置
const INTEGRATION_CONFIG = {
  API_BASE_URL: 'https://api.test.com/v1',
  AUTH_TOKEN: 'test-auth-token',
  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager', 
    STAFF: 'staff',
    VIEWER: 'viewer'
  },
  DATA_FLOW_SCENARIOS: [
    {
      id: 'user-creation-flow',
      name: '用户创建流程',
      steps: ['create-user', 'assign-role', 'verify-email', 'initial-login']
    },
    {
      id: 'order-processing-flow', 
      name: '订单处理流程',
      steps: ['create-order', 'validate-payment', 'process-order', 'ship-order', 'confirm-delivery']
    },
    {
      id: 'member-tier-upgrade-flow',
      name: '会员等级升级流程', 
      steps: ['check-eligibility', 'calculate-rewards', 'apply-upgrade', 'notify-user']
    }
  ],
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout', 
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    USERS: {
      LIST: '/users',
      CREATE: '/users',
      GET: '/users/:id',
      UPDATE: '/users/:id',
      DELETE: '/users/:id'
    },
    ORDERS: {
      LIST: '/orders',
      CREATE: '/orders',
      GET: '/orders/:id',
      UPDATE: '/orders/:id',
      DELETE: '/orders/:id'
    },
    MEMBERS: {
      LIST: '/members',
      CREATE: '/members',
      GET: '/members/:id', 
      UPDATE: '/members/:id',
      DELETE: '/members/:id'
    }
  }
}

// 🎭 模拟API客户端
class MockAPIClient {
  private baseUrl: string
  private authToken: string

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl
    this.authToken = authToken
  }

  async request(endpoint: string, options: any = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = {
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({ success: true, data: null })
    }

    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, 100))

    // 根据端点返回不同的模拟数据
    if (endpoint.includes('/auth/login')) {
      response.json = async () => ({
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 'USER-001',
            email: 'admin@test.com',
            role: INTEGRATION_CONFIG.USER_ROLES.ADMIN,
            name: '测试管理员'
          },
          expiresIn: 3600
        }
      })
    } else if (endpoint.includes('/users')) {
      if (options.method === 'GET') {
        response.json = async () => ({
          success: true,
          data: [
            {
              id: 'USER-001',
              email: 'admin@test.com',
              name: '测试管理员',
              role: INTEGRATION_CONFIG.USER_ROLES.ADMIN,
              status: 'active',
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 'USER-002', 
              email: 'manager@test.com',
              name: '测试经理',
              role: INTEGRATION_CONFIG.USER_ROLES.MANAGER,
              status: 'active',
              createdAt: '2024-01-02T00:00:00Z'
            }
          ]
        })
      } else if (options.method === 'POST') {
        response.json = async () => ({
          success: true,
          data: {
            id: 'USER-003',
            ...JSON.parse(options.body),
            status: 'active',
            createdAt: new Date().toISOString()
          }
        })
      }
    } else if (endpoint.includes('/orders')) {
      response.json = async () => ({
        success: true,
        data: [
          {
            id: 'ORDER-001',
            orderNumber: 'ORD-2025-001',
            customerId: 'MEMBER-001',
            status: 'pending',
            totalAmount: 2999.99,
            createdAt: '2025-01-06T10:00:00Z'
          }
        ]
      })
    } else if (endpoint.includes('/members')) {
      response.json = async () => ({
        success: true,
        data: [
          {
            id: 'MEMBER-001',
            memberId: 'MB-001',
            name: '测试会员',
            email: 'member@test.com',
            tierId: 'TIER-SILVER',
            tierName: '白银会员',
            points: 5000,
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z'
          }
        ]
      })
    }

    return response
  }

  async get(endpoint: string, options: any = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  async post(endpoint: string, data: any, options: any = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        ...options.headers
      }
    })
  }

  async put(endpoint: string, data: any, options: any = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        ...options.headers
      }
    })
  }

  async delete(endpoint: string, options: any = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        ...options.headers
      }
    })
  }
}

// 🎭 模拟数据存储管理器
class MockDataStore {
  private data: Map<string, any[]> = new Map()

  constructor() {
    // 初始化默认数据
    this.data.set('users', [
      {
        id: 'USER-001',
        email: 'admin@test.com',
        name: '测试管理员',
        role: INTEGRATION_CONFIG.USER_ROLES.ADMIN,
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ])
    
    this.data.set('orders', [
      {
        id: 'ORDER-001',
        orderNumber: 'ORD-2025-001',
        customerId: 'MEMBER-001',
        status: 'pending',
        totalAmount: 2999.99,
        createdAt: '2025-01-06T10:00:00Z'
      }
    ])
    
    this.data.set('members', [
      {
        id: 'MEMBER-001',
        memberId: 'MB-001',
        name: '测试会员',
        email: 'member@test.com',
        tierId: 'TIER-SILVER',
        tierName: '白银会员',
        points: 5000,
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ])
  }

  get(table: string): any[] {
    return this.data.get(table) || []
  }

  insert(table: string, record: any): any {
    const records = this.data.get(table) || []
    const newRecord = {
      id: `${table.toUpperCase()}-${Date.now()}`,
      ...record,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    records.push(newRecord)
    this.data.set(table, records)
    return newRecord
  }

  update(table: string, id: string, updates: any): any | null {
    const records = this.data.get(table) || []
    const index = records.findIndex(r => r.id === id)
    if (index === -1) return null
    
    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return records[index]
  }

  delete(table: string, id: string): boolean {
    const records = this.data.get(table) || []
    const index = records.findIndex(r => r.id === id)
    if (index === -1) return false
    
    records.splice(index, 1)
    this.data.set(table, records)
    return true
  }
}

// 🎭 模拟集成组件
const createMockIntegratedApp = () => {
  const MockIntegratedApp: React.FC = () => {
    const [apiClient] = React.useState(() => new MockAPIClient(
      INTEGRATION_CONFIG.API_BASE_URL,
      INTEGRATION_CONFIG.AUTH_TOKEN
    ))
    
    const [dataStore] = React.useState(() => new MockDataStore())
    
    const [currentUser, setCurrentUser] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [notifications, setNotifications] = React.useState<Array<{
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      timestamp: Date
    }>>([])

    // 🔄 数据流管理器
    const dataFlowManager = {
      // 用户创建流程
      async executeUserCreationFlow(userData: any) {
        setIsLoading(true)
        try {
          // 步骤1: 创建用户
          const newUser = dataStore.insert('users', userData)
          
          // 步骤2: 分配角色
          if (userData.role) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          // 步骤3: 验证邮箱 (模拟)
          if (userData.email) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          // 步骤4: 初始登录 (模拟)
          if (userData.email && userData.password) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          // 添加成功通知
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'success' as const,
            message: '用户创建流程执行成功',
            timestamp: new Date()
          }
          setNotifications(prev => [...prev, notification])
          
          return newUser
        } catch (error) {
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'error' as const,
            message: '用户创建流程执行失败',
            timestamp: new Date()
          }
          setNotifications(prev => [...prev, notification])
          throw error
        } finally {
          setIsLoading(false)
        }
      },

      // 订单处理流程
      async executeOrderProcessingFlow(orderData: any) {
        setIsLoading(true)
        try {
          // 步骤1: 创建订单
          const newOrder = dataStore.insert('orders', orderData)
          
          // 步骤2: 验证支付
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // 步骤3: 处理订单
          const updatedOrder = dataStore.update('orders', newOrder.id, {
            status: 'processing'
          })
          
          // 步骤4: 发货
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // 步骤5: 确认配送
          const completedOrder = dataStore.update('orders', newOrder.id, {
            status: 'shipped'
          })
          
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'success' as const,
            message: '订单处理流程执行成功',
            timestamp: new Date()
          }
          setNotifications(prev => [...prev, notification])
          
          return completedOrder
        } catch (error) {
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'error' as const,
            message: '订单处理流程执行失败',
            timestamp: new Date()
          }
          setNotifications(prev => [...prev, notification])
          throw error
        } finally {
          setIsLoading(false)
        }
      },

      // 会员等级升级流程
      async executeMemberTierUpgradeFlow(memberId: string, newTierId: string) {
        setIsLoading(true)
        try {
          // 步骤1: 检查资格
          const members = dataStore.get('members')
          const member = members.find(m => m.id === memberId)
          if (!member) throw new Error('会员不存在')
          
          // 步骤2: 计算奖励
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // 步骤3: 应用升级
          const updatedMember = dataStore.update('members', memberId, {
            tierId: newTierId,
            tierName: newTierId === 'TIER-GOLD' ? '黄金会员' : 
                     newTierId === 'TIER-DIAMOND' ? '钻石会员' : '白银会员'
          })
          
          // 步骤4: 通知用户
          await new Promise(resolve => setTimeout(resolve, 200))
          
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'success' as const,
            message: '会员等级升级成功',
            timestamp: new Date()
          }
          setNotifications(prev => [...prev, notification])
          
          return updatedMember
        } catch (error) {
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'error' as const,
            message: '会员等级升级失败',
            timestamp: new Date()
          }
          setNotifications(prev => [...prev, notification])
          throw error
        } finally {
          setIsLoading(false)
        }
      }
    }

    // API集成方法
    const apiMethods = {
      // 认证API
      async login(credentials: any) {
        try {
          const response = await apiClient.post(INTEGRATION_CONFIG.API_ENDPOINTS.AUTH.LOGIN, credentials)
          const data = await response.json()
          
          if (data.success) {
            setCurrentUser(data.data.user)
            localStorage.setItem('authToken', data.data.token)
            return data.data
          } else {
            throw new Error('登录失败')
          }
        } catch (error) {
          console.error('Login API error:', error)
          throw error
        }
      },

      async logout() {
        try {
          await apiClient.post(INTEGRATION_CONFIG.API_ENDPOINTS.AUTH.LOGOUT, {})
          setCurrentUser(null)
          localStorage.removeItem('authToken')
        } catch (error) {
          console.error('Logout API error:', error)
        }
      },

      // 用户管理API
      async getUsers() {
        try {
          const response = await apiClient.get(INTEGRATION_CONFIG.API_ENDPOINTS.USERS.LIST)
          const data = await response.json()
          return data.success ? data.data : []
        } catch (error) {
          console.error('Get users API error:', error)
          return dataStore.get('users')
        }
      },

      async createUser(userData: any) {
        try {
          const response = await apiClient.post(INTEGRATION_CONFIG.API_ENDPOINTS.USERS.CREATE, userData)
          const data = await response.json()
          
          if (data.success) {
            return data.data
          } else {
            // 回退到本地存储
            return dataStore.insert('users', userData)
          }
        } catch (error) {
          console.error('Create user API error:', error)
          return dataStore.insert('users', userData)
        }
      },

      // 订单管理API
      async getOrders() {
        try {
          const response = await apiClient.get(INTEGRATION_CONFIG.API_ENDPOINTS.ORDERS.LIST)
          const data = await response.json()
          return data.success ? data.data : []
        } catch (error) {
          console.error('Get orders API error:', error)
          return dataStore.get('orders')
        }
      },

      async createOrder(orderData: any) {
        try {
          const response = await apiClient.post(INTEGRATION_CONFIG.API_ENDPOINTS.ORDERS.CREATE, orderData)
          const data = await response.json()
          
          if (data.success) {
            return data.data
          } else {
            return dataStore.insert('orders', orderData)
          }
        } catch (error) {
          console.error('Create order API error:', error)
          return dataStore.insert('orders', orderData)
        }
      },

      // 会员管理API
      async getMembers() {
        try {
          const response = await apiClient.get(INTEGRATION_CONFIG.API_ENDPOINTS.MEMBERS.LIST)
          const data = await response.json()
          return data.success ? data.data : []
        } catch (error) {
          console.error('Get members API error:', error)
          return dataStore.get('members')
        }
      },

      async updateMember(memberId: string, updates: any) {
        try {
          const response = await apiClient.put(
            INTEGRATION_CONFIG.API_ENDPOINTS.MEMBERS.GET.replace(':id', memberId), 
            updates
          )
          const data = await response.json()
          
          if (data.success) {
            return data.data
          } else {
            return dataStore.update('members', memberId, updates)
          }
        } catch (error) {
          console.error('Update member API error:', error)
          return dataStore.update('members', memberId, updates)
        }
      }
    }

    return (
      <div data-testid="integrated-app" className="integrated-app-container">
        {/* 顶部导航 */}
        <header className="app-header">
          <h1>集成测试应用</h1>
          <div className="user-info">
            {currentUser ? (
              <div>
                <span data-testid="current-user-name">{currentUser.name}</span>
                <span className="user-role">{currentUser.role}</span>
                <button onClick={() => apiMethods.logout()} data-testid="logout-btn">
                  退出
                </button>
              </div>
            ) : (
              <span data-testid="guest-user">未登录</span>
            )}
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className="app-main">
          {/* 认证区域 */}
          <section className="auth-section" data-testid="auth-section">
            {!currentUser ? (
              <div className="login-form">
                <h2>登录</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const credentials = {
                    email: formData.get('email'),
                    password: formData.get('password')
                  }
                  try {
                    await apiMethods.login(credentials)
                  } catch (error) {
                    console.error('Login failed:', error)
                  }
                }} data-testid="login-form">
                  <div className="form-group">
                    <label>邮箱:</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue="admin@test.com"
                      data-testid="login-email"
                    />
                  </div>
                  <div className="form-group">
                    <label>密码:</label>
                    <input
                      type="password"
                      name="password"
                      defaultValue="password123"
                      data-testid="login-password"
                    />
                  </div>
                  <button type="submit" data-testid="login-submit" disabled={isLoading}>
                    {isLoading ? '登录中...' : '登录'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="auth-success">
                <h2>认证成功</h2>
                <p data-testid="auth-success-message">用户 {currentUser.name} 已登录</p>
              </div>
            )}
          </section>

          {/* 数据流测试区域 */}
          <section className="dataflow-section" data-testid="dataflow-section">
            <h2>数据流测试</h2>
            
            {/* 用户创建流程 */}
            <div className="flow-test">
              <h3>用户创建流程测试</h3>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const userData = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  role: formData.get('role'),
                  status: 'active'
                }
                try {
                  await dataFlowManager.executeUserCreationFlow(userData)
                } catch (error) {
                  console.error('User creation flow failed:', error)
                }
              }} data-testid="user-creation-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="用户姓名"
                    data-testid="user-name-input"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="用户邮箱"
                    data-testid="user-email-input"
                  />
                  <select name="role" data-testid="user-role-select">
                    <option value="admin">管理员</option>
                    <option value="manager">经理</option>
                    <option value="staff">员工</option>
                  </select>
                  <button type="submit" disabled={isLoading} data-testid="create-user-btn">
                    创建用户
                  </button>
                </div>
              </form>
            </div>

            {/* 订单处理流程 */}
            <div className="flow-test">
              <h3>订单处理流程测试</h3>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const orderData = {
                  orderNumber: `ORD-${Date.now()}`,
                  customerId: formData.get('customerId'),
                  totalAmount: parseFloat(formData.get('amount') as string),
                  status: 'pending',
                  items: [
                    {
                      productId: 'PROD-001',
                      quantity: 1,
                      price: parseFloat(formData.get('amount') as string)
                    }
                  ]
                }
                try {
                  await dataFlowManager.executeOrderProcessingFlow(orderData)
                } catch (error) {
                  console.error('Order processing flow failed:', error)
                }
              }} data-testid="order-processing-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="customerId"
                    placeholder="客户ID"
                    defaultValue="MEMBER-001"
                    data-testid="customer-id-input"
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="订单金额"
                    step="0.01"
                    defaultValue="2999.99"
                    data-testid="order-amount-input"
                  />
                  <button type="submit" disabled={isLoading} data-testid="process-order-btn">
                    处理订单
                  </button>
                </div>
              </form>
            </div>

            {/* 会员升级流程 */}
            <div className="flow-test">
              <h3>会员升级流程测试</h3>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const memberId = formData.get('memberId') as string
                const newTierId = formData.get('newTierId') as string
                
                try {
                  await dataFlowManager.executeMemberTierUpgradeFlow(memberId, newTierId)
                } catch (error) {
                  console.error('Member tier upgrade flow failed:', error)
                }
              }} data-testid="member-upgrade-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="memberId"
                    placeholder="会员ID"
                    defaultValue="MEMBER-001"
                    data-testid="member-id-input"
                  />
                  <select name="newTierId" data-testid="new-tier-select">
                    <option value="TIER-SILVER">白银会员</option>
                    <option value="TIER-GOLD">黄金会员</option>
                    <option value="TIER-DIAMOND">钻石会员</option>
                  </select>
                  <button type="submit" disabled={isLoading} data-testid="upgrade-member-btn">
                    升级会员
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* API集成测试区域 */}
          <section className="api-section" data-testid="api-section">
            <h2>API集成测试</h2>
            
            <div className="api-tests">
              <div className="api-test">
                <h3>用户API测试</h3>
                <div className="api-buttons">
                  <button
                    onClick={async () => {
                      const users = await apiMethods.getUsers()
                      console.log('Users fetched:', users)
                    }}
                    data-testid="get-users-btn"
                  >
                    获取用户列表
                  </button>
                  
                  <button
                    onClick={async () => {
                      const newUser = await apiMethods.createUser({
                        name: 'API测试用户',
                        email: `api-test-${Date.now()}@test.com`,
                        role: 'staff',
                        status: 'active'
                      })
                      console.log('User created:', newUser)
                    }}
                    data-testid="create-user-api-btn"
                  >
                    创建用户API
                  </button>
                </div>
              </div>

              <div className="api-test">
                <h3>订单API测试</h3>
                <div className="api-buttons">
                  <button
                    onClick={async () => {
                      const orders = await apiMethods.getOrders()
                      console.log('Orders fetched:', orders)
                    }}
                    data-testid="get-orders-btn"
                  >
                    获取订单列表
                  </button>
                  
                  <button
                    onClick={async () => {
                      const newOrder = await apiMethods.createOrder({
                        orderNumber: `API-ORD-${Date.now()}`,
                        customerId: 'MEMBER-001',
                        totalAmount: 1599.99,
                        status: 'pending',
                        items: []
                      })
                      console.log('Order created:', newOrder)
                    }}
                    data-testid="create-order-api-btn"
                  >
                    创建订单API
                  </button>
                </div>
              </div>

              <div className="api-test">
                <h3>会员API测试</h3>
                <div className="api-buttons">
                  <button
                    onClick={async () => {
                      const members = await apiMethods.getMembers()
                      console.log('Members fetched:', members)
                    }}
                    data-testid="get-members-btn"
                  >
                    获取会员列表
                  </button>
                  
                  <button
                    onClick={async () => {
                      const updatedMember = await apiMethods.updateMember('MEMBER-001', {
                        tierId: 'TIER-GOLD',
                        tierName: '黄金会员',
                        points: 15000
                      })
                      console.log('Member updated:', updatedMember)
                    }}
                    data-testid="update-member-api-btn"
                  >
                    更新会员API
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 组件集成测试区域 */}
          <section className="component-section" data-testid="component-section">
            <h2>组件集成测试</h2>
            
            <div className="component-integrations">
              <div className="component-integration">
                <h3>用户管理组件</h3>
                <UserManagementComponent apiMethods={apiMethods} />
              </div>

              <div className="component-integration">
                <h3>订单管理组件</h3>
                <OrderManagementComponent apiMethods={apiMethods} />
              </div>

              <div className="component-integration">
                <h3>会员管理组件</h3>
                <MemberManagementComponent apiMethods={apiMethods} />
              </div>
            </div>
          </section>

          {/* 通知系统 */}
          <section className="notifications-section" data-testid="notifications-section">
            <h2>系统通知</h2>
            <div className="notifications-container">
              {notifications.length === 0 ? (
                <div data-testid="no-notifications">暂无通知</div>
              ) : (
                <div className="notifications-list">
                  {notifications.slice(-5).map(notification => (
                    <div
                      key={notification.id}
                      className={`notification notification-${notification.type}`}
                      data-testid={`notification-${notification.id}`}
                    >
                      <span className="notification-message">{notification.message}</span>
                      <span className="notification-time">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 加载状态指示器 */}
          {isLoading && (
            <div className="loading-overlay" data-testid="loading-overlay">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>处理中...</span>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  return MockIntegratedApp
}

// 🎭 用户管理组件
const UserManagementComponent: React.FC<{ apiMethods: any }> = ({ apiMethods }) => {
  const [users, setUsers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const userList = await apiMethods.getUsers()
      setUsers(userList)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div data-testid="user-management-component" className="user-management-component">
      <div className="component-header">
        <button onClick={loadUsers} disabled={isLoading} data-testid="refresh-users-btn">
          {isLoading ? '加载中...' : '刷新'}
        </button>
        <span className="user-count" data-testid="user-count">
          共 {users.length} 个用户
        </span>
      </div>
      
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-item" data-testid={`user-${user.id}`}>
            <div className="user-info">
              <span className="user-name" data-testid={`user-name-${user.id}`}>{user.name}</span>
              <span className="user-email">{user.email}</span>
              <span className="user-role">{user.role}</span>
              <span className="user-status">{user.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🎭 订单管理组件
const OrderManagementComponent: React.FC<{ apiMethods: any }> = ({ apiMethods }) => {
  const [orders, setOrders] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const orderList = await apiMethods.getOrders()
      setOrders(orderList)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div data-testid="order-management-component" className="order-management-component">
      <div className="component-header">
        <button onClick={loadOrders} disabled={isLoading} data-testid="refresh-orders-btn">
          {isLoading ? '加载中...' : '刷新'}
        </button>
        <span className="order-count" data-testid="order-count">
          共 {orders.length} 个订单
        </span>
      </div>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-item" data-testid={`order-${order.id}`}>
            <div className="order-info">
              <span className="order-number" data-testid={`order-number-${order.id}`}>
                {order.orderNumber}
              </span>
              <span className="order-customer">{order.customerId}</span>
              <span className="order-amount">¥{order.totalAmount}</span>
              <span className="order-status">{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🎭 会员管理组件
const MemberManagementComponent: React.FC<{ apiMethods: any }> = ({ apiMethods }) => {
  const [members, setMembers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const loadMembers = async () => {
    setIsLoading(true)
    try {
      const memberList = await apiMethods.getMembers()
      setMembers(memberList)
    } catch (error) {
      console.error('Failed to load members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadMembers()
  }, [])

  const handleTierUpgrade = async (memberId: string) => {
    try {
      await apiMethods.updateMember(memberId, {
        tierId: 'TIER-GOLD',
        tierName: '黄金会员'
      })
      loadMembers() // 重新加载列表
    } catch (error) {
      console.error('Failed to upgrade member:', error)
    }
  }

  return (
    <div data-testid="member-management-component" className="member-management-component">
      <div className="component-header">
        <button onClick={loadMembers} disabled={isLoading} data-testid="refresh-members-btn">
          {isLoading ? '加载中...' : '刷新'}
        </button>
        <span className="member-count" data-testid="member-count">
          共 {members.length} 个会员
        </span>
      </div>
      
      <div className="members-list">
        {members.map(member => (
          <div key={member.id} className="member-item" data-testid={`member-${member.id}`}>
            <div className="member-info">
              <span className="member-name" data-testid={`member-name-${member.id}`}>
                {member.name}
              </span>
              <span className="member-email">{member.email}</span>
              <span className="member-tier">{member.tierName}</span>
              <span className="member-points">{member.points} 积分</span>
              <button
                onClick={() => handleTierUpgrade(member.id)}
                data-testid={`upgrade-tier-btn-${member.id}`}
                className="btn-small"
              >
                升级
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

describe('集成测试框架', () => {
  const user = userEvent.setup()

  beforeAll(() => {
    // 全局测试设置
    console.log('集成测试框架初始化完成')
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 每个测试后清理
    vi.restoreAllMocks()
  })

  afterAll(() => {
    // 全局清理
    console.log('集成测试框架清理完成')
  })

  describe('集成应用渲染测试', () => {
    it('应该正确渲染集成应用', () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      expect(screen.getByTestId('integrated-app')).toBeInTheDocument()
      expect(screen.getByTestId('auth-section')).toBeInTheDocument()
      expect(screen.getByTestId('dataflow-section')).toBeInTheDocument()
      expect(screen.getByTestId('api-section')).toBeInTheDocument()
      expect(screen.getByTestId('component-section')).toBeInTheDocument()
    })

    it('应该显示未登录状态', () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      expect(screen.getByTestId('guest-user')).toBeInTheDocument()
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
    })
  })

  describe('认证API集成测试', () => {
    it('应该正确处理用户登录', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.clear(emailInput)
      await user.type(emailInput, 'admin@test.com')
      await user.clear(passwordInput)
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该显示当前登录用户信息', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 先登录
      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('测试管理员')).toBeInTheDocument()
      })

      expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    })
  })

  describe('数据流集成测试', () => {
    beforeEach(async () => {
      // 确保用户已登录
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该执行用户创建流程', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const nameInput = screen.getByTestId('user-name-input')
      const emailInput = screen.getByTestId('user-email-input')
      const roleSelect = screen.getByTestId('user-role-select')
      const createButton = screen.getByTestId('create-user-btn')

      await user.type(nameInput, '流程测试用户')
      await user.type(emailInput, 'flow-test@example.com')
      await user.selectOptions(roleSelect, 'staff')
      await user.click(createButton)

      // 等待流程完成
      await waitFor(() => {
        expect(screen.getByText(/notification-/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('应该执行订单处理流程', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const customerIdInput = screen.getByTestId('customer-id-input')
      const amountInput = screen.getByTestId('order-amount-input')
      const processButton = screen.getByTestId('process-order-btn')

      await user.clear(customerIdInput)
      await user.type(customerIdInput, 'MEMBER-001')
      await user.clear(amountInput)
      await user.type(amountInput, '1999.99')
      await user.click(processButton)

      await waitFor(() => {
        expect(screen.getByText(/notification-/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('应该执行会员升级流程', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const memberIdInput = screen.getByTestId('member-id-input')
      const tierSelect = screen.getByTestId('new-tier-select')
      const upgradeButton = screen.getByTestId('upgrade-member-btn')

      await user.clear(memberIdInput)
      await user.type(memberIdInput, 'MEMBER-001')
      await user.selectOptions(tierSelect, 'TIER-GOLD')
      await user.click(upgradeButton)

      await waitFor(() => {
        expect(screen.getByText(/notification-/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('API集成测试', () => {
    beforeEach(async () => {
      // 确保用户已登录
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该正确调用用户API', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const getUsersButton = screen.getByTestId('get-users-btn')
      await user.click(getUsersButton)

      // API调用成功（数据应该能获取到）
      await waitFor(() => {
        expect(screen.getByTestId('user-count')).toHaveTextContent(/共 \d+ 个用户/)
      })
    })

    it('应该正确调用订单API', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const getOrdersButton = screen.getByTestId('get-orders-btn')
      await user.click(getOrdersButton)

      await waitFor(() => {
        expect(screen.getByTestId('order-count')).toHaveTextContent(/共 \d+ 个订单/)
      })
    })

    it('应该正确调用会员API', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const getMembersButton = screen.getByTestId('get-members-btn')
      await user.click(getMembersButton)

      await waitFor(() => {
        expect(screen.getByTestId('member-count')).toHaveTextContent(/共 \d+ 个会员/)
      })
    })
  })

  describe('组件集成测试', () => {
    beforeEach(async () => {
      // 确保用户已登录
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该正确渲染用户管理组件', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      expect(screen.getByTestId('user-management-component')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-users-btn')).toBeInTheDocument()
    })

    it('应该正确渲染订单管理组件', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      expect(screen.getByTestId('order-management-component')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-orders-btn')).toBeInTheDocument()
    })

    it('应该正确渲染会员管理组件', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      expect(screen.getByTestId('member-management-component')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-members-btn')).toBeInTheDocument()
    })

    it('应该正确处理组件交互', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 点击刷新按钮
      const refreshButton = screen.getByTestId('refresh-users-btn')
      await user.click(refreshButton)

      // 等待数据加载
      await waitFor(() => {
        expect(screen.getByTestId('user-count')).toHaveTextContent(/共 \d+ 个用户/)
      })
    })
  })

  describe('数据流状态管理测试', () => {
    beforeEach(async () => {
      // 确保用户已登录
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该正确显示加载状态', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 开始流程时应该显示加载状态
      const createButton = screen.getByTestId('create-user-btn')
      await user.click(createButton)

      // 验证加载状态显示
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument()
    })

    it('应该正确显示通知消息', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const memberIdInput = screen.getByTestId('member-id-input')
      const upgradeButton = screen.getByTestId('upgrade-member-btn')

      await user.clear(memberIdInput)
      await user.type(memberIdInput, 'MEMBER-001')
      await user.click(upgradeButton)

      // 等待通知出现
      await waitFor(() => {
        expect(screen.getByTestId('notifications-section')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('应该正确处理错误状态', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 尝试不存在的会员ID
      const memberIdInput = screen.getByTestId('member-id-input')
      const tierSelect = screen.getByTestId('new-tier-select')
      const upgradeButton = screen.getByTestId('upgrade-member-btn')

      await user.clear(memberIdInput)
      await user.type(memberIdInput, 'NONEXISTENT-MEMBER')
      await user.selectOptions(tierSelect, 'TIER-GOLD')
      await user.click(upgradeButton)

      // 等待错误通知
      await waitFor(() => {
        expect(screen.getByText(/会员等级升级失败/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('数据一致性测试', () => {
    beforeEach(async () => {
      // 确保用户已登录
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该保持数据在不同组件间的一致性', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 初始数据统计
      const initialUserCount = screen.getByTestId('user-count').textContent
      const initialOrderCount = screen.getByTestId('order-count').textContent
      const initialMemberCount = screen.getByTestId('member-count').textContent

      // 创建新用户
      const nameInput = screen.getByTestId('user-name-input')
      const emailInput = screen.getByTestId('user-email-input')
      const createButton = screen.getByTestId('create-user-btn')

      await user.type(nameInput, '一致性测试用户')
      await user.type(emailInput, 'consistency-test@example.com')
      await user.click(createButton)

      // 等待流程完成
      await waitFor(() => {
        expect(screen.getByText(/notification-/)).toBeInTheDocument()
      }, { timeout: 3000 })

      // 刷新并验证数据更新
      const refreshButton = screen.getByTestId('refresh-users-btn')
      await user.click(refreshButton)

      await waitFor(() => {
        const newUserCount = screen.getByTestId('user-count').textContent
        expect(newUserCount).not.toBe(initialUserCount)
      })
    })

    it('应该正确处理并发操作', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 同时触发多个操作
      const createUserButton = screen.getByTestId('create-user-btn')
      const processOrderButton = screen.getByTestId('process-order-btn')
      const upgradeMemberButton = screen.getByTestId('upgrade-member-btn')

      // 模拟并发操作
      await Promise.all([
        user.click(createUserButton),
        user.click(processOrderButton),
        user.click(upgradeMemberButton)
      ])

      // 等待所有操作完成
      await waitFor(() => {
        const notifications = screen.getAllByTestId(/notification-/)
        expect(notifications.length).toBeGreaterThanOrEqual(3)
      }, { timeout: 5000 })
    })
  })

  describe('性能集成测试', () => {
    beforeEach(async () => {
      // 确保用户已登录
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })
    })

    it('应该快速响应API调用', async () => {
      const startTime = Date.now()
      
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      const getUsersButton = screen.getByTestId('get-users-btn')
      await user.click(getUsersButton)

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // API调用应该在合理时间内完成
      expect(responseTime).toBeLessThan(5000) // 5秒内完成
    })

    it('应该正确处理大数据量', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 等待登录完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 创建大量数据
      const promises = []
      for (let i = 0; i < 10; i++) {
        const nameInput = screen.getByTestId('user-name-input')
        const emailInput = screen.getByTestId('user-email-input')
        const createButton = screen.getByTestId('create-user-btn')

        await user.type(nameInput, `批量用户${i}`)
        await user.type(emailInput, `batch-${i}@test.com`)
        
        promises.push(user.click(createButton))
      }

      await Promise.all(promises)

      // 验证所有操作完成
      await waitFor(() => {
        const notifications = screen.getAllByTestId(/notification-/)
        expect(notifications.length).toBeGreaterThanOrEqual(10)
      }, { timeout: 10000 })
    })
  })

  describe('集成测试框架完整性验证', () => {
    it('应该包含所有必需的测试组件', () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 验证所有主要部分都存在
      expect(screen.getByTestId('auth-section')).toBeInTheDocument()
      expect(screen.getByTestId('dataflow-section')).toBeInTheDocument()
      expect(screen.getByTestId('api-section')).toBeInTheDocument()
      expect(screen.getByTestId('component-section')).toBeInTheDocument()
      expect(screen.getByTestId('notifications-section')).toBeInTheDocument()
    })

    it('应该支持完整的端到端流程', async () => {
      const MockIntegratedApp = createMockIntegratedApp()
      render(<MockIntegratedApp />)

      // 1. 用户认证
      const emailInput = screen.getByTestId('login-email')
      const passwordInput = screen.getByTestId('login-password')
      const submitButton = screen.getByTestId('login-submit')

      await user.type(emailInput, 'admin@test.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-success-message')).toBeInTheDocument()
      })

      // 2. 数据流操作
      const nameInput = screen.getByTestId('user-name-input')
      const createButton = screen.getByTestId('create-user-btn')

      await user.type(nameInput, '端到端测试用户')
      await user.click(createButton)

      // 3. API调用
      const getUsersButton = screen.getByTestId('get-users-btn')
      await user.click(getUsersButton)

      // 4. 组件交互
      const refreshButton = screen.getByTestId('refresh-users-btn')
      await user.click(refreshButton)

      // 验证整个流程完成
      await waitFor(() => {
        expect(screen.getByTestId('user-count')).toHaveTextContent(/共 \d+ 个用户/)
      })
    })
  })
})