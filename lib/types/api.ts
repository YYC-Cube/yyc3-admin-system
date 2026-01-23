/**
 * @file API相关类型定义
 * @description 定义API响应和请求相关的类型
 * @module api/types
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

// 基础API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

// 排序参数类型
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 筛选参数类型
export interface FilterParams {
  [key: string]: any;
}

// 通用ID类型
export type ID = string | number;

// 通用状态类型
export type Status = 'active' | 'inactive' | 'pending' | 'deleted';
