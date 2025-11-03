# 🚀 Easy Table Converter 部署指南

## 📋 目录

- [环境准备](#-环境准备)
- [配置说明](#-配置说明)
- [Docker 部署](#-docker-部署)
- [CI/CD 工作流](#-cicd-工作流)
- [高可用配置](#-高可用配置)
- [监控与维护](#-监控与维护)
- [故障排查](#-故障排查)
- [安全最佳实践](#-安全最佳实践)

## 🛠️ 环境准备

### 系统要求

- **操作系统**: Linux (推荐 Ubuntu 22.04+), macOS, Windows (WSL2)
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 20.x (仅开发环境需要)
- **pnpm**: 8.x (仅开发环境需要)

### 安装依赖

```bash
# Ubuntu/Debian
apt update && apt install -y docker.io docker-compose

# 安装 pnpm (开发环境)
npm install -g pnpm
```

## ⚙️ 配置说明

### 环境变量配置

项目提供了两个主要的环境变量配置文件：

1. **`.env.example`** - 开发环境配置示例，包含所有可用的配置项
2. **`.env.local.example`** - 生产环境配置示例

### 关键配置项

| 配置项                  | 类型    | 默认值                  | 说明                | 环境 |
| ----------------------- | ------- | ----------------------- | ------------------- | ---- |
| `NEXT_PUBLIC_SITE_URL`  | string  | `http://localhost:3000` | 站点基础URL         | 所有 |
| `BRAND_NAME`            | string  | `Easy Table Converter`  | 品牌名称            | 所有 |
| `DEBUG_MODE`            | boolean | `false`                 | 调试模式            | 开发 |
| `ENV_STRICT`            | boolean | `true`                  | 环境变量严格模式    | 生产 |
| `MAX_UPLOAD_SIZE`       | string  | `10MB`                  | 最大上传文件大小    | 所有 |
| `API_TIMEOUT`           | number  | `10000`                 | API请求超时时间(ms) | 所有 |
| `API_RATE_LIMIT`        | number  | `50`                    | API请求速率限制     | 所有 |
| `ALLOWED_IMAGE_FORMATS` | string  | `png,jpg,jpeg,webp`     | 允许的图片格式      | 所有 |

### 生产环境配置步骤

1. 复制生产环境配置示例：

```bash
cp .env.local.example .env.local
```

2. 编辑 `.env.local` 文件，根据实际情况配置环境变量：

```bash
# 必须配置的生产环境变量
NEXT_PUBLIC_SITE_URL=https://your-domain.com
BRAND_NAME=Easy Table Converter
DEBUG_MODE=false
ENV_STRICT=true

# API配置
MAX_UPLOAD_SIZE=50MB
API_TIMEOUT=30000
API_RATE_LIMIT=100
```

## 🐳 Docker 部署

### 基本部署（开发环境）

```bash
# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 生产环境部署

```bash
# 使用生产环境配置启动服务
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# 验证服务健康状态
docker-compose ps
```

### 部署参数

| 参数               | 说明             | 示例                                    |
| ------------------ | ---------------- | --------------------------------------- |
| `--scale app=N`    | 扩展应用实例数量 | `docker-compose up -d --scale app=3`    |
| `--no-deps`        | 不重建依赖服务   | `docker-compose up -d --no-deps app`    |
| `--force-recreate` | 强制重新创建容器 | `docker-compose up -d --force-recreate` |

## 🔄 CI/CD 工作流

### 工作流配置

项目使用 GitHub Actions 实现自动化 CI/CD 流程，配置文件位于 `.github/workflows/ci-cd.yml`。

### 工作流触发条件

- 主分支（`main`/`master`）推送
- 标签推送（`v*.*.*`）
- PR 提交到主分支
- 手动触发（可选择部署环境）

### 工作流程

1. **代码质量检查**：ESLint、代码格式化、TypeScript 类型检查
2. **自动化测试**：单元测试和 E2E 测试
3. **构建应用**：构建应用和 Docker 镜像，推送到 GitHub Container Registry
4. **部署**：
   - PR 和主分支推送：部署到 Staging 环境
   - 标签推送：部署到 Production 环境
   - 手动触发：可选择部署环境
5. **监控**：部署后健康检查和监控

### GitHub Secrets 配置

需要在 GitHub 仓库中配置以下 Secrets：

- `NEXT_PUBLIC_SITE_URL`：站点基础 URL
- `STAGING_SITE_URL`：Staging 环境 URL
- `PROD_SITE_URL`：Production 环境 URL
- `STAGING_SSH_USER`：Staging 服务器 SSH 用户名
- `STAGING_SSH_HOST`：Staging 服务器 SSH 地址
- `STAGING_DEPLOY_PATH`：Staging 部署路径
- `SLACK_WEBHOOK`：部署通知 Slack Webhook URL

## 🏗️ 高可用配置

### 多实例部署

项目通过 Docker Compose 的 `deploy.replicas` 配置实现多实例部署，默认配置 3 个应用实例。

### 负载均衡

使用 Nginx 作为负载均衡器，配置文件位于 `nginx/conf.d/default.conf`，实现：

- 轮询策略的负载分发
- SSL 终止
- 静态资源缓存
- 健康检查和故障转移

### 健康检查

应用和 Nginx 都配置了健康检查：

- 应用：检查 `/api/health` 端点
- Nginx：检查配置文件有效性

### 滚动更新

生产环境配置了滚动更新策略，确保更新过程中服务不中断：

```yaml
update_config:
  parallelism: 1 # 一次更新一个实例
  delay: 10s # 更新间隔
  order: start-first # 先启动新实例再停止旧实例
  failure_action: rollback # 失败时自动回滚
```

## 📊 监控与维护

### 日志管理

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs app

# 实时查看日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail 100
```

### 性能监控

项目预留了 Prometheus 和 Grafana 集成配置，需要时可以启用：

1. 取消 `docker-compose.yml` 中监控服务的注释
2. 创建 Prometheus 配置文件：`monitoring/prometheus.yml`
3. 启动监控服务：`docker-compose up -d prometheus grafana`

### 备份与恢复

```bash
# 备份上传文件
mkdir -p backups
docker-compose exec app /bin/sh -c "tar -czf /tmp/uploads_backup.tar.gz /app/public/uploads"
docker cp $(docker-compose ps -q app):/tmp/uploads_backup.tar.gz ./backups/

# 恢复上传文件
docker cp ./backups/uploads_backup.tar.gz $(docker-compose ps -q app):/tmp/
docker-compose exec app /bin/sh -c "tar -xzf /tmp/uploads_backup.tar.gz -C /"
```

## 🔍 故障排查

### 常见问题

#### 服务无法启动

```bash
# 检查容器状态
docker-compose ps

# 查看详细日志
docker-compose logs --tail 100

# 验证环境变量
.env.local 是否正确配置
```

#### 负载均衡器问题

```bash
# 检查 Nginx 配置
docker-compose exec nginx nginx -t

# 查看 Nginx 访问日志
docker-compose logs nginx
```

#### 性能问题

```bash
# 检查容器资源使用情况
docker stats

# 扩展服务实例
docker-compose up -d --scale app=5
```

## 🛡️ 安全最佳实践

### Docker 安全

- 使用非 root 用户运行容器
- 定期更新基础镜像
- 限制容器资源使用
- 配置只读文件系统（除必要目录外）

### Nginx 安全

- 配置强密码套件
- 启用 HTTP/2
- 配置安全头部
- 限制请求大小
- 启用请求限速

### 数据安全

- 定期备份上传文件
- 配置适当的文件权限
- 使用 HTTPS 加密传输

### 部署安全

- 使用环境变量存储敏感信息
- 限制生产环境访问权限
- 定期检查依赖漏洞
- 实施最小权限原则

## 📝 部署清单

### 生产部署前检查

- [ ] 确认 `.env.local` 配置正确
- [ ] 验证 Nginx 配置和 SSL 证书
- [ ] 配置服务器防火墙
- [ ] 设置监控告警
- [ ] 准备回滚方案
- [ ] 配置日志收集

### 部署后验证

- [ ] 访问站点主页
- [ ] 测试核心功能
- [ ] 验证健康检查端点
- [ ] 检查日志中是否有错误
- [ ] 确认 SSL 证书有效性

---

📚 更多信息请参考项目文档。如有问题，请联系技术支持。

保持代码健康，稳步前行！ 🌹
