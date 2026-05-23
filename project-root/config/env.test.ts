import type { EnvConfig } from "./env.sync.d.ts"

export const env: EnvConfig = {
  NODE_ENV: "test",

  NEXT_PUBLIC_APP_NAME: "启智KTV测试环境",
  NEXT_PUBLIC_APP_VERSION: "1.0.0-test",
  NEXT_PUBLIC_API_BASE_URL: "http://localhost:4000/api",
  API_TIMEOUT: 10000,

  YYC3_YY_DB_HOST: "localhost",
  YYC3_YY_DB_PORT: 3306,
  YYC3_YY_DB_USER: "test_user",
  YYC3_YY_DB_PASSWORD: "test_pass",
  YYC3_YY_DB_NAME: "yyc3_yy_test",

  REDIS_URL: "redis://localhost:6380/0",

  JWT_SECRET: "test_jwt_secret",
  JWT_EXPIRES_IN: "1h",

  WECHAT_PAY_APP_ID: "test_wechat_app",
  WECHAT_PAY_MCH_ID: "test_mch",
  WECHAT_PAY_API_KEY: "test_api_key",
  WECHAT_PAY_NOTIFY_URL: "http://localhost:4000/api/payment/wechat-notify",

  ALIPAY_APP_ID: "test_alipay_app",
  ALIPAY_PRIVATE_KEY: "test_private_key",
  ALIPAY_PUBLIC_KEY: "test_public_key",
  ALIPAY_NOTIFY_URL: "http://localhost:4000/api/payment/alipay-notify",

  ANALYTICS_KEY: "test_analytics",
  SENTRY_DSN: "https://test@o0.ingest.sentry.io/0",

  NEXT_PUBLIC_ENABLE_DARK_MODE: false,
  NEXT_PUBLIC_ENABLE_PWA: false,
  NEXT_PUBLIC_ENABLE_I18N: false,

  CACHE_TTL: 600,

  MAX_FILE_SIZE: 1048576,
  ALLOWED_FILE_TYPES: "jpg,png",

  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  LOG_LEVEL: "debug",
  LOG_FORMAT: "text",

  EMAIL_HOST: "smtp.test.com",
  EMAIL_PORT: 1025,
  EMAIL_USER: "test@ktv.local",
  EMAIL_PASSWORD: "test_email_pass",
  EMAIL_FROM: "test@ktv.local",

  CSRF_SECRET: "test_csrf_secret",
  ENCRYPTION_KEY: "test_encryption_key_32_chars",

  DEV_PORT: 4000,
  DEV_HOST: "localhost",

  WEBRTC_SIGNALING_URL: "wss://localhost/ws",
  WEBRTC_TURN_URL: "turn:localhost:3478",
  WEBRTC_TURN_USERNAME: "test_turn",
  WEBRTC_TURN_PASSWORD: "test_turn_pass",
  WEBRTC_CODEC: "VP8",
  WEBRTC_BITRATE_MIN: 100000,
  WEBRTC_BITRATE_MAX: 1000000,
  WEBRTC_LATENCY_TARGET_MS: 100,

  MEDIA_SERVER_TYPE: "janus",
  MEDIA_SERVER_URL: "https://media.test.local",
  MEDIA_SERVER_API_KEY: "test_media_key",

  VIDEO_EFFECTS_PATH: "/test/effects",
  DEFAULT_VIDEO_EFFECT: "none",
  ENABLE_VIDEO_EFFECTS: false,

  AR_ENGINE: "none",
  VR_ENGINE: "none",
  AR_RESOURCES_PATH: "/test/ar",
  VR_RESOURCES_PATH: "/test/vr",
  ENABLE_AR_CONCERT: false,
  ENABLE_VR_ROOM: false,

  ENABLE_METRICS: false,
  METRICS_INTERVAL_MS: 10000,
  METRICS_EXPORT_URL: "http://localhost:4000/api/metrics",

  LOG_RETENTION_DAYS: 7,
  LOG_REMOTE_URL: "https://logs.test.local",

  BI_TOOL: "metabase",
  BI_HOST: "http://localhost:3002",
  BI_API_KEY: "test_bi_key",

  OLAP_ENGINE: "clickhouse",
  OLAP_HOST: "http://localhost:8124",
  OLAP_USER: "test_olap",
  OLAP_PASSWORD: "test_olap_pass",
  OLAP_DB: "analytics_test",

  VISUALIZATION_ENGINE: "echarts",
  VISUALIZATION_THEME: "light",

  DATASOURCE_HOST: "localhost",
  DATASOURCE_PORT: 3307,
  DATASOURCE_USER: "test_bi",
  DATASOURCE_PASSWORD: "test_bi_pass",
  DATASOURCE_DB: "yyc3_yy_test",

  REPORT_CRON: "0 9 * * *",
  REPORT_NOTIFY_EMAIL: "test@ktv.local",
  REPORT_SHARE_URL: "https://bi.test.local/share",

  ALERT_THRESHOLD_SALES_DROP: 10,
  ALERT_EMAIL: "test@ktv.local",
}
