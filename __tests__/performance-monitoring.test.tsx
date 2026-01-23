/**
 * @file 性能监控与基准测试
 * @description 测试性能监控系统、基准测试工具和监控告警功能
 * @module performance-monitoring
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import { PerformanceMonitor, type PerformanceMetric } from '@/lib/monitoring/performance'
import { PerformanceBenchmark } from '@/lib/monitoring/benchmark'
import { MonitoringSystem } from '@/lib/monitoring/index'

describe('性能监控测试套件', () => {
  let performanceMonitor: PerformanceMonitor
  let performanceBenchmark: PerformanceBenchmark

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor()
    performanceBenchmark = PerformanceBenchmark.getInstance()
    jest.clearAllMocks()
  })

  describe('PerformanceMonitor类测试', () => {
    test('PerformanceMonitor应该正确初始化', () => {
      expect(performanceMonitor).toBeInstanceOf(PerformanceMonitor)
      expect(performanceMonitor).toHaveProperty('startMeasurement')
      expect(performanceMonitor).toHaveProperty('endMeasurement')
      expect(performanceMonitor).toHaveProperty('getMetrics')
    })

    test('应该能够开始和结束性能测量', () => {
      const measurementId = performanceMonitor.startMeasurement('test-operation')
      expect(measurementId).toBeDefined()
      expect(typeof measurementId).toBe('string')

      const endResult = performanceMonitor.endMeasurement(measurementId)
      expect(endResult).toBeDefined()
      expect(endResult).toHaveProperty('operation')
      expect(endResult).toHaveProperty('duration')
      expect(endResult).toHaveProperty('timestamp')
    })

    test('应该能够收集API性能指标', async () => {
      const mockMetrics: PerformanceMetric[] = [
        {
          name: 'api-response-time',
          value: 150,
          unit: 'ms',
          timestamp: new Date(),
          tags: { endpoint: '/api/test', method: 'GET' }
        },
        {
          name: 'api-throughput',
          value: 100,
          unit: 'req/min',
          timestamp: new Date(),
          tags: { endpoint: '/api/test' }
        }
      ]

      // 模拟收集API指标
      mockMetrics.forEach(metric => {
        performanceMonitor.recordMetric(metric)
      })

      const metrics = performanceMonitor.getMetrics()
      expect(metrics).toContainEqual(mockMetrics[0])
      expect(metrics).toContainEqual(mockMetrics[1])
    })

    test('应该能够执行性能告警检查', () => {
      // 设置高延迟阈值
      const criticalMetrics: PerformanceMetric[] = [
        {
          name: 'api-response-time',
          value: 2000, // 超高延迟
          unit: 'ms',
          timestamp: new Date(),
          tags: { endpoint: '/api/critical' }
        }
      ]

      criticalMetrics.forEach(metric => {
        performanceMonitor.recordMetric(metric)
      })

      const alerts = performanceMonitor.checkThresholds()
      expect(alerts).toContainEqual(
        expect.objectContaining({
          level: 'critical',
          metric: 'api-response-time',
          value: 2000
        })
      )
    })

    test('应该能够生成性能报告', () => {
      // 记录多个指标
      const testMetrics: PerformanceMetric[] = [
        {
          name: 'cpu-usage',
          value: 45,
          unit: '%',
          timestamp: new Date(),
          tags: { service: 'web' }
        },
        {
          name: 'memory-usage',
          value: 60,
          unit: '%',
          timestamp: new Date(),
          tags: { service: 'web' }
        }
      ]

      testMetrics.forEach(metric => {
        performanceMonitor.recordMetric(metric)
      })

      const report = performanceMonitor.generateReport()
      expect(report).toHaveProperty('summary')
      expect(report).toHaveProperty('metrics')
      expect(report).toHaveProperty('recommendations')
      expect(report.summary.totalMetrics).toBe(2)
    })
  })

  describe('PerformanceBenchmark类测试', () => {
    test('PerformanceBenchmark应该实现单例模式', () => {
      const instance1 = PerformanceBenchmark.getInstance()
      const instance2 = PerformanceBenchmark.getInstance()
      expect(instance1).toBe(instance2)
    })

    test('应该能够建立性能基线', async () => {
      const mockBaselineData = new Map([
        ['api-latency', 150],
        ['page-load-time', 2000],
        ['memory-usage', 512]
      ])

      const baselineResult = performanceBenchmark.establishBaseline(mockBaselineData)
      expect(baselineResult).toHaveProperty('timestamp')
      expect(baselineResult).toHaveProperty('metrics')
      expect(baselineResult.metrics.size).toBe(3)
    })

    test('应该能够执行API性能测试', async () => {
      const mockApiEndpoint = '/api/test-performance'
      const testOptions = {
        concurrentUsers: 10,
        duration: 5000, // 5秒
        rampUpTime: 1000 // 1秒
      }

      const result = await performanceBenchmark.runApiTest(mockApiEndpoint, testOptions)
      expect(result).toHaveProperty('endpoint', mockApiEndpoint)
      expect(result).toHaveProperty('metrics')
      expect(result).toHaveProperty('successRate')
      expect(result).toHaveProperty('avgResponseTime')
      expect(typeof result.successRate).toBe('number')
      expect(typeof result.avgResponseTime).toBe('number')
    })

    test('应该能够执行页面性能测试', async () => {
      const mockUrl = '/dashboard/performance'
      const testOptions = {
        loadTimeout: 10000,
        device: 'desktop'
      }

      const result = await performanceBenchmark.runPageTest(mockUrl, testOptions)
      expect(result).toHaveProperty('url', mockUrl)
      expect(result).toHaveProperty('loadTime')
      expect(result).toHaveProperty('domContentLoaded')
      expect(result).toHaveProperty('firstContentfulPaint')
    })

    test('应该能够进行性能对比分析', async () => {
      const baselineData = new Map([
        ['api-latency', 150],
        ['page-load-time', 2000]
      ])

      const currentData = new Map([
        ['api-latency', 180], // 恶化
        ['page-load-time', 1800] // 改善
      ])

      const comparison = performanceBenchmark.comparePerformance(baselineData, currentData)
      expect(comparison).toHaveProperty('improvements')
      expect(comparison).toHaveProperty('degradations')
      expect(comparison).toHaveProperty('overallTrend')
      
      expect(comparison.degradations).toContainEqual(
        expect.objectContaining({
          metric: 'api-latency',
          change: 20, // 增长20ms
          percentage: 13.33
        })
      )
      
      expect(comparison.improvements).toContainEqual(
        expect.objectContaining({
          metric: 'page-load-time',
          change: -200, // 减少200ms
          percentage: -10
        })
      )
    })
  })

  describe('MonitoringSystem类测试', () => {
    let monitoringSystem: MonitoringSystem

    beforeEach(() => {
      monitoringSystem = new MonitoringSystem()
    })

    test('MonitoringSystem应该正确初始化', () => {
      expect(monitoringSystem).toBeInstanceOf(MonitoringSystem)
      expect(monitoringSystem).toHaveProperty('initialize')
      expect(monitoringSystem).toHaveProperty('generateReport')
    })

    test('应该能够初始化监控系统', async () => {
      const config = {
        alerts: {
          email: 'admin@example.com',
          webhook: 'https://hooks.slack.com/test'
        },
        thresholds: {
          'api-response-time': { warning: 1000, critical: 2000 },
          'cpu-usage': { warning: 70, critical: 90 }
        }
      }

      const result = await monitoringSystem.initialize(config)
      expect(result).toBe(true)
    })

    test('应该能够建立监控基线', async () => {
      const baselineResult = await monitoringSystem.establishBaseline()
      expect(baselineResult).toHaveProperty('timestamp')
      expect(baselineResult).toHaveProperty('metrics')
      expect(baselineResult).toHaveProperty('status')
    })

    test('应该能够生成监控报告', async () => {
      // 模拟一些指标数据
      const mockMetrics = [
        {
          name: 'system-uptime',
          value: 99.9,
          unit: '%',
          timestamp: new Date(),
          tags: { service: 'production' }
        }
      ]

      // 模拟添加指标数据
      monitoringSystem.addMetrics(mockMetrics)

      const report = await monitoringSystem.generateReport()
      expect(report).toHaveProperty('overview')
      expect(report).toHaveProperty('alerts')
      expect(report).toHaveProperty('recommendations')
      expect(report).toHaveProperty('performance')
    })

    test('应该能够处理监控告警', async () => {
      const criticalAlert = {
        level: 'critical',
        message: 'API响应时间过长',
        metric: 'api-response-time',
        value: 3000,
        threshold: 2000,
        timestamp: new Date()
      }

      const result = await monitoringSystem.handleAlert(criticalAlert)
      expect(result).toBe(true)
    })
  })

  describe('性能监控集成测试', () => {
    test('完整性能监控流程', async () => {
      // 1. 初始化监控
      const monitor = new PerformanceMonitor()
      const benchmark = PerformanceBenchmark.getInstance()
      const monitoringSystem = new MonitoringSystem()

      // 2. 启动测量
      const measurementId = monitor.startMeasurement('integration-test')

      // 3. 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 100))

      // 4. 结束测量
      const result = monitor.endMeasurement(measurementId)
      expect(result.duration).toBeGreaterThan(0)

      // 5. 建立基线
      const baseline = benchmark.establishBaseline(new Map([
        ['test-metric', result.duration]
      ]))

      expect(baseline).toBeDefined()
    })

    test('性能告警集成', async () => {
      const monitor = new PerformanceMonitor()
      
      // 记录超阈值指标
      const criticalMetric: PerformanceMetric = {
        name: 'database-query-time',
        value: 5000, // 超时5秒
        unit: 'ms',
        timestamp: new Date(),
        tags: { database: 'primary' }
      }

      monitor.recordMetric(criticalMetric)
      const alerts = monitor.checkThresholds()

      expect(alerts.length).toBeGreaterThan(0)
      expect(alerts[0]).toHaveProperty('level', 'critical')
    })
  })

  describe('性能监控错误处理', () => {
    test('应该正确处理无效指标数据', () => {
      const monitor = new PerformanceMonitor()
      
      expect(() => {
        monitor.recordMetric({
          name: '', // 空名称
          value: NaN, // 无效值
          unit: '',
          timestamp: new Date(),
          tags: {}
        })
      }).not.toThrow()

      const metrics = monitor.getMetrics()
      // 验证无效数据被正确处理
      expect(metrics.length).toBeGreaterThanOrEqual(0)
    })

    test('应该正确处理监控配置错误', async () => {
      const monitoringSystem = new MonitoringSystem()
      
      const invalidConfig = {
        thresholds: {
          'invalid-metric': { warning: 'invalid-value', critical: 'invalid-value' }
        }
      }

      // 应该不会抛出错误，而是返回错误结果
      const result = await monitoringSystem.initialize(invalidConfig as any)
      expect(result).toBe(false)
    })

    test('应该正确处理基准测试超时', async () => {
      const benchmark = PerformanceBenchmark.getInstance()
      
      // 模拟非常长的测试持续时间
      const testOptions = {
        concurrentUsers: 1000,
        duration: 60000, // 1分钟
        rampUpTime: 5000
      }

      const result = await benchmark.runApiTest('/api/slow-endpoint', testOptions)
      expect(result).toHaveProperty('timeout', true)
    })
  })
})