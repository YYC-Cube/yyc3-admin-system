export interface EnvConfig {
  NODE_ENV: string
  DEPLOYMENT_STAGE: string
  SYSTEM_VERSION: string
  SUBMISSION_TAG: string

  MODULE_AI_OPS_ENABLED: boolean
  MODULE_BIGDATA_ENABLED: boolean
  MODULE_IOT_ENABLED: boolean
  MODULE_HR_ENABLED: boolean
  MODULE_AUDIT_ENABLED: boolean
  ENABLE_AUDIT_LOGS: boolean
  ENABLE_ALERTS: boolean

  NEXT_PUBLIC_APP_NAME: string
  NEXT_PUBLIC_APP_VERSION: string
  NEXT_PUBLIC_API_BASE_URL: string
  API_TIMEOUT: number

  YYC3_YY_DB_HOST: string
  YYC3_YY_DB_PORT: number
  YYC3_YY_DB_USER: string
  YYC3_YY_DB_PASSWORD: string
  YYC3_YY_DB_NAME: string

  REDIS_URL: string

  JWT_SECRET: string
  JWT_EXPIRES_IN: string

  WECHAT_PAY_APP_ID: string
  WECHAT_PAY_MCH_ID: string
  WECHAT_PAY_API_KEY: string
  WECHAT_PAY_NOTIFY_URL: string

  ALIPAY_APP_ID: string
  ALIPAY_PRIVATE_KEY: string
  ALIPAY_PUBLIC_KEY: string
  ALIPAY_NOTIFY_URL: string

  ANALYTICS_KEY: string
  SENTRY_DSN: string

  NEXT_PUBLIC_ENABLE_DARK_MODE: boolean
  NEXT_PUBLIC_ENABLE_PWA: boolean
  NEXT_PUBLIC_ENABLE_I18N: boolean

  CACHE_TTL: number
  MAX_FILE_SIZE: number
  ALLOWED_FILE_TYPES: string

  DEFAULT_PAGE_SIZE: number
  MAX_PAGE_SIZE: number

  LOG_LEVEL: string
  LOG_FORMAT: string

  EMAIL_HOST: string
  EMAIL_PORT: number
  EMAIL_USER: string
  EMAIL_PASSWORD: string
  EMAIL_FROM: string

  CSRF_SECRET: string
  ENCRYPTION_KEY: string

  DEV_PORT: number
  DEV_HOST: string

  WEBRTC_SIGNALING_URL: string
  WEBRTC_TURN_URL: string
  WEBRTC_TURN_USERNAME: string
  WEBRTC_TURN_PASSWORD: string
  WEBRTC_CODEC: string
  WEBRTC_BITRATE_MIN: number
  WEBRTC_BITRATE_MAX: number
  WEBRTC_LATENCY_TARGET_MS: number

  MEDIA_SERVER_TYPE: string
  MEDIA_SERVER_URL: string
  MEDIA_SERVER_API_KEY: string

  VIDEO_EFFECTS_PATH: string
  DEFAULT_VIDEO_EFFECT: string
  ENABLE_VIDEO_EFFECTS: boolean

  AR_ENGINE: string
  VR_ENGINE: string
  AR_RESOURCES_PATH: string
  VR_RESOURCES_PATH: string
  ENABLE_AR_CONCERT: boolean
  ENABLE_VR_ROOM: boolean

  ENABLE_METRICS: boolean
  METRICS_INTERVAL_MS: number
  METRICS_EXPORT_URL: string

  LOG_RETENTION_DAYS: number
  LOG_REMOTE_URL: string

  BI_TOOL: string
  BI_HOST: string
  BI_API_KEY: string

  OLAP_ENGINE: string
  OLAP_HOST: string
  OLAP_USER: string
  OLAP_PASSWORD: string
  OLAP_DB: string

  VISUALIZATION_ENGINE: string
  VISUALIZATION_THEME: string

  DATASOURCE_HOST: string
  DATASOURCE_PORT: number
  DATASOURCE_USER: string
  DATASOURCE_PASSWORD: string
  DATASOURCE_DB: string

  REPORT_CRON: string
  REPORT_NOTIFY_EMAIL: string
  REPORT_SHARE_URL: string

  ALERT_THRESHOLD_SALES_DROP: number
  ALERT_EMAIL: string

  HR_API_KEY: string
  HR_DB_HOST: string
  HR_DB_NAME: string
  HR_DB_USER: string
  HR_DB_PASSWORD: string

  AUDIT_LOG_PATH: string
  AUDIT_DB_NAME: string
  AUDIT_DB_USER: string
  AUDIT_DB_PASSWORD: string
}
