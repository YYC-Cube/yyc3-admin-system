import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

const requiredKeys = [
  // 环境与部署标记
  'NODE_ENV',
  'DEPLOYMENT_STAGE',
  'SYSTEM_VERSION',
  'SUBMISSION_TAG',

  // 应用与API
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_API_BASE_URL',
  'API_TIMEOUT',

  // 主数据库
  'YYC3_YY_DB_HOST',
  'YYC3_YY_DB_PORT',
  'YYC3_YY_DB_USER',
  'YYC3_YY_DB_PASSWORD',
  'YYC3_YY_DB_NAME',

  // Redis
  'REDIS_URL',

  // JWT
  'JWT_SECRET',

  // 邮件服务
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM',

  // 安全
  'CSRF_SECRET',
  'ENCRYPTION_KEY',

  // WebRTC
  'WEBRTC_SIGNALING_URL',
  'WEBRTC_TURN_URL',
  'WEBRTC_TURN_USERNAME',
  'WEBRTC_TURN_PASSWORD',

  // 媒体服务
  'MEDIA_SERVER_URL',

  // BI与OLAP
  'BI_HOST',
  'BI_API_KEY',
  'OLAP_HOST',
  'OLAP_USER',
  'OLAP_PASSWORD',
  'OLAP_DB',

  // 数据源
  'DATASOURCE_DB',

  // 报告与告警
  'REPORT_CRON',
  'REPORT_NOTIFY_EMAIL',
  'ALERT_EMAIL'
]

const envPath = path.resolve(__dirname, '../.env')
const envContent = dotenv.parse(fs.readFileSync(envPath))

const missing = requiredKeys.filter(key => !envContent[key])
if (missing.length > 0) {
  console.error('❌ 缺失以下关键环境变量：')
  missing.forEach(key => console.error(`- ${key}`))
  process.exit(1)
} else {
  console.log('✅ 所有关键环境变量已配置完毕')
}
