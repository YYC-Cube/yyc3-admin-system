/**
 * @file 产品定价页面
 * @description 展示和管理系统中各类产品的定价策略和价格方案
 * @module dashboard/products/pricing
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

'use client';

import { useState, useEffect } from 'react';

// 本地货币格式化函数
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// 模拟产品数据类型定义
interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  priceTier: 'basic' | 'standard' | 'premium';
  discount: number;
  isActive: boolean;
  updatedAt: string;
}

const PricingPage: React.FC = () => {
  // 状态管理
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // 模拟数据加载
  useEffect(() => {
    // 模拟产品数据
    const mockProducts: Product[] = [
      {
        id: '1',
        name: '基础云存储',
        category: '存储服务',
        basePrice: 99.00,
        priceTier: 'basic',
        discount: 0,
        isActive: true,
        updatedAt: '2024-10-01T10:30:00Z',
      },
      {
        id: '2',
        name: '专业计算包',
        category: '计算服务',
        basePrice: 299.00,
        priceTier: 'standard',
        discount: 10,
        isActive: true,
        updatedAt: '2024-10-05T14:20:00Z',
      },
      {
        id: '3',
        name: '企业级AI套件',
        category: 'AI服务',
        basePrice: 999.00,
        priceTier: 'premium',
        discount: 15,
        isActive: true,
        updatedAt: '2024-09-28T09:15:00Z',
      },
      {
        id: '4',
        name: '边缘计算节点',
        category: '计算服务',
        basePrice: 199.00,
        priceTier: 'standard',
        discount: 5,
        isActive: true,
        updatedAt: '2024-10-03T16:45:00Z',
      },
      {
        id: '5',
        name: '大数据分析包',
        category: '数据分析',
        basePrice: 499.00,
        priceTier: 'premium',
        discount: 20,
        isActive: false,
        updatedAt: '2024-09-20T11:10:00Z',
      },
      {
        id: '6',
        name: 'IoT设备管理',
        category: 'IoT服务',
        basePrice: 149.00,
        priceTier: 'basic',
        discount: 0,
        isActive: true,
        updatedAt: '2024-10-08T13:50:00Z',
      },
    ];

    setProducts(mockProducts);
  }, []);

  // 筛选产品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // 获取产品类别列表
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // 获取折扣后价格
  const getDiscountedPrice = (basePrice: number, discount: number): number => {
    return basePrice * (1 - discount / 100);
  };

  // 获取价格级别样式
  const getPriceTierLabel = (tier: string): string => {
    switch (tier) {
      case 'basic': return '基础';
      case 'standard': return '标准';
      case 'premium': return '高级';
      default: return tier;
    }
  };

  // 获取价格级别样式类
  const getPriceTierClass = (tier: string): string => {
    switch (tier) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态样式类
  const getStatusClass = (isActive: boolean): string => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">产品定价管理</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">管理所有产品的定价策略、价格调整和折扣设置</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">搜索产品</label>
            <input
              id="search"
              type="text"
              placeholder="输入产品名称或类别"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">产品类别</label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '全部类别' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 产品定价表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">产品定价列表</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">查看和管理所有产品的定价信息</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">产品名称</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">类别</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">价格级别</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">基础价格</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">折扣</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">折扣后价格</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">上次更新</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriceTierClass(product.priceTier)}`}>
                      {getPriceTierLabel(product.priceTier)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(product.basePrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.discount}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(getDiscountedPrice(product.basePrice, product.discount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(product.isActive)}`}>
                      {product.isActive ? '已激活' : '已禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(product.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            显示 {filteredProducts.length} 个产品（共 {products.length} 个）
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            添加新产品
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">活跃产品</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {products.filter(p => p.isActive).length}
          </div>
          <div className="mt-1 flex items-center text-xs text-green-600">
            <span>↑ 2 本周</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">平均折扣</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {products.length > 0 
              ? `${(products.reduce((sum, p) => sum + p.discount, 0) / products.length).toFixed(1)}%`
              : '0%'
            }
          </div>
          <div className="mt-1 flex items-center text-xs text-blue-600">
            <span>与上周持平</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">产品类别</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {categories.length - 1}
          </div>
          <div className="mt-1 flex items-center text-xs text-purple-600">
            <span>共 {categories.length - 1} 个类别</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;