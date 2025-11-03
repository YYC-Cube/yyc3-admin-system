/**
 * @file 类型定义文件
 * @description 项目核心数据类型定义
 * @module types
 * @author YYC
 * @version 1.0.0
 * @created 2024-11-02
 * @updated 2024-11-02
 */

/**
 * 表格数据行类型
 */
export type TableRow = Record<string, string | number | boolean | null | undefined>;

/**
 * 完整表格数据类型
 */
export interface TableData {
  headers: string[];
  rows: TableRow[];
}

/**
 * 支持的格式类型
 */
export type SupportedFormat =
  | 'csv'
  | 'json'
  | 'markdown'
  | 'html'
  | 'xlsx'
  | 'tsv'
  | 'sql'
  | 'yaml'
  | 'xml'
  | 'jsonl'
  | 'ndjson';

/**
 * 格式元数据
 */
export interface FormatMetadata {
  extension: string;
  mimeType: string;
  name: string;
  description: string;
}

/**
 * 格式配置映射
 */
export type FormatConfigMap = Record<SupportedFormat, FormatMetadata>;

/**
 * 解析器选项
 */
export interface ParserOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  quoteChar?: string;
  escapeChar?: string;
}

/**
 * 生成器选项
 */
export interface GeneratorOptions {
  delimiter?: string;
  quoteChar?: string;
  escapeChar?: string;
  pretty?: boolean;
  indentSize?: number;
  tableName?: string; // SQL相关
}

/**
 * 转换结果类型
 */
export interface ConversionResult {
  success: boolean;
  data?: string;
  error?: string;
  filename?: string;
  mimeType?: string;
}

/**
 * 用户操作历史记录
 */
export interface HistoryItem {
  id: string;
  timestamp: number;
  fromFormat: SupportedFormat;
  toFormat: SupportedFormat;
  tablePreview?: TableData;
}

/**
 * 任务状态类型
 */
export type TaskStatus = 'pending' | 'processing' | 'success' | 'error';

/**
 * 后台任务类型
 */
export interface BackgroundTask {
  id: string;
  status: TaskStatus;
  progress: number;
  message?: string;
  result?: ConversionResult;
  createdAt: number;
  updatedAt: number;
}

/**
 * API响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
