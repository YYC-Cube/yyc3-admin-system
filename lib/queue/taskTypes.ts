/**
 * @file 任务类型与状态定义
 * @description 用于队列与进度查询
 * @author YYC
 */

export type TaskCategory = "image" | "doc" | "vector";

export type TaskStatus = "queued" | "running" | "done" | "error";

export interface TaskRequest {
  id: string;
  category: TaskCategory;
  from?: string | null;
  to: string;
  fileName: string;
  fileBuffer: Buffer;
  createdAt: number;
}

export interface TaskProgress {
  status: TaskStatus;
  progress: number; // 0-100
  message?: string;
  mime?: string;
  /** 输出文件名（含扩展名），用于前端下载与展示 */
  fileName?: string;
  dataBase64?: string; // 结果数据（Base64）
  updatedAt: number;
}
