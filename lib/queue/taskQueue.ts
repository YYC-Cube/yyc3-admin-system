/**
 * @file 简易任务队列（并发控制 + 进度）
 * @author YYC
 */

import { environmentConfig } from "../../config/environment";
import { CacheService } from "../cache/cacheService";
import { convertWithExternalTool, isToolAvailable } from "../convert/external";
import { convertImage } from "../convert/image";
import { HealthMonitor } from "../monitoring/healthMonitor";

import { TaskRequest, TaskProgress, TaskStatus, TaskCategory } from "./taskTypes";

class TaskQueue {
  private static instance: TaskQueue;
  private tasks = new Map<string, TaskRequest>();
  private progress = new Map<string, TaskProgress>();
  private running = 0;
  private cache = CacheService.getInstance();

  static getInstance(): TaskQueue {
    if (!this.instance) this.instance = new TaskQueue();
    return this.instance;
  }

  /** 获取当前队列长度（含待运行的任务数） */
  getQueueSize(): number {
    return this.tasks.size;
  }

  /** 获取当前运行中的任务数 */
  getRunningCount(): number {
    return this.running;
  }

  /** 获取队列软限制 */
  getSoftLimit(): number {
    return environmentConfig.api.concurrency.queueSoftLimit ?? 50;
  }

  /** 获取全局并发上限 */
  getMaxTotal(): number {
    return environmentConfig.api.concurrency.maxTotal ?? 8;
  }

  enqueue(req: Omit<TaskRequest, "id" | "createdAt">): string {
    const id = Math.random().toString(36).slice(2, 10);
    const task: TaskRequest = { id, createdAt: Date.now(), ...req };
    this.tasks.set(id, task);
    const softLimit = environmentConfig.api.concurrency.queueSoftLimit ?? 50;
    const queueSize = this.tasks.size;
    const baseProgress: TaskProgress = { status: "queued", progress: 0, updatedAt: Date.now() };
    if (queueSize >= softLimit) {
      // 进入队列拥挤态：发送告警 + 前端提示文案
      HealthMonitor.getInstance().notify("队列长度超过软限制", { queueSize, softLimit });
      this.progress.set(id, { ...baseProgress, message: "队列拥挤，预计等待较久。建议稍后重试" });
    } else {
      this.progress.set(id, baseProgress);
    }
    setImmediate(() => this.runNext());
    return id;
  }

  getProgress(id: string): TaskProgress | null {
    return this.progress.get(id) ?? null;
  }

  private async runNext() {
    if (this.running >= environmentConfig.api.concurrency.maxTotal) return;
    const next = [...this.tasks.values()].find((t) => (this.progress.get(t.id)?.status ?? "queued") === "queued");
    if (!next) return;

    this.running++;
    this.progress.set(next.id, { status: "running", progress: 5, updatedAt: Date.now(), message: "转换开始" });

    try {
      const { id, category, from, to, fileBuffer, fileName } = next;

      // 缓存命中
      const cacheKey = this.cache.hashKey(fileBuffer, from, to);
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        this.progress.set(id, { status: "done", progress: 100, dataBase64: cached, mime: this.guessMime(category, to), fileName: this.makeOutputName(fileName, category, to), updatedAt: Date.now(), message: "缓存命中" });
      } else {
        const res = await this.execute(category, { from, to, fileBuffer, fileName }, (p, msg) => {
          this.progress.set(id, { status: "running", progress: p, updatedAt: Date.now(), message: msg });
        });
        await this.cache.set(cacheKey, res.data.toString("base64"), 3600);
        this.progress.set(id, { status: "done", progress: 100, dataBase64: res.data.toString("base64"), mime: res.mime, fileName: this.makeOutputName(fileName, category, to), updatedAt: Date.now(), message: "完成" });
      }
    } catch (e: any) {
      this.progress.set(next.id, { status: "error", progress: 100, updatedAt: Date.now(), message: e?.message ?? String(e) });
    } finally {
      this.tasks.delete(next.id);
      this.running--;
      setImmediate(() => this.runNext());
    }
  }

  private guessMime(category: TaskCategory, to: string): string {
    if (category === "doc" && to === "pdf") return "application/pdf";
    if (category === "vector" && to === "svg") return "image/svg+xml";
    if (category === "vector" && to === "png") return "image/png";
    if (category === "image") {
      switch (to) {
        case "png": return "image/png";
        case "jpeg": return "image/jpeg";
        case "webp": return "image/webp";
        case "avif": return "image/avif";
        case "tiff": return "image/tiff";
        case "heif": return "image/heif";
      }
    }
    return "application/octet-stream";
  }

  /** 基于输入文件名与转换目标生成输出文件名 */
  private makeOutputName(input: string, category: TaskCategory, to: string): string {
    const base = input.replace(/\.[^.]+$/, "");
    const ext = (category === "doc") ? "pdf" : to;
    return `${base}.${ext}`;
  }

  private async execute(category: TaskCategory, params: { from?: string | null; to: string; fileBuffer: Buffer; fileName: string }, onProgress: (p: number, msg?: string) => void): Promise<{ mime: string; data: Buffer }> {
    const { from, to, fileBuffer, fileName } = params;
    onProgress(15, "准备转换");

    if (category === "image") {
      const out = await convertImage(fileBuffer, to as any);
      onProgress(80, "编码输出");
      return { mime: this.guessMime("image", to), data: out.data };
    }

    if (category === "doc") {
      if (!(await isToolAvailable("libreoffice"))) throw new Error("libreoffice 不可用");
      onProgress(30, "调用 LibreOffice");
      const res = await convertWithExternalTool(fileBuffer, { tool: "libreoffice", from: "docx", to: "pdf" });
      onProgress(80, "生成 PDF");
      return { mime: res.mime, data: res.data };
    }

    if (category === "vector") {
      if (!(await isToolAvailable("inkscape"))) throw new Error("inkscape 不可用");
      onProgress(30, "调用 Inkscape");
      const detectedFrom = fileName.toLowerCase().endsWith(".ai") ? "ai" : "eps";
      const res = await convertWithExternalTool(fileBuffer, { tool: "inkscape", from: detectedFrom, to });
      onProgress(80, "生成输出");
      return { mime: res.mime, data: res.data };
    }

    throw new Error("未知任务类别");
  }
}

export const GlobalTaskQueue = TaskQueue.getInstance();