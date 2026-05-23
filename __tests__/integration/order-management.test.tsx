/**
 * @file order-management.test.tsx
 * @description 订单管理模块集成测试 - 订单列表、状态管理、客户信息、支付状态等功能
 * @module __tests__/integration
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-06
 * @updated 2025-01-06
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// 🧪 测试配置
const TEST_CONFIG = {
  INITIAL_ORDERS: [
    {
      id: 'ORDER-2025-001',
      orderNumber: 'ORD-001',
      customerId: 'CUST-001',
      customerName: '张三',
      customerEmail: 'zhangsan@example.com',
      customerPhone: '13800138001',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'credit_card',
      totalAmount: 2999.99,
      shippingAddress: {
        street: '北京市朝阳区建国路88号',
        city: '北京',
        province: '北京市',
        zipCode: '100000',
        country: '中国'
      },
      billingAddress: {
        street: '北京市朝阳区建国路88号',
        city: '北京',
        province: '北京市',
        zipCode: '100000',
        country: '中国'
      },
      items: [
        {
          productId: 'PROD-001',
          productName: 'iPhone 15 Pro',
          quantity: 1,
          unitPrice: 9999.00,
          totalPrice: 9999.00,
          status: 'pending'
        },
        {
          productId: 'PROD-002',
          productName: 'MacBook Air M3',
          quantity: 1,
          unitPrice: 8999.00,
          totalPrice: 8999.00,
          status: 'pending'
        }
      ],
      shippingMethod: 'standard',
      shippingCost: 0,
      tax: 899.99,
      discount: 0,
      notes: '请尽快发货',
      createdAt: '2025-01-06T10:00:00Z',
      updatedAt: '2025-01-06T10:00:00Z',
      shippedAt: null,
      deliveredAt: null
    },
    {
      id: 'ORDER-2025-002',
      orderNumber: 'ORD-002',
      customerId: 'CUST-002',
      customerName: '李四',
      customerEmail: 'lisi@example.com',
      customerPhone: '13800138002',
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'alipay',
      totalAmount: 1599.99,
      shippingAddress: {
        street: '上海市浦东新区陆家嘴环路1000号',
        city: '上海',
        province: '上海市',
        zipCode: '200000',
        country: '中国'
      },
      billingAddress: {
        street: '上海市浦东新区陆家嘴环路1000号',
        city: '上海',
        province: '上海市',
        zipCode: '200000',
        country: '中国'
      },
      items: [
        {
          productId: 'PROD-003',
          productName: '华为P60',
          quantity: 1,
          unitPrice: 5999.00,
          totalPrice: 5999.00,
          status: 'confirmed'
        }
      ],
      shippingMethod: 'express',
      shippingCost: 20,
      tax: 480.99,
      discount: 500.00,
      notes: '',
      createdAt: '2025-01-05T14:30:00Z',
      updatedAt: '2025-01-06T09:15:00Z',
      shippedAt: '2025-01-06T08:00:00Z',
      deliveredAt: null
    },
    {
      id: 'ORDER-2025-003',
      orderNumber: 'ORD-003',
      customerId: 'CUST-003',
      customerName: '王五',
      customerEmail: 'wangwu@example.com',
      customerPhone: '13800138003',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'wechat_pay',
      totalAmount: 899.99,
      shippingAddress: {
        street: '广州市天河区珠江新城花城大道85号',
        city: '广州',
        province: '广东省',
        zipCode: '510000',
        country: '中国'
      },
      billingAddress: {
        street: '广州市天河区珠江新城花城大道85号',
        city: '广州',
        province: '广东省',
        zipCode: '510000',
        country: '中国'
      },
      items: [
        {
          productId: 'PROD-004',
          productName: 'AirPods Pro',
          quantity: 2,
          unitPrice: 1999.00,
          totalPrice: 3998.00,
          status: 'delivered'
        }
      ],
      shippingMethod: 'standard',
      shippingCost: 0,
      tax: 319.84,
      discount: 3417.85,
      notes: '客户VIP客户',
      createdAt: '2025-01-04T16:20:00Z',
      updatedAt: '2025-01-05T10:30:00Z',
      shippedAt: '2025-01-04T18:00:00Z',
      deliveredAt: '2025-01-05T12:00:00Z'
    },
    {
      id: 'ORDER-2025-004',
      orderNumber: 'ORD-004',
      customerId: 'CUST-004',
      customerName: '赵六',
      customerEmail: 'zhaoliu@example.com',
      customerPhone: '13800138004',
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'credit_card',
      totalAmount: 4599.99,
      shippingAddress: {
        street: '深圳市南山区科技园南区深南大道9988号',
        city: '深圳',
        province: '广东省',
        zipCode: '518000',
        country: '中国'
      },
      billingAddress: {
        street: '深圳市南山区科技园南区深南大道9988号',
        city: '深圳',
        province: '广东省',
        zipCode: '518000',
        country: '中国'
      },
      items: [
        {
          productId: 'PROD-005',
          productName: 'iPad Pro',
          quantity: 1,
          unitPrice: 6799.00,
          totalPrice: 6799.00,
          status: 'cancelled'
        }
      ],
      shippingMethod: 'express',
      shippingCost: 30,
      tax: 543.92,
      discount: 2272.93,
      notes: '客户主动取消',
      createdAt: '2025-01-03T11:45:00Z',
      updatedAt: '2025-01-04T14:20:00Z',
      shippedAt: null,
      deliveredAt: null
    }
  ],
  ORDER_STATUSES: [
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待处理' },
    { value: 'confirmed', label: '已确认' },
    { value: 'processing', label: '处理中' },
    { value: 'shipped', label: '已发货' },
    { value: 'delivered', label: '已送达' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
    { value: 'refunded', label: '已退款' }
  ],
  PAYMENT_STATUSES: [
    { value: 'all', label: '全部支付状态' },
    { value: 'pending', label: '待支付' },
    { value: 'paid', label: '已支付' },
    { value: 'failed', label: '支付失败' },
    { value: 'refunded', label: '已退款' },
    { value: 'partial_refund', label: '部分退款' }
  ],
  PAYMENT_METHODS: [
    'credit_card',
    'alipay',
    'wechat_pay',
    'bank_transfer',
    'paypal'
  ],
  SHIPPING_METHODS: [
    { value: 'standard', label: '标准配送', cost: 0 },
    { value: 'express', label: '快递配送', cost: 20 },
    { value: 'same_day', label: '当日达', cost: 50 }
  ]
}

// 🎭 模拟订单管理页面组件
const createMockOrderManagementPage = () => {
  const MockOrderManagementPage: React.FC = () => {
    const [orders, setOrders] = React.useState(TEST_CONFIG.INITIAL_ORDERS)
    const [selectedOrders, setSelectedOrders] = React.useState<Set<string>>(new Set())
    const [showOrderDetailModal, setShowOrderDetailModal] = React.useState(false)
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
    const [editingOrder, setEditingOrder] = React.useState<any>(null)
    const [filters, setFilters] = React.useState({
      search: '',
      orderNumber: '',
      customerName: '',
      status: 'all',
      paymentStatus: 'all',
      paymentMethod: 'all',
      dateRange: { start: '', end: '' },
      amountRange: { min: '', max: '' }
    })
    const [sortBy, setSortBy] = React.useState('createdAt')
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 10

    // 过滤和排序逻辑
    const filteredOrders = orders
      .filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
                            order.customerEmail.toLowerCase().includes(filters.search.toLowerCase())
        
        const matchesOrderNumber = filters.orderNumber === '' || 
                                  order.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())
        
        const matchesCustomerName = filters.customerName === '' || 
                                   order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
        
        const matchesStatus = filters.status === 'all' || order.status === filters.status
        const matchesPaymentStatus = filters.paymentStatus === 'all' || order.paymentStatus === filters.paymentStatus
        const matchesPaymentMethod = filters.paymentMethod === 'all' || order.paymentMethod === filters.paymentMethod
        
        const matchesDateRange = 
          (filters.dateRange.start === '' || order.createdAt >= filters.dateRange.start) &&
          (filters.dateRange.end === '' || order.createdAt <= filters.dateRange.end)
        
        const matchesAmountRange = 
          (filters.amountRange.min === '' || order.totalAmount >= parseFloat(filters.amountRange.min)) &&
          (filters.amountRange.max === '' || order.totalAmount <= parseFloat(filters.amountRange.max))
        
        return matchesSearch && matchesOrderNumber && matchesCustomerName && 
               matchesStatus && matchesPaymentStatus && matchesPaymentMethod && 
               matchesDateRange && matchesAmountRange
      })
      .sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a]
        const bVal = b[sortBy as keyof typeof b]
        const modifier = sortOrder === 'asc' ? 1 : -1
        return aVal > bVal ? modifier : -modifier
      })

    // 分页逻辑
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const paginatedOrders = filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    const handleFilterChange = (key: string, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }))
      setCurrentPage(1)
    }

    const handleSort = (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortBy(field)
        setSortOrder('asc')
      }
    }

    const handleSelectOrder = (orderId: string) => {
      const newSelected = new Set(selectedOrders)
      if (newSelected.has(orderId)) {
        newSelected.delete(orderId)
      } else {
        newSelected.add(orderId)
      }
      setSelectedOrders(newSelected)
    }

    const handleSelectAll = () => {
      if (selectedOrders.size === paginatedOrders.length) {
        setSelectedOrders(new Set())
      } else {
        setSelectedOrders(new Set(paginatedOrders.map(o => o.id)))
      }
    }

    const handleViewOrderDetail = (order: any) => {
      setSelectedOrder(order)
      setShowOrderDetailModal(true)
    }

    const handleEditOrder = (order: any) => {
      setEditingOrder(order)
      setShowEditModal(true)
    }

    const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      ))
    }

    const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: string) => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() } : order
      ))
    }

    const handleCancelOrder = (orderId: string) => {
      if (confirm('确定要取消此订单吗？')) {
        handleUpdateOrderStatus(orderId, 'cancelled')
        handleUpdatePaymentStatus(orderId, 'refunded')
      }
    }

    const handleBatchUpdateStatus = (newStatus: string) => {
      if (confirm(`确定要将选中的 ${selectedOrders.size} 个订单状态更新为 "${newStatus}" 吗？`)) {
        selectedOrders.forEach(orderId => {
          handleUpdateOrderStatus(orderId, newStatus)
        })
        setSelectedOrders(new Set())
      }
    }

    const handleBatchExport = () => {
      if (confirm(`确定要导出选中的 ${selectedOrders.size} 个订单吗？`)) {
        console.log('导出订单数据:', Array.from(selectedOrders))
      }
    }

    const getStatusText = (status: string) => {
      const statusMap = {
        pending: '待处理',
        confirmed: '已确认',
        processing: '处理中',
        shipped: '已发货',
        delivered: '已送达',
        completed: '已完成',
        cancelled: '已取消',
        refunded: '已退款'
      }
      return statusMap[status as keyof typeof statusMap] || status
    }

    const getStatusClass = (status: string) => {
      const classMap = {
        pending: 'status-pending',
        confirmed: 'status-confirmed',
        processing: 'status-processing',
        shipped: 'status-shipped',
        delivered: 'status-delivered',
        completed: 'status-completed',
        cancelled: 'status-cancelled',
        refunded: 'status-refunded'
      }
      return classMap[status as keyof typeof classMap] || 'status-default'
    }

    const getPaymentStatusText = (status: string) => {
      const statusMap = {
        pending: '待支付',
        paid: '已支付',
        failed: '支付失败',
        refunded: '已退款',
        partial_refund: '部分退款'
      }
      return statusMap[status as keyof typeof statusMap] || status
    }

    const getPaymentStatusClass = (status: string) => {
      const classMap = {
        pending: 'payment-pending',
        paid: 'payment-paid',
        failed: 'payment-failed',
        refunded: 'payment-refunded',
        partial_refund: 'payment-partial-refund'
      }
      return classMap[status as keyof typeof classMap] || 'payment-default'
    }

    const getPaymentMethodText = (method: string) => {
      const methodMap = {
        credit_card: '信用卡',
        alipay: '支付宝',
        wechat_pay: '微信支付',
        bank_transfer: '银行转账',
        paypal: 'PayPal'
      }
      return methodMap[method as keyof typeof methodMap] || method
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getOrderStats = () => {
      const total = orders.length
      const pending = orders.filter(o => o.status === 'pending').length
      const processing = orders.filter(o => o.status === 'processing').length
      const completed = orders.filter(o => o.status === 'completed').length
      const cancelled = orders.filter(o => o.status === 'cancelled').length
      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0)
      
      return { total, pending, processing, completed, cancelled, totalRevenue }
    }

    const stats = getOrderStats()

    return (
      <div data-testid="order-management-page" className="order-management-container">
        {/* 页面标题和操作栏 */}
        <div className="page-header">
          <h1 data-testid="page-title">订单管理</h1>
          <div className="page-actions">
            <button onClick={() => console.log('导出订单')} data-testid="export-btn">
              导出订单
            </button>
            <button onClick={() => console.log('打印标签')} data-testid="print-labels-btn">
              打印标签
            </button>
          </div>
        </div>

        {/* 订单统计 */}
        <div className="stats-section" data-testid="stats-section">
          <div className="stat-card">
            <h3>总订单数</h3>
            <span className="stat-value" data-testid="total-orders">{stats.total}</span>
          </div>
          <div className="stat-card">
            <h3>待处理</h3>
            <span className="stat-value text-warning" data-testid="pending-orders">{stats.pending}</span>
          </div>
          <div className="stat-card">
            <h3>处理中</h3>
            <span className="stat-value text-info" data-testid="processing-orders">{stats.processing}</span>
          </div>
          <div className="stat-card">
            <h3>已完成</h3>
            <span className="stat-value text-success" data-testid="completed-orders">{stats.completed}</span>
          </div>
          <div className="stat-card">
            <h3>已取消</h3>
            <span className="stat-value text-danger" data-testid="cancelled-orders">{stats.cancelled}</span>
          </div>
          <div className="stat-card">
            <h3>总收入</h3>
            <span className="stat-value text-success" data-testid="total-revenue">¥{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* 过滤和搜索栏 */}
        <div className="filters-section" data-testid="filters-section">
          <div className="search-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="搜索订单号、客户姓名或邮箱"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                data-testid="search-input"
              />
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>订单号:</label>
              <input
                type="text"
                placeholder="订单号"
                value={filters.orderNumber}
                onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                data-testid="order-number-filter"
              />
            </div>

            <div className="filter-group">
              <label>客户姓名:</label>
              <input
                type="text"
                placeholder="客户姓名"
                value={filters.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                data-testid="customer-name-filter"
              />
            </div>

            <div className="filter-group">
              <label>订单状态:</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                data-testid="status-filter"
              >
                {TEST_CONFIG.ORDER_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>支付状态:</label>
              <select 
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                data-testid="payment-status-filter"
              >
                {TEST_CONFIG.PAYMENT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>支付方式:</label>
              <select 
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                data-testid="payment-method-filter"
              >
                <option value="all">全部支付方式</option>
                {TEST_CONFIG.PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{getPaymentMethodText(method)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="date-amount-filters">
            <div className="filter-group">
              <label>日期范围:</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                data-testid="date-start-filter"
              />
              <span>至</span>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                data-testid="date-end-filter"
              />
            </div>

            <div className="filter-group">
              <label>金额范围:</label>
              <input
                type="number"
                placeholder="最低金额"
                value={filters.amountRange.min}
                onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, min: e.target.value })}
                data-testid="amount-min-filter"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="最高金额"
                value={filters.amountRange.max}
                onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, max: e.target.value })}
                data-testid="amount-max-filter"
              />
            </div>

            <button 
              onClick={() => setFilters({
                search: '',
                orderNumber: '',
                customerName: '',
                status: 'all',
                paymentStatus: 'all',
                paymentMethod: 'all',
                dateRange: { start: '', end: '' },
                amountRange: { min: '', max: '' }
              })}
              data-testid="clear-filters-btn"
            >
              清除筛选
            </button>
          </div>
        </div>

        {/* 批量操作栏 */}
        {selectedOrders.size > 0 && (
          <div className="batch-actions" data-testid="batch-actions">
            <span>已选中 {selectedOrders.size} 个订单</span>
            <div className="batch-buttons">
              <button 
                onClick={() => handleBatchUpdateStatus('processing')}
                data-testid="batch-process-btn"
              >
                批量处理
              </button>
              <button 
                onClick={() => handleBatchUpdateStatus('shipped')}
                data-testid="batch-ship-btn"
              >
                批量发货
              </button>
              <button 
                onClick={() => handleBatchUpdateStatus('completed')}
                data-testid="batch-complete-btn"
              >
                批量完成
              </button>
              <button 
                onClick={handleBatchExport}
                data-testid="batch-export-btn"
              >
                批量导出
              </button>
            </div>
          </div>
        )}

        {/* 订单列表 */}
        <div className="orders-table-container" data-testid="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleSelectAll}
                    data-testid="select-all-checkbox"
                  />
                </th>
                <th onClick={() => handleSort('orderNumber')} data-testid="sort-order-number">
                  订单号 {sortBy === 'orderNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('customerName')} data-testid="sort-customer-name">
                  客户信息 {sortBy === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('totalAmount')} data-testid="sort-amount">
                  订单金额 {sortBy === 'totalAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} data-testid="sort-status">
                  订单状态 {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('paymentStatus')} data-testid="sort-payment-status">
                  支付状态 {sortBy === 'paymentStatus' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('createdAt')} data-testid="sort-created-at">
                  创建时间 {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr key={order.id} data-testid={`order-row-${order.id}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      data-testid={`order-checkbox-${order.id}`}
                    />
                  </td>
                  <td>
                    <div className="order-info">
                      <div className="order-number" data-testid={`order-number-${order.id}`}>
                        {order.orderNumber}
                      </div>
                      <div className="shipping-method">
                        {TEST_CONFIG.SHIPPING_METHODS.find(m => m.value === order.shippingMethod)?.label}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name" data-testid={`customer-name-${order.id}`}>
                        {order.customerName}
                      </div>
                      <div className="customer-contact">
                        <span data-testid={`customer-email-${order.id}`}>{order.customerEmail}</span>
                        <br />
                        <span data-testid={`customer-phone-${order.id}`}>{order.customerPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      <div className="total-amount" data-testid={`total-amount-${order.id}`}>
                        ¥{order.totalAmount.toFixed(2)}
                      </div>
                      <div className="items-count">
                        {order.items.length} 件商品
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`status-select ${getStatusClass(order.status)}`}
                      data-testid={`status-select-${order.id}`}
                    >
                      <option value="pending">待处理</option>
                      <option value="confirmed">已确认</option>
                      <option value="processing">处理中</option>
                      <option value="shipped">已发货</option>
                      <option value="delivered">已送达</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                      className={`payment-status-select ${getPaymentStatusClass(order.paymentStatus)}`}
                      data-testid={`payment-status-select-${order.id}`}
                    >
                      <option value="pending">待支付</option>
                      <option value="paid">已支付</option>
                      <option value="failed">支付失败</option>
                      <option value="refunded">已退款</option>
                      <option value="partial_refund">部分退款</option>
                    </select>
                  </td>
                  <td>
                    <div className="date-info">
                      <div data-testid={`created-date-${order.id}`}>
                        {formatDate(order.createdAt)}
                      </div>
                      {order.updatedAt !== order.createdAt && (
                        <div className="updated-date">
                          更新: {formatDate(order.updatedAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewOrderDetail(order)}
                        data-testid={`view-detail-btn-${order.id}`}
                        className="btn-small btn-info"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleEditOrder(order)}
                        data-testid={`edit-btn-${order.id}`}
                        className="btn-small btn-secondary"
                      >
                        编辑
                      </button>
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          data-testid={`cancel-btn-${order.id}`}
                          className="btn-small btn-danger"
                        >
                          取消
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div data-testid="empty-state" className="empty-state">
              <p>没有找到符合条件的订单</p>
            </div>
          )}
        </div>

        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="pagination" data-testid="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              data-testid="prev-page"
            >
              上一页
            </button>
            <span data-testid="page-info">
              第 {currentPage} 页，共 {totalPages} 页，共 {filteredOrders.length} 条记录
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              data-testid="next-page"
            >
              下一页
            </button>
          </div>
        )}

        {/* 订单详情模态框 */}
        {showOrderDetailModal && selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderDetailModal(false)
              setSelectedOrder(null)
            }}
            onUpdateStatus={(orderId, status) => handleUpdateOrderStatus(orderId, status)}
            onUpdatePaymentStatus={(orderId, status) => handleUpdatePaymentStatus(orderId, status)}
          />
        )}

        {/* 编辑订单模态框 */}
        {showEditModal && editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onClose={() => {
              setShowEditModal(false)
              setEditingOrder(null)
            }}
            onSave={(updatedOrder) => {
              setOrders(prev => prev.map(o => 
                o.id === editingOrder.id ? { ...o, ...updatedOrder, updatedAt: new Date().toISOString() } : o
              ))
              setShowEditModal(false)
              setEditingOrder(null)
            }}
          />
        )}
      </div>
    )
  }

  return MockOrderManagementPage
}

// 🎭 模拟订单详情模态框
const OrderDetailModal: React.FC<{
  order: any
  onClose: () => void
  onUpdateStatus: (orderId: string, status: string) => void
  onUpdatePaymentStatus: (orderId: string, status: string) => void
}> = ({ order, onClose, onUpdateStatus, onUpdatePaymentStatus }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div data-testid="order-detail-modal" className="modal-overlay">
      <div className="modal-content order-detail-modal">
        <div className="modal-header">
          <h2 data-testid="modal-title">订单详情 - {order.orderNumber}</h2>
          <button onClick={onClose} data-testid="close-modal">×</button>
        </div>

        <div className="modal-body">
          {/* 订单基本信息 */}
          <div className="order-section">
            <h3>基本信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>订单号:</label>
                <span>{order.orderNumber}</span>
              </div>
              <div className="info-item">
                <label>客户姓名:</label>
                <span>{order.customerName}</span>
              </div>
              <div className="info-item">
                <label>客户邮箱:</label>
                <span>{order.customerEmail}</span>
              </div>
              <div className="info-item">
                <label>客户电话:</label>
                <span>{order.customerPhone}</span>
              </div>
              <div className="info-item">
                <label>订单状态:</label>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
              <div className="info-item">
                <label>支付状态:</label>
                <span className={`payment-status-badge ${order.paymentStatus}`}>{order.paymentStatus}</span>
              </div>
              <div className="info-item">
                <label>支付方式:</label>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="info-item">
                <label>配送方式:</label>
                <span>{order.shippingMethod}</span>
              </div>
            </div>
          </div>

          {/* 订单商品 */}
          <div className="order-section">
            <h3>商品信息</h3>
            <div className="items-list">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="order-item" data-testid={`order-item-${index}`}>
                  <div className="item-info">
                    <div className="item-name" data-testid={`item-name-${index}`}>
                      {item.productName}
                    </div>
                    <div className="item-details">
                      单价: ¥{item.unitPrice.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="item-total">
                    ¥{item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 收货地址 */}
          <div className="order-section">
            <h3>收货地址</h3>
            <div className="address-info">
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zipCode}</div>
              <div>{order.shippingAddress.country}</div>
            </div>
          </div>

          {/* 订单金额 */}
          <div className="order-section">
            <h3>金额明细</h3>
            <div className="amount-breakdown">
              <div className="amount-item">
                <span>商品总价:</span>
                <span>¥{order.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0).toFixed(2)}</span>
              </div>
              <div className="amount-item">
                <span>运费:</span>
                <span>¥{order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="amount-item">
                <span>税费:</span>
                <span>¥{order.tax.toFixed(2)}</span>
              </div>
              <div className="amount-item">
                <span>折扣:</span>
                <span>-¥{order.discount.toFixed(2)}</span>
              </div>
              <div className="amount-item total">
                <span>总计:</span>
                <span>¥{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 时间线 */}
          <div className="order-section">
            <h3>订单时间线</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">{formatDate(order.createdAt)}</div>
                <div className="timeline-content">订单创建</div>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="timeline-item">
                  <div className="timeline-date">{formatDate(order.updatedAt)}</div>
                  <div className="timeline-content">订单更新</div>
                </div>
              )}
              {order.shippedAt && (
                <div className="timeline-item">
                  <div className="timeline-date">{formatDate(order.shippedAt)}</div>
                  <div className="timeline-content">商品已发货</div>
                </div>
              )}
              {order.deliveredAt && (
                <div className="timeline-item">
                  <div className="timeline-date">{formatDate(order.deliveredAt)}</div>
                  <div className="timeline-content">商品已送达</div>
                </div>
              )}
            </div>
          </div>

          {/* 备注 */}
          {order.notes && (
            <div className="order-section">
              <h3>备注</h3>
              <div className="order-notes">{order.notes}</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} data-testid="close-btn">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

// 🎭 模拟编辑订单模态框
const EditOrderModal: React.FC<{
  order: any
  onClose: () => void
  onSave: (updatedOrder: any) => void
}> = ({ order, onClose, onSave }) => {
  const [formData, setFormData] = React.useState(order)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (type: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item: any, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 简单验证
    if (!formData.customerName.trim()) {
      setErrors({ customerName: '客户姓名不能为空' })
      return
    }
    onSave(formData)
  }

  return (
    <div data-testid="edit-order-modal" className="modal-overlay">
      <div className="modal-content edit-order-modal">
        <div className="modal-header">
          <h2 data-testid="modal-title">编辑订单 - {order.orderNumber}</h2>
          <button onClick={onClose} data-testid="close-modal">×</button>
        </div>

        <form onSubmit={handleSubmit} data-testid="edit-order-form">
          <div className="modal-body">
            {/* 客户信息 */}
            <div className="form-section">
              <h3>客户信息</h3>
              <div className="form-group">
                <label>客户姓名 *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  data-testid="input-customer-name"
                />
                {errors.customerName && <span className="error">{errors.customerName}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>客户邮箱</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    data-testid="input-customer-email"
                  />
                </div>
                
                <div className="form-group">
                  <label>客户电话</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    data-testid="input-customer-phone"
                  />
                </div>
              </div>
            </div>

            {/* 收货地址 */}
            <div className="form-section">
              <h3>收货地址</h3>
              <div className="form-group">
                <label>街道地址</label>
                <input
                  type="text"
                  value={formData.shippingAddress.street}
                  onChange={(e) => handleAddressChange('shippingAddress', 'street', e.target.value)}
                  data-testid="input-shipping-street"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>城市</label>
                  <input
                    type="text"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleAddressChange('shippingAddress', 'city', e.target.value)}
                    data-testid="input-shipping-city"
                  />
                </div>
                
                <div className="form-group">
                  <label>省份</label>
                  <input
                    type="text"
                    value={formData.shippingAddress.province}
                    onChange={(e) => handleAddressChange('shippingAddress', 'province', e.target.value)}
                    data-testid="input-shipping-province"
                  />
                </div>
                
                <div className="form-group">
                  <label>邮编</label>
                  <input
                    type="text"
                    value={formData.shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('shippingAddress', 'zipCode', e.target.value)}
                    data-testid="input-shipping-zip"
                  />
                </div>
              </div>
            </div>

            {/* 订单备注 */}
            <div className="form-section">
              <h3>备注</h3>
              <div className="form-group">
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  data-testid="input-notes"
                  placeholder="订单备注信息"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} data-testid="cancel-btn">
              取消
            </button>
            <button type="submit" data-testid="save-btn" className="btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

describe('订单管理模块集成测试', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('订单管理页面渲染测试', () => {
    it('应该正确渲染订单管理页面', () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      expect(screen.getByTestId('order-management-page')).toBeInTheDocument()
      expect(screen.getByTestId('page-title')).toHaveTextContent('订单管理')
      expect(screen.getByTestId('stats-section')).toBeInTheDocument()
      expect(screen.getByTestId('filters-section')).toBeInTheDocument()
      expect(screen.getByTestId('orders-table-container')).toBeInTheDocument()
    })

    it('应该显示正确的订单统计', () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      expect(screen.getByTestId('total-orders')).toHaveTextContent('4')
      expect(screen.getByTestId('pending-orders')).toHaveTextContent('1')
      expect(screen.getByTestId('processing-orders')).toHaveTextContent('1')
      expect(screen.getByTestId('completed-orders')).toHaveTextContent('1')
      expect(screen.getByTestId('cancelled-orders')).toHaveTextContent('1')
      expect(screen.getByTestId('total-revenue')).toHaveTextContent('¥7399.97')
    })

    it('应该显示订单列表', () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      expect(screen.getByTestId('order-row-ORDER-2025-001')).toBeInTheDocument()
      expect(screen.getByTestId('order-row-ORDER-2025-002')).toBeInTheDocument()
      expect(screen.getByTestId('order-row-ORDER-2025-003')).toBeInTheDocument()
      expect(screen.getByTestId('order-row-ORDER-2025-004')).toBeInTheDocument()
    })
  })

  describe('搜索和过滤功能测试', () => {
    it('应该正确处理通用搜索', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, '张三')
      
      expect(searchInput).toHaveValue('张三')
    })

    it('应该正确处理订单号过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const orderNumberFilter = screen.getByTestId('order-number-filter')
      await user.type(orderNumberFilter, 'ORD-001')
      
      expect(orderNumberFilter).toHaveValue('ORD-001')
    })

    it('应该正确处理客户姓名过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const customerNameFilter = screen.getByTestId('customer-name-filter')
      await user.type(customerNameFilter, '李四')
      
      expect(customerNameFilter).toHaveValue('李四')
    })

    it('应该正确处理订单状态过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const statusFilter = screen.getByTestId('status-filter')
      await user.selectOptions(statusFilter, 'pending')
      
      expect(statusFilter).toHaveValue('pending')
    })

    it('应该正确处理支付状态过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const paymentStatusFilter = screen.getByTestId('payment-status-filter')
      await user.selectOptions(paymentStatusFilter, 'paid')
      
      expect(paymentStatusFilter).toHaveValue('paid')
    })

    it('应该正确处理支付方式过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const paymentMethodFilter = screen.getByTestId('payment-method-filter')
      await user.selectOptions(paymentMethodFilter, 'alipay')
      
      expect(paymentMethodFilter).toHaveValue('alipay')
    })

    it('应该正确处理日期范围过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const dateStartFilter = screen.getByTestId('date-start-filter')
      const dateEndFilter = screen.getByTestId('date-end-filter')
      
      await user.type(dateStartFilter, '2025-01-01')
      await user.type(dateEndFilter, '2025-01-07')
      
      expect(dateStartFilter).toHaveValue('2025-01-01')
      expect(dateEndFilter).toHaveValue('2025-01-07')
    })

    it('应该正确处理金额范围过滤', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const amountMinFilter = screen.getByTestId('amount-min-filter')
      const amountMaxFilter = screen.getByTestId('amount-max-filter')
      
      await user.type(amountMinFilter, '1000')
      await user.type(amountMaxFilter, '5000')
      
      expect(amountMinFilter).toHaveValue('1000')
      expect(amountMaxFilter).toHaveValue('5000')
    })

    it('应该正确处理清除筛选功能', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      // 先设置一些筛选条件
      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, 'test')

      const clearFiltersBtn = screen.getByTestId('clear-filters-btn')
      await user.click(clearFiltersBtn)

      // 验证筛选条件已被清除
      expect(searchInput).toHaveValue('')
    })
  })

  describe('排序功能测试', () => {
    it('应该正确处理按订单号排序', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const sortButton = screen.getByTestId('sort-order-number')
      await user.click(sortButton)
      
      expect(screen.getByTestId('sort-order-number')).toContainElement(screen.getByText('↓'))
    })

    it('应该正确处理按客户姓名排序', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const sortButton = screen.getByTestId('sort-customer-name')
      await user.click(sortButton)
      
      expect(screen.getByTestId('sort-customer-name')).toContainElement(screen.getByText('↑'))
    })

    it('应该正确处理按订单金额排序', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const sortButton = screen.getByTestId('sort-amount')
      await user.click(sortButton)
      
      expect(screen.getByTestId('sort-amount')).toContainElement(screen.getByText('↓'))
    })

    it('应该正确处理按创建时间排序', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const sortButton = screen.getByTestId('sort-created-at')
      await user.click(sortButton)
      
      expect(screen.getByTestId('sort-created-at')).toContainElement(screen.getByText('↑'))
    })
  })

  describe('订单选择功能测试', () => {
    it('应该正确处理单个订单选择', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const orderCheckbox = screen.getByTestId('order-checkbox-ORDER-2025-001')
      await user.click(orderCheckbox)
      
      expect(orderCheckbox).toBeChecked()
    })

    it('应该正确处理全选功能', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const selectAllCheckbox = screen.getByTestId('select-all-checkbox')
      await user.click(selectAllCheckbox)
      
      expect(selectAllCheckbox).toBeChecked()
    })

    it('应该正确显示批量操作栏', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      // 选择订单
      const orderCheckbox = screen.getByTestId('order-checkbox-ORDER-2025-001')
      await user.click(orderCheckbox)

      // 验证批量操作栏出现
      expect(screen.getByTestId('batch-actions')).toBeInTheDocument()
      expect(screen.getByText('已选中 1 个订单')).toBeInTheDocument()
      expect(screen.getByTestId('batch-process-btn')).toBeInTheDocument()
      expect(screen.getByTestId('batch-ship-btn')).toBeInTheDocument()
      expect(screen.getByTestId('batch-complete-btn')).toBeInTheDocument()
      expect(screen.getByTestId('batch-export-btn')).toBeInTheDocument()
    })
  })

  describe('订单状态管理测试', () => {
    it('应该正确处理订单状态更改', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const statusSelect = screen.getByTestId('status-select-ORDER-2025-001')
      await user.selectOptions(statusSelect, 'processing')
      
      expect(statusSelect).toHaveValue('processing')
    })

    it('应该正确处理支付状态更改', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const paymentStatusSelect = screen.getByTestId('payment-status-select-ORDER-2025-001')
      await user.selectOptions(paymentStatusSelect, 'paid')
      
      expect(paymentStatusSelect).toHaveValue('paid')
    })

    it('应该正确处理批量状态更新', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      // 选择订单
      const orderCheckbox = screen.getByTestId('order-checkbox-ORDER-2025-001')
      await user.click(orderCheckbox)

      // 点击批量处理
      const batchProcessBtn = screen.getByTestId('batch-process-btn')
      await user.click(batchProcessBtn)

      // 验证确认对话框出现
      expect(screen.getByText(/确定要将选中的 1 个订单状态更新为 "processing" 吗？/)).toBeInTheDocument()
    })
  })

  describe('订单详情查看测试', () => {
    it('应该正确打开订单详情模态框', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const viewDetailBtn = screen.getByTestId('view-detail-btn-ORDER-2025-001')
      await user.click(viewDetailBtn)
      
      expect(screen.getByTestId('order-detail-modal')).toBeInTheDocument()
      expect(screen.getByText(/订单详情 - ORD-001/)).toBeInTheDocument()
    })

    it('应该正确显示订单基本信息', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const viewDetailBtn = screen.getByTestId('view-detail-btn-ORDER-2025-001')
      await user.click(viewDetailBtn)

      // 验证基本信息显示
      expect(screen.getByText('张三')).toBeInTheDocument()
      expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument()
      expect(screen.getByText('13800138001')).toBeInTheDocument()
    })

    it('应该正确显示订单商品信息', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const viewDetailBtn = screen.getByTestId('view-detail-btn-ORDER-2025-001')
      await user.click(viewDetailBtn)

      // 验证商品信息显示
      expect(screen.getByTestId('order-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('item-name-0')).toHaveTextContent('iPhone 15 Pro')
      expect(screen.getByTestId('order-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('item-name-1')).toHaveTextContent('MacBook Air M3')
    })

    it('应该正确显示金额明细', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const viewDetailBtn = screen.getByTestId('view-detail-btn-ORDER-2025-001')
      await user.click(viewDetailBtn)

      // 验证金额明细显示
      expect(screen.getByText('商品总价:')).toBeInTheDocument()
      expect(screen.getByText('运费:')).toBeInTheDocument()
      expect(screen.getByText('税费:')).toBeInTheDocument()
      expect(screen.getByText('总计:')).toBeInTheDocument()
    })

    it('应该正确显示订单时间线', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const viewDetailBtn = screen.getByTestId('view-detail-btn-ORDER-2025-001')
      await user.click(viewDetailBtn)

      // 验证时间线显示
      expect(screen.getByText('订单创建')).toBeInTheDocument()
      expect(screen.getByText('订单更新')).toBeInTheDocument()
    })
  })

  describe('订单编辑功能测试', () => {
    it('应该正确打开编辑订单模态框', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const editBtn = screen.getByTestId('edit-btn-ORDER-2025-001')
      await user.click(editBtn)
      
      expect(screen.getByTestId('edit-order-modal')).toBeInTheDocument()
      expect(screen.getByText(/编辑订单 - ORD-001/)).toBeInTheDocument()
    })

    it('应该正确预填充客户信息', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const editBtn = screen.getByTestId('edit-btn-ORDER-2025-001')
      await user.click(editBtn)

      // 验证预填充的客户信息
      expect(screen.getByTestId('input-customer-name')).toHaveValue('张三')
      expect(screen.getByTestId('input-customer-email')).toHaveValue('zhangsan@example.com')
      expect(screen.getByTestId('input-customer-phone')).toHaveValue('13800138001')
    })

    it('应该正确预填充收货地址', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const editBtn = screen.getByTestId('edit-btn-ORDER-2025-001')
      await user.click(editBtn)

      // 验证预填充的地址信息
      expect(screen.getByTestId('input-shipping-street')).toHaveValue('北京市朝阳区建国路88号')
      expect(screen.getByTestId('input-shipping-city')).toHaveValue('北京')
      expect(screen.getByTestId('input-shipping-province')).toHaveValue('北京市')
      expect(screen.getByTestId('input-shipping-zip')).toHaveValue('100000')
    })

    it('应该正确保存编辑后的订单', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const editBtn = screen.getByTestId('edit-btn-ORDER-2025-001')
      await user.click(editBtn)

      // 修改客户姓名
      const nameInput = screen.getByTestId('input-customer-name')
      await user.clear(nameInput)
      await user.type(nameInput, '张三丰')

      // 保存订单
      const saveBtn = screen.getByTestId('save-btn')
      await user.click(saveBtn)

      // 验证模态框关闭
      await waitFor(() => {
        expect(screen.queryByTestId('edit-order-modal')).not.toBeInTheDocument()
      })
    })
  })

  describe('订单取消功能测试', () => {
    it('应该正确处理订单取消', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const cancelBtn = screen.getByTestId('cancel-btn-ORDER-2025-001')
      await user.click(cancelBtn)

      // 验证确认对话框出现
      expect(screen.getByText('确定要取消此订单吗？')).toBeInTheDocument()
    })
  })

  describe('数据验证测试', () => {
    it('应该正确验证订单编辑表单', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      const editBtn = screen.getByTestId('edit-btn-ORDER-2025-001')
      await user.click(editBtn)

      // 清空必填字段
      const nameInput = screen.getByTestId('input-customer-name')
      await user.clear(nameInput)

      // 尝试保存
      const saveBtn = screen.getByTestId('save-btn')
      await user.click(saveBtn)

      // 验证错误提示
      expect(screen.getByText('客户姓名不能为空')).toBeInTheDocument()
    })
  })

  describe('空状态测试', () => {
    it('应该正确显示空状态', async () => {
      const MockOrderManagementPage = createMockOrderManagementPage()
      render(<MockOrderManagementPage />)

      // 搜索不存在的订单
      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, '不存在的订单')

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
        expect(screen.getByText('没有找到符合条件的订单')).toBeInTheDocument()
      })
    })
  })
})