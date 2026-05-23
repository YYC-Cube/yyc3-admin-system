/**
 * @file 环境配置类型定义
 * @description 定义环境变量配置的TypeScript接口
 * @module configs/env
 * @author YYC
 */

/**
 * 环境配置接口
 * @interface EnvConfig
 */
export interface EnvConfig {
  // 基础配置
  NODE_ENV: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
  NEXT_PUBLIC_API_BASE_URL: string;
  API_TIMEOUT: number;
  
  // 数据库配置
  YYC3_YY_DB_HOST: string;
  YYC3_YY_DB_PORT: number;
  YYC3_YY_DB_USER: string;
  YYC3_YY_DB_PASSWORD: string;
  YYC3_YY_DB_NAME: string;
  
  // Redis配置
  REDIS_URL: string;
  
  // JWT配置
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // 微信支付配置
  WECHAT_PAY_APP_ID: string;
  WECHAT_PAY_MCH_ID: string;
  WECHAT_PAY_API_KEY: string;
  WECHAT_PAY_NOTIFY_URL: string;
  
  // 支付宝配置
  ALIPAY_APP_ID: string;
  ALIPAY_PRIVATE_KEY: string;
  ALIPAY_PUBLIC_KEY: string;
  ALIPAY_NOTIFY_URL: string;
  
  // 分析和监控
  ANALYTICS_KEY: string;
  SENTRY_DSN: string;
  
  // 功能开关
  NEXT_PUBLIC_ENABLE_DARK_MODE: boolean;
  NEXT_PUBLIC_ENABLE_PWA: boolean;
  NEXT_PUBLIC_ENABLE_I18N: boolean;
  
  // 缓存配置
  CACHE_TTL: number;
  
  // 文件上传配置
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string;
  
  // 分页配置
  DEFAULT_PAGE_SIZE: number;
  MAX_PAGE_SIZE: number;
  
  // 日志配置
  LOG_LEVEL: string;
  LOG_FORMAT: string;
  
  // 邮件配置
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;
  
  // 安全配置
  CSRF_SECRET: string;
  ENCRYPTION_KEY: string;
  
  // 开发配置
  DEV_PORT: number;
  DEV_HOST: string;
  
  // WebRTC配置
  WEBRTC_SIGNALING_URL: string;
  WEBRTC_TURN_URL: string;
  WEBRTC_TURN_USERNAME: string;
  WEBRTC_TURN_PASSWORD: string;
  WEBRTC_CODEC: string;
  WEBRTC_BITRATE_MIN: number;
  WEBRTC_BITRATE_MAX: number;
  WEBRTC_LATENCY_TARGET_MS: number;
  
  // 媒体服务器配置
  MEDIA_SERVER_TYPE: string;
  MEDIA_SERVER_URL: string;
  MEDIA_SERVER_API_KEY: string;
  
  // 视频效果配置
  VIDEO_EFFECTS_PATH: string;
  DEFAULT_VIDEO_EFFECT: string;
  ENABLE_VIDEO_EFFECTS: boolean;
  
  // AR/VR配置
  AR_ENGINE: string;
  VR_ENGINE: string;
  AR_RESOURCES_PATH: string;
  VR_RESOURCES_PATH: string;
  ENABLE_AR_CONCERT: boolean;
  ENABLE_VR_ROOM: boolean;
  
  // 监控指标配置
  ENABLE_METRICS: boolean;
  METRICS_INTERVAL_MS: number;
  METRICS_EXPORT_URL: string;
  
  // 日志保留配置
  LOG_RETENTION_DAYS: number;
  LOG_REMOTE_URL: string;
  
  // 商业智能配置
  BI_TOOL: string;
  BI_HOST: string;
  BI_API_KEY: string;
  
  // OLAP引擎配置
  OLAP_ENGINE: string;
  OLAP_HOST: string;
  OLAP_USER: string;
  OLAP_PASSWORD: string;
  OLAP_DB: string;
  
  // 可视化配置
  VISUALIZATION_ENGINE: string;
  VISUALIZATION_THEME: string;
  
  // 数据源配置
  DATASOURCE_HOST: string;
  DATASOURCE_PORT: number;
  DATASOURCE_USER: string;
  DATASOURCE_PASSWORD: string;
  DATASOURCE_DB: string;
  
  // 报告配置
  REPORT_CRON: string;
  REPORT_NOTIFY_EMAIL: string;
  REPORT_SHARE_URL: string;
  
  // 告警配置
  ALERT_THRESHOLD_SALES_DROP: number;
  ALERT_EMAIL: string;
}