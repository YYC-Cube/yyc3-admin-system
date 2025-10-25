interface Metric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

class MetricsCollector {
  private metrics: Metric[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    // 每30秒刷新一次指标
    this.flushInterval = setInterval(() => this.flush(), 30000)
  }

  // 记录计数器
  increment(name: string, value = 1, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      tags,
    })
  }

  // 记录计时器
  timing(name: string, duration: number, tags?: Record<string, string>) {
    this.metrics.push({
      name: `${name}.duration`,
      value: duration,
      timestamp: Date.now(),
      tags,
    })
  }

  // 记录仪表盘
  gauge(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      tags,
    })
  }

  // 刷新指标到监控服务
  private async flush() {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []

    try {
      if (process.env.METRICS_SERVICE_URL) {
        await fetch(process.env.METRICS_SERVICE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metricsToSend),
        })
      }
    } catch (error) {
      console.error("[v0] Failed to send metrics:", error)
    }
  }

  // 清理
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
  }
}

export const metrics = new MetricsCollector()

// 性能监控装饰器
export function measurePerformance(metricName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()

      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - startTime

        metrics.timing(metricName, duration, {
          method: propertyKey,
          status: "success",
        })

        return result
      } catch (error) {
        const duration = Date.now() - startTime

        metrics.timing(metricName, duration, {
          method: propertyKey,
          status: "error",
        })

        throw error
      }
    }

    return descriptor
  }
}
