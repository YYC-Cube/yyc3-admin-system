/**
 * @file 模拟数据服务
 * @description 提供系统所需的模拟数据，用于开发和测试
 * @module api/mock-service
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * 
 * ⚠️ 安全警告:
 * 1. 本文件仅用于开发和测试环境
 * 2. 包含弱密码（123456）仅供测试使用
 * 3. 生产环境必须使用真实的身份验证系统
 * 4. 生产环境必须实现：
 *    - 密码哈希（bcrypt, argon2等）
 *    - 盐值（salt）
 *    - 安全的会话管理
 *    - JWT token 签名验证
 *    - 账户锁定机制
 *    - 多因素认证（MFA）
 */

import type { ApiResponse, PaginatedResponse } from '../types/api';

// 模拟包厢数据
export const mockRooms = [
  { id: '1', name: '包厢A1', type: 'small', capacity: 4, price_per_hour: 188, status: 'available' as const },
  { id: '2', name: '包厢A2', type: 'small', capacity: 4, price_per_hour: 188, status: 'occupied' as const },
  { id: '3', name: '包厢B1', type: 'medium', capacity: 6, price_per_hour: 288, status: 'available' as const },
  { id: '4', name: '包厢B2', type: 'medium', capacity: 6, price_per_hour: 288, status: 'reserved' as const },
  { id: '5', name: '包厢C1', type: 'large', capacity: 10, price_per_hour: 388, status: 'available' as const },
  { id: '6', name: '包厢V1', type: 'vip', capacity: 8, price_per_hour: 588, status: 'maintenance' as const },
];

// 模拟商品分类
export const mockCategories = [
  { id: '1', name: '啤酒', parent_id: null },
  { id: '2', name: '饮料', parent_id: null },
  { id: '3', name: '小食', parent_id: null },
  { id: '4', name: '果盘', parent_id: null },
  { id: '5', name: '香烟', parent_id: null },
];

// 模拟商品数据
export const mockProducts = [
  { id: '1', name: '青岛啤酒', category_id: '1', price: 12, unit: '瓶', status: 'active' as const },
  { id: '2', name: '百威啤酒', category_id: '1', price: 15, unit: '瓶', status: 'active' as const },
  { id: '3', name: '可乐', category_id: '2', price: 8, unit: '罐', status: 'active' as const },
  { id: '4', name: '雪碧', category_id: '2', price: 8, unit: '罐', status: 'active' as const },
  { id: '5', name: '花生', category_id: '3', price: 15, unit: '份', status: 'active' as const },
  { id: '6', name: '瓜子', category_id: '3', price: 12, unit: '份', status: 'active' as const },
  { id: '7', name: '小果盘', category_id: '4', price: 38, unit: '份', status: 'active' as const },
  { id: '8', name: '大果盘', category_id: '4', price: 68, unit: '份', status: 'active' as const },
  { id: '9', name: '中华烟', category_id: '5', price: 65, unit: '包', status: 'active' as const },
];

// 模拟订单数据
export const mockOrders = [
  {
    id: '1',
    order_number: 'ORD20241015001',
    room_id: '2',
    room_name: '包厢A2',
    total_amount: 388,
    payment_status: 'pending' as const,
    status: 'open' as const,
    created_at: '2024-10-15T12:30:00',
    items: [
      { product_id: '1', product_name: '青岛啤酒', quantity: 10, unit_price: 12, total_price: 120 },
      { product_id: '3', product_name: '可乐', quantity: 5, unit_price: 8, total_price: 40 },
      { product_id: '5', product_name: '花生', quantity: 2, unit_price: 15, total_price: 30 },
    ],
  },
  {
    id: '2',
    order_number: 'ORD20241015002',
    room_id: '4',
    room_name: '包厢B2',
    total_amount: 588,
    payment_status: 'paid' as const,
    status: 'closed' as const,
    created_at: '2024-10-15T10:15:00',
    items: [
      { product_id: '2', product_name: '百威啤酒', quantity: 15, unit_price: 15, total_price: 225 },
      { product_id: '8', product_name: '大果盘', quantity: 1, unit_price: 68, total_price: 68 },
    ],
  },
];

// 模拟仪表盘数据
export const mockDashboardData = {
  stats: {
    totalSales: 12880,
    todaySales: 1588,
    totalOrders: 86,
    activeRooms: 2,
  },
  recentOrders: mockOrders.slice(0, 5),
  salesTrend: [
    { date: '10/10', amount: 8500 },
    { date: '10/11', amount: 9200 },
    { date: '10/12', amount: 7800 },
    { date: '10/13', amount: 10500 },
    { date: '10/14', amount: 11200 },
    { date: '10/15', amount: 12880 },
  ],
  roomUsage: {
    totalRooms: 6,
    available: 3,
    occupied: 1,
    reserved: 1,
    maintenance: 1,
  },
};

// 模拟用户数据
export const mockUsers = [
  { id: '1', username: 'admin', role: 'admin' as const, status: 'active' as const },
  { id: '2', username: 'cashier1', role: 'cashier' as const, status: 'active' as const },
  { id: '3', username: 'waiter1', role: 'waiter' as const, status: 'active' as const },
];

/**
 * 模拟数据服务类
 */
export class MockService {
  /**
   * 获取所有包厢
   */
  getRooms(): Promise<ApiResponse<any[]>> {
    return Promise.resolve({
      success: true,
      data: mockRooms,
    });
  }

  /**
   * 获取单个包厢
   */
  getRoom(id: string): Promise<ApiResponse<any>> {
    const room = mockRooms.find(r => r.id === id);
    if (room) {
      return Promise.resolve({ success: true, data: room });
    }
    return Promise.resolve({ success: false, error: '包厢不存在' });
  }

  /**
   * 更新包厢状态
   */
  updateRoomStatus(id: string, status: string): Promise<ApiResponse<any>> {
    const room = mockRooms.find(r => r.id === id);
    if (room) {
      room.status = status as any;
      return Promise.resolve({ success: true, data: room });
    }
    return Promise.resolve({ success: false, error: '包厢不存在' });
  }

  /**
   * 获取商品分类
   */
  getCategories(): Promise<ApiResponse<any[]>> {
    return Promise.resolve({
      success: true,
      data: mockCategories,
    });
  }

  /**
   * 获取商品列表 - 支持分页和分类筛选
   */
  getProducts(params?: { page?: number; pageSize?: number; category_id?: string }): Promise<ApiResponse<PaginatedResponse<any>>> {
    let products = [...mockProducts];
    
    // 应用分类筛选
    if (params?.category_id) {
      products = products.filter(p => p.category_id === params.category_id);
    }
    
    // 应用分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = products.slice(start, end);
    
    return Promise.resolve({
      success: true,
      data: {
        data: paginatedProducts,
        pagination: {
          page,
          pageSize,
          total: products.length,
          totalPages: Math.ceil(products.length / pageSize),
        },
      },
    });
  }

  /**
   * 获取订单列表
   */
  getOrders(params?: { page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOrders = mockOrders.slice(start, end);

    return Promise.resolve({
      success: true,
      data: {
        data: paginatedOrders,
        pagination: {
          page,
          pageSize,
          total: mockOrders.length,
          totalPages: Math.ceil(mockOrders.length / pageSize),
        },
      },
    });
  }

  /**
   * 创建订单
   */
  createOrder(orderData: any): Promise<ApiResponse<any>> {
    const newOrder = {
      id: Date.now().toString(),
      order_number: `ORD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(mockOrders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: 'open',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
    };
    mockOrders.unshift(newOrder);
    return Promise.resolve({ success: true, data: newOrder });
  }

  /**
   * 获取仪表盘数据
   */
  getDashboardData(): Promise<ApiResponse<any>> {
    return Promise.resolve({
      success: true,
      data: {
        stats: {
          totalSales: 128500,
          todaySales: 4500,
          orderCount: 286,
          activeMembers: 1240,
          growthRate: 18.5,
          conversionRate: 32.8
        },
        recentOrders: [
          { id: 'ORD-202401', room: 'A01', amount: '¥1,280', status: '已完成', time: '2024-01-15 20:30' },
          { id: 'ORD-202402', room: 'B03', amount: '¥850', status: '处理中', time: '2024-01-15 19:15' },
          { id: 'ORD-202403', room: 'VIP01', amount: '¥2,100', status: '已完成', time: '2024-01-14 21:00' },
          { id: 'ORD-202404', room: 'C02', amount: '¥680', status: '已取消', time: '2024-01-14 18:45' },
          { id: 'ORD-202405', room: 'A02', amount: '¥1,450', status: '已完成', time: '2024-01-13 20:00' }
        ]
      },
    });
  }

  /**
   * 模拟用户登录
   * 
   * ⚠️ 安全警告:
   * - 此函数仅用于开发和测试环境
   * - 生产环境必须使用真实的身份验证系统
   * - 不要在生产环境使用弱密码（如 "123456"）
   * - 必须实现密码哈希、盐值和安全存储
   */
  login(username: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const user = mockUsers.find(u => u.username === username);
    // ⚠️ 测试用弱密码：admin/123456, cashier1/123456, waiter1/123456
    // 生产环境必须替换为真实的密码验证系统
    if (user && password === '123456') {
      return Promise.resolve({
        success: true,
        data: {
          token: `mock-token-${username}-${Date.now()}`,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        },
      });
    }
    return Promise.resolve({ success: false, error: '用户名或密码错误' });
  }
}

// 导出单例
export const mockService = new MockService();
