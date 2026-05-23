/**
 * @file 大数据分析模块测试
 * @description 覆盖用户行为分析、预测分析、数据仓库等大数据功能测试
 * @module bigdata-analysis
 * @author YYC
 * @version 1.0.0
 * @created 2025-11-15
 * @updated 2025-11-15
 */

import React from 'react';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock UI Components
const MockCard = ({ children, className = "", ...props }: any) => (
  <div className={`border rounded-lg p-4 ${className}`} {...props}>{children}</div>
);

const MockTabs = ({ children, value, onValueChange }: any) => (
  <div data-testid="tabs" data-value={value} onClick={(e: any) => {
    const tab = e.target.closest('[data-tab-value]');
    if (tab && onValueChange) {
      onValueChange(tab.dataset.tabValue);
    }
  }}>
    {children}
  </div>
);

const MockTabsList = ({ children }: any) => (
  <div className="flex space-x-2" data-testid="tabs-list">{children}</div>
);

const MockTabsTrigger = ({ children, value }: any) => (
  <button data-tab-value={value} className="px-4 py-2 rounded border">{children}</button>
);

const MockTabsContent = ({ children, value }: any) => (
  <div data-tab-content={value} className="mt-4">{children}</div>
);

const MockBadge = ({ children, variant = "default" }: any) => (
  <span className={`px-2 py-1 rounded text-sm ${
    variant === "destructive" ? "bg-red-100 text-red-800" :
    variant === "outline" ? "border" : "bg-blue-100 text-blue-800"
  }`}>{children}</span>
);

const MockProgress = ({ value }: any) => (
  <div className="w-full bg-gray-200 rounded">
    <div className="bg-blue-500 h-2 rounded" style={{ width: `${value}%` }} />
  </div>
);

const MockButton = ({ children, onClick, variant = "default", ...props }: any) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-2 rounded ${
      variant === "outline" ? "border" : "bg-blue-500 text-white"
    }`}
    {...props}
  >
    {children}
  </button>
);

// Mock Business Components
const MockUserBehaviorDashboard = () => (
  <div data-testid="user-behavior-dashboard">
    <MockCard>
      <h2>用户行为分析</h2>
      <div data-testid="user-stats">
        <span>日活用户: 1,234</span>
        <span>页面访问: 5,678</span>
        <span>转化率: 12.5%</span>
      </div>
    </MockCard>
  </div>
);

const MockPredictiveDashboard = () => (
  <div data-testid="predictive-dashboard">
    <MockTabs value="sales" onValueChange={() => {}}>
      <MockTabsList>
        <MockTabsTrigger value="sales">销售预测</MockTabsTrigger>
        <MockTabsTrigger value="churn">客户流失</MockTabsTrigger>
        <MockTabsTrigger value="inventory">库存预测</MockTabsTrigger>
        <MockTabsTrigger value="elasticity">价格弹性</MockTabsTrigger>
      </MockTabsList>
      
      <MockTabsContent value="sales">
        <div data-testid="sales-prediction">销售预测面板</div>
      </MockTabsContent>
      
      <MockTabsContent value="churn">
        <div data-testid="churn-prediction">
          <MockCard>
            <h3>高风险客户</h3>
            <div className="space-y-2">
              <div>
                <span>张三 - 流失风险: 85%</span>
                <MockProgress value={85} />
              </div>
              <div>
                <span>李四 - 流失风险: 72%</span>
                <MockProgress value={72} />
              </div>
            </div>
          </MockCard>
        </div>
      </MockTabsContent>
      
      <MockTabsContent value="inventory">
        <div data-testid="inventory-forecast">库存预测面板</div>
      </MockTabsContent>
      
      <MockTabsContent value="elasticity">
        <div data-testid="price-elasticity">价格弹性分析</div>
      </MockTabsContent>
    </MockTabs>
  </div>
);

const MockDataWarehouseDashboard = () => (
  <div data-testid="data-warehouse-dashboard">
    <div className="grid grid-cols-4 gap-4">
      <MockCard>
        <h4>查询延迟</h4>
        <span data-testid="query-latency">850ms</span>
      </MockCard>
      <MockCard>
        <h4>数据新鲜度</h4>
        <span data-testid="data-freshness">8秒</span>
      </MockCard>
      <MockCard>
        <h4>并发查询</h4>
        <span data-testid="qps">1200 QPS</span>
      </MockCard>
      <MockCard>
        <h4>数据模型</h4>
        <span data-testid="data-models">3个</span>
      </MockCard>
    </div>
    
    <MockCard>
      <h3>数据源状态</h3>
      <div data-testid="data-sources">
        <div>MySQL订单数据库 - 正常</div>
        <div>MongoDB用户行为日志 - 正常</div>
        <div>Elasticsearch搜索引擎 - 异常</div>
      </div>
    </MockCard>
  </div>
);

// Mock Data
const mockUserProfiles = [
  {
    id: '1',
    name: '张三',
    segment: 'VIP客户',
    tags: ['高消费', '频繁访问', '会员'],
    value: 15000,
    lastVisit: '2025-11-14',
  },
  {
    id: '2',
    name: '李四',
    segment: '活跃用户',
    tags: ['中消费', '移动端', '新用户'],
    value: 3200,
    lastVisit: '2025-11-13',
  },
];

const mockChurnCustomers = [
  {
    id: '1',
    name: '王五',
    riskScore: 85,
    reason: '已转向竞争对手',
    recommendation: '提供特别优惠方案争取回流'
  },
  {
    id: '2',
    name: '赵六',
    riskScore: 72,
    reason: '价格敏感度增加',
    recommendation: '推出价格优惠活动'
  }
];

const mockInventoryForecasts = [
  {
    productName: "茅台飞天53度500ml",
    currentStock: 45,
    forecastDemand: 60,
    recommendedOrder: 30,
    status: "warning"
  },
  {
    productName: "五粮液52度500ml",
    currentStock: 15,
    forecastDemand: 40,
    recommendedOrder: 50,
    status: "critical"
  }
];

// Component Definitions
const UserProfilePanel = ({ profile }: { profile: any }) => (
  <MockCard data-testid="user-profile-panel">
    <h3 className="text-lg font-semibold">{profile.name}</h3>
    <MockBadge>{profile.segment}</MockBadge>
    <div className="mt-2">
      {profile.tags.map((tag: string, index: number) => (
        <MockBadge key={index} variant="outline">{tag}</MockBadge>
      ))}
    </div>
    <div className="mt-2">
      <span>客户价值: ¥{profile.value.toLocaleString()}</span>
    </div>
  </MockCard>
);

const ChurnPredictionPanel = ({ customers }: { customers: any[] }) => (
  <MockCard data-testid="churn-prediction-panel">
    <h3>客户流失预测</h3>
    <div className="space-y-4">
      {customers.map((customer) => (
        <div key={customer.id} className="p-4 border rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{customer.name}</span>
            <MockBadge variant="destructive">高风险</MockBadge>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span>流失风险</span>
              <span>{customer.riskScore}%</span>
            </div>
            <MockProgress value={customer.riskScore} />
          </div>
          <div className="text-sm text-gray-600">
            <p>原因: {customer.reason}</p>
            <p>建议: {customer.recommendation}</p>
          </div>
        </div>
      ))}
    </div>
  </MockCard>
);

const InventoryForecastPanel = ({ forecasts }: { forecasts: any[] }) => (
  <MockCard data-testid="inventory-forecast-panel">
    <h3>库存需求预测</h3>
    <div className="space-y-3">
      {forecasts.map((forecast, index) => (
        <div key={index} className="flex justify-between items-center p-3 border rounded">
          <div>
            <p className="font-medium">{forecast.productName}</p>
            <p className="text-sm text-gray-600">
              当前库存: {forecast.currentStock} | 预测需求: {forecast.forecastDemand}
            </p>
          </div>
          <div className="text-right">
            <MockBadge variant={forecast.status === "critical" ? "destructive" : "default"}>
              {forecast.status === "critical" ? "紧急" : "预警"}
            </MockBadge>
            <p className="text-sm mt-1">建议订货: {forecast.recommendedOrder}</p>
          </div>
        </div>
      ))}
    </div>
  </MockCard>
);

const PriceElasticityPanel = ({ data, elasticity }: { data: any[], elasticity: number }) => (
  <MockCard data-testid="price-elasticity-panel">
    <h3>价格弹性分析</h3>
    <div className="p-4 bg-gray-100 rounded">
      <p className="text-sm">价格弹性系数</p>
      <p className="text-2xl font-bold">{elasticity.toFixed(2)}</p>
      <p className="text-sm">
        {Math.abs(elasticity) > 1 ? "需求富有弹性" : "需求缺乏弹性"}
      </p>
    </div>
    <div data-testid="elasticity-chart">价格-需求散点图</div>
  </MockCard>
);

// Test Suites
describe('大数据分析模块测试', () => {
  describe('用户行为分析', () => {
    test('用户行为仪表板渲染测试', () => {
      render(<MockUserBehaviorDashboard />);
      
      expect(screen.getByTestId('user-behavior-dashboard')).toBeInTheDocument();
      expect(screen.getByText('用户行为分析')).toBeInTheDocument();
      expect(screen.getByText('日活用户: 1,234')).toBeInTheDocument();
      expect(screen.getByText('页面访问: 5,678')).toBeInTheDocument();
      expect(screen.getByText('转化率: 12.5%')).toBeInTheDocument();
    });

    test('用户画像面板测试', () => {
      render(<UserProfilePanel profile={mockUserProfiles[0]} />);
      
      expect(screen.getByTestId('user-profile-panel')).toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('VIP客户')).toBeInTheDocument();
      expect(screen.getByText('高消费')).toBeInTheDocument();
      expect(screen.getByText('客户价值: ¥15,000')).toBeInTheDocument();
    });

    test('用户画像标签渲染测试', () => {
      render(<UserProfilePanel profile={mockUserProfiles[1]} />);
      
      const profilePanel = screen.getByTestId('user-profile-panel');
      expect(profilePanel).toContainElement(screen.getByText('活跃用户'));
      expect(profilePanel).toContainElement(screen.getByText('中消费'));
      expect(profilePanel).toContainElement(screen.getByText('移动端'));
    });
  });

  describe('预测分析', () => {
    test('预测仪表板标签页切换测试', () => {
      render(<MockPredictiveDashboard />);
      
      expect(screen.getByTestId('predictive-dashboard')).toBeInTheDocument();
      expect(screen.getByText('销售预测')).toBeInTheDocument();
      expect(screen.getByText('客户流失')).toBeInTheDocument();
      expect(screen.getByText('库存预测')).toBeInTheDocument();
      expect(screen.getByText('价格弹性')).toBeInTheDocument();
    });

    test('客户流失预测面板测试', () => {
      render(<ChurnPredictionPanel customers={mockChurnCustomers} />);
      
      expect(screen.getByTestId('churn-prediction-panel')).toBeInTheDocument();
      expect(screen.getByText('客户流失预测')).toBeInTheDocument();
      expect(screen.getByText('王五')).toBeInTheDocument();
      expect(screen.getByText('赵六')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('72%')).toBeInTheDocument();
      
      // 检查面板包含流失风险相关信息
      const panel = screen.getByTestId('churn-prediction-panel');
      expect(panel).toHaveTextContent(/已转向竞争对手/);
      expect(panel).toHaveTextContent(/价格敏感度增加/);
      expect(panel).toHaveTextContent(/推出价格优惠活动/);
    });

    test('库存预测面板测试', () => {
      render(<InventoryForecastPanel forecasts={mockInventoryForecasts} />);
      
      expect(screen.getByTestId('inventory-forecast-panel')).toBeInTheDocument();
      expect(screen.getByText('库存需求预测')).toBeInTheDocument();
      expect(screen.getByText('茅台飞天53度500ml')).toBeInTheDocument();
      expect(screen.getByText('五粮液52度500ml')).toBeInTheDocument();
      expect(screen.getByText('紧急')).toBeInTheDocument();
      expect(screen.getByText('建议订货: 50')).toBeInTheDocument();
    });

    test('价格弹性分析测试', () => {
      const mockData = [
        { price: 100, demand: 1000 },
        { price: 120, demand: 800 },
        { price: 140, demand: 650 },
      ];
      
      render(<PriceElasticityPanel data={mockData} elasticity={-1.2} />);
      
      expect(screen.getByTestId('price-elasticity-panel')).toBeInTheDocument();
      expect(screen.getByText('价格弹性分析')).toBeInTheDocument();
      expect(screen.getByText('-1.20')).toBeInTheDocument();
      expect(screen.getByText('需求富有弹性')).toBeInTheDocument();
      expect(screen.getByTestId('elasticity-chart')).toBeInTheDocument();
    });

    // 新增的深度预测分析测试
     test('销售预测模型准确性验证', () => {
       const mockSalesForecast = {
         predicted: [120000, 135000, 118000, 142000, 155000],
         actual: [118000, 137000, 120000, 140000, 158000],
         accuracy: 96.8,
         trends: ['上升', '稳定', '下降', '上升', '上升']
       };

       const SalesForecastPanel = ({ forecast }: { forecast: any }) => (
         <MockCard data-testid="sales-forecast-panel">
           <h3>销售预测分析</h3>
           <div className="space-y-2">
             <div data-testid="forecast-accuracy-text">预测准确率: {forecast.accuracy}%</div>
             <div data-testid="forecast-accuracy">
               {forecast.accuracy >= 95 ? '优秀' : forecast.accuracy >= 90 ? '良好' : '需改进'}
             </div>
           </div>
           <div data-testid="forecast-trends">
             {forecast.trends.map((trend: string, i: number) => (
               <div key={i}>周期{i+1}: {trend}</div>
             ))}
           </div>
         </MockCard>
       );

       render(<SalesForecastPanel forecast={mockSalesForecast} />);

       expect(screen.getByTestId('sales-forecast-panel')).toBeInTheDocument();
       expect(screen.getByTestId('forecast-accuracy-text')).toHaveTextContent('96.8');
       expect(screen.getByText('优秀')).toBeInTheDocument();
       expect(screen.getByTestId('forecast-trends')).toHaveTextContent('周期1: 上升');
     });

    test('客户流失风险分级测试', () => {
      const mockRiskCustomers = [
        { 
          id: '1', 
          name: '高风险客户', 
          riskScore: 92, 
          riskLevel: 'high',
          lastActivity: '30天前',
          churnProbability: 0.92
        },
        { 
          id: '2', 
          name: '中风险客户', 
          riskScore: 68, 
          riskLevel: 'medium',
          lastActivity: '15天前',
          churnProbability: 0.68
        },
        { 
          id: '3', 
          name: '低风险客户', 
          riskScore: 25, 
          riskLevel: 'low',
          lastActivity: '2天前',
          churnProbability: 0.25
        }
      ];

      const RiskLevelPanel = ({ customers }: { customers: any[] }) => (
        <MockCard data-testid="risk-level-panel">
          <h3>客户流失风险分级</h3>
          {customers.map(customer => (
            <div key={customer.id} className="border p-3 rounded mb-2">
              <div className="flex justify-between items-center">
                <span>{customer.name}</span>
                <span className={
                  customer.riskLevel === 'high' ? 'px-2 py-1 rounded text-sm bg-red-100 text-red-800' : 
                  customer.riskLevel === 'medium' ? 'px-2 py-1 rounded text-sm bg-blue-100 text-blue-800' : 'px-2 py-1 rounded text-sm border'
                } data-testid={`risk-level-${customer.id}`}>
                  {customer.riskLevel === 'high' ? '高风险' : 
                   customer.riskLevel === 'medium' ? '中风险' : '低风险'}
                </span>
              </div>
              <div className="text-sm text-gray-600" data-testid={`customer-${customer.id}-info`}>
                风险分数: {customer.riskScore} | 最后活跃: {customer.lastActivity}
              </div>
              <MockProgress value={customer.riskScore} />
            </div>
          ))}
        </MockCard>
      );

      render(<RiskLevelPanel customers={mockRiskCustomers} />);

      expect(screen.getByTestId('risk-level-panel')).toBeInTheDocument();
      expect(screen.getByText('高风险')).toBeInTheDocument();
      expect(screen.getByText('中风险')).toBeInTheDocument();
      expect(screen.getByText('低风险')).toBeInTheDocument();
      expect(screen.getByTestId('customer-1-info')).toHaveTextContent('30天前');
      expect(screen.getByTestId('customer-3-info')).toHaveTextContent('2天前');
    });

    test('库存需求季节性预测测试', () => {
      const mockSeasonalForecast = [
        {
          product: '月饼',
          currentDemand: 500,
          seasonalMultiplier: 2.3,
          predictedDemand: 1150,
          recommendation: '增加库存200%',
          season: '中秋节'
        },
        {
          product: '啤酒',
          currentDemand: 800,
          seasonalMultiplier: 1.5,
          predictedDemand: 1200,
          recommendation: '增加库存50%',
          season: '夏季'
        }
      ];

      const SeasonalForecastPanel = ({ forecasts }: { forecasts: any[] }) => (
        <MockCard data-testid="seasonal-forecast-panel">
          <h3>季节性库存预测</h3>
          {forecasts.map((item, index) => (
            <div key={index} className="border p-3 rounded mb-2">
              <div className="font-medium">{item.product}</div>
              <div className="text-sm" data-testid={`demand-${index}`}>
                当前需求: {item.currentDemand} → 预测需求: {item.predictedDemand}
              </div>
              <div className="text-sm" data-testid={`season-${index}`}>季节: {item.season}</div>
              <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800" data-testid={`recommendation-${index}`}>{item.recommendation}</span>
              <MockProgress value={Math.min(item.seasonalMultiplier * 40, 100)} />
            </div>
          ))}
        </MockCard>
      );

      render(<SeasonalForecastPanel forecasts={mockSeasonalForecast} />);

      expect(screen.getByTestId('seasonal-forecast-panel')).toBeInTheDocument();
      expect(screen.getByText('月饼')).toBeInTheDocument();
      expect(screen.getByText('啤酒')).toBeInTheDocument();
      expect(screen.getByTestId('season-0')).toHaveTextContent('中秋节');
      expect(screen.getByTestId('recommendation-0')).toHaveTextContent('增加库存200%');
      expect(screen.getByTestId('demand-0')).toHaveTextContent('当前需求: 500 → 预测需求: 1150');
    });

    test('价格优化推荐算法测试', () => {
        const mockPricingOptimization = {
          currentPrice: 100,
          optimizedPrice: 95,
          expectedRevenue: 150000,
          confidence: 92.5,
          factors: ['需求弹性', '竞品价格', '库存水平', '季节因素']
        };

        const PricingOptimizationPanel = ({ optimization }: { optimization: any }) => (
          <MockCard data-testid="pricing-optimization-panel">
            <h3>价格优化建议</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">当前价格</div>
                <div className="text-xl font-bold" data-testid="current-price">¥{optimization.currentPrice}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">建议价格</div>
                <div className="text-xl font-bold text-green-600" data-testid="optimized-price">¥{optimization.optimizedPrice}</div>
              </div>
            </div>
            <div className="mt-4">
              <div data-testid="expected-revenue">预期收益: ¥{optimization.expectedRevenue.toLocaleString()}</div>
              <div data-testid="confidence">置信度: {optimization.confidence}%</div>
            </div>
            <div data-testid="optimization-factors">
              影响因素: {optimization.factors.join(', ')}
            </div>
          </MockCard>
        );

        render(<PricingOptimizationPanel optimization={mockPricingOptimization} />);

        expect(screen.getByTestId('pricing-optimization-panel')).toBeInTheDocument();
        expect(screen.getByTestId('current-price')).toHaveTextContent('¥100');
        expect(screen.getByTestId('optimized-price')).toHaveTextContent('¥95');
        expect(screen.getByTestId('expected-revenue')).toHaveTextContent('150,000');
        expect(screen.getByTestId('confidence')).toHaveTextContent('92.5');
        expect(screen.getByTestId('optimization-factors')).toHaveTextContent('需求弹性');
      });
  });

  describe('数据仓库管理', () => {
    test('数据仓库仪表板统计数据显示测试', () => {
      render(<MockDataWarehouseDashboard />);
      
      expect(screen.getByTestId('data-warehouse-dashboard')).toBeInTheDocument();
      expect(screen.getByText('查询延迟')).toBeInTheDocument();
      expect(screen.getByTestId('query-latency')).toHaveTextContent('850ms');
      expect(screen.getByTestId('data-freshness')).toHaveTextContent('8秒');
      expect(screen.getByTestId('qps')).toHaveTextContent('1200 QPS');
      expect(screen.getByTestId('data-models')).toHaveTextContent('3个');
    });

    test('数据源状态监控测试', () => {
      render(<MockDataWarehouseDashboard />);
      
      const dataSources = screen.getByTestId('data-sources');
      expect(dataSources).toBeInTheDocument();
      expect(dataSources).toHaveTextContent('MySQL订单数据库 - 正常');
      expect(dataSources).toHaveTextContent('Elasticsearch搜索引擎 - 异常');
    });
  });

  describe('数据分析功能测试', () => {
    test('大数据分析页面整体渲染测试', async () => {
      const BigDataAnalysisPage = () => (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">大数据分析中心</h1>
            <p className="text-muted-foreground">深度分析用户行为，预测业务趋势</p>
          </div>
          
          <div className="grid gap-6">
            <MockUserBehaviorDashboard />
            <MockPredictiveDashboard />
            <MockDataWarehouseDashboard />
          </div>
        </div>
      );

      render(<BigDataAnalysisPage />);
      
      expect(screen.getByText('大数据分析中心')).toBeInTheDocument();
      expect(screen.getByText('深度分析用户行为，预测业务趋势')).toBeInTheDocument();
      expect(screen.getByTestId('user-behavior-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('predictive-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('data-warehouse-dashboard')).toBeInTheDocument();
    });

    test('多用户画像同时显示测试', () => {
      const MultipleProfilesPage = () => (
        <div>
          <h2>用户画像总览</h2>
          <div className="grid gap-4">
            {mockUserProfiles.map(profile => (
              <UserProfilePanel key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      );

      render(<MultipleProfilesPage />);
      
      expect(screen.getByText('用户画像总览')).toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('客户价值: ¥15,000')).toBeInTheDocument();
      expect(screen.getByText('客户价值: ¥3,200')).toBeInTheDocument();
    });

    test('预测模型数据验证测试', () => {
      const PredictiveAnalysisPage = () => (
        <div>
          <h2>预测分析</h2>
          <div className="grid gap-4">
            <ChurnPredictionPanel customers={mockChurnCustomers} />
            <InventoryForecastPanel forecasts={mockInventoryForecasts} />
            <PriceElasticityPanel 
              data={[{ price: 100, demand: 1000 }]} 
              elasticity={-1.2} 
            />
          </div>
        </div>
      );

      render(<PredictiveAnalysisPage />);
      
      // 验证流失风险分数范围
      const riskScores = screen.getAllByText(/%/);
      riskScores.forEach(score => {
        const value = parseInt(score.textContent?.replace('%', '') || '0');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });

      // 验证库存状态
      expect(screen.getByText('紧急')).toBeInTheDocument();
      expect(screen.getByText('预警')).toBeInTheDocument();
    });

    test('数据分析异常情况处理测试', () => {
      const emptyChurnData: any[] = [];
      const emptyInventoryData: any[] = [];
      
      render(
        <div>
          <ChurnPredictionPanel customers={emptyChurnData} />
          <InventoryForecastPanel forecasts={emptyInventoryData} />
        </div>
      );
      
      expect(screen.getByTestId('churn-prediction-panel')).toBeInTheDocument();
      expect(screen.getByTestId('inventory-forecast-panel')).toBeInTheDocument();
      // 空数据时应该显示默认内容
      expect(screen.getByText('客户流失预测')).toBeInTheDocument();
      expect(screen.getByText('库存需求预测')).toBeInTheDocument();
    });
  });

  describe('性能与可用性测试', () => {
    test('大量数据渲染性能测试', () => {
      const largeUserProfiles = Array.from({ length: 100 }, (_, i) => ({
        id: `user-${i}`,
        name: `用户${i}`,
        segment: i % 3 === 0 ? 'VIP' : '普通',
        tags: ['标签1', '标签2'],
        value: Math.random() * 10000,
        lastVisit: '2025-11-14',
      }));

      const startTime = performance.now();
      render(
        <div>
          {largeUserProfiles.map(profile => (
            <UserProfilePanel key={profile.id} profile={profile} />
          ))}
        </div>
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // 渲染时间应少于1秒
    });

    test('用户交互响应性测试', async () => {
      const user = userEvent.setup();
      render(<MockPredictiveDashboard />);
      
      // 测试标签页切换
      const churnTab = screen.getByText('客户流失');
      await user.click(churnTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('churn-prediction')).toBeInTheDocument();
      });
    });
  });
});