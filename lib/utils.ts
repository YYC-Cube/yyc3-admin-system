import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS类名合并工具
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成唯一ID
 * @returns 唯一标识符字符串
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 验证文件大小
 * @param file 文件对象
 * @param maxSizeMB 最大文件大小（MB）
 * @returns 是否通过验证
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 小写的扩展名（不含点）
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};
