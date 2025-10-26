// 图片转换接口
export interface ImageTransform {
  type: "resize" | "crop" | "format" | "quality" | "watermark"
  params: any
}

// 处理后的图片接口
export interface ProcessedImage {
  data: Buffer
  format: string
  width: number
  height: number
  size: number
}

// 数据点接口
export interface DataPoint {
  timestamp: number
  value: number
  category: string
  metadata?: Record<string, any>
}

// 聚合数据接口
export interface AggregatedData {
  total: number
  average: number
  min: number
  max: number
  count: number
  groupBy: Record<string, any>
}

// 事件接口
export interface Event {
  id: string
  type: string
  timestamp: number
  data: any
  userId?: string
}

// 分析结果接口
export interface AnalysisResult {
  summary: {
    totalEvents: number
    uniqueUsers: number
    eventTypes: Record<string, number>
  }
  trends: Array<{
    timestamp: number
    count: number
  }>
  anomalies: Array<{
    timestamp: number
    type: string
    severity: "low" | "medium" | "high"
    description: string
  }>
  insights: string[]
}

/**
 * 边缘计算函数类
 * 在边缘节点执行计算逻辑，减少数据传输
 */
export class EdgeComputeFunction {
  /**
   * 图片处理
   * 在边缘节点处理图片，减少带宽消耗
   */
  async processImage(imageUrl: string, transformations: ImageTransform[]): Promise<ProcessedImage> {
    try {
      // 获取图片
      const response = await fetch(imageUrl)
      const buffer = Buffer.from(await response.arrayBuffer())

      // 创建sharp实例
      let image = new ImageProcessor(buffer)

      // 应用转换
      for (const transform of transformations) {
        switch (transform.type) {
          case "resize":
            image = image.resize(transform.params.width, transform.params.height, {
              fit: transform.params.fit || "cover",
              position: transform.params.position || "center",
            })
            break

          case "crop":
            image = image.crop({
              left: transform.params.x,
              top: transform.params.y,
              width: transform.params.width,
              height: transform.params.height,
            })
            break

          case "format":
            image = image.format(transform.params.format, {
              quality: transform.params.quality || 80,
            })
            break

          case "quality":
            image = image.quality(transform.params.quality)
            break

          case "watermark":
            // 添加水印
            const watermark = Buffer.from(transform.params.text)
            image = image.watermark({
              input: watermark,
              gravity: transform.params.position || "southeast",
            })
            break
        }
      }

      // 获取处理后的图片信息
      const processedBuffer = await image.toBuffer()
      const metadata = await new ImageProcessor(processedBuffer).metadata()

      return {
        data: processedBuffer,
        format: metadata.format || "jpeg",
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: processedBuffer.length,
      }
    } catch (error) {
      console.error("[EdgeCompute] 图片处理失败:", error)
      throw error
    }
  }

  /**
   * 数据聚合
   * 在边缘节点聚合数据，减少传输量
   */
  async aggregateData(dataPoints: DataPoint[]): Promise<AggregatedData> {
    try {
      if (dataPoints.length === 0) {
        return {
          total: 0,
          average: 0,
          min: 0,
          max: 0,
          count: 0,
          groupBy: {},
        }
      }

      // 计算基础统计
      const values = dataPoints.map((dp) => dp.value)
      const total = values.reduce((sum, val) => sum + val, 0)
      const average = total / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)

      // 按类别分组
      const groupBy: Record<string, any> = {}
      for (const dp of dataPoints) {
        if (!groupBy[dp.category]) {
          groupBy[dp.category] = {
            count: 0,
            total: 0,
            average: 0,
            dataPoints: [],
          }
        }
        groupBy[dp.category].count++
        groupBy[dp.category].total += dp.value
        groupBy[dp.category].dataPoints.push(dp)
      }

      // 计算每个分组的平均值
      for (const category in groupBy) {
        groupBy[category].average = groupBy[category].total / groupBy[category].count
      }

      return {
        total,
        average,
        min,
        max,
        count: dataPoints.length,
        groupBy,
      }
    } catch (error) {
      console.error("[EdgeCompute] 数据聚合失败:", error)
      throw error
    }
  }

  /**
   * 实时分析
   * 在边缘节点分析事件流，快速响应
   */
  async analyzeRealtime(events: Event[]): Promise<AnalysisResult> {
    try {
      // 基础统计
      const uniqueUsers = new Set(events.map((e) => e.userId).filter(Boolean))
      const eventTypes: Record<string, number> = {}

      for (const event of events) {
        eventTypes[event.type] = (eventTypes[event.type] || 0) + 1
      }

      // 趋势分析（按小时分组）
      const trends: Record<number, number> = {}
      for (const event of events) {
        const hour = Math.floor(event.timestamp / 3600000) * 3600000
        trends[hour] = (trends[hour] || 0) + 1
      }

      const trendArray = Object.entries(trends)
        .map(([timestamp, count]) => ({
          timestamp: Number.parseInt(timestamp),
          count,
        }))
        .sort((a, b) => a.timestamp - b.timestamp)

      // 异常检测
      const anomalies: AnalysisResult["anomalies"] = []

      // 检测突发流量
      const avgCount = trendArray.reduce((sum, t) => sum + t.count, 0) / trendArray.length
      for (const trend of trendArray) {
        if (trend.count > avgCount * 2) {
          anomalies.push({
            timestamp: trend.timestamp,
            type: "traffic_spike",
            severity: "high",
            description: `流量突增: ${trend.count} 事件 (平均: ${avgCount.toFixed(0)})`,
          })
        }
      }

      // 检测错误率
      const errorEvents = events.filter((e) => e.type.includes("error"))
      const errorRate = (errorEvents.length / events.length) * 100
      if (errorRate > 5) {
        anomalies.push({
          timestamp: Date.now(),
          type: "high_error_rate",
          severity: errorRate > 10 ? "high" : "medium",
          description: `错误率过高: ${errorRate.toFixed(2)}%`,
        })
      }

      // 生成洞察
      const insights: string[] = []

      // 最活跃的事件类型
      const topEventType = Object.entries(eventTypes).sort((a, b) => b[1] - a[1])[0]
      if (topEventType) {
        insights.push(
          `最活跃的事件类型是 "${topEventType[0]}"，占比 ${((topEventType[1] / events.length) * 100).toFixed(1)}%`,
        )
      }

      // 用户活跃度
      insights.push(`共有 ${uniqueUsers.size} 个活跃用户`)

      // 趋势洞察
      if (trendArray.length >= 2) {
        const recentTrend = trendArray[trendArray.length - 1].count - trendArray[trendArray.length - 2].count
        if (recentTrend > 0) {
          insights.push(`事件数量呈上升趋势，增长 ${recentTrend} 个事件`)
        } else if (recentTrend < 0) {
          insights.push(`事件数量呈下降趋势，减少 ${Math.abs(recentTrend)} 个事件`)
        }
      }

      return {
        summary: {
          totalEvents: events.length,
          uniqueUsers: uniqueUsers.size,
          eventTypes,
        },
        trends: trendArray,
        anomalies,
        insights,
      }
    } catch (error) {
      console.error("[EdgeCompute] 实时分析失败:", error)
      throw error
    }
  }

  /**
   * 数据转换
   * 在边缘节点转换数据格式
   */
  async transformData(data: any, transformType: "json-to-csv" | "csv-to-json" | "xml-to-json"): Promise<string> {
    try {
      switch (transformType) {
        case "json-to-csv":
          return this.jsonToCsv(data)
        case "csv-to-json":
          return JSON.stringify(this.csvToJson(data))
        case "xml-to-json":
          return JSON.stringify(this.xmlToJson(data))
        default:
          throw new Error(`不支持的转换类型: ${transformType}`)
      }
    } catch (error) {
      console.error("[EdgeCompute] 数据转换失败:", error)
      throw error
    }
  }

  /**
   * JSON转CSV
   */
  private jsonToCsv(data: any[]): string {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const rows = data.map((item) => headers.map((header) => JSON.stringify(item[header] || "")).join(","))

    return [headers.join(","), ...rows].join("\n")
  }

  /**
   * CSV转JSON
   */
  private csvToJson(csv: string): any[] {
    const lines = csv.split("\n")
    const headers = lines[0].split(",")
    const result = []

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {}
      const currentLine = lines[i].split(",")

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j]
      }

      result.push(obj)
    }

    return result
  }

  /**
   * XML转JSON (简化版)
   */
  private xmlToJson(xml: string): any {
    // 简化的XML解析，生产环境建议使用专业库
    const result: any = {}
    const regex = /<(\w+)>(.*?)<\/\1>/g
    let match

    while ((match = regex.exec(xml)) !== null) {
      result[match[1]] = match[2]
    }

    return result
  }
}

// 创建全局实例
export const edgeComputeFunction = new EdgeComputeFunction()

// 计算装饰器
export function EdgeCompute() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()

      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - startTime

        console.log(`[EdgeCompute] ${propertyKey} 执行时间: ${duration}ms`)

        return result
      } catch (error) {
        console.error(`[EdgeCompute] ${propertyKey} 执行失败:`, error)
        throw error
      }
    }

    return descriptor
  }
}

// 模拟ImageProcessor类，因为Edge Runtime不支持Node.js模块
class ImageProcessor {
  private buffer: Buffer

  constructor(buffer: Buffer) {
    this.buffer = buffer
  }

  resize(width: number, height: number, options: any): ImageProcessor {
    // 模拟resize操作
    return this
  }

  crop(options: any): ImageProcessor {
    // 模拟crop操作
    return this
  }

  format(format: string, options: any): ImageProcessor {
    // 模拟format操作
    return this
  }

  quality(quality: number): ImageProcessor {
    // 模拟quality操作
    return this
  }

  watermark(options: any): ImageProcessor {
    // 模拟watermark操作
    return this
  }

  async toBuffer(): Promise<Buffer> {
    // 返回原始buffer
    return this.buffer
  }

  async metadata(): Promise<any> {
    // 模拟获取metadata操作
    return {
      format: "jpeg",
      width: 100,
      height: 100,
    }
  }
}
