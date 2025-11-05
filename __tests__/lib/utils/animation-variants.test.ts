import { describe, it, expect } from '@jest/globals'
import {
  fadeInVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  getListItemAnimation,
  defaultTransition,
  fastTransition,
  slowTransition,
  springTransition,
} from '@/lib/utils/animation-variants'

describe('Animation Variants', () => {
  describe('Fade In Variants', () => {
    it('should have correct initial state', () => {
      expect(fadeInVariants.initial).toEqual({ opacity: 0 })
    })

    it('should have correct animate state', () => {
      expect(fadeInVariants.animate).toEqual({ opacity: 1 })
    })

    it('should have correct exit state', () => {
      expect(fadeInVariants.exit).toEqual({ opacity: 0 })
    })
  })

  describe('Slide Up Variants', () => {
    it('should have correct initial state', () => {
      expect(slideUpVariants.initial).toEqual({ opacity: 0, y: 20 })
    })

    it('should have correct animate state', () => {
      expect(slideUpVariants.animate).toEqual({ opacity: 1, y: 0 })
    })
  })

  describe('Slide Down Variants', () => {
    it('should have correct initial state', () => {
      expect(slideDownVariants.initial).toEqual({ opacity: 0, y: -10 })
    })

    it('should have correct animate state', () => {
      expect(slideDownVariants.animate).toEqual({ opacity: 1, y: 0 })
    })
  })

  describe('Slide Left Variants', () => {
    it('should have correct initial state', () => {
      expect(slideLeftVariants.initial).toEqual({ opacity: 0, x: -20 })
    })

    it('should have correct animate state', () => {
      expect(slideLeftVariants.animate).toEqual({ opacity: 1, x: 0 })
    })
  })

  describe('Slide Right Variants', () => {
    it('should have correct initial state', () => {
      expect(slideRightVariants.initial).toEqual({ opacity: 0, x: 20 })
    })

    it('should have correct animate state', () => {
      expect(slideRightVariants.animate).toEqual({ opacity: 1, x: 0 })
    })
  })

  describe('Scale Variants', () => {
    it('should have correct initial state', () => {
      expect(scaleVariants.initial).toEqual({ opacity: 0, scale: 0.95 })
    })

    it('should have correct animate state', () => {
      expect(scaleVariants.animate).toEqual({ opacity: 1, scale: 1 })
    })
  })

  describe('getListItemAnimation', () => {
    it('should return animation with delay based on index', () => {
      const animation = getListItemAnimation(3, 0.1)
      expect(animation.transition.delay).toBeCloseTo(0.3, 5)
    })

    it('should use default base delay of 0.1', () => {
      const animation = getListItemAnimation(2)
      expect(animation.transition.delay).toBeCloseTo(0.2, 5)
    })
  })

  describe('Transition Configs', () => {
    it('should have default transition with duration 0.4', () => {
      expect(defaultTransition.duration).toBe(0.4)
      expect(defaultTransition.ease).toBe('easeOut')
    })

    it('should have fast transition with duration 0.2', () => {
      expect(fastTransition.duration).toBe(0.2)
      expect(fastTransition.ease).toBe('easeOut')
    })

    it('should have slow transition with duration 0.6', () => {
      expect(slowTransition.duration).toBe(0.6)
      expect(slowTransition.ease).toBe('easeOut')
    })

    it('should have spring transition with correct properties', () => {
      expect(springTransition.type).toBe('spring')
      expect(springTransition.stiffness).toBe(100)
      expect(springTransition.damping).toBe(15)
    })
  })
})
