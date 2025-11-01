/**
 * @file 任务轮询 Hook
 * @description 统一处理 /api/tasks/:id 的轮询、退避、取消与超时逻辑
 * @module hooks/useTaskPolling
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import { useCallback, useRef, useState } from "react";

export interface TaskPollingOptions {
  initialDelayMs?: number; // 初始轮询间隔，默认 800ms
  maxDelayMs?: number;     // 最大退避间隔，默认 2000ms
  timeoutMs?: number;      // 超时阈值，默认 30s
}

export interface TaskProgress {
  status: "pending" | "done" | "error";
  progress?: number;
  message?: string;
  dataBase64?: string;
  retryAfterMs?: number; // 服务端建议的下次轮询时间
  // 预览/下载增强字段（服务端可选返回）
  mime?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface UseTaskPollingResult {
  isPolling: boolean;
  progress: number;
  message: string;
  start: (taskId: string, onUpdate?: (p: TaskProgress) => void) => void;
  cancel: () => void;
}

/**
 * @description 通用任务轮询 Hook - 支持 Retry-After、退避与取消
 * @example
 * const { isPolling, start, cancel, progress, message } = useTaskPolling();
 * start(taskId, (p) => { // 处理完成/错误/预览URL生成等 });
 */
export function useTaskPolling(options?: TaskPollingOptions): UseTaskPollingResult {
  const initialDelay = options?.initialDelayMs ?? 800;
  const maxDelay = options?.maxDelayMs ?? 2000;
  const timeoutMs = options?.timeoutMs ?? 30_000;

  const [isPolling, setIsPolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const stoppedRef = useRef(false);
  const delayRef = useRef(initialDelay);
  const startedAtRef = useRef<number | null>(null);

  const poll = useCallback(async (taskId: string, onUpdate?: (p: TaskProgress) => void) => {
    if (stoppedRef.current) return;
    try {
      const r = await fetch(`/api/tasks/${taskId}`);
      if (!r.ok) {
        if (r.status === 429) {
          const retryAfter = r.headers.get("Retry-After");
          const suggestedMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
          delayRef.current = Math.min(suggestedMs ?? Math.round(delayRef.current * 1.5), maxDelay);
          setTimeout(() => poll(taskId, onUpdate), delayRef.current);
          return;
        }
        // 其它错误：停止
        stoppedRef.current = true;
        setIsPolling(false);
        onUpdate?.({ status: "error", message: `错误(${r.status})` });
        return;
      }
      const prog: TaskProgress = await r.json();
      setProgress(prog.progress ?? 0);
      setMessage(prog.message ?? "");
      onUpdate?.(prog);

      // 终止条件
      if (prog.status === "done" || prog.status === "error") {
        stoppedRef.current = true;
        setIsPolling(false);
        return;
      }
      if (startedAtRef.current && Date.now() - startedAtRef.current > timeoutMs) {
        stoppedRef.current = true;
        setIsPolling(false);
        onUpdate?.({ status: "error", message: "任务处理超时" });
        return;
      }

      // 正常情况：依据服务端建议调整间隔
      if (typeof prog.retryAfterMs === "number") {
        delayRef.current = Math.min(Math.max(prog.retryAfterMs, initialDelay), maxDelay);
      }
      setTimeout(() => poll(taskId, onUpdate), delayRef.current);
    } catch (e) {
      stoppedRef.current = true;
      setIsPolling(false);
      onUpdate?.({ status: "error", message: "网络异常" });
    }
  }, [initialDelay, maxDelay, timeoutMs]);

  const start = useCallback((taskId: string, onUpdate?: (p: TaskProgress) => void) => {
    stoppedRef.current = false;
    startedAtRef.current = Date.now();
    delayRef.current = initialDelay;
    setIsPolling(true);
    setProgress(0);
    setMessage("队列中…");
    setTimeout(() => poll(taskId, onUpdate), delayRef.current);
  }, [initialDelay, poll]);

  const cancel = useCallback(() => {
    stoppedRef.current = true;
    setIsPolling(false);
    setMessage("已取消轮询");
  }, []);

  return { isPolling, progress, message, start, cancel };
}
