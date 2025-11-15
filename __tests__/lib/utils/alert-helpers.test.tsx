/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from '@jest/globals'
import {
  getAlertBadgeVariant,
  getAlertSeverityText,
  type AlertSeverity,
} from '@/lib/utils/alert-helpers'

describe('Alert Helpers', () => {
  describe('getAlertBadgeVariant', () => {
    it('should return destructive variant for critical severity', () => {
      expect(getAlertBadgeVariant('critical')).toBe('destructive')
    })

    it('should return destructive variant for high severity', () => {
      expect(getAlertBadgeVariant('high')).toBe('destructive')
    })

    it('should return default variant for medium severity', () => {
      expect(getAlertBadgeVariant('medium')).toBe('default')
    })

    it('should return default variant for warning severity', () => {
      expect(getAlertBadgeVariant('warning')).toBe('default')
    })

    it('should return secondary variant for low severity', () => {
      expect(getAlertBadgeVariant('low')).toBe('secondary')
    })

    it('should return secondary variant for info severity', () => {
      expect(getAlertBadgeVariant('info')).toBe('secondary')
    })
  })

  describe('getAlertSeverityText', () => {
    it('should return correct Chinese text for critical', () => {
      expect(getAlertSeverityText('critical')).toBe('严重')
    })

    it('should return correct Chinese text for high', () => {
      expect(getAlertSeverityText('high')).toBe('严重')
    })

    it('should return correct Chinese text for medium', () => {
      expect(getAlertSeverityText('medium')).toBe('警告')
    })

    it('should return correct Chinese text for warning', () => {
      expect(getAlertSeverityText('warning')).toBe('警告')
    })

    it('should return correct Chinese text for low', () => {
      expect(getAlertSeverityText('low')).toBe('低')
    })

    it('should return correct Chinese text for info', () => {
      expect(getAlertSeverityText('info')).toBe('提示')
    })

    it('should return original value for unknown severity', () => {
      const unknownSeverity = 'unknown' as AlertSeverity
      expect(getAlertSeverityText(unknownSeverity)).toBe('unknown')
    })
  })
})
