export const deployConfig = {
  appName: "启智KTV商家后台",
  version: "1.0.0",
  environment: "production",
  server: {
    host: "ktv.yourdomain.com",
    port: 3000,
    protocol: "https",
  },
  database: {
    host: "db.ktv.yourdomain.com",
    port: 3306,
    user: "prod_user",
    name: "yyc3_yy",
  },
  redis: {
    url: "redis://redis.ktv.yourdomain.com:6379/0",
  },
  metrics: {
    enabled: true,
    exportUrl: "https://api.ktv.yourdomain.com/api/metrics",
    intervalMs: 5000,
  },
  logging: {
    level: "info",
    format: "json",
    retentionDays: 30,
    remoteUrl: "https://logs.ktv.yourdomain.com",
  },
  bi: {
    host: "https://bi.ktv.yourdomain.com",
    tool: "metabase",
  },
  olap: {
    engine: "clickhouse",
    host: "https://olap.ktv.yourdomain.com",
    db: "analytics_prod",
  },
  report: {
    cron: "0 8 * * *",
    notifyEmail: "ops@ktv.yourdomain.com",
    shareUrl: "https://bi.ktv.yourdomain.com/share",
  },
  alert: {
    thresholdSalesDrop: 20,
    email: "alerts@ktv.yourdomain.com",
  },
}
