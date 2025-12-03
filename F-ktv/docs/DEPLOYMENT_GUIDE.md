# 🚀 生产环境部署指南

本文档提供启智KTV商家后台管理系统的完整生产环境部署指南，包括服务器配置、数据库部署、应用部署、监控告警等全流程。

---

## 📑 目录

- [环境要求](#环境要求)
- [服务器准备](#服务器准备)
- [数据库部署](#数据库部署)
- [Redis部署](#redis部署)
- [应用部署](#应用部署)
- [Nginx配置](#nginx配置)
- [SSL证书](#ssl证书)
- [监控告警](#监控告警)
- [备份恢复](#备份恢复)
- [故障排查](#故障排查)
- [性能优化](#性能优化)
- [安全加固](#安全加固)

---

## 环境要求

### 硬件要求

#### 最低配置（适用于小型店铺）
- CPU: 4核心
- 内存: 8GB
- 存储: 100GB SSD
- 带宽: 10Mbps

#### 推荐配置（适用于中大型店铺）
- CPU: 8核心+
- 内存: 16GB+
- 存储: 500GB SSD
- 带宽: 50Mbps+

#### 企业级配置（适用于连锁店铺）
- CPU: 16核心+
- 内存: 32GB+
- 存储: 1TB SSD (RAID 10)
- 带宽: 100Mbps+

### 软件要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | 18.x LTS | 运行环境 |
| MySQL | 8.0+ | 数据库 |
| Redis | 7.0+ | 缓存 |
| Nginx | 1.24+ | 反向代理 |
| PM2 | 5.x | 进程管理 |
| Git | 2.x | 版本控制 |

### 操作系统

推荐使用：
- Ubuntu 22.04 LTS
- CentOS Stream 9
- Debian 12

---

## 服务器准备

### 1. 创建部署用户

\`\`\`bash
# 创建部署用户
sudo useradd -m -s /bin/bash deploy
sudo passwd deploy

# 添加sudo权限
sudo usermod -aG sudo deploy

# 切换到部署用户
su - deploy
\`\`\`

### 2. 安装基础软件

#### Ubuntu/Debian

\`\`\`bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y git curl wget vim net-tools

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装PM2
sudo npm install -g pm2

# 验证安装
node -v
npm -v
pm2 -v
\`\`\`

#### CentOS

\`\`\`bash
# 更新系统
sudo dnf update -y

# 安装基础工具
sudo dnf install -y git curl wget vim net-tools

# 安装Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# 安装PM2
sudo npm install -g pm2

# 验证安装
node -v
npm -v
pm2 -v
\`\`\`

### 3. 配置防火墙

\`\`\`bash
# 安装UFW (Ubuntu)
sudo apt install -y ufw

# 允许SSH
sudo ufw allow 22/tcp

# 允许HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许MySQL (仅内网)
sudo ufw allow from 10.0.0.0/8 to any port 3306

# 允许Redis (仅内网)
sudo ufw allow from 10.0.0.0/8 to any port 6379

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
\`\`\`

### 4. 时间同步

\`\`\`bash
# 安装NTP
sudo apt install -y ntp

# 配置时区
sudo timedatectl set-timezone Asia/Shanghai

# 启动NTP服务
sudo systemctl start ntp
sudo systemctl enable ntp

# 验证时间
date
\`\`\`

---

## 数据库部署

### 1. 安装MySQL

#### Ubuntu/Debian

\`\`\`bash
# 安装MySQL Server
sudo apt install -y mysql-server

# 启动MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
\`\`\`

#### CentOS

\`\`\`bash
# 添加MySQL仓库
sudo dnf install -y mysql-server

# 启动MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 获取临时密码
sudo grep 'temporary password' /var/log/mysqld.log

# 安全配置
sudo mysql_secure_installation
\`\`\`

### 2. 配置MySQL

#### 创建配置文件

\`\`\`bash
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
\`\`\`

#### 优化配置

\`\`\`ini
[mysqld]
# 基础配置
port = 3306
bind-address = 0.0.0.0
max_connections = 500
max_connect_errors = 10000

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# InnoDB配置
innodb_buffer_pool_size = 4G          # 设置为物理内存的70-80%
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# 查询缓存
query_cache_type = 0
query_cache_size = 0

# 二进制日志
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_format = ROW
expire_logs_days = 7
max_binlog_size = 100M

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 2

# 错误日志
log_error = /var/log/mysql/error.log

# 性能优化
tmp_table_size = 256M
max_heap_table_size = 256M
join_buffer_size = 256K
sort_buffer_size = 256K
read_buffer_size = 256K
read_rnd_buffer_size = 512K
\`\`\`

#### 重启MySQL

\`\`\`bash
sudo systemctl restart mysql
\`\`\`

### 3. 创建数据库和用户

\`\`\`bash
# 登录MySQL
sudo mysql -u root -p
\`\`\`

\`\`\`sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS `yyc3_yy` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `yyc3_hr` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `yyc3_audit` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 创建用户 (使用强密码)
CREATE USER 'ktv_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';
CREATE USER 'hr_admin'@'localhost' IDENTIFIED BY 'YOUR_HR_PASSWORD_HERE';
CREATE USER 'audit_user'@'localhost' IDENTIFIED BY 'YOUR_AUDIT_PASSWORD_HERE';

-- 授权
GRANT ALL PRIVILEGES ON yyc3_yy.* TO 'ktv_user'@'localhost';
GRANT ALL PRIVILEGES ON yyc3_hr.* TO 'hr_admin'@'localhost';
GRANT ALL PRIVILEGES ON yyc3_audit.* TO 'audit_user'@'localhost';

FLUSH PRIVILEGES;

-- 退出
EXIT;
\`\`\`

### 4. 导入数据库结构

\`\`\`bash
# 下载项目
cd /home/deploy
git clone https://github.com/your-org/ktv-admin.git
cd ktv-admin

# 导入表结构
mysql -u ktv_user -p yyc3_yy < scripts/sql/yyc3_yy_schema.sql
mysql -u hr_admin -p yyc3_hr < scripts/sql/yyc3_hr_schema.sql
mysql -u audit_user -p yyc3_audit < scripts/sql/yyc3_audit_schema.sql

# 导入初始数据
mysql -u ktv_user -p yyc3_yy < scripts/sql/yyc3_yy_init_data.sql
\`\`\`

### 5. 数据库备份脚本

\`\`\`bash
# 创建备份目录
sudo mkdir -p /data/backups/mysql
sudo chown deploy:deploy /data/backups/mysql

# 创建备份脚本
cat > /home/deploy/backup_mysql.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/data/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份 yyc3_yy
mysqldump -u ktv_user -p'YOUR_PASSWORD' \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  yyc3_yy | gzip > ${BACKUP_DIR}/yyc3_yy_${DATE}.sql.gz

# 备份 yyc3_hr
mysqldump -u hr_admin -p'YOUR_HR_PASSWORD' \
  --single-transaction \
  yyc3_hr | gzip > ${BACKUP_DIR}/yyc3_hr_${DATE}.sql.gz

# 备份 yyc3_audit
mysqldump -u audit_user -p'YOUR_AUDIT_PASSWORD' \
  --single-transaction \
  yyc3_audit | gzip > ${BACKUP_DIR}/yyc3_audit_${DATE}.sql.gz

# 删除7天前的备份
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${DATE}"
EOF

chmod +x /home/deploy/backup_mysql.sh

# 添加到crontab (每天凌晨2点执行)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/deploy/backup_mysql.sh >> /var/log/mysql_backup.log 2>&1") | crontab -
\`\`\`

---

## Redis部署

### 1. 安装Redis

#### Ubuntu/Debian

\`\`\`bash
sudo apt install -y redis-server
\`\`\`

#### CentOS

\`\`\`bash
sudo dnf install -y redis
\`\`\`

### 2. 配置Redis

\`\`\`bash
sudo vim /etc/redis/redis.conf
\`\`\`

\`\`\`conf
# 绑定地址 (生产环境只绑定内网IP)
bind 127.0.0.1 10.0.0.100

# 端口
port 6379

# 守护进程模式
daemonize yes

# 日志文件
logfile /var/log/redis/redis-server.log

# 数据目录
dir /var/lib/redis

# 最大内存
maxmemory 2gb

# 淘汰策略
maxmemory-policy allkeys-lru

# 持久化配置
save 900 1
save 300 10
save 60 10000

# AOF持久化
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec

# 密码 (使用强密码)
requirepass YOUR_REDIS_PASSWORD

# 性能优化
tcp-backlog 511
timeout 0
tcp-keepalive 300
\`\`\`

### 3. 启动Redis

\`\`\`bash
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 验证
redis-cli -a YOUR_REDIS_PASSWORD ping
# 应返回: PONG
\`\`\`

---

## 应用部署

### 1. 克隆项目

\`\`\`bash
cd /home/deploy
git clone https://github.com/your-org/ktv-admin.git
cd ktv-admin
\`\`\`

### 2. 安装依赖

\`\`\`bash
# 安装Node.js依赖
npm install --production

# 或使用yarn
npm install -g yarn
yarn install --production
\`\`\`

### 3. 配置环境变量

\`\`\`bash
# 创建生产环境配置
cat > .env.production << 'EOF'
# 环境模式
NODE_ENV=production
DEPLOYMENT_STAGE=production

# 应用配置
NEXT_PUBLIC_APP_NAME=启智KTV商家后台
NEXT_PUBLIC_APP_VERSION=1.0.0

# API配置
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
API_TIMEOUT=30000

# yyc3_yy 数据库连接
YYC3_YY_DB_HOST=localhost
YYC3_YY_DB_PORT=3306
YYC3_YY_DB_USER=ktv_user
YYC3_YY_DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
YYC3_YY_DB_NAME=yyc3_yy

# yyc3_hr 数据库连接
HR_DB_HOST=localhost
HR_DB_NAME=yyc3_hr
HR_DB_USER=hr_admin
HR_DB_PASSWORD=YOUR_HR_PASSWORD_HERE

# yyc3_audit 数据库连接
AUDIT_DB_NAME=yyc3_audit
AUDIT_DB_USER=audit_user
AUDIT_DB_PASSWORD=YOUR_AUDIT_PASSWORD_HERE

# Redis配置
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@localhost:6379/0

# JWT配置 (生成强密钥)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h

# 微信支付配置
WECHAT_PAY_APP_ID=your_wechat_pay_app_id
WECHAT_PAY_MCH_ID=your_wechat_pay_mch_id
WECHAT_PAY_API_KEY=your_wechat_pay_api_key
WECHAT_PAY_NOTIFY_URL=https://yourdomain.com/api/payment/wechat-notify

# 支付宝配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
ALIPAY_PUBLIC_KEY=your_alipay_public_key
ALIPAY_NOTIFY_URL=https://yourdomain.com/api/payment/alipay-notify

# 安全配置
CSRF_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=json

# 监控配置
ENABLE_METRICS=true
METRICS_INTERVAL_MS=5000

# AI运营系统
MODULE_AI_OPS_ENABLED=true
MODULE_BIGDATA_ENABLED=true
MODULE_IOT_ENABLED=true
MODULE_HR_ENABLED=true
MODULE_AUDIT_ENABLED=true

# 审计
ENABLE_AUDIT_LOGS=true
ENABLE_ALERTS=true
AUDIT_LOG_PATH=/data/logs/audit

# BI平台
BI_TOOL=metabase
BI_HOST=http://bi.yourdomain.com
BI_API_KEY=your_bi_api_key

# OLAP引擎
OLAP_ENGINE=clickhouse
OLAP_HOST=http://localhost:8123
OLAP_USER=olap_user
OLAP_PASSWORD=olap_password
OLAP_DB=analytics_cube
EOF

# 保护配置文件
chmod 600 .env.production
\`\`\`

### 4. 构建项目

\`\`\`bash
# 构建Next.js应用
npm run build

# 验证构建
ls -la .next
\`\`\`

### 5. 配置PM2

\`\`\`bash
# 创建PM2配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ktv-admin',
      script: 'npm',
      args: 'start',
      cwd: '/home/deploy/ktv-admin',
      instances: 4,              // CPU核心数
      exec_mode: 'cluster',      // 集群模式
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/data/logs/ktv-admin/error.log',
      out_file: '/data/logs/ktv-admin/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
EOF

# 创建日志目录
sudo mkdir -p /data/logs/ktv-admin
sudo chown -R deploy:deploy /data/logs/ktv-admin
\`\`\`

### 6. 启动应用

\`\`\`bash
# 启动应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy

# 查看状态
pm2 status
pm2 logs ktv-admin --lines 50

# 监控
pm2 monit
\`\`\`

---

## Nginx配置

### 1. 安装Nginx

\`\`\`bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS
sudo dnf install -y nginx

# 启动
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

### 2. 配置Nginx

\`\`\`bash
sudo vim /etc/nginx/sites-available/ktv-admin
\`\`\`

\`\`\`nginx
# HTTP -> HTTPS重定向
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # ACME验证 (Let's Encrypt)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL证书
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 日志
    access_log /var/log/nginx/ktv-admin-access.log;
    error_log /var/log/nginx/ktv-admin-error.log;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js应用代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API路由
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 限流
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;
    }

    # WebSocket支持
    location /ws/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}

# 限流配置
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
\`\`\`

### 3. 启用配置

\`\`\`bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/ktv-admin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
\`\`\`

---

## SSL证书

### 1. 安装Certbot

\`\`\`bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS
sudo dnf install -y certbot python3-certbot-nginx
\`\`\`

### 2. 申请证书

\`\`\`bash
# 停止Nginx (首次申请)
sudo systemctl stop nginx

# 申请证书
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 启动Nginx
sudo systemctl start nginx

# 自动续期 (添加到crontab)
sudo crontab -e
\`\`\`

```cron
# 每天凌晨3点检查证书续期
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
