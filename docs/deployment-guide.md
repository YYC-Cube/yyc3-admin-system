/\*\*

- @file 部署操作流程文档
- @description Easy Table Converter 项目的部署步骤、环境配置和运维指南
- @project Easy Table Converter
- @author YYC
- @version 1.0.0
- @created 2025-01-01
- @updated 2025-01-01
  \*/

# 🚀 Easy Table Converter 部署操作流程

## 1. 环境要求

### 1.1 系统要求

- **操作系统**：Ubuntu 20.04+/Debian 10+/CentOS 8+
- **CPU**：至少 2 核
- **内存**：至少 4GB RAM
- **存储**：至少 20GB 磁盘空间
- **网络**：支持 HTTP/HTTPS 访问

### 1.2 软件依赖

- **Node.js**：v18.x LTS 或更高版本
- **pnpm**：v8.x 或更高版本
- **外部转换工具**：
  - LibreOffice 7.0+（文档转换）
  - Inkscape 1.0+（SVG 处理）
  - pdf2svg（PDF 转 SVG）
  - ImageMagick（图像处理）

### 1.3 可选依赖

- **Redis**：用于缓存和队列管理
- **Nginx**：作为反向代理
- **Docker**：容器化部署
- **PM2**：进程管理

## 2. 部署前准备

### 2.1 安装系统依赖

```bash
# Ubuntu/Debian 系统
apt-get update
apt-get install -y libreoffice inkscape pdf2svg imagemagick

# CentOS 系统
dnf install -y libreoffice inkscape ImageMagick
# 安装 pdf2svg
dnf install -y pdf2svg
```

### 2.2 安装 Node.js 和 pnpm

```bash
# 使用 NVM 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# 安装 pnpm
npm install -g pnpm
```

## 3. 代码部署

### 3.1 获取代码

```bash
git clone https://github.com/your-org/easy-table-converter.git
cd easy-table-converter
```

### 3.2 安装项目依赖

```bash
pnpm install
```

### 3.3 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置以下环境变量：

```dotenv
# 基础配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production

# 文件上传配置
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FORMATS=pdf,doc,docx,xls,xlsx,csv,svg,png,jpg,jpeg

# 外部工具配置
LIBREOFFICE_PATH=/usr/bin/soffice
INKSCAPE_PATH=/usr/bin/inkscape
PDF2SVG_PATH=/usr/bin/pdf2svg
IMAGEMAGICK_PATH=/usr/bin/convert

# Redis 配置（可选）
REDIS_URL=redis://localhost:6379

# 性能配置
CONVERSION_TIMEOUT=300000  # 5分钟
MAX_CONCURRENT_CONVERSIONS=5
```

### 3.4 构建项目

```bash
pnpm build
```

## 4. 服务启动

### 4.1 使用 PM2 启动（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm start

# 设置开机自启
pm install -g pm2
pm install -g pm2-logrotate
pm install -g pm2-papertrail
pm install -g pm2-bunyan
npm install -g pm2-influxdb

# 配置 PM2
echo "module.exports = { apps : [{\n  name: 'easy-table-converter',\n  script: './node_modules/.bin/next',\n  args: 'start',\n  instances: 'max',\n  exec_mode: 'cluster',\n  env: {\n    NODE_ENV: 'production'\n  },\n  log_date_format: 'YYYY-MM-DD HH:mm Z',\n  max_memory_restart: '1G'\n}]}" > ecosystem.config.js

# 启动并设置自启
pm start
pm install -g pm2
pm install -g pm2-logrotate
npm install -g pm2-papertrail
npm install -g pm2-bunyan
npm install -g pm2-influxdb

# 使用 ecosystem 文件启动
pm start

# 保存 PM2 进程列表
pm start

# 设置开机自启
npm start
```

### 4.2 使用 Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

# 安装系统依赖
RUN apk update && apk add --no-cache libreoffice inkscape imagemagick

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目代码
COPY . .

# 构建项目
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start"]
```

创建 `docker-compose.yml`：

```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    volumes:
      - ./uploads:/app/uploads
    restart: always

  redis:
    image: redis:alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    restart: always

volumes:
  redis-data:
```

启动 Docker 容器：

```bash
docker-compose up -d
```

### 4.3 配置 Nginx 反向代理

```bash
# 安装 Nginx
apt-get install -y nginx

# 创建配置文件
cat > /etc/nginx/sites-available/easy-table-converter << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
EOF

# 启用配置
ln -s /etc/nginx/sites-available/easy-table-converter /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

## 5. 部署后检查

### 5.1 服务健康检查

```bash
# 检查服务是否运行
curl -I http://localhost:3000

# 检查 API 健康状态
curl -X GET http://localhost:3000/api/health
```

### 5.2 外部工具检查

```bash
# 检查 LibreOffice 是否安装成功
soffice --version

# 检查 Inkscape 是否安装成功
inkscape --version

# 检查 pdf2svg 是否安装成功
pdf2svg --version

# 检查 ImageMagick 是否安装成功
convert --version
```

## 6. 监控与维护

### 6.1 日志管理

```bash
# 查看应用日志（PM2）
pm logs

# 实时监控日志
npm logs --lines 100 --raw

# 配置日志轮转
pm install -g pm2-logrotate
pm start
```

### 6.2 性能监控

- **PM2 监控面板**：

  ```bash
  npm install -g pm2-dashboard
  npm start
  ```

- **系统资源监控**：

  ```bash
  # 安装 htop
  apt-get install -y htop

  # 运行监控
  htop
  ```

### 6.3 常见问题排查

| 问题         | 可能原因                 | 解决方案                               |
| ------------ | ------------------------ | -------------------------------------- |
| 转换失败     | 外部工具未安装或路径错误 | 检查工具安装状态和环境变量配置         |
| 内存占用过高 | 大文件处理或内存泄漏     | 增加服务器内存，优化代码，设置内存限制 |
| 服务无响应   | PM2 进程崩溃             | 检查日志，重启服务，配置自动重启       |
| 文件上传失败 | 文件大小限制或权限问题   | 调整 MAX_FILE_SIZE，检查目录权限       |

## 7. 更新部署

### 7.1 代码更新流程

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
pnpm install

# 构建项目
pnpm build

# 重启服务（PM2）
pm restart
```

### 7.2 Docker 更新流程

```bash
# 停止并删除现有容器
docker-compose down

# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build
```

## 8. 安全最佳实践

### 8.1 文件安全

- 限制上传文件大小和类型
- 对上传文件进行病毒扫描
- 将上传目录设置为不可执行

### 8.2 系统安全

- 定期更新系统和依赖包
- 配置防火墙，只开放必要端口
- 使用 HTTPS 加密传输

### 8.3 应用安全

- 启用 Next.js 的安全头部
- 实现请求限流
- 定期检查依赖的安全漏洞

## 9. 扩展与高可用

### 9.1 水平扩展

- 使用 PM2 的集群模式
- 配置负载均衡器
- 使用 Redis 共享会话和缓存

### 9.2 高可用配置

- 多实例部署
- 数据库主从复制
- 监控和自动故障转移

---

部署完成后，请进行全面的功能测试，确保所有转换功能正常工作。定期维护和监控是保证系统稳定运行的关键。 🌹
