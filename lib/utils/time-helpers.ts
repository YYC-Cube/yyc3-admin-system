/**
 * 时间格式化工具函数
 */

/**
 * 验证时间戳是否有效
 * @param timestamp - 时间戳（毫秒）
 * @returns 是否为有效时间戳
 */
function isValidTimestamp(timestamp: number): boolean {
  return typeof timestamp === 'number' && 
         !isNaN(timestamp) && 
         timestamp >= 0 && 
         timestamp <= 8640000000000000 // Max valid JavaScript date
}

/**
 * 将时间戳格式化为相对时间（例如："5分钟前"）
 * @param timestamp - 时间戳（毫秒）
 * @returns 格式化后的相对时间字符串
 */
export function formatRelativeTime(timestamp: number): string {
  if (!isValidTimestamp(timestamp)) {
    return "无效时间"
  }

  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return "刚刚"
}

/**
 * 将时间戳格式化为日期时间字符串
 * @param timestamp - 时间戳（毫秒）
 * @param locale - 区域设置，默认为中文
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(timestamp: number, locale: string = "zh-CN"): string {
  if (!isValidTimestamp(timestamp)) {
    return "无效时间"
  }
  return new Date(timestamp).toLocaleString(locale)
}

/**
 * 将时间戳格式化为时间字符串
 * @param timestamp - 时间戳（毫秒）
 * @param locale - 区域设置，默认为中文
 * @returns 格式化后的时间字符串
 */
export function formatTime(timestamp: number, locale: string = "zh-CN"): string {
  if (!isValidTimestamp(timestamp)) {
    return "无效时间"
  }
  return new Date(timestamp).toLocaleTimeString(locale)
}

/**
 * 将时间戳格式化为日期字符串
 * @param timestamp - 时间戳（毫秒）
 * @param locale - 区域设置，默认为中文
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number, locale: string = "zh-CN"): string {
  if (!isValidTimestamp(timestamp)) {
    return "无效时间"
  }
  return new Date(timestamp).toLocaleDateString(locale)
}
