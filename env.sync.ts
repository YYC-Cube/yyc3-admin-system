/**
 * 环境变量配置 - 开发环境示例
 * 
 * ⚠️ 安全警告:
 * 1. 本文件仅用于开发和测试环境的默认配置
 * 2. 生产环境必须使用真实的环境变量，不要使用这些示例值
 * 3. 所有敏感信息（密码、密钥、API keys）必须通过环境变量配置
 * 4. 不要将真实的生产环境凭据提交到版本控制系统
 * 
 * 配置方式:
 * - 创建 .env.local 文件（已在 .gitignore 中）
 * - 设置系统环境变量
 * - 在部署平台配置环境变量
 */
export const env = {
  // 系统配置
  NODE_ENV: "development",
  DEPLOYMENT_STAGE: "development",
  SYSTEM_VERSION: "1.0.0",
  SUBMISSION_TAG: "ktv-v0-final",
  
  // 功能模块开关
  MODULE_AI_OPS_ENABLED: true,
  MODULE_BIGDATA_ENABLED: true,
  MODULE_IOT_ENABLED: true,
  MODULE_HR_ENABLED: true,
  MODULE_AUDIT_ENABLED: true,
  ENABLE_AUDIT_LOGS: true,
  ENABLE_ALERTS: true,
  
  // 公开配置（可以暴露在客户端）
  NEXT_PUBLIC_APP_NAME: "启智KTV商家后台",
  NEXT_PUBLIC_APP_VERSION: "1.0.0",
  NEXT_PUBLIC_API_BASE_URL: "http://localhost:3000/api",
  NEXT_PUBLIC_ENABLE_DARK_MODE: true,
  NEXT_PUBLIC_ENABLE_PWA: true,
  NEXT_PUBLIC_ENABLE_I18N: true,
  
  // API配置
  API_TIMEOUT: 30000,
  
  // 数据库配置 - ⚠️ 生产环境必须使用环境变量
  YYC3_YY_DB_HOST: "localhost",
  YYC3_YY_DB_PORT: 3306,
  YYC3_YY_DB_USER: "devuser",
  YYC3_YY_DB_PASSWORD: "", // ⚠️ 请通过环境变量设置: process.env.YYC3_YY_DB_PASSWORD
  YYC3_YY_DB_NAME: "yyc3_yy",
  
  // Redis配置
  REDIS_URL: "redis://localhost:6379/0",
  
  // JWT配置 - ⚠️ 生产环境必须使用强随机密钥
  JWT_SECRET: "", // ⚠️ 请通过环境变量设置: process.env.JWT_SECRET (至少32字符)
  JWT_EXPIRES_IN: "24h",
  
  // 微信支付配置 - ⚠️ 生产环境必须使用真实凭据
  WECHAT_PAY_APP_ID: "", // ⚠️ 请通过环境变量设置
  WECHAT_PAY_MCH_ID: "", // ⚠️ 请通过环境变量设置
  WECHAT_PAY_API_KEY: "", // ⚠️ 请通过环境变量设置
  WECHAT_PAY_NOTIFY_URL: "http://your-domain.com/api/payment/wechat-notify",
  
  // 支付宝配置 - ⚠️ 生产环境必须使用真实凭据
  ALIPAY_APP_ID: "", // ⚠️ 请通过环境变量设置
  ALIPAY_PRIVATE_KEY: "", // ⚠️ 请通过环境变量设置
  ALIPAY_PUBLIC_KEY: "", // ⚠️ 请通过环境变量设置
  ALIPAY_NOTIFY_URL: "http://your-domain.com/api/payment/alipay-notify",
  
  // 分析和监控
  ANALYTICS_KEY: "", // ⚠️ 请通过环境变量设置
  SENTRY_DSN: "", // ⚠️ 请通过环境变量设置（可选）
  
  // 文件上传配置
  CACHE_TTL: 3600,
  MAX_FILE_SIZE: 10485760, // 10MB
  ALLOWED_FILE_TYPES: "jpg,png,pdf",
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // 日志配置
  LOG_LEVEL: "info",
  LOG_FORMAT: "json",
  LOG_RETENTION_DAYS: 30,
  LOG_REMOTE_URL: "https://logs.yourdomain.com",
  
  // 邮件配置 - ⚠️ 生产环境必须使用真实凭据
  EMAIL_HOST: "smtp.example.com",
  EMAIL_PORT: 587,
  EMAIL_USER: "admin@0379.email",
  EMAIL_PASSWORD: "", // ⚠️ 请通过环境变量设置
  EMAIL_FROM: "admin@0379.email",
  
  // 安全配置 - ⚠️ 生产环境必须使用强随机密钥
  CSRF_SECRET: "", // ⚠️ 请通过环境变量设置 (至少32字符)
  ENCRYPTION_KEY: "", // ⚠️ 请通过环境变量设置 (必须32字符)
  
  // 开发服务器配置
  DEV_PORT: 3000,
  DEV_HOST: "localhost",
  
  // WebRTC配置 - ⚠️ 生产环境必须使用真实凭据
  WEBRTC_SIGNALING_URL: "wss://yourdomain.com/ws",
  WEBRTC_TURN_URL: "turn:yourdomain.com:3478",
  WEBRTC_TURN_USERNAME: "", // ⚠️ 请通过环境变量设置
  WEBRTC_TURN_PASSWORD: "", // ⚠️ 请通过环境变量设置
  WEBRTC_CODEC: "VP9",
  WEBRTC_BITRATE_MIN: 300000,
  WEBRTC_BITRATE_MAX: 2000000,
  WEBRTC_LATENCY_TARGET_MS: 200,
  
  // 媒体服务器配置 - ⚠️ 生产环境必须使用真实凭据
  MEDIA_SERVER_TYPE: "janus",
  MEDIA_SERVER_URL: "https://media.yourdomain.com",
  MEDIA_SERVER_API_KEY: "", // ⚠️ 请通过环境变量设置
  
  // 视频特效配置
  VIDEO_EFFECTS_PATH: "/assets/effects",
  DEFAULT_VIDEO_EFFECT: "beauty_filter",
  ENABLE_VIDEO_EFFECTS: true,
  
  // AR/VR配置
  AR_ENGINE: "threejs",
  VR_ENGINE: "webxr",
  AR_RESOURCES_PATH: "/assets/ar",
  VR_RESOURCES_PATH: "/assets/vr",
  ENABLE_AR_CONCERT: true,
  ENABLE_VR_ROOM: true,
  
  // 监控配置
  ENABLE_METRICS: true,
  METRICS_INTERVAL_MS: 5000,
  METRICS_EXPORT_URL: "http://localhost:3000/api/metrics",
  
  // BI工具配置 - ⚠️ 生产环境必须使用真实凭据
  BI_TOOL: "metabase",
  BI_HOST: "http://localhost:3001",
  BI_API_KEY: "", // ⚠️ 请通过环境变量设置
  
  // OLAP配置 - ⚠️ 生产环境必须使用真实凭据
  OLAP_ENGINE: "clickhouse",
  OLAP_HOST: "http://localhost:8123",
  OLAP_USER: "olap_user",
  OLAP_PASSWORD: "", // ⚠️ 请通过环境变量设置
  OLAP_DB: "analytics_cube",
  
  // 数据可视化配置
  VISUALIZATION_ENGINE: "echarts",
  VISUALIZATION_THEME: "dark",
  
  // 数据源配置 - ⚠️ 生产环境必须使用真实凭据
  DATASOURCE_HOST: "localhost",
  DATASOURCE_PORT: 3306,
  DATASOURCE_USER: "bi_user",
  DATASOURCE_PASSWORD: "", // ⚠️ 请通过环境变量设置
  DATASOURCE_DB: "yyc3_yy",
  
  // 报表配置
  REPORT_CRON: "0 8 * * *",
  REPORT_NOTIFY_EMAIL: "admin@0379.email",
  REPORT_SHARE_URL: "https://bi.yourdomain.com/share",
  
  // 告警配置
  ALERT_THRESHOLD_SALES_DROP: 20,
  ALERT_EMAIL: "admin@0379.email",
}

/**
 * 安全提示：生产环境配置
 * 
 * 请在生产环境中设置以下环境变量：
 * - YYC3_YY_DB_PASSWORD: 数据库密码
 * - JWT_SECRET: JWT密钥（至少32字符）
 * - WECHAT_PAY_*: 微信支付凭据
 * - ALIPAY_*: 支付宝凭据
 * - EMAIL_PASSWORD: 邮件服务密码
 * - CSRF_SECRET: CSRF保护密钥
 * - ENCRYPTION_KEY: 加密密钥（必须32字符）
 * - MEDIA_SERVER_API_KEY: 媒体服务器API密钥
 * - BI_API_KEY: BI工具API密钥
 * - OLAP_PASSWORD: OLAP数据库密码
 * - DATASOURCE_PASSWORD: 数据源密码
 * - WEBRTC_TURN_USERNAME: TURN服务器用户名
 * - WEBRTC_TURN_PASSWORD: TURN服务器密码
 */

export default env
