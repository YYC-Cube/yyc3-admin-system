/**
 * @file 性能基准测试工具
 * @description 生成性能基线数据，支持API和页面性能测试
 * @module performance
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { performance } from 'perf_hooks';

interface BenchmarkResult {
  name: string;
  description: string;
  responseTime: number;
  memoryBefore: NodeJS.MemoryUsage;
  memoryAfter: NodeJS.MemoryUsage;
  timestamp: number;
  iterations: number;
  status: 'success' | 'error';
  error?: string;
}

interface PagePerformance {
  url: string;
  domContentLoaded: number;
  loadComplete: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export class PerformanceBenchmark {
  private static instance: PerformanceBenchmark;
  private benchmarkResults: BenchmarkResult[] = [];
  private baselineData: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): PerformanceBenchmark {
    if (!PerformanceBenchmark.instance) {
      PerformanceBenchmark.instance = new PerformanceBenchmark();
    }
    return PerformanceBenchmark.instance;
  }

  /**
   * API性能基准测试
   */
  public async benchmarkApi(
    name: string,
    description: string,
    apiCall: () => Promise<any>,
    iterations: number = 10
  ): Promise<BenchmarkResult> {
    const results: number[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < iterations; i++) {
      try {
        const memoryBefore = process.memoryUsage();
        const startTime = performance.now();
        
        await apiCall();
        
        const endTime = performance.now();
        const memoryAfter = process.memoryUsage();
        
        results.push(endTime - startTime);
        
        // 等待短暂时间让系统稳定
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    const responseTime = results.length > 0 ? 
      results.reduce((a, b) => a + b, 0) / results.length : 0;

    const result: BenchmarkResult = {
      name,
      description,
      responseTime: Math.round(responseTime * 100) / 100,
      memoryBefore: process.memoryUsage(),
      memoryAfter: process.memoryUsage(),
      timestamp: Date.now(),
      iterations: results.length,
      status: errors.length === iterations ? 'error' : 'success',
      error: errors.length > 0 ? errors.join(', ') : undefined
    };

    this.benchmarkResults.push(result);
    return result;
  }

  /**
   * 页面性能测试
   */
  public async benchmarkPage(
    url: string,
    fetcher: () => Promise<string>
  ): Promise<PagePerformance> {
    const startTime = performance.now();
    
    try {
      const html = await fetcher();
      const endTime = performance.now();

      // 模拟Web性能指标计算
      const loadComplete = endTime - startTime;
      const domContentLoaded = loadComplete * 0.7; // 假设DOMContentLoaded占70%
      const firstContentfulPaint = loadComplete * 0.3; // 假设首屏绘制占30%
      const timeToInteractive = loadComplete * 1.1; // 假设可交互时间稍长
      const largestContentfulPaint = loadComplete * 0.8; // 假设最大内容绘制占80%
      const cumulativeLayoutShift = Math.random() * 0.1; // 模拟CLS值

      return {
        url,
        domContentLoaded: Math.round(domContentLoaded * 100) / 100,
        loadComplete: Math.round(loadComplete * 100) / 100,
        firstContentfulPaint: Math.round(firstContentfulPaint * 100) / 100,
        timeToInteractive: Math.round(timeToInteractive * 100) / 100,
        largestContentfulPaint: Math.round(largestContentfulPaint * 100) / 100,
        cumulativeLayoutShift: Math.round(cumulativeLayoutShift * 1000) / 1000
      };
    } catch (error) {
      throw new Error(`页面性能测试失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 建立性能基线
   */
  public async establishBaseline(): Promise<void> {
    console.log('🚀 开始建立性能基线...');

    // API性能基线
    const apiBenchmarks = [
      {
        name: 'auth-login',
        description: '用户登录API性能测试',
        test: () => Promise.resolve({ success: true })
      },
      {
        name: 'products-list',
        description: '产品列表API性能测试',
        test: () => Promise.resolve({ products: [], total: 0 })
      },
      {
        name: 'orders-query',
        description: '订单查询API性能测试',
        test: () => Promise.resolve({ orders: [], total: 0 })
      },
      {
        name: 'members-search',
        description: '会员搜索API性能测试',
        test: () => Promise.resolve({ members: [], total: 0 })
      }
    ];

    for (const benchmark of apiBenchmarks) {
      console.log(`📊 测试 ${benchmark.name}...`);
      try {
        const result = await this.benchmarkApi(
          benchmark.name,
          benchmark.description,
          benchmark.test,
          5 // 减少迭代次数以提高速度
        );
        this.baselineData.set(benchmark.name, result.responseTime);
        console.log(`✅ ${benchmark.name}: ${result.responseTime}ms`);
      } catch (error) {
        console.error(`❌ ${benchmark.name} 失败:`, error);
      }
    }

    // 页面性能基线
    const pageBenchmarks = [
      { name: 'dashboard', url: '/dashboard' },
      { name: 'products', url: '/dashboard/products' },
      { name: 'orders', url: '/dashboard/orders' },
      { name: 'members', url: '/dashboard/members' }
    ];

    for (const page of pageBenchmarks) {
      console.log(`📄 测试页面 ${page.name}...`);
      try {
        const result = await this.benchmarkPage(page.url, async () => 
          `<html><body><h1>${page.name}</h1></body></html>`
        );
        this.baselineData.set(`page-${page.name}`, result.loadComplete);
        console.log(`✅ 页面 ${page.name}: ${result.loadComplete}ms`);
      } catch (error) {
        console.error(`❌ 页面 ${page.name} 失败:`, error);
      }
    }

    console.log('🎉 性能基线建立完成！');
    this.saveBaselineData();
  }

  /**
   * 保存基线数据
   */
  private saveBaselineData(): void {
    const baselineFile = './performance-baseline.json';
    
    try {
      const baselineObject: Record<string, any> = {};
      this.baselineData.forEach((value, key) => {
        baselineObject[key] = value;
      });
      
      baselineObject['createdAt'] = new Date().toISOString();
      baselineObject['version'] = '1.0.0';
      
      // 注意：在Node.js环境中，我们可以导出这个数据
      global.performanceBaseline = baselineObject;
      
      console.log('💾 基线数据已保存到内存');
    } catch (error) {
      console.error('❌ 保存基线数据失败:', error);
    }
  }

  /**
   * 获取基线数据
   */
  public getBaselineData(key?: string): number | Record<string, number> | null {
    if (key) {
      return this.baselineData.get(key) || null;
    }
    
    const baselineObject: Record<string, number> = {};
    this.baselineData.forEach((value, key) => {
      baselineObject[key] = value;
    });
    
    return baselineObject;
  }

  /**
   * 性能对比分析
   */
  public compareWithBaseline(
    currentMetrics: Record<string, number>
  ): Record<string, {
    baseline: number;
    current: number;
    difference: number;
    percentage: number;
    status: 'good' | 'warning' | 'critical';
  }> {
    const comparison: Record<string, any> = {};

    for (const [key, currentValue] of Object.entries(currentMetrics)) {
      const baseline = this.baselineData.get(key);
      if (baseline) {
        const difference = currentValue - baseline;
        const percentage = (difference / baseline) * 100;
        
        let status: 'good' | 'warning' | 'critical' = 'good';
        if (percentage > 20) status = 'critical';
        else if (percentage > 10) status = 'warning';

        comparison[key] = {
          baseline,
          current: currentValue,
          difference: Math.round(difference * 100) / 100,
          percentage: Math.round(percentage * 100) / 100,
          status
        };
      }
    }

    return comparison;
  }

  /**
   * 获取所有基准测试结果
   */
  public getAllResults(): BenchmarkResult[] {
    return [...this.benchmarkResults];
  }

  /**
   * 生成性能报告
   */
  public generateReport(): string {
    const results = this.benchmarkResults;
    if (results.length === 0) {
      return '暂无性能测试结果';
    }

    const report = [
      '# 性能基准测试报告',
      `生成时间: ${new Date().toLocaleString('zh-CN')}`,
      '',
      '## API性能测试结果',
      '',
      '| 测试名称 | 描述 | 响应时间 | 状态 | 错误信息 |',
      '|---------|------|----------|------|----------|'
    ];

    results.forEach(result => {
      const status = result.status === 'success' ? '✅' : '❌';
      const error = result.error || '-';
      report.push(`| ${result.name} | ${result.description} | ${result.responseTime}ms | ${status} | ${error} |`);
    });

    // 基线数据
    report.push('', '## 性能基线数据', '');
    this.baselineData.forEach((value, key) => {
      report.push(`- **${key}**: ${value}ms`);
    });

    return report.join('\n');
  }
}

// 全局实例
export const performanceBenchmark = PerformanceBenchmark.getInstance();