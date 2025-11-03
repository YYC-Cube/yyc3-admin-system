/**
 * @file 环境配置 - 上传与转换限制（含 Zod 校验 + 严格模式）
 * @description 统一校验并导出项目环境配置，支持通过环境变量覆盖默认值；生产环境默认启用严格模式并进行边界告警
 * @module config/environment
 * @author YYC
 * @version 1.2.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { z } from 'zod';

// 避免循环导入，使用直接导入路径
import { ErrorHandler } from '../lib/errorHandler';

/** 默认配置（当环境变量缺失或非法时使用） */
const DEFAULTS = {
  api: {
    maxUploadSize: 10 * 1024 * 1024, // 10MB
    timeoutMs: 30_000, // 30s
    rateLimit: { windowMs: 60_000, maxPerIp: 30 },
    concurrency: { maxPerIp: 2, maxTotal: 8, queueSoftLimit: 50 },
  },
  image: { allowedOutputFormats: ['png', 'jpeg', 'webp', 'avif', 'tiff', 'heif'] as const },
};

/** 严格模式：生产环境或显式开启 ENV_STRICT */
const STRICT = process.env.ENV_STRICT === 'true' || process.env.NODE_ENV === 'production';

/** 关键参数边界（严格模式启用时进行告警与钳制） */
const BOUNDS = {
  API_TIMEOUT_MS: { min: 1_000, max: 120_000 }, // 1s ~ 120s
  API_MAX_UPLOAD_SIZE: { min: 1 * 1024 * 1024, max: 50 * 1024 * 1024 }, // 1MB ~ 50MB
  API_RATE_WINDOW_MS: { min: 1_000, max: 600_000 }, // 1s ~ 10min
  API_RATE_MAX_PER_IP: { min: 1, max: 1_000 },
  API_CONCURRENCY_MAX_PER_IP: { min: 1, max: 10 },
  API_CONCURRENCY_MAX_TOTAL: { min: 1, max: 100 },
  API_QUEUE_SOFT_LIMIT: { min: 1, max: 1_000 },
} as const;

/** 环境变量 Schema（字符串接收，内部转换为 number/array） */
const envSchema = z.object({
  API_MAX_UPLOAD_SIZE: z.string().optional(),
  API_TIMEOUT_MS: z.string().optional(),
  API_RATE_WINDOW_MS: z.string().optional(),
  API_RATE_MAX_PER_IP: z.string().optional(),
  API_CONCURRENCY_MAX_PER_IP: z.string().optional(),
  API_CONCURRENCY_MAX_TOTAL: z.string().optional(),
  API_QUEUE_SOFT_LIMIT: z.string().optional(),
  IMAGE_ALLOWED_OUTPUT_FORMATS: z.string().optional(), // 如 "png,jpeg,webp"
});

/** 数值解析与格式解析 */
function toInt(val: string | undefined, fallback: number): number {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseFormats(val: string | undefined, fallback: readonly string[]): readonly string[] {
  if (!val) return fallback;
  const arr = val
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return arr.length ? arr : fallback;
}

function enforceBounds(name: keyof typeof BOUNDS, value: number): number {
  if (!STRICT) return value;
  const { min, max } = BOUNDS[name];
  if (value < min || value > max) {
    ErrorHandler.sendAlert({ name, value, min, max }, 'EnvBounds');
    return Math.min(Math.max(value, min), max);
  }
  return value;
}

function parseFormatsStrict(
  val: string | undefined,
  fallback: readonly string[],
  known: readonly string[]
): readonly string[] {
  const raw = parseFormats(val, fallback);
  if (!STRICT) return raw;
  const filtered = raw.filter((fmt) => known.includes(fmt));
  if (filtered.length !== raw.length) {
    const unknown = raw.filter((fmt) => !known.includes(fmt));
    ErrorHandler.sendAlert({ unknown, allowed: known }, 'EnvFormatsUnknown');
  }
  return filtered.length ? filtered : fallback;
}

const envRaw = envSchema.safeParse(process.env);
if (!envRaw.success) {
  // 告警并使用默认配置启动，避免阻塞应用
  ErrorHandler.sendAlert(envRaw.error.flatten(), 'EnvSchemaInvalid');
}
const env = envRaw.success ? envRaw.data : {};

/** 导出的标准化配置（已应用默认值与环境变量覆盖 + 严格模式边界） */
const knownFormats = DEFAULTS.image.allowedOutputFormats;
const maxUploadSize = enforceBounds(
  'API_MAX_UPLOAD_SIZE',
  toInt(env.API_MAX_UPLOAD_SIZE, DEFAULTS.api.maxUploadSize)
);
const timeoutMs = enforceBounds(
  'API_TIMEOUT_MS',
  toInt(env.API_TIMEOUT_MS, DEFAULTS.api.timeoutMs)
);
const rateWindowMs = enforceBounds(
  'API_RATE_WINDOW_MS',
  toInt(env.API_RATE_WINDOW_MS, DEFAULTS.api.rateLimit.windowMs)
);
const rateMaxPerIp = enforceBounds(
  'API_RATE_MAX_PER_IP',
  toInt(env.API_RATE_MAX_PER_IP, DEFAULTS.api.rateLimit.maxPerIp)
);
const concMaxPerIp = enforceBounds(
  'API_CONCURRENCY_MAX_PER_IP',
  toInt(env.API_CONCURRENCY_MAX_PER_IP, DEFAULTS.api.concurrency.maxPerIp)
);
const concMaxTotal = enforceBounds(
  'API_CONCURRENCY_MAX_TOTAL',
  toInt(env.API_CONCURRENCY_MAX_TOTAL, DEFAULTS.api.concurrency.maxTotal)
);
const queueSoftLimit = enforceBounds(
  'API_QUEUE_SOFT_LIMIT',
  toInt(env.API_QUEUE_SOFT_LIMIT, DEFAULTS.api.concurrency.queueSoftLimit)
);
const allowedOutputFormats = parseFormatsStrict(
  env.IMAGE_ALLOWED_OUTPUT_FORMATS,
  knownFormats,
  knownFormats
);

export const environmentConfig = {
  api: {
    maxUploadSize,
    timeoutMs,
    rateLimit: { windowMs: rateWindowMs, maxPerIp: rateMaxPerIp },
    concurrency: { maxPerIp: concMaxPerIp, maxTotal: concMaxTotal, queueSoftLimit },
  },
  image: { allowedOutputFormats },
} as const;

// 为保持类型安全（联合类型），导出基于内置格式的类型
export type ImageOutputFormat = (typeof DEFAULTS.image.allowedOutputFormats)[number];
