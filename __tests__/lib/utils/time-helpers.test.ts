import { describe, it, expect } from '@jest/globals'
import {
  formatRelativeTime,
  formatDateTime,
  formatTime,
  formatDate,
} from '@/lib/utils/time-helpers'

describe('Time Helpers', () => {
  const now = Date.now()
  
  describe('formatRelativeTime', () => {
    it('should return "刚刚" for time less than a minute ago', () => {
      const timestamp = now - 30000 // 30 seconds ago
      expect(formatRelativeTime(timestamp)).toBe('刚刚')
    })

    it('should return minutes for time less than an hour ago', () => {
      const timestamp = now - 5 * 60000 // 5 minutes ago
      expect(formatRelativeTime(timestamp)).toBe('5分钟前')
    })

    it('should return hours for time less than a day ago', () => {
      const timestamp = now - 3 * 60 * 60000 // 3 hours ago
      expect(formatRelativeTime(timestamp)).toBe('3小时前')
    })

    it('should return days for time more than a day ago', () => {
      const timestamp = now - 2 * 24 * 60 * 60000 // 2 days ago
      expect(formatRelativeTime(timestamp)).toBe('2天前')
    })
  })

  describe('formatDateTime', () => {
    it('should format timestamp as date-time string', () => {
      const timestamp = new Date('2024-11-05T10:30:00').getTime()
      const formatted = formatDateTime(timestamp)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('11')
      expect(formatted).toContain('5')
    })
  })

  describe('formatTime', () => {
    it('should format timestamp as time string', () => {
      const timestamp = new Date('2024-11-05T10:30:00').getTime()
      const formatted = formatTime(timestamp)
      expect(formatted).toContain('10')
      expect(formatted).toContain('30')
    })
  })

  describe('formatDate', () => {
    it('should format timestamp as date string', () => {
      const timestamp = new Date('2024-11-05T10:30:00').getTime()
      const formatted = formatDate(timestamp)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('11')
      expect(formatted).toContain('5')
    })
  })
})
