/**
 * Framer Motion 动画配置常量
 * 统一管理整个应用的动画效果，保持一致性
 */

import type { Variants } from "framer-motion"

/**
 * 淡入动画变体
 */
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * 从下方滑入动画变体
 */
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

/**
 * 从上方滑入动画变体
 */
export const slideDownVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

/**
 * 从左侧滑入动画变体
 */
export const slideLeftVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

/**
 * 从右侧滑入动画变体
 */
export const slideRightVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

/**
 * 缩放动画变体
 */
export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

/**
 * 列表项动画配置（带索引延迟）
 */
export function getListItemAnimation(index: number, baseDelay: number = 0.1) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * baseDelay },
  }
}

/**
 * 标准过渡配置
 */
export const defaultTransition = {
  duration: 0.4,
  ease: "easeOut",
}

/**
 * 快速过渡配置
 */
export const fastTransition = {
  duration: 0.2,
  ease: "easeOut",
}

/**
 * 慢速过渡配置
 */
export const slowTransition = {
  duration: 0.6,
  ease: "easeOut",
}

/**
 * 弹性过渡配置
 */
export const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
}
