import type { EnvConfig } from "./env.sync.d.ts"

function parseBoolean(value: string | undefined): boolean {
  return value === "true"
}

function parseNumber(value: string | undefined, fallback = 0): number {
  const n = Number(value)
  return isNaN(n) ? fallback : n
}

export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION!,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  API_TIMEOUT: parseNumber(process.env.API_TIMEOUT, 30000),

  YYC3_YY_DB_HOST: process.env.YYC3_YY_DB_HOST!,
  YYC3_YY_DB_PORT: parseNumber(process.env.YYC3_YY_DB_PORT, 3306),
  YYC3_YY_DB_USER: process.env.YYC3_YY_DB_USER!,
  YYC3_YY_DB_PASSWORD: process.env.YYC3_YY_DB_PASSWORD!,
  YYC3_YY_DB_NAME: process.env.YYC3_YY_DB_NAME!,

  REDIS_URL: process.env.REDIS_URL!,

  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,

  WECHAT_PAY_APP_ID: process.env.WECHAT_PAY_APP_ID!,
  WECHAT_PAY_MCH_ID: process.env.WECHAT_PAY_MCH_ID!,
  WECHAT_PAY_API_KEY: process.env.WECHAT_PAY_API_KEY!,
  WECHAT_PAY_NOTIFY_URL: process.env.WECHAT_PAY_NOTIFY_URL!,

  ALIPAY_APP_ID: process.env.ALIPAY_APP_ID!,
  ALIPAY_PRIVATE_KEY: process.env.ALIPAY_PRIVATE_KEY!,
  ALIPAY_PUBLIC_KEY: process.env.ALIPAY_PUBLIC_KEY!,
  ALIPAY_NOTIFY_URL: process.env.ALIPAY_NOTIFY_URL!,

  ANALYTICS_KEY: process.env.ANALYTICS_KEY!,
  SENTRY_DSN: process.env.SENTRY_DSN!,

  NEXT_PUBLIC_ENABLE_DARK_MODE: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_DARK_MODE),
  NEXT_PUBLIC_ENABLE_PWA: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_PWA),
  NEXT_PUBLIC_ENABLE_I18N: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_I18N),

  CACHE_TTL: parseNumber(process.env.CACHE_TTL, 3600),

  MAX_FILE_SIZE: parseNumber(process.env.MAX_FILE_SIZE, 10485760),
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES!,

  DEFAULT_PAGE_SIZE: parseNumber(process.env.DEFAULT_PAGE_SIZE, 20),
  MAX_PAGE_SIZE: parseNumber(process.env.MAX_PAGE_SIZE, 100),

  LOG_LEVEL: process.env.LOG_LEVEL!,
  LOG_FORMAT: process.env.LOG_FORMAT!,

  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: parseNumber(process.env.EMAIL_PORT, 587),
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
  EMAIL_FROM: process.env.EMAIL_FROM!,

  CSRF_SECRET: process.env.CSRF_SECRET!,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!,

  DEV_PORT: parseNumber(process.env.DEV_PORT, 3000),
  DEV_HOST: process.env.DEV_HOST!,

  WEBRTC_SIGNALING_URL: process.env.WEBRTC_SIGNALING_URL!,
  WEBRTC_TURN_URL: process.env.WEBRTC_TURN_URL!,
  WEBRTC_TURN_USERNAME: process.env.WEBRTC_TURN_USERNAME!,
  WEBRTC_TURN_PASSWORD: process.env.WEBRTC_TURN_PASSWORD!,
  WEBRTC_CODEC: process.env.WEBRTC_CODEC!,
  WEBRTC_BITRATE_MIN: parseNumber(process.env.WEBRTC_BITRATE_MIN, 300000),
  WEBRTC_BITRATE_MAX: parseNumber(process.env.WEBRTC_BITRATE_MAX, 2000000),
  WEBRTC_LATENCY_TARGET_MS: parseNumber(process.env.WEBRTC_LATENCY_TARGET_MS, 200),

  MEDIA_SERVER_TYPE: process.env.MEDIA_SERVER_TYPE!,
  MEDIA_SERVER_URL: process.env.MEDIA_SERVER_URL!,
  MEDIA_SERVER_API_KEY: process.env.MEDIA_SERVER_API_KEY!,

  VIDEO_EFFECTS_PATH: process.env.VIDEO_EFFECTS_PATH!,
  DEFAULT_VIDEO_EFFECT: process.env.DEFAULT_VIDEO_EFFECT!,
  ENABLE_VIDEO_EFFECTS: parseBoolean(process.env.ENABLE_VIDEO_EFFECTS),

  AR_ENGINE: process.env.AR_ENGINE!,
  VR_ENGINE: process.env.VR_ENGINE!,
  AR_RESOURCES_PATH: process.env.AR_RESOURCES_PATH!,
  VR_RESOURCES_PATH: process.env.VR_RESOURCES_PATH!,
  ENABLE_AR_CONCERT: parseBoolean(process.env.ENABLE_AR_CONCERT),
  ENABLE_VR_ROOM: parseBoolean(process.env.ENABLE_VR_ROOM),

  ENABLE_METRICS: parseBoolean(process.env.ENABLE_METRICS),
  METRICS_INTERVAL_MS: parseNumber(process.env.METRICS_INTERVAL_MS, 5000),
  METRICS_EXPORT_URL: process.env.METRICS_EXPORT_URL!,

  LOG_RETENTION_DAYS: parseNumber(process.env.LOG_RETENTION_DAYS, 30),
  LOG_REMOTE_URL: process.env.LOG_REMOTE_URL!,

  BI_TOOL: process.env.BI_TOOL!,
  BI_HOST: process.env.BI_HOST!,
  BI_API_KEY: process.env.BI_API_KEY!,

  OLAP_ENGINE: process.env.OLAP_ENGINE!,
  OLAP_HOST: process.env.OLAP_HOST!,
  OLAP_USER: process.env.OLAP_USER!,
  OLAP_PASSWORD: process.env.OLAP_PASSWORD!,
  OLAP_DB: process.env.OLAP_DB!,

  VISUALIZATION_ENGINE: process.env.VISUALIZATION_ENGINE!,
  VISUALIZATION_THEME: process.env.VISUALIZATION_THEME!,

  DATASOURCE_HOST: process.env.DATASOURCE_HOST!,
  DATASOURCE_PORT: parseNumber(process.env.DATASOURCE_PORT, 3306),
  DATASOURCE_USER: process.env.DATASOURCE_USER!,
  DATASOURCE_PASSWORD: process.env.DATASOURCE_PASSWORD!,
  DATASOURCE_DB: process.env.DATASOURCE_DB!,

  REPORT_CRON: process.env.REPORT_CRON!,
  REPORT_NOTIFY_EMAIL: process.env.REPORT_NOTIFY_EMAIL!,
  REPORT_SHARE_URL: process.env.REPORT_SHARE_URL!,

  ALERT_THRESHOLD_SALES_DROP: parseNumber(process.env.ALERT_THRESHOLD_SALES_DROP, 20),
  ALERT_EMAIL: process.env.ALERT_EMAIL!,
}

export default env
