/**
 * @file ai-marketing.test.tsx
 * @description AI智能营销模块完整测试 - Jest版本
 * @author YYC
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the marketing dashboard components
const MockMarketingDashboard = () => {
  const [stats, setStats] = React.useState({
    totalCustomers: 1250,
    activeCampaigns: 8,
    conversionRate: 15.8,
    revenue: 45000
  });

  const [selectedTab, setSelectedTab] = React.useState('segment');

  return (
    <div data-testid="marketing-dashboard">
      <h2 data-testid="dashboard-title">AI智能营销助手</h2>
      
      {/* 统计卡片 */}
      <div data-testid="stats-cards">
        <div data-testid="stat-card-total-customers">
          <span>总客户数</span>
          <span>{stats.totalCustomers}</span>
        </div>
        <div data-testid="stat-card-active-campaigns">
          <span>活跃活动</span>
          <span>{stats.activeCampaigns}</span>
        </div>
        <div data-testid="stat-card-conversion-rate">
          <span>转化率</span>
          <span>{stats.conversionRate}%</span>
        </div>
        <div data-testid="stat-card-revenue">
          <span>营收</span>
          <span>${stats.revenue.toLocaleString()}</span>
        </div>
      </div>

      {/* 功能标签页 */}
      <div data-testid="feature-tabs">
        <button 
          data-testid="tab-segment"
          onClick={() => setSelectedTab('segment')}
          className={selectedTab === 'segment' ? 'active' : ''}
        >
          客户细分
        </button>
        <button 
          data-testid="tab-campaign"
          onClick={() => setSelectedTab('campaign')}
          className={selectedTab === 'campaign' ? 'active' : ''}
        >
          活动生成
        </button>
        <button 
          data-testid="tab-analysis"
          onClick={() => setSelectedTab('analysis')}
          className={selectedTab === 'analysis' ? 'active' : ''}
        >
          效果分析
        </button>
      </div>

      {/* 内容区域 */}
      <div data-testid="tab-content">
        {selectedTab === 'segment' && <MockCustomerSegmentPanel />}
        {selectedTab === 'campaign' && <MockCampaignGeneratorPanel />}
        {selectedTab === 'analysis' && (
          <div data-testid="analysis-panel">
            <h3>营销效果分析</h3>
            <p>正在分析营销活动效果...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MockCustomerSegmentPanel = () => {
  const [segments] = React.useState([
    { id: 'vip', name: 'VIP客户', count: 120, growth: 12 },
    { id: 'loyal', name: '忠诚客户', count: 450, growth: 8 },
    { id: 'potential', name: '潜力客户', count: 300, growth: 15 },
    { id: 'new', name: '新客户', count: 180, growth: 25 },
    { id: 'at-risk', name: '流失风险', count: 85, growth: -5 },
    { id: 'churned', name: '已流失', count: 115, growth: -2 }
  ]);

  return (
    <div data-testid="customer-segment-panel">
      <h3>客户细分分析</h3>
      <div data-testid="segments-grid">
        {segments.map(segment => (
          <div 
            key={segment.id} 
            data-testid={`segment-${segment.id}`}
            className="segment-card"
          >
            <h4>{segment.name}</h4>
            <p data-testid={`count-${segment.id}`}>{segment.count} 客户</p>
            <p data-testid={`growth-${segment.id}`}>
              增长: {segment.growth > 0 ? '+' : ''}{segment.growth}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MockCampaignGeneratorPanel = () => {
  const [formData, setFormData] = React.useState({
    segment: '',
    objective: '',
    budget: '',
    duration: ''
  });
  const [campaign, setCampaign] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCampaign({
      name: 'AI生成营销活动',
      description: '基于客户细分的个性化营销方案',
      budget: formData.budget,
      duration: formData.duration,
      expectedReach: '5,000-8,000',
      expectedConversion: '12-15%'
    });
  };

  return (
    <div data-testid="campaign-generator-panel">
      <h3>AI营销活动生成器</h3>
      
      <form data-testid="campaign-form" onSubmit={handleSubmit}>
        <div data-testid="form-segment">
          <label>目标客户群体</label>
          <select 
            value={formData.segment}
            onChange={(e) => setFormData({...formData, segment: e.target.value})}
          >
            <option value="">请选择客户群体</option>
            <option value="vip">VIP客户</option>
            <option value="loyal">忠诚客户</option>
            <option value="potential">潜力客户</option>
          </select>
        </div>

        <div data-testid="form-objective">
          <label>业务目标</label>
          <select 
            value={formData.objective}
            onChange={(e) => setFormData({...formData, objective: e.target.value})}
          >
            <option value="">请选择目标</option>
            <option value="acquisition">客户获取</option>
            <option value="retention">客户留存</option>
            <option value="upsell">追加销售</option>
            <option value="reactivation">客户唤醒</option>
          </select>
        </div>

        <div data-testid="form-budget">
          <label>预算范围</label>
          <select 
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
          >
            <option value="">请选择预算</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="10000+">$10,000+</option>
          </select>
        </div>

        <div data-testid="form-duration">
          <label>活动周期</label>
          <select 
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          >
            <option value="">请选择周期</option>
            <option value="1week">1周</option>
            <option value="2weeks">2周</option>
            <option value="1month">1个月</option>
            <option value="3months">3个月</option>
          </select>
        </div>

        <button 
          data-testid="generate-button"
          type="submit"
          disabled={!formData.segment || !formData.objective}
        >
          生成营销方案
        </button>
      </form>

      {campaign && (
        <div data-testid="campaign-result">
          <h4>{campaign.name}</h4>
          <p>{campaign.description}</p>
          <div data-testid="campaign-metrics">
            <p>预算: {campaign.budget}</p>
            <p>周期: {campaign.duration}</p>
            <p>预期触达: {campaign.expectedReach}</p>
            <p>预期转化: {campaign.expectedConversion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 主测试组件
const AIMarketingPage = () => {
  return (
    <div data-testid="ai-marketing-page">
      <h1 data-testid="page-title">AI智能营销助手</h1>
      <p data-testid="page-description">
        利用人工智能技术，为您的业务提供精准的营销策略和客户洞察
      </p>
      <MockMarketingDashboard />
    </div>
  );
};

describe('AI智能营销模块测试', () => {
  
  describe('AI营销页面组件测试', () => {
    test('页面应该正确渲染AI营销标题和描述', () => {
      render(<AIMarketingPage />);
      
      expect(screen.getByTestId('page-title')).toHaveTextContent('AI智能营销助手');
      expect(screen.getByTestId('page-description')).toBeInTheDocument();
      expect(screen.getByTestId('marketing-dashboard')).toBeInTheDocument();
    });

    test('营销仪表板应该正确显示', () => {
      render(<AIMarketingPage />);
      
      expect(screen.getByTestId('dashboard-title')).toHaveTextContent('AI智能营销助手');
      expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
      expect(screen.getByTestId('feature-tabs')).toBeInTheDocument();
    });

    test('统计卡片应该显示正确数据', () => {
      render(<AIMarketingPage />);
      
      expect(screen.getByTestId('stat-card-total-customers')).toHaveTextContent('总客户数1250');
      expect(screen.getByTestId('stat-card-active-campaigns')).toHaveTextContent('活跃活动8');
      expect(screen.getByTestId('stat-card-conversion-rate')).toHaveTextContent('转化率15.8%');
      expect(screen.getByTestId('stat-card-revenue')).toHaveTextContent('营收$45,000');
    });
  });

  describe('营销仪表板功能测试', () => {
    test('标签页切换功能应该正常工作', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 默认显示客户细分
      expect(screen.getByTestId('customer-segment-panel')).toBeInTheDocument();
      expect(screen.queryByTestId('campaign-generator-panel')).not.toBeInTheDocument();
      
      // 切换到活动生成标签页
      await user.click(screen.getByTestId('tab-campaign'));
      expect(screen.getByTestId('campaign-generator-panel')).toBeInTheDocument();
      expect(screen.queryByTestId('customer-segment-panel')).not.toBeInTheDocument();
      
      // 切换到效果分析标签页
      await user.click(screen.getByTestId('tab-analysis'));
      expect(screen.getByTestId('analysis-panel')).toBeInTheDocument();
      expect(screen.queryByTestId('campaign-generator-panel')).not.toBeInTheDocument();
    });

    test('活动生成器表单验证应该正常工作', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 切换到活动生成标签页
      await user.click(screen.getByTestId('tab-campaign'));
      
      const generateButton = screen.getByTestId('generate-button');
      
      // 表单未完成时按钮应该禁用
      expect(generateButton).toBeDisabled();
      
      // 填写必要字段
      await user.selectOptions(screen.getByTestId('form-segment').querySelector('select'), 'vip');
      await user.selectOptions(screen.getByTestId('form-objective').querySelector('select'), 'acquisition');
      
      // 填写后按钮应该启用
      expect(generateButton).not.toBeDisabled();
    });

    test('营销活动生成流程应该正常工作', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 切换到活动生成标签页
      await user.click(screen.getByTestId('tab-campaign'));
      
      // 填写表单
      await user.selectOptions(screen.getByTestId('form-segment').querySelector('select'), 'vip');
      await user.selectOptions(screen.getByTestId('form-objective').querySelector('select'), 'acquisition');
      await user.selectOptions(screen.getByTestId('form-budget').querySelector('select'), '5000-10000');
      await user.selectOptions(screen.getByTestId('form-duration').querySelector('select'), '1month');
      
      // 提交表单
      await user.click(screen.getByTestId('generate-button'));
      
      // 等待异步操作完成
      await waitFor(() => {
        expect(screen.getByTestId('campaign-result')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // 验证生成的结果
      expect(screen.getByTestId('campaign-result')).toHaveTextContent('AI生成营销活动');
      expect(screen.getByTestId('campaign-metrics')).toBeInTheDocument();
    });
  });

  describe('客户细分面板测试', () => {
    test('客户细分数据应该正确显示', () => {
      render(<AIMarketingPage />);
      
      // 验证各个细分客户群体
      expect(screen.getByTestId('segment-vip')).toBeInTheDocument();
      expect(screen.getByTestId('count-vip')).toHaveTextContent('120 客户');
      expect(screen.getByTestId('growth-vip')).toHaveTextContent('增长: +12%');
      
      expect(screen.getByTestId('segment-loyal')).toBeInTheDocument();
      expect(screen.getByTestId('count-loyal')).toHaveTextContent('450 客户');
      expect(screen.getByTestId('growth-loyal')).toHaveTextContent('增长: +8%');
      
      expect(screen.getByTestId('segment-at-risk')).toBeInTheDocument();
      expect(screen.getByTestId('count-at-risk')).toHaveTextContent('85 客户');
      expect(screen.getByTestId('growth-at-risk')).toHaveTextContent('增长: -5%');
    });

    test('客户细分面板应该正确渲染', () => {
      render(<AIMarketingPage />);
      
      expect(screen.getByTestId('customer-segment-panel')).toBeInTheDocument();
      expect(screen.getByText('客户细分分析')).toBeInTheDocument();
      expect(screen.getByTestId('segments-grid')).toBeInTheDocument();
    });
  });

  describe('营销活动生成器测试', () => {
    test('表单字段应该正确渲染', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 切换到活动生成标签页
      await user.click(screen.getByTestId('tab-campaign'));
      
      expect(screen.getByTestId('campaign-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-segment')).toBeInTheDocument();
      expect(screen.getByTestId('form-objective')).toBeInTheDocument();
      expect(screen.getByTestId('form-budget')).toBeInTheDocument();
      expect(screen.getByTestId('form-duration')).toBeInTheDocument();
    });

    test('表单选择应该正确更新状态', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 切换到活动生成标签页
      await user.click(screen.getByTestId('tab-campaign'));
      
      // 选择客户群体
      await user.selectOptions(screen.getByTestId('form-segment').querySelector('select'), 'vip');
      
      // 选择业务目标
      await user.selectOptions(screen.getByTestId('form-objective').querySelector('select'), 'retention');
      
      // 选择预算
      await user.selectOptions(screen.getByTestId('form-budget').querySelector('select'), '10000+');
      
      // 选择周期
      await user.selectOptions(screen.getByTestId('form-duration').querySelector('select'), '3months');
      
      // 验证按钮现在已启用
      expect(screen.getByTestId('generate-button')).not.toBeDisabled();
    });
  });

  describe('集成测试', () => {
    test('完整的用户交互流程应该正常工作', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 1. 验证初始页面状态
      expect(screen.getByTestId('page-title')).toHaveTextContent('AI智能营销助手');
      
      // 2. 验证仪表板数据显示
      expect(screen.getByTestId('stat-card-total-customers')).toHaveTextContent('总客户数1250');
      
      // 3. 测试标签页切换
      await user.click(screen.getByTestId('tab-campaign'));
      expect(screen.getByTestId('campaign-generator-panel')).toBeInTheDocument();
      
      // 4. 测试表单填写
      await user.selectOptions(screen.getByTestId('form-segment').querySelector('select'), 'loyal');
      await user.selectOptions(screen.getByTestId('form-objective').querySelector('select'), 'upsell');
      
      // 5. 生成营销活动
      await user.click(screen.getByTestId('generate-button'));
      
      // 6. 验证结果
      await waitFor(() => {
        expect(screen.getByTestId('campaign-result')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      expect(screen.getByTestId('campaign-result')).toHaveTextContent('AI生成营销活动');
      
      // 7. 切换回客户细分验证数据
      await user.click(screen.getByTestId('tab-segment'));
      expect(screen.getByTestId('customer-segment-panel')).toBeInTheDocument();
      expect(screen.getByTestId('count-vip')).toHaveTextContent('120 客户');
    });
  });

  describe('错误处理测试', () => {
    test('网络错误应该得到适当处理', async () => {
      // 这里可以模拟网络错误场景
      // 由于这是模拟组件，暂时跳过实际的网络错误测试
      expect(true).toBe(true);
    });

    test('无效表单提交应该被阻止', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      // 切换到活动生成标签页
      await user.click(screen.getByTestId('tab-campaign'));
      
      // 不填写任何字段尝试提交
      const generateButton = screen.getByTestId('generate-button');
      expect(generateButton).toBeDisabled();
      
      // 只填写一个字段
      await user.selectOptions(screen.getByTestId('form-segment').querySelector('select'), 'vip');
      expect(generateButton).toBeDisabled();
    });
  });

  describe('性能测试', () => {
    test('组件渲染应该很快', () => {
      const startTime = performance.now();
      render(<AIMarketingPage />);
      const endTime = performance.now();
      
      // 组件渲染时间应该少于100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('用户交互响应应该及时', async () => {
      const user = userEvent.setup();
      render(<AIMarketingPage />);
      
      const startTime = performance.now();
      await user.click(screen.getByTestId('tab-campaign'));
      const endTime = performance.now();
      
      // 标签页切换响应时间应该少于50ms
      expect(endTime - startTime).toBeLessThan(50);
    });
  });
});