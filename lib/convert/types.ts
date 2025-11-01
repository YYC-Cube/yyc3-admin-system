/**
 * @file 转换类型定义
 * @description 统一管理各转换类别与目标格式的类型，避免页面内重复声明
 * @module lib/convert/types
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

// 转换类别
export type ConvertCategory = "image" | "doc" | "vector";

// 文档目标格式（当前仅支持 pdf，可扩展）
export const DOC_TARGETS = ["pdf"] as const;
export type DocTarget = typeof DOC_TARGETS[number];

// 矢量目标格式
export const VECTOR_TARGETS = ["svg", "png"] as const;
export type VectorTarget = typeof VECTOR_TARGETS[number];

// 图片目标格式：由环境配置控制（参考 environmentConfig.image.allowedOutputFormats）
// 此处仅提供类型占位以便统一使用方式
export type ImageTarget = string;

