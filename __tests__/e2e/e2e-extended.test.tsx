/**
 * @file e2e-extended.test.tsx
 * @description E2E测试扩展 - 端到端业务流程测试，覆盖主要用户交互场景
 * @module __tests__/e2e
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-06
 * @updated 2025-01-06
 */

import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// 🎭 E2E测试配置
const E2E_CONFIG = {
  APP_NAME: 'YYC³管理系统',
  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager', 
    STAFF: 'staff',
    VIEWER: 'viewer'
  },
  USER_TYPES: {
    SUPER_ADMIN: 'super-admin',
    BUSINESS_ADMIN: 'business-admin',
    OPERATIONS_MANAGER: 'operations-manager',
    SALES_REPRESENTATIVE: 'sales-representative',
    CUSTOMER_SERVICE: 'customer-service',
    STANDARD_USER: 'standard-user'
  },
  BUSINESS_SCENARIOS: [
    {
      id: 'complete-user-journey',
      name: '完整用户旅程',
      description: '从注册到成为高级会员的完整流程'
    },
    {
      id: 'order-processing-cycle',
      name: '订单处理周期',
      description: '从下单到订单完成的完整生命周期'
    },
    {
      id: 'product-catalog-management',
      name: '产品目录管理',
      description: '产品创建、编辑、分类管理的完整流程'
    },
    {
      id: 'customer-service-workflow',
      name: '客户服务工作流',
      description: '客户问题处理、投诉处理的完整流程'
    },
    {
      id: 'data-analytics-dashboard',
      name: '数据分析仪表盘',
      description: '数据查看、分析、报告生成的完整流程'
    },
    {
      id: 'system-administration',
      name: '系统管理流程',
      description: '用户管理、权限设置、系统配置的完整流程'
    }
  ],
  PERFORMANCE_THRESHOLDS: {
    PAGE_LOAD_TIME: 3000, // 3秒
    API_RESPONSE_TIME: 2000, // 2秒
    USER_INTERACTION_DELAY: 500, // 0.5秒
    FORM_SUBMISSION_TIME: 1000 // 1秒
  }
}

// 🎭 模拟用户类型管理
class MockUserTypeManager {
  private users: Map<string, any> = new Map()

  constructor() {
    // 初始化各种用户类型
    this.users.set('super-admin', {
      id: 'USER-SUPER-001',
      name: '超级管理员',
      email: 'super.admin@test.com',
      role: E2E_CONFIG.USER_TYPES.SUPER_ADMIN,
      permissions: ['all'],
      department: 'IT部门',
      joinDate: '2020-01-01',
      lastLogin: new Date().toISOString()
    })

    this.users.set('business-admin', {
      id: 'USER-BUSINESS-001',
      name: '业务管理员',
      email: 'business.admin@test.com',
      role: E2E_CONFIG.USER_TYPES.BUSINESS_ADMIN,
      permissions: ['manage_users', 'manage_orders', 'manage_products'],
      department: '业务部门',
      joinDate: '2021-03-15',
      lastLogin: new Date().toISOString()
    })

    this.users.set('operations-manager', {
      id: 'USER-OPS-001',
      name: '运营经理',
      email: 'ops.manager@test.com',
      role: E2E_CONFIG.USER_TYPES.OPERATIONS_MANAGER,
      permissions: ['manage_orders', 'view_analytics', 'manage_members'],
      department: '运营部门',
      joinDate: '2022-06-20',
      lastLogin: new Date().toISOString()
    })

    this.users.set('sales-rep', {
      id: 'USER-SALES-001',
      name: '销售代表',
      email: 'sales.rep@test.com',
      role: E2E_CONFIG.USER_TYPES.SALES_REPRESENTATIVE,
      permissions: ['view_customers', 'create_orders', 'view_reports'],
      department: '销售部门',
      joinDate: '2023-02-10',
      lastLogin: new Date().toISOString()
    })
  }

  getUser(type: string) {
    return this.users.get(type) || null
  }

  loginAs(type: string) {
    const user = this.getUser(type)
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    }
    throw new Error(`用户类型 ${type} 不存在`)
  }

  logout() {
    localStorage.removeItem('currentUser')
  }

  getCurrentUser() {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }
}

// 🎭 模拟业务流程管理器
class MockBusinessProcessManager {
  private processes: Map<string, any[]> = new Map()
  private activeProcesses: Set<string> = new Set()

  constructor() {
    this.processes.set('user-journey', [])
    this.processes.set('order-processing', [])
    this.processes.set('product-management', [])
    this.processes.set('customer-service', [])
    this.processes.set('analytics', [])
    this.processes.set('system-admin', [])
  }

  async startProcess(processType: string, initialData: any) {
    const processId = `process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    this.activeProcesses.add(processId)

    const process = {
      id: processId,
      type: processType,
      status: 'running',
      startTime: new Date().toISOString(),
      steps: [],
      currentStep: 0,
      data: initialData
    }

    this.processes.get(processType)?.push(process)
    return processId
  }

  async executeStep(processId: string, stepName: string, stepData: any) {
    const processes = Array.from(this.processes.values()).flat()
    const process = processes.find(p => p.id === processId)
    
    if (!process) {
      throw new Error(`进程 ${processId} 不存在`)
    }

    const step = {
      name: stepName,
      data: stepData,
      timestamp: new Date().toISOString(),
      status: 'completed'
    }

    process.steps.push(step)
    process.currentStep += 1

    // 模拟步骤执行延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

    return step
  }

  async completeProcess(processId: string, finalData: any) {
    const processes = Array.from(this.processes.values()).flat()
    const process = processes.find(p => p.id === processId)
    
    if (!process) {
      throw new Error(`进程 ${processId} 不存在`)
    }

    process.status = 'completed'
    process.endTime = new Date().toISOString()
    process.data = { ...process.data, ...finalData }
    this.activeProcesses.delete(processId)

    return process
  }

  getProcess(processId: string) {
    const processes = Array.from(this.processes.values()).flat()
    return processes.find(p => p.id === processId) || null
  }

  getProcessHistory(processType: string) {
    return this.processes.get(processType) || []
  }

  getActiveProcesses() {
    return Array.from(this.activeProcesses)
  }
}

// 🎭 模拟E2E应用
const createMockE2EApp = () => {
  const MockE2EApp: React.FC = () => {
    const [userManager] = React.useState(() => new MockUserTypeManager())
    const [processManager] = React.useState(() => new MockBusinessProcessManager())
    
    const [currentUser, setCurrentUser] = React.useState<any>(null)
    const [currentProcess, setCurrentProcess] = React.useState<any>(null)
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [navigationHistory, setNavigationHistory] = React.useState<string[]>(['/'])
    const [notifications, setNotifications] = React.useState<Array<{
      id: string
      type: 'info' | 'success' | 'warning' | 'error'
      title: string
      message: string
      timestamp: Date
      processId?: string
    }>>([])

    // 🔄 导航管理器
    const navigationManager = {
      navigateTo: (path: string, pageData?: any) => {
        setNavigationHistory(prev => [...prev, path])
        
        // 模拟页面加载时间
        setIsProcessing(true)
        setTimeout(() => {
          setIsProcessing(false)
        }, Math.random() * 1000 + 500)
      },

      goBack: () => {
        setNavigationHistory(prev => {
          if (prev.length > 1) {
            return prev.slice(0, -1)
          }
          return prev
        })
      },

      getCurrentPage: () => {
        return navigationHistory[navigationHistory.length - 1] || '/'
      },

      getBreadcrumb: () => {
        return navigationHistory
      }
    }

    // 🔔 通知管理器
    const notificationManager = {
      addNotification: (notification: Omit<typeof notifications[0], 'id' | 'timestamp'>) => {
        const newNotification = {
          id: `notification-${Date.now()}`,
          timestamp: new Date(),
          ...notification
        }
        setNotifications(prev => [...prev, newNotification])
        return newNotification.id
      },

      removeNotification: (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      },

      clearAll: () => {
        setNotifications([])
      }
    }

    // 🎭 用户身份验证管理
    const authManager = {
      login: (userType: string, credentials: any = {}) => {
        try {
          const user = userManager.loginAs(userType)
          setCurrentUser(user)
          notificationManager.addNotification({
            type: 'success',
            title: '登录成功',
            message: `欢迎回来，${user.name}！`
          })
          return user
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '登录失败',
            message: error instanceof Error ? error.message : '未知错误'
          })
          throw error
        }
      },

      logout: () => {
        userManager.logout()
        setCurrentUser(null)
        setCurrentProcess(null)
        notificationManager.addNotification({
          type: 'info',
          title: '已退出登录',
          message: '您已成功退出系统'
        })
      },

      getCurrentUser: () => {
        return currentUser || userManager.getCurrentUser()
      },

      hasPermission: (permission: string) => {
        const user = authManager.getCurrentUser()
        return user && (
          user.permissions.includes('all') || 
          user.permissions.includes(permission)
        )
      }
    }

    // 🎯 业务流程执行器
    const businessProcessExecutor = {
      // 完整用户旅程流程
      async executeUserJourney(userData: any) {
        const processId = await processManager.startProcess('user-journey', userData)
        setCurrentProcess({ id: processId, type: 'user-journey' })

        try {
          // 步骤1: 注册新用户
          await processManager.executeStep(processId, 'user-registration', userData)
          
          // 步骤2: 验证邮箱
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 步骤3: 完善个人资料
          const profileData = {
            ...userData,
            profile: {
              phone: userData.phone,
              address: userData.address,
              preferences: userData.preferences || {}
            }
          }
          await processManager.executeStep(processId, 'profile-completion', profileData)
          
          // 步骤4: 首次购买
          const orderData = {
            products: userData.initialProducts || [],
            totalAmount: userData.initialPurchaseAmount || 0,
            paymentMethod: 'credit_card'
          }
          await processManager.executeStep(processId, 'first-purchase', orderData)
          
          // 步骤5: 会员升级
          await new Promise(resolve => setTimeout(resolve, 1500))
          const memberUpgradeData = {
            newTier: userData.targetTier || 'gold',
            benefits: userData.benefits || ['discount', 'priority-support']
          }
          await processManager.executeStep(processId, 'member-tier-upgrade', memberUpgradeData)
          
          // 完成流程
          const finalProcess = await processManager.completeProcess(processId, {
            status: 'completed',
            completionTime: new Date().toISOString(),
            totalSteps: 5
          })

          notificationManager.addNotification({
            type: 'success',
            title: '用户旅程完成',
            message: '用户旅程流程已成功完成',
            processId
          })

          return finalProcess
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '用户旅程中断',
            message: error instanceof Error ? error.message : '未知错误',
            processId
          })
          throw error
        } finally {
          setCurrentProcess(null)
        }
      },

      // 订单处理周期流程
      async executeOrderProcessingCycle(orderData: any) {
        const processId = await processManager.startProcess('order-processing', orderData)
        setCurrentProcess({ id: processId, type: 'order-processing' })

        try {
          // 步骤1: 订单创建
          const newOrder = await processManager.executeStep(processId, 'order-creation', orderData)
          
          // 步骤2: 库存检查
          const inventoryData = {
            items: orderData.items || [],
            available: true,
            backorderItems: []
          }
          await processManager.executeStep(processId, 'inventory-check', inventoryData)
          
          // 步骤3: 支付验证
          const paymentData = {
            method: orderData.paymentMethod,
            amount: orderData.totalAmount,
            status: 'pending'
          }
          const paymentResult = await processManager.executeStep(processId, 'payment-verification', paymentData)
          
          // 步骤4: 订单处理
          const processingData = {
            orderId: newOrder.data.id,
            status: 'processing',
            estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2天后
          }
          await processManager.executeStep(processId, 'order-processing', processingData)
          
          // 步骤5: 包装和发货
          const shippingData = {
            orderId: newOrder.data.id,
            trackingNumber: `TRK-${Date.now()}`,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5天后
          }
          await processManager.executeStep(processId, 'shipping', shippingData)
          
          // 步骤6: 配送确认
          await new Promise(resolve => setTimeout(resolve, 2000))
          const deliveryData = {
            status: 'delivered',
            deliveredAt: new Date().toISOString(),
            signature: 'customer-signature'
          }
          await processManager.executeStep(processId, 'delivery-confirmation', deliveryData)
          
          // 步骤7: 客户服务跟进
          const followUpData = {
            surveySent: true,
            reviewRequest: true,
            supportTicket: null
          }
          await processManager.executeStep(processId, 'customer-follow-up', followUpData)

          const finalProcess = await processManager.completeProcess(processId, {
            status: 'completed',
            completionTime: new Date().toISOString(),
            totalSteps: 7,
            orderStatus: 'completed'
          })

          notificationManager.addNotification({
            type: 'success',
            title: '订单处理完成',
            message: '订单已成功完成整个处理周期',
            processId
          })

          return finalProcess
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '订单处理失败',
            message: error instanceof Error ? error.message : '未知错误',
            processId
          })
          throw error
        } finally {
          setCurrentProcess(null)
        }
      },

      // 产品目录管理流程
      async executeProductCatalogManagement(productData: any) {
        const processId = await processManager.startProcess('product-management', productData)
        setCurrentProcess({ id: processId, type: 'product-management' })

        try {
          // 步骤1: 产品信息录入
          const productInfo = await processManager.executeStep(processId, 'product-creation', productData)
          
          // 步骤2: 产品分类设置
          const categoryData = {
            primaryCategory: productData.category,
            subCategories: productData.subCategories || [],
            tags: productData.tags || []
          }
          await processManager.executeStep(processId, 'category-assignment', categoryData)
          
          // 步骤3: 价格策略设置
          const pricingData = {
            basePrice: productData.price,
            discountRules: productData.discountRules || [],
            tierPricing: productData.tierPricing || {}
          }
          await processManager.executeStep(processId, 'pricing-setup', pricingData)
          
          // 步骤4: 库存配置
          const inventoryData = {
            initialStock: productData.initialStock || 0,
            reorderLevel: productData.reorderLevel || 10,
            maxStock: productData.maxStock || 1000,
            trackingEnabled: true
          }
          await processManager.executeStep(processId, 'inventory-setup', inventoryData)
          
          // 步骤5: 产品上架
          await new Promise(resolve => setTimeout(resolve, 800))
          const launchData = {
            status: 'active',
            launchDate: new Date().toISOString(),
            visibility: 'public',
            featured: productData.featured || false
          }
          await processManager.executeStep(processId, 'product-launch', launchData)
          
          // 步骤6: 营销推广设置
          const marketingData = {
            promotions: productData.promotions || [],
            campaign: productData.campaign || null,
            seoKeywords: productData.keywords || []
          }
          await processManager.executeStep(processId, 'marketing-setup', marketingData)

          const finalProcess = await processManager.completeProcess(processId, {
            status: 'completed',
            completionTime: new Date().toISOString(),
            totalSteps: 6,
            productStatus: 'active'
          })

          notificationManager.addNotification({
            type: 'success',
            title: '产品目录更新完成',
            message: '产品已成功添加到目录并开始销售',
            processId
          })

          return finalProcess
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '产品目录管理失败',
            message: error instanceof Error ? error.message : '未知错误',
            processId
          })
          throw error
        } finally {
          setCurrentProcess(null)
        }
      },

      // 客户服务工作流程
      async executeCustomerServiceWorkflow(customerData: any) {
        const processId = await processManager.startProcess('customer-service', customerData)
        setCurrentProcess({ id: processId, type: 'customer-service' })

        try {
          // 步骤1: 客户问题接收
          const issueData = await processManager.executeStep(processId, 'issue-reception', customerData)
          
          // 步骤2: 问题分类
          const classificationData = {
            category: customerData.category,
            priority: customerData.priority || 'medium',
            department: customerData.department || 'general',
            estimatedResolution: customerData.estimatedResolution || 24
          }
          await processManager.executeStep(processId, 'issue-classification', classificationData)
          
          // 步骤3: 分配客服代表
          const assignmentData = {
            assignedAgent: customerData.agentId || 'agent-001',
            estimatedResponse: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2小时后
            escalationLevel: 1
          }
          await processManager.executeStep(processId, 'agent-assignment', assignmentData)
          
          // 步骤4: 初步响应
          await new Promise(resolve => setTimeout(resolve, 1500))
          const responseData = {
            responseSent: true,
            responseTime: new Date().toISOString(),
            nextSteps: ['investigate-issue', 'provide-solution']
          }
          await processManager.executeStep(processId, 'initial-response', responseData)
          
          // 步骤5: 问题调查
          const investigationData = {
            investigationSteps: customerData.investigationSteps || [],
            findings: customerData.findings || [],
            rootCause: customerData.rootCause || null
          }
          await processManager.executeStep(processId, 'issue-investigation', investigationData)
          
          // 步骤6: 解决方案实施
          const solutionData = {
            solution: customerData.solution,
            implementation: customerData.implementation || 'pending',
            customerNotified: false
          }
          await processManager.executeStep(processId, 'solution-implementation', solutionData)
          
          // 步骤7: 客户确认
          await new Promise(resolve => setTimeout(resolve, 1000))
          const confirmationData = {
            customerConfirmed: customerData.customerConfirmed || true,
            satisfactionRating: customerData.satisfactionRating || 4,
            followUpRequired: false
          }
          await processManager.executeStep(processId, 'customer-confirmation', confirmationData)
          
          // 步骤8: 案例归档
          const closureData = {
            status: 'resolved',
            resolutionDate: new Date().toISOString(),
            lessonsLearned: customerData.lessonsLearned || [],
            documentation: 'completed'
          }
          await processManager.executeStep(processId, 'case-closure', closureData)

          const finalProcess = await processManager.completeProcess(processId, {
            status: 'completed',
            completionTime: new Date().toISOString(),
            totalSteps: 8,
            customerSatisfaction: customerData.satisfactionRating || 4
          })

          notificationManager.addNotification({
            type: 'success',
            title: '客户服务流程完成',
            message: '客户问题已成功解决',
            processId
          })

          return finalProcess
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '客户服务流程失败',
            message: error instanceof Error ? error.message : '未知错误',
            processId
          })
          throw error
        } finally {
          setCurrentProcess(null)
        }
      },

      // 数据分析仪表盘流程
      async executeAnalyticsDashboardWorkflow(dashboardData: any) {
        const processId = await processManager.startProcess('analytics', dashboardData)
        setCurrentProcess({ id: processId, type: 'analytics' })

        try {
          // 步骤1: 数据源连接
          const connectionData = await processManager.executeStep(processId, 'data-source-connection', dashboardData)
          
          // 步骤2: 数据收集
          const collectionData = {
            dataSources: dashboardData.sources || ['users', 'orders', 'products'],
            dateRange: dashboardData.dateRange || 'last-30-days',
            completeness: 0.95
          }
          await processManager.executeStep(processId, 'data-collection', collectionData)
          
          // 步骤3: 数据清洗
          const cleaningData = {
            recordsProcessed: 10000,
            invalidRecordsRemoved: 50,
            duplicatesRemoved: 25,
            dataQualityScore: 0.97
          }
          await processManager.executeStep(processId, 'data-cleaning', cleaningData)
          
          // 步骤4: 指标计算
          await new Promise(resolve => setTimeout(resolve, 1200))
          const metricsData = {
            revenue: dashboardData.revenue || 125000,
            orders: dashboardData.orders || 250,
            customers: dashboardData.customers || 180,
            conversionRate: dashboardData.conversionRate || 0.15,
            avgOrderValue: dashboardData.avgOrderValue || 500
          }
          await processManager.executeStep(processId, 'metrics-calculation', metricsData)
          
          // 步骤5: 趋势分析
          const trendData = {
            trends: dashboardData.trends || ['growth', 'seasonal-pattern'],
            insights: dashboardData.insights || [
              '销量呈上升趋势',
              '移动端转化率提升',
              '新产品线表现良好'
            ],
            predictions: dashboardData.predictions || []
          }
          await processManager.executeStep(processId, 'trend-analysis', trendData)
          
          // 步骤6: 可视化生成
          const visualizationData = {
            charts: dashboardData.charts || ['revenue-trend', 'customer-growth', 'product-performance'],
            reports: dashboardData.reports || ['monthly-summary', 'executive-dashboard'],
            formats: ['pdf', 'excel', 'interactive-dashboard']
          }
          await processManager.executeStep(processId, 'visualization-generation', visualizationData)
          
          // 步骤7: 报告分发
          const distributionData = {
            recipients: dashboardData.recipients || ['executives', 'managers', 'teams'],
            deliveryMethod: dashboardData.deliveryMethod || 'email',
            scheduledDelivery: dashboardData.scheduledDelivery || 'immediate'
          }
          await processManager.executeStep(processId, 'report-distribution', distributionData)

          const finalProcess = await processManager.completeProcess(processId, {
            status: 'completed',
            completionTime: new Date().toISOString(),
            totalSteps: 7,
            dataAccuracy: 0.97,
            insightsGenerated: trendData.insights.length
          })

          notificationManager.addNotification({
            type: 'success',
            title: '数据分析流程完成',
            message: '数据分析仪表盘已更新并分发',
            processId
          })

          return finalProcess
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '数据分析流程失败',
            message: error instanceof Error ? error.message : '未知错误',
            processId
          })
          throw error
        } finally {
          setCurrentProcess(null)
        }
      },

      // 系统管理流程
      async executeSystemAdministrationWorkflow(adminData: any) {
        const processId = await processManager.startProcess('system-admin', adminData)
        setCurrentProcess({ id: processId, type: 'system-admin' })

        try {
          // 步骤1: 系统状态检查
          const systemData = await processManager.executeStep(processId, 'system-status-check', adminData)
          
          // 步骤2: 用户管理
          const userManagementData = {
            usersAffected: adminData.usersAffected || 0,
            newUsers: adminData.newUsers || [],
            userUpdates: adminData.userUpdates || [],
            permissionsChanged: adminData.permissionsChanged || []
          }
          await processManager.executeStep(processId, 'user-management', userManagementData)
          
          // 步骤3: 权限配置
          const permissionData = {
            rolesModified: adminData.rolesModified || [],
            permissionsAdded: adminData.permissionsAdded || [],
            permissionsRemoved: adminData.permissionsRemoved || [],
            securityPolicies: adminData.securityPolicies || []
          }
          await processManager.executeStep(processId, 'permission-configuration', permissionData)
          
          // 步骤4: 数据备份
          const backupData = {
            backupType: adminData.backupType || 'full',
            backupLocation: adminData.backupLocation || 'cloud',
            dataSize: adminData.dataSize || '10GB',
            verificationStatus: 'completed'
          }
          await processManager.executeStep(processId, 'data-backup', backupData)
          
          // 步骤5: 系统优化
          await new Promise(resolve => setTimeout(resolve, 1800))
          const optimizationData = {
            performanceImprovements: adminData.performanceImprovements || [
              'database-index-optimization',
              'cache-configuration',
              'query-optimization'
            ],
            securityUpdates: adminData.securityUpdates || [],
            systemHealthScore: adminData.systemHealthScore || 0.95
          }
          await processManager.executeStep(processId, 'system-optimization', optimizationData)
          
          // 步骤6: 合规性检查
          const complianceData = {
            regulationsChecked: adminData.regulationsChecked || ['gdpr', 'sox', 'iso27001'],
            violations: adminData.violations || [],
            recommendations: adminData.recommendations || [],
            complianceScore: adminData.complianceScore || 0.98
          }
          await processManager.executeStep(processId, 'compliance-check', complianceData)
          
          // 步骤7: 文档更新
          const documentationData = {
            documentsUpdated: adminData.documentsUpdated || [],
            processesDocumented: adminData.processesDocumented || [],
            knowledgeBase: 'updated',
            trainingMaterials: 'revised'
          }
          await processManager.executeStep(processId, 'documentation-update', documentationData)

          const finalProcess = await processManager.completeProcess(processId, {
            status: 'completed',
            completionTime: new Date().toISOString(),
            totalSteps: 7,
            systemHealthScore: optimizationData.systemHealthScore,
            complianceScore: complianceData.complianceScore
          })

          notificationManager.addNotification({
            type: 'success',
            title: '系统管理完成',
            message: '系统管理流程已成功执行',
            processId
          })

          return finalProcess
        } catch (error) {
          notificationManager.addNotification({
            type: 'error',
            title: '系统管理失败',
            message: error instanceof Error ? error.message : '未知错误',
            processId
          })
          throw error
        } finally {
          setCurrentProcess(null)
        }
      }
    }

    // 页面渲染函数
    const renderPage = () => {
      const currentPage = navigationManager.getCurrentPage()
      const user = authManager.getCurrentUser()

      // 根据当前页面渲染不同组件
      if (currentPage === '/login') {
        return (
          <LoginPage 
            userManager={userManager} 
            authManager={authManager}
            navigationManager={navigationManager}
          />
        )
      }

      if (currentPage === '/dashboard') {
        return (
          <DashboardPage 
            currentUser={user}
            navigationManager={navigationManager}
            processManager={processManager}
            businessProcessExecutor={businessProcessExecutor}
          />
        )
      }

      if (currentPage === '/user-journey') {
        return (
          <UserJourneyPage 
            currentUser={user}
            businessProcessExecutor={businessProcessExecutor}
            isProcessing={isProcessing}
          />
        )
      }

      if (currentPage === '/order-processing') {
        return (
          <OrderProcessingPage 
            currentUser={user}
            businessProcessExecutor={businessProcessExecutor}
            isProcessing={isProcessing}
          />
        )
      }

      if (currentPage === '/product-catalog') {
        return (
          <ProductCatalogPage 
            currentUser={user}
            businessProcessExecutor={businessProcessExecutor}
            isProcessing={isProcessing}
          />
        )
      }

      if (currentPage === '/customer-service') {
        return (
          <CustomerServicePage 
            currentUser={user}
            businessProcessExecutor={businessProcessExecutor}
            isProcessing={isProcessing}
          />
        )
      }

      if (currentPage === '/analytics') {
        return (
          <AnalyticsPage 
            currentUser={user}
            businessProcessExecutor={businessProcessExecutor}
            isProcessing={isProcessing}
          />
        )
      }

      if (currentPage === '/system-admin') {
        return (
          <SystemAdminPage 
            currentUser={user}
            businessProcessExecutor={businessProcessExecutor}
            isProcessing={isProcessing}
          />
        )
      }

      // 默认返回首页
      return (
        <HomePage 
          currentUser={user}
          navigationManager={navigationManager}
          processManager={processManager}
          businessProcessExecutor={businessProcessExecutor}
        />
      )
    }

    return (
      <div data-testid="e2e-app" className="e2e-app-container">
        {/* 顶部导航栏 */}
        <header className="app-header" data-testid="app-header">
          <div className="header-left">
            <h1 className="app-title">{E2E_CONFIG.APP_NAME}</h1>
          </div>
          
          <div className="header-center">
            {/* 面包屑导航 */}
            <nav className="breadcrumb-nav" data-testid="breadcrumb-nav">
              {navigationManager.getBreadcrumb().map((path, index) => (
                <span 
                  key={index}
                  className={`breadcrumb-item ${index === navigationManager.getBreadcrumb().length - 1 ? 'current' : ''}`}
                  onClick={() => index < navigationManager.getBreadcrumb().length - 1 && 
                    navigationManager.navigateTo(path)}
                >
                  {path === '/' ? '首页' : path.replace('/', '')}
                  {index < navigationManager.getBreadcrumb().length - 1 && <span className="breadcrumb-separator"> {'>'} </span>}
                </span>
              ))}
            </nav>
          </div>
          
          <div className="header-right">
            {/* 用户信息 */}
            {currentUser ? (
              <div className="user-profile" data-testid="user-profile">
                <span className="user-name" data-testid="header-user-name">{currentUser.name}</span>
                <span className="user-role">{currentUser.role}</span>
                <button 
                  onClick={() => authManager.logout()}
                  data-testid="header-logout-btn"
                >
                  退出
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigationManager.navigateTo('/login')}
                data-testid="header-login-btn"
              >
                登录
              </button>
            )}
          </div>
        </header>

        {/* 进程状态指示器 */}
        {currentProcess && (
          <div className="process-indicator" data-testid="process-indicator">
            <div className="process-info">
              <span className="process-type">正在执行: {currentProcess.type}</span>
              <div className="process-spinner">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
        )}

        {/* 主内容区域 */}
        <main className="app-main" data-testid="app-main">
          {renderPage()}
        </main>

        {/* 通知系统 */}
        <div className="notifications-container" data-testid="notifications-container">
          {notifications.slice(-3).map(notification => (
            <div 
              key={notification.id}
              className={`notification notification-${notification.type}`}
              data-testid={`notification-${notification.id}`}
            >
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-timestamp">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <button 
                onClick={() => notificationManager.removeNotification(notification.id)}
                className="notification-close"
                data-testid={`close-notification-${notification.id}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* 全局加载覆盖层 */}
        {isProcessing && (
          <div className="global-loading-overlay" data-testid="global-loading-overlay">
            <div className="loading-content">
              <div className="large-spinner"></div>
              <span>处理中...</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return MockE2EApp
}

// 🎭 登录页面组件
const LoginPage: React.FC<{
  userManager: MockUserTypeManager
  authManager: any
  navigationManager: any
}> = ({ userManager, authManager, navigationManager }) => {
  const [selectedUserType, setSelectedUserType] = React.useState('super-admin')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      authManager.login(selectedUserType)
      navigationManager.navigateTo('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-container">
        <h2>系统登录</h2>
        
        <form onSubmit={handleLogin} data-testid="login-form">
          <div className="user-type-selection">
            <label>选择用户类型:</label>
            <div className="user-type-options">
              {Object.entries(E2E_CONFIG.USER_TYPES).map(([key, value]) => (
                <label key={key} className="user-type-option">
                  <input
                    type="radio"
                    name="userType"
                    value={key}
                    checked={selectedUserType === key}
                    onChange={() => setSelectedUserType(key)}
                    data-testid={`user-type-${key}`}
                  />
                  <span className="user-type-label">
                    {userManager.getUser(key)?.name} ({value})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h3>快速操作:</h3>
            <div className="action-buttons">
              <button 
                type="button"
                onClick={() => authManager.login('super-admin') && navigationManager.navigateTo('/dashboard')}
                data-testid="quick-login-super-admin"
              >
                超级管理员登录
              </button>
              <button 
                type="button"
                onClick={() => authManager.login('business-admin') && navigationManager.navigateTo('/dashboard')}
                data-testid="quick-login-business-admin"
              >
                业务管理员登录
              </button>
              <button 
                type="button"
                onClick={() => authManager.login('operations-manager') && navigationManager.navigateTo('/dashboard')}
                data-testid="quick-login-ops-manager"
              >
                运营经理登录
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" data-testid="login-submit">
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

// 🎭 首页组件
const HomePage: React.FC<{
  currentUser: any
  navigationManager: any
  processManager: MockBusinessProcessManager
  businessProcessExecutor: any
}> = ({ currentUser, navigationManager, processManager, businessProcessExecutor }) => {
  const [systemStatus, setSystemStatus] = React.useState({
    uptime: '99.9%',
    activeUsers: 1234,
    systemLoad: 0.23,
    lastBackup: new Date().toISOString()
  })

  React.useEffect(() => {
    // 模拟系统状态更新
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 100) + 1200,
        systemLoad: Math.random() * 0.5
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!currentUser) {
    return (
      <div className="guest-homepage" data-testid="guest-homepage">
        <h2>欢迎使用 {E2E_CONFIG.APP_NAME}</h2>
        <p>请先登录以开始使用系统</p>
        <button 
          onClick={() => navigationManager.navigateTo('/login')}
          data-testid="go-to-login-btn"
        >
          前往登录
        </button>
      </div>
    )
  }

  return (
    <div className="homepage" data-testid="homepage">
      <div className="welcome-section">
        <h2>欢迎，{currentUser.name}!</h2>
        <p>您的角色: {currentUser.role}</p>
        <p>部门: {currentUser.department}</p>
      </div>

      <div className="system-overview">
        <h3>系统概览</h3>
        <div className="status-cards">
          <div className="status-card">
            <h4>系统运行时间</h4>
            <span className="status-value">{systemStatus.uptime}</span>
          </div>
          <div className="status-card">
            <h4>活跃用户</h4>
            <span className="status-value">{systemStatus.activeUsers}</span>
          </div>
          <div className="status-card">
            <h4>系统负载</h4>
            <span className="status-value">{(systemStatus.systemLoad * 100).toFixed(1)}%</span>
          </div>
          <div className="status-card">
            <h4>最后备份</h4>
            <span className="status-value">
              {new Date(systemStatus.lastBackup).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="process-scenarios">
        <h3>业务流程场景测试</h3>
        <div className="scenario-grid">
          {E2E_CONFIG.BUSINESS_SCENARIOS.map(scenario => (
            <div key={scenario.id} className="scenario-card" data-testid={`scenario-${scenario.id}`}>
              <h4>{scenario.name}</h4>
              <p>{scenario.description}</p>
              <button
                onClick={() => navigationManager.navigateTo(`/${scenario.id}`)}
                data-testid={`start-${scenario.id}-scenario`}
              >
                开始测试
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-processes">
        <h3>最近执行的流程</h3>
        <div className="processes-list">
          {Object.entries(E2E_CONFIG.BUSINESS_SCENARIOS).map(([key, scenario]) => {
            const history = processManager.getProcessHistory(key.replace('-', '_'))
            return (
              <div key={key} className="process-item" data-testid={`recent-process-${key}`}>
                <span className="process-name">{scenario.name}</span>
                <span className="process-count">执行次数: {history.length}</span>
                <span className="process-status">
                  {history.length > 0 ? `最后执行: ${new Date(history[history.length - 1].startTime).toLocaleString()}` : '未执行'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 🎭 用户旅程页面组件
const UserJourneyPage: React.FC<{
  currentUser: any
  businessProcessExecutor: any
  isProcessing: boolean
}> = ({ currentUser, businessProcessExecutor, isProcessing }) => {
  const [journeyData, setJourneyData] = React.useState({
    name: '测试用户',
    email: 'test@example.com',
    phone: '13800138000',
    address: '北京市朝阳区',
    initialProducts: [
      { id: 'PROD-001', name: '智能手机', price: 2999 },
      { id: 'PROD-002', name: '保护壳', price: 99 }
    ],
    initialPurchaseAmount: 3098,
    targetTier: 'gold',
    benefits: ['discount', 'priority-support', 'free-shipping']
  })

  const [executionProgress, setExecutionProgress] = React.useState<any[]>([])

  const handleExecuteJourney = async () => {
    try {
      setExecutionProgress([])
      
      const process = await businessProcessExecutor.executeUserJourney(journeyData)
      setExecutionProgress([{
        step: 'complete',
        status: 'success',
        message: '用户旅程已成功完成',
        timestamp: new Date()
      }])
    } catch (error) {
      setExecutionProgress([{
        step: 'error',
        status: 'error',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date()
      }])
    }
  }

  return (
    <div className="user-journey-page" data-testid="user-journey-page">
      <div className="page-header">
        <h2>完整用户旅程测试</h2>
        <p>测试从用户注册到成为高级会员的完整流程</p>
      </div>

      <div className="journey-form">
        <h3>用户旅程配置</h3>
        
        <div className="form-section">
          <h4>基本信息</h4>
          <div className="form-row">
            <label>姓名:</label>
            <input
              type="text"
              value={journeyData.name}
              onChange={(e) => setJourneyData(prev => ({ ...prev, name: e.target.value }))}
              data-testid="journey-name-input"
            />
          </div>
          
          <div className="form-row">
            <label>邮箱:</label>
            <input
              type="email"
              value={journeyData.email}
              onChange={(e) => setJourneyData(prev => ({ ...prev, email: e.target.value }))}
              data-testid="journey-email-input"
            />
          </div>
          
          <div className="form-row">
            <label>电话:</label>
            <input
              type="tel"
              value={journeyData.phone}
              onChange={(e) => setJourneyData(prev => ({ ...prev, phone: e.target.value }))}
              data-testid="journey-phone-input"
            />
          </div>
          
          <div className="form-row">
            <label>地址:</label>
            <input
              type="text"
              value={journeyData.address}
              onChange={(e) => setJourneyData(prev => ({ ...prev, address: e.target.value }))}
              data-testid="journey-address-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>购买信息</h4>
          <div className="form-row">
            <label>目标会员等级:</label>
            <select
              value={journeyData.targetTier}
              onChange={(e) => setJourneyData(prev => ({ ...prev, targetTier: e.target.value }))}
              data-testid="journey-tier-select"
            >
              <option value="bronze">青铜会员</option>
              <option value="silver">白银会员</option>
              <option value="gold">黄金会员</option>
              <option value="platinum">铂金会员</option>
              <option value="diamond">钻石会员</option>
            </select>
          </div>
          
          <div className="form-row">
            <label>首购金额:</label>
            <input
              type="number"
              value={journeyData.initialPurchaseAmount}
              onChange={(e) => setJourneyData(prev => ({ 
                ...prev, 
                initialPurchaseAmount: parseFloat(e.target.value) 
              }))}
              data-testid="journey-amount-input"
            />
          </div>
        </div>

        <button
          onClick={handleExecuteJourney}
          disabled={isProcessing}
          className="execute-journey-btn"
          data-testid="execute-journey-btn"
        >
          {isProcessing ? '执行中...' : '开始用户旅程'}
        </button>
      </div>

      <div className="execution-progress">
        <h3>执行进度</h3>
        {executionProgress.length === 0 ? (
          <div data-testid="no-progress">尚未开始执行</div>
        ) : (
          <div className="progress-list">
            {executionProgress.map((progress, index) => (
              <div
                key={index}
                className={`progress-item progress-${progress.status}`}
                data-testid={`progress-${index}`}
              >
                <span className="progress-message">{progress.message}</span>
                <span className="progress-time">
                  {progress.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="journey-overview">
        <h3>流程概览</h3>
        <div className="steps-overview">
          <div className="step-item">
            <span className="step-number">1</span>
            <span className="step-name">用户注册</span>
            <span className="step-description">创建新用户账户</span>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <span className="step-name">邮箱验证</span>
            <span className="step-description">验证用户邮箱地址</span>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <span className="step-name">完善资料</span>
            <span className="step-description">填写个人详细信息</span>
          </div>
          <div className="step-item">
            <span className="step-number">4</span>
            <span className="step-name">首次购买</span>
            <span className="step-description">完成首次订单</span>
          </div>
          <div className="step-item">
            <span className="step-number">5</span>
            <span className="step-name">会员升级</span>
            <span className="step-description">升级到目标会员等级</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🎭 订单处理页面组件
const OrderProcessingPage: React.FC<{
  currentUser: any
  businessProcessExecutor: any
  isProcessing: boolean
}> = ({ currentUser, businessProcessExecutor, isProcessing }) => {
  const [orderData, setOrderData] = React.useState({
    customerId: 'CUST-001',
    customerName: '张三',
    customerEmail: 'zhangsan@example.com',
    items: [
      { id: 'PROD-001', name: '智能手机', quantity: 1, price: 2999 },
      { id: 'PROD-002', name: '耳机', quantity: 1, price: 299 }
    ],
    totalAmount: 3298,
    paymentMethod: 'credit_card',
    shippingAddress: '北京市朝阳区xxx街道xxx号',
    priority: 'normal'
  })

  const [executionProgress, setExecutionProgress] = React.useState<any[]>([])

  const handleExecuteOrderProcessing = async () => {
    try {
      setExecutionProgress([])
      
      const process = await businessProcessExecutor.executeOrderProcessingCycle(orderData)
      setExecutionProgress([{
        step: 'complete',
        status: 'success',
        message: '订单处理周期已成功完成',
        timestamp: new Date()
      }])
    } catch (error) {
      setExecutionProgress([{
        step: 'error',
        status: 'error',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date()
      }])
    }
  }

  return (
    <div className="order-processing-page" data-testid="order-processing-page">
      <div className="page-header">
        <h2>订单处理周期测试</h2>
        <p>测试从下单到订单完成的完整生命周期</p>
      </div>

      <div className="order-form">
        <h3>订单配置</h3>
        
        <div className="form-section">
          <h4>客户信息</h4>
          <div className="form-row">
            <label>客户ID:</label>
            <input
              type="text"
              value={orderData.customerId}
              onChange={(e) => setOrderData(prev => ({ ...prev, customerId: e.target.value }))}
              data-testid="order-customer-id-input"
            />
          </div>
          
          <div className="form-row">
            <label>客户姓名:</label>
            <input
              type="text"
              value={orderData.customerName}
              onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
              data-testid="order-customer-name-input"
            />
          </div>
          
          <div className="form-row">
            <label>客户邮箱:</label>
            <input
              type="email"
              value={orderData.customerEmail}
              onChange={(e) => setOrderData(prev => ({ ...prev, customerEmail: e.target.value }))}
              data-testid="order-customer-email-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>订单详情</h4>
          <div className="form-row">
            <label>支付方式:</label>
            <select
              value={orderData.paymentMethod}
              onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              data-testid="order-payment-method-select"
            >
              <option value="credit_card">信用卡</option>
              <option value="debit_card">借记卡</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">银行转账</option>
              <option value="cash_on_delivery">货到付款</option>
            </select>
          </div>
          
          <div className="form-row">
            <label>订单优先级:</label>
            <select
              value={orderData.priority}
              onChange={(e) => setOrderData(prev => ({ ...prev, priority: e.target.value }))}
              data-testid="order-priority-select"
            >
              <option value="low">低</option>
              <option value="normal">普通</option>
              <option value="high">高</option>
              <option value="urgent">紧急</option>
            </select>
          </div>
          
          <div className="form-row">
            <label>配送地址:</label>
            <textarea
              value={orderData.shippingAddress}
              onChange={(e) => setOrderData(prev => ({ ...prev, shippingAddress: e.target.value }))}
              data-testid="order-shipping-address-textarea"
            />
          </div>
        </div>

        <div className="order-items">
          <h4>订单商品</h4>
          {orderData.items.map((item, index) => (
            <div key={item.id} className="order-item" data-testid={`order-item-${index}`}>
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">数量: {item.quantity}</span>
              <span className="item-price">价格: ¥{item.price}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>总计: ¥{orderData.totalAmount}</strong>
          </div>
        </div>

        <button
          onClick={handleExecuteOrderProcessing}
          disabled={isProcessing}
          className="execute-order-btn"
          data-testid="execute-order-btn"
        >
          {isProcessing ? '处理中...' : '开始订单处理'}
        </button>
      </div>

      <div className="execution-progress">
        <h3>执行进度</h3>
        {executionProgress.length === 0 ? (
          <div data-testid="no-order-progress">尚未开始处理</div>
        ) : (
          <div className="progress-list">
            {executionProgress.map((progress, index) => (
              <div
                key={index}
                className={`progress-item progress-${progress.status}`}
                data-testid={`order-progress-${index}`}
              >
                <span className="progress-message">{progress.message}</span>
                <span className="progress-time">
                  {progress.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="order-processing-overview">
        <h3>处理流程概览</h3>
        <div className="steps-overview">
          <div className="step-item">
            <span className="step-number">1</span>
            <span className="step-name">订单创建</span>
            <span className="step-description">创建新订单</span>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <span className="step-name">库存检查</span>
            <span className="step-description">验证商品库存</span>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <span className="step-name">支付验证</span>
            <span className="step-description">验证支付信息</span>
          </div>
          <div className="step-item">
            <span className="step-number">4</span>
            <span className="step-name">订单处理</span>
            <span className="step-description">处理订单</span>
          </div>
          <div className="step-item">
            <span className="step-number">5</span>
            <span className="step-name">包装发货</span>
            <span className="step-description">包装并发货</span>
          </div>
          <div className="step-item">
            <span className="step-number">6</span>
            <span className="step-name">配送确认</span>
            <span className="step-description">确认配送完成</span>
          </div>
          <div className="step-item">
            <span className="step-number">7</span>
            <span className="step-name">客户跟进</span>
            <span className="step-description">客户服务跟进</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🎭 产品目录管理页面组件
const ProductCatalogPage: React.FC<{
  currentUser: any
  businessProcessExecutor: any
  isProcessing: boolean
}> = ({ currentUser, businessProcessExecutor, isProcessing }) => {
  const [productData, setProductData] = React.useState({
    name: '智能手表',
    description: '新一代智能手表，具备健康监测功能',
    category: 'electronics',
    subCategories: ['wearables', 'fitness'],
    price: 1299,
    initialStock: 100,
    reorderLevel: 20,
    maxStock: 500,
    tags: ['smart', 'wearable', 'health'],
    featured: true,
    discountRules: [
      { type: 'bulk', threshold: 10, discount: 0.1 },
      { type: 'member', discount: 0.05 }
    ],
    tierPricing: {
      bronze: 1299,
      silver: 1199,
      gold: 1099,
      platinum: 999
    }
  })

  const [executionProgress, setExecutionProgress] = React.useState<any[]>([])

  const handleExecuteProductManagement = async () => {
    try {
      setExecutionProgress([])
      
      const process = await businessProcessExecutor.executeProductCatalogManagement(productData)
      setExecutionProgress([{
        step: 'complete',
        status: 'success',
        message: '产品目录管理流程已成功完成',
        timestamp: new Date()
      }])
    } catch (error) {
      setExecutionProgress([{
        step: 'error',
        status: 'error',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date()
      }])
    }
  }

  return (
    <div className="product-catalog-page" data-testid="product-catalog-page">
      <div className="page-header">
        <h2>产品目录管理测试</h2>
        <p>测试产品创建、编辑、分类管理的完整流程</p>
      </div>

      <div className="product-form">
        <h3>产品配置</h3>
        
        <div className="form-section">
          <h4>基本信息</h4>
          <div className="form-row">
            <label>产品名称:</label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
              data-testid="product-name-input"
            />
          </div>
          
          <div className="form-row">
            <label>产品描述:</label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
              data-testid="product-description-textarea"
            />
          </div>
          
          <div className="form-row">
            <label>产品分类:</label>
            <select
              value={productData.category}
              onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
              data-testid="product-category-select"
            >
              <option value="electronics">电子产品</option>
              <option value="clothing">服装</option>
              <option value="home">家居用品</option>
              <option value="sports">运动用品</option>
              <option value="books">图书</option>
            </select>
          </div>
          
          <div className="form-row">
            <label>价格:</label>
            <input
              type="number"
              value={productData.price}
              onChange={(e) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              data-testid="product-price-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>库存管理</h4>
          <div className="form-row">
            <label>初始库存:</label>
            <input
              type="number"
              value={productData.initialStock}
              onChange={(e) => setProductData(prev => ({ ...prev, initialStock: parseInt(e.target.value) }))}
              data-testid="product-initial-stock-input"
            />
          </div>
          
          <div className="form-row">
            <label>最低库存:</label>
            <input
              type="number"
              value={productData.reorderLevel}
              onChange={(e) => setProductData(prev => ({ ...prev, reorderLevel: parseInt(e.target.value) }))}
              data-testid="product-reorder-level-input"
            />
          </div>
          
          <div className="form-row">
            <label>最高库存:</label>
            <input
              type="number"
              value={productData.maxStock}
              onChange={(e) => setProductData(prev => ({ ...prev, maxStock: parseInt(e.target.value) }))}
              data-testid="product-max-stock-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>特性设置</h4>
          <div className="form-row">
            <label>
              <input
                type="checkbox"
                checked={productData.featured}
                onChange={(e) => setProductData(prev => ({ ...prev, featured: e.target.checked }))}
                data-testid="product-featured-checkbox"
              />
              推荐产品
            </label>
          </div>
        </div>

        <button
          onClick={handleExecuteProductManagement}
          disabled={isProcessing}
          className="execute-product-btn"
          data-testid="execute-product-btn"
        >
          {isProcessing ? '处理中...' : '开始产品管理'}
        </button>
      </div>

      <div className="execution-progress">
        <h3>执行进度</h3>
        {executionProgress.length === 0 ? (
          <div data-testid="no-product-progress">尚未开始管理</div>
        ) : (
          <div className="progress-list">
            {executionProgress.map((progress, index) => (
              <div
                key={index}
                className={`progress-item progress-${progress.status}`}
                data-testid={`product-progress-${index}`}
              >
                <span className="progress-message">{progress.message}</span>
                <span className="progress-time">
                  {progress.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="product-management-overview">
        <h3>管理流程概览</h3>
        <div className="steps-overview">
          <div className="step-item">
            <span className="step-number">1</span>
            <span className="step-name">产品创建</span>
            <span className="step-description">创建产品信息</span>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <span className="step-name">分类设置</span>
            <span className="step-description">设置产品分类</span>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <span className="step-name">价格策略</span>
            <span className="step-description">配置价格规则</span>
          </div>
          <div className="step-item">
            <span className="step-number">4</span>
            <span className="step-name">库存配置</span>
            <span className="step-description">配置库存参数</span>
          </div>
          <div className="step-item">
            <span className="step-number">5</span>
            <span className="step-name">产品上架</span>
            <span className="step-description">发布产品</span>
          </div>
          <div className="step-item">
            <span className="step-number">6</span>
            <span className="step-name">营销推广</span>
            <span className="step-description">设置营销活动</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🎭 客户服务工作流页面组件
const CustomerServicePage: React.FC<{
  currentUser: any
  businessProcessExecutor: any
  isProcessing: boolean
}> = ({ currentUser, businessProcessExecutor, isProcessing }) => {
  const [serviceData, setServiceData] = React.useState({
    customerId: 'CUST-001',
    customerName: '李四',
    category: 'product-issue',
    priority: 'medium',
    department: 'technical',
    agentId: 'agent-001',
    issue: '产品无法正常开机',
    investigationSteps: [
      '检查电源连接',
      '验证电池状态',
      '测试重启功能'
    ],
    findings: [
      '电源适配器故障',
      '电池需要更换'
    ],
    rootCause: '电源适配器损坏',
    solution: '更换新的电源适配器',
    customerConfirmed: true,
    satisfactionRating: 4,
    lessonsLearned: [
      '电源适配器质量问题',
      '需要加强供应商质量控制'
    ]
  })

  const [executionProgress, setExecutionProgress] = React.useState<any[]>([])

  const handleExecuteCustomerService = async () => {
    try {
      setExecutionProgress([])
      
      const process = await businessProcessExecutor.executeCustomerServiceWorkflow(serviceData)
      setExecutionProgress([{
        step: 'complete',
        status: 'success',
        message: '客户服务工作流程已成功完成',
        timestamp: new Date()
      }])
    } catch (error) {
      setExecutionProgress([{
        step: 'error',
        status: 'error',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date()
      }])
    }
  }

  return (
    <div className="customer-service-page" data-testid="customer-service-page">
      <div className="page-header">
        <h2>客户服务工作流测试</h2>
        <p>测试客户问题处理、投诉处理的完整流程</p>
      </div>

      <div className="service-form">
        <h3>客户服务配置</h3>
        
        <div className="form-section">
          <h4>客户信息</h4>
          <div className="form-row">
            <label>客户ID:</label>
            <input
              type="text"
              value={serviceData.customerId}
              onChange={(e) => setServiceData(prev => ({ ...prev, customerId: e.target.value }))}
              data-testid="service-customer-id-input"
            />
          </div>
          
          <div className="form-row">
            <label>客户姓名:</label>
            <input
              type="text"
              value={serviceData.customerName}
              onChange={(e) => setServiceData(prev => ({ ...prev, customerName: e.target.value }))}
              data-testid="service-customer-name-input"
            />
          </div>
          
          <div className="form-row">
            <label>问题类别:</label>
            <select
              value={serviceData.category}
              onChange={(e) => setServiceData(prev => ({ ...prev, category: e.target.value }))}
              data-testid="service-category-select"
            >
              <option value="product-issue">产品问题</option>
              <option value="billing">账单问题</option>
              <option value="shipping">配送问题</option>
              <option value="technical">技术支持</option>
              <option value="complaint">投诉</option>
            </select>
          </div>
          
          <div className="form-row">
            <label>优先级:</label>
            <select
              value={serviceData.priority}
              onChange={(e) => setServiceData(prev => ({ ...prev, priority: e.target.value }))}
              data-testid="service-priority-select"
            >
              <option value="low">低</option>
              <option value="medium">中等</option>
              <option value="high">高</option>
              <option value="urgent">紧急</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h4>问题描述</h4>
          <div className="form-row">
            <label>问题详情:</label>
            <textarea
              value={serviceData.issue}
              onChange={(e) => setServiceData(prev => ({ ...prev, issue: e.target.value }))}
              data-testid="service-issue-textarea"
            />
          </div>
          
          <div className="form-row">
            <label>解决方案:</label>
            <textarea
              value={serviceData.solution}
              onChange={(e) => setServiceData(prev => ({ ...prev, solution: e.target.value }))}
              data-testid="service-solution-textarea"
            />
          </div>
          
          <div className="form-row">
            <label>满意度评分 (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={serviceData.satisfactionRating}
              onChange={(e) => setServiceData(prev => ({ ...prev, satisfactionRating: parseInt(e.target.value) }))}
              data-testid="service-rating-input"
            />
          </div>
        </div>

        <button
          onClick={handleExecuteCustomerService}
          disabled={isProcessing}
          className="execute-service-btn"
          data-testid="execute-service-btn"
        >
          {isProcessing ? '处理中...' : '开始客户服务流程'}
        </button>
      </div>

      <div className="execution-progress">
        <h3>执行进度</h3>
        {executionProgress.length === 0 ? (
          <div data-testid="no-service-progress">尚未开始处理</div>
        ) : (
          <div className="progress-list">
            {executionProgress.map((progress, index) => (
              <div
                key={index}
                className={`progress-item progress-${progress.status}`}
                data-testid={`service-progress-${index}`}
              >
                <span className="progress-message">{progress.message}</span>
                <span className="progress-time">
                  {progress.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
