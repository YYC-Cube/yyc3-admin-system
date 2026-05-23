import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

const requiredKeys = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_API_BASE_URL',
  'YYC3_YY_DB_HOST',
  'YYC3_YY_DB_PORT',
  'YYC3_YY_DB_USER',
  'YYC3_YY_DB_PASSWORD',
  'YYC3_YY_DB_NAME',
  'REDIS_URL',
  'JWT_SECRET',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM',
  'CSRF_SECRET',
  'ENCRYPTION_KEY',
  'WEBRTC_SIGNALING_URL',
  'WEBRTC_TURN_URL',
  'WEBRTC_TURN_USERNAME',
  'WEBRTC_TURN_PASSWORD',
  'MEDIA_SERVER_URL',
  'BI_HOST',
  'OLAP_HOST',
  'DATASOURCE_DB',
  'REPORT_CRON',
  'REPORT_NOTIFY_EMAIL',
  'ALERT_EMAIL',
  'DEPLOYMENT_STAGE',
  'SYSTEM_VERSION',
  'SUBMISSION_TAG'
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
