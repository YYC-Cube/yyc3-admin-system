# 启智KTV商家后台管理系统 - 部署指南

## 目录
- [系统要求](#系统要求)
- [环境准备](#环境准备)
- [部署步骤](#部署步骤)
- [生产环境配置](#生产环境配置)
- [监控与维护](#监控与维护)
- [故障排查](#故障排查)

## 系统要求

### 硬件要求
- **CPU**: 4核心以上
- **内存**: 8GB以上
- **存储**: 50GB以上SSD
- **网络**: 100Mbps以上带宽

### 软件要求
- **操作系统**: Ubuntu 22.04 LTS / CentOS 8+
- **Node.js**: 20.x LTS
- **pnpm**: 10.x
- **Nginx**: 1.24+
- **MySQL**: 8.0+
- **Redis**: 7.0+

## 环境准备

### 1. 安装Node.js和pnpm

\`\`\`bash
# 安装Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装pnpm
npm install -g pnpm@10

# 验证安装
node --version
pnpm --version
\`\`\`

### 2. 安装Nginx

\`\`\`bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

### 3. 安装MySQL

\`\`\`bash
# 安装MySQL 8.0
sudo apt-get install -y mysql-server

# 安全配置
sudo mysql_secure_installation

# 创建数据库
mysql -u root -p
CREATE DATABASE ktv_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ktv_admin'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ktv_admin.* TO 'ktv_admin'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### 4. 安装Redis

\`\`\`bash
# 安装Redis
sudo apt-get install -y redis-server

# 启动Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
\`\`\`

## 部署步骤

### 1. 克隆代码

\`\`\`bash
# 克隆仓库
git clone https://github.com/YYC-Cube/yyc3-system-framework.git
cd yyc3-system-framework

# 切换到生产分支
git checkout main
\`\`\`

### 2. 安装依赖

\`\`\`bash
# 安装项目依赖
pnpm install --frozen-lockfile
\`\`\`

### 3. 配置环境变量

\`\`\`bash
# 复制环境变量模板
cp .env.example .env.production

# 编辑环境变量
nano .env.production
\`\`\`

**必需的环境变量**：

\`\`\`env
# 应用配置
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.ktv-admin.example.com

# 数据库配置
YYC3_YY_DB_HOST=localhost
YYC3_YY_DB_PORT=3306
YYC3_YY_DB_USER=ktv_admin
YYC3_YY_DB_PASSWORD=your_password
YYC3_YY_DB_NAME=ktv_admin

# Redis配置
REDIS_URL=redis://localhost:6379

# JWT密钥
JWT_SECRET=your_jwt_secret_key_here

# 邮件配置
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@example.com
EMAIL_PASSWORD=your_email_password

# 区块链配置（可选）
BLOCKCHAIN_PROVIDER_URL=https://polygon-mumbai.g.alchemy.com/v2/your_key
BLOCKCHAIN_PRIVATE_KEY=your_private_key
\`\`\`

### 4. 构建应用

\`\`\`bash
# 构建生产版本
pnpm run build

# 验证构建
ls -la .next/
\`\`\`

### 5. 配置Nginx

\`\`\`bash
# 复制Nginx配置
sudo cp nginx.conf /etc/nginx/sites-available/ktv-admin
sudo ln -s /etc/nginx/sites-available/ktv-admin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
\`\`\`

### 6. 配置SSL证书

\`\`\`bash
# 使用Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d ktv-admin.example.com

# 自动续期
sudo certbot renew --dry-run
\`\`\`

### 7. 启动应用

#### 使用PM2（推荐）

\`\`\`bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "ktv-admin" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs ktv-admin
\`\`\`

#### 使用systemd

\`\`\`bash
# 创建systemd服务
sudo nano /etc/systemd/system/ktv-admin.service
\`\`\`

\`\`\`ini
[Unit]
Description=KTV Admin System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ktv-admin
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
# 启动服务
sudo systemctl daemon-reload
sudo systemctl start ktv-admin
sudo systemctl enable ktv-admin

# 查看状态
sudo systemctl status ktv-admin
\`\`\`

## 生产环境配置

### 1. 性能优化

\`\`\`bash
# 增加文件描述符限制
sudo nano /etc/security/limits.conf
\`\`\`

\`\`\`
* soft nofile 65536
* hard nofile 65536
\`\`\`

### 2. 日志管理

\`\`\`bash
# 配置日志轮转
sudo nano /etc/logrotate.d/ktv-admin
\`\`\`

\`\`\`
/var/log/nginx/ktv-admin-*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
\`\`\`

### 3. 数据库备份

\`\`\`bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-db.sh
\`\`\`

\`\`\`bash
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u ktv_admin -p'your_password' ktv_admin | gzip > $BACKUP_DIR/ktv_admin_$DATE.sql.gz

# 保留最近7天的备份
find $BACKUP_DIR -name "ktv_admin_*.sql.gz" -mtime +7 -delete
\`\`\`

\`\`\`bash
# 设置定时任务
sudo chmod +x /usr/local/bin/backup-db.sh
sudo crontab -e
\`\`\`

\`\`\`
# 每天凌晨2点备份数据库
0 2 * * * /usr/local/bin/backup-db.sh
\`\`\`

## 监控与维护

### 1. 应用监控

\`\`\`bash
# 使用PM2监控
pm2 monit

# 查看日志
pm2 logs ktv-admin --lines 100
\`\`\`

### 2. 系统监控

\`\`\`bash
# 安装监控工具
sudo apt-get install -y htop iotop nethogs

# 查看系统资源
htop
\`\`\`

### 3. 健康检查

\`\`\`bash
# 检查应用状态
curl https://ktv-admin.example.com/health

# 检查数据库连接
mysql -u ktv_admin -p -e "SELECT 1"

# 检查Redis连接
redis-cli ping
\`\`\`

## 故障排查

### 常见问题

#### 1. 应用无法启动

\`\`\`bash
# 查看日志
pm2 logs ktv-admin --err

# 检查端口占用
sudo netstat -tulpn | grep :3000

# 检查环境变量
pm2 env ktv-admin
\`\`\`

#### 2. 数据库连接失败

\`\`\`bash
# 测试数据库连接
mysql -u ktv_admin -p -h localhost

# 检查MySQL状态
sudo systemctl status mysql

# 查看MySQL日志
sudo tail -f /var/log/mysql/error.log
\`\`\`

#### 3. Nginx 502错误

\`\`\`bash
# 检查Nginx配置
sudo nginx -t

# 查看Nginx日志
sudo tail -f /var/log/nginx/ktv-admin-error.log

# 检查上游服务器
curl http://localhost:3000/health
\`\`\`

#### 4. 内存不足

\`\`\`bash
# 查看内存使用
free -h

# 清理缓存
sudo sync && sudo sysctl -w vm.drop_caches=3

# 重启应用
pm2 restart ktv-admin
\`\`\`

## 更新部署

\`\`\`bash
# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install --frozen-lockfile

# 构建应用
pnpm run build

# 重启应用
pm2 restart ktv-admin

# 验证部署
curl https://ktv-admin.example.com/health
\`\`\`

## 回滚部署

\`\`\`bash
# 查看提交历史
git log --oneline

# 回滚到指定版本
git checkout <commit-hash>

# 重新构建和部署
pnpm install --frozen-lockfile
pnpm run build
pm2 restart ktv-admin
\`\`\`

## 安全建议

1. **定期更新系统和依赖**
2. **使用强密码和密钥**
3. **启用防火墙**
4. **配置fail2ban防止暴力破解**
5. **定期备份数据**
6. **监控异常访问**
7. **使用HTTPS**
8. **限制API访问频率**

## 联系支持

如有问题，请联系技术支持：
- 邮箱：support@example.com
- 电话：400-xxx-xxxx
