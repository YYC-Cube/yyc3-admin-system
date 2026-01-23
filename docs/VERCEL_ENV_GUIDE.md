# Vercel 环境变量配置指南

> **最后更新**: 2025-12-03  
> **项目**: YYC3 KTV 商家管理系统

---

## 🚀 快速开始 (5分钟部署)

### 最低必需配置 (6个变量)

在 Vercel Dashboard → Settings → Environment Variables 中添加:

```bash
# 1. 数据库连接 (必需)
YYC3_YY_DB_HOST=your-database-host.com
YYC3_YY_DB_USER=your_db_user
YYC3_YY_DB_PASSWORD=your_strong_password
YYC3_YY_DB_NAME=yyc3_yy

# 2. 安全密钥 (必需)
ENCRYPTION_SECRET=your_32_character_encryption_key_here
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

> ✅ 配置完这6个变量即可成功部署!

---

## 📊 完整配置清单

### 🔴 必需变量 (Production环境必填)

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `YYC3_YY_DB_HOST` | 数据库地址 | `db.example.com` |
| `YYC3_YY_DB_USER` | 数据库用户名 | `admin` |
| `YYC3_YY_DB_PASSWORD` | 数据库密码 | `StrongPass123!` |
| `YYC3_YY_DB_NAME` | 数据库名称 | `yyc3_yy` |
| `ENCRYPTION_SECRET` | 数据加密密钥 (≥32字符) | `your_very_long_secret_key_here` |
| `NEXTAUTH_SECRET` | NextAuth密钥 | `your_nextauth_secret` |

### 🟡 推荐变量 (提升性能和监控)

| 变量名 | 说明 | 推荐服务 |
|--------|------|----------|
| `REDIS_URL` | Redis缓存地址 | [Upstash Redis](https://upstash.com) (免费) |
| `LOG_SERVICE_URL` | 日志服务 | [Sentry](https://sentry.io) (免费5K/月) |
| `METRICS_SERVICE_URL` | 性能监控 | Vercel Analytics |
| `MONITORING_ENABLED` | 启用监控 | `true` |

### 🟢 可选变量 (按业务需求)

#### 支付功能
```bash
NEXT_PUBLIC_WECHAT_APP_ID=wx_your_app_id
WECHAT_MCH_ID=your_merchant_id
WECHAT_API_KEY=your_api_key

NEXT_PUBLIC_ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_private_key
ALIPAY_PUBLIC_KEY=your_public_key
```

#### 物联网 (MQTT)
```bash
MQTT_BROKER_URL=mqtts://your-broker.com:8883
```

#### 区块链积分系统
```bash
BLOCKCHAIN_PROVIDER_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
LOYALTY_CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=your_private_key
```

#### 5G视频通信
```bash
NEXT_PUBLIC_TURN_SERVER_URL=turn:turn.example.com:3478
NEXT_PUBLIC_TURN_USERNAME=username
NEXT_PUBLIC_TURN_CREDENTIAL=credential
```

---

## 🔧 配置步骤详解

### 方法1: Vercel Dashboard (推荐)

1. **访问项目设置**
   ```
   https://vercel.com/your-team/yyc3-admin-system/settings/environment-variables
   ```

2. **添加环境变量**
   - 点击 "Add New" 按钮
   - 输入变量名和值
   - 选择环境: `Production`, `Preview`, `Development`
   - 点击 "Save"

3. **重新部署**
   - 进入 Deployments 标签
   - 点击最新部署的 "..." 菜单
   - 选择 "Redeploy"

### 方法2: Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add YYC3_YY_DB_HOST production
vercel env add ENCRYPTION_SECRET production

# 批量导入 (从.env.local)
vercel env pull .env.local
```

### 方法3: GitHub Secrets同步

在 `.github/workflows/deploy.yml` 中配置:

```yaml
env:
  YYC3_YY_DB_HOST: ${{ secrets.DB_HOST }}
  ENCRYPTION_SECRET: ${{ secrets.ENCRYPTION_SECRET }}
```

---

## 🎯 推荐服务配置

### 1. 数据库 - PlanetScale (免费)

```bash
# 注册: https://planetscale.com
# 创建数据库后获取连接信息

YYC3_YY_DB_HOST=aws.connect.psdb.cloud
YYC3_YY_DB_USER=your_username
YYC3_YY_DB_PASSWORD=pscale_pw_...
YYC3_YY_DB_NAME=yyc3_yy
YYC3_YY_DB_PORT=3306
```

### 2. Redis - Upstash (免费)

```bash
# 注册: https://console.upstash.com
# 创建Redis数据库后获取URL

REDIS_URL=rediss://default:xxx@us1-xxx.upstash.io:6379
```

### 3. 日志 - Sentry (免费)

```bash
# 注册: https://sentry.io
# 创建项目后获取DSN

LOG_SERVICE_URL=https://xxx@o123456.ingest.sentry.io/123456
```

---

## 🔒 安全最佳实践

### 密钥生成

```bash
# 生成ENCRYPTION_SECRET (32字符)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 生成NEXTAUTH_SECRET
openssl rand -base64 32

# 生成ENCRYPTION_SALT (128位十六进制)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 环境变量安全检查

- ✅ 所有密钥至少32字符
- ✅ 使用强随机生成的密钥
- ✅ 生产环境和开发环境使用不同密钥
- ✅ 不要在代码中硬编码敏感信息
- ✅ 定期轮换密钥

---

## ⚠️ 常见问题

### Q1: 部署后数据库连接失败?

**A**: 检查以下项:
1. 数据库地址是否正确 (不要包含 `mysql://` 前缀)
2. 用户名密码是否正确
3. 数据库是否允许Vercel IP访问 (或开启0.0.0.0/0)
4. 端口号是否正确 (默认3306)

### Q2: Redis连接超时?

**A**: 
- 确保使用 `rediss://` (SSL) 协议
- Upstash Redis URL格式: `rediss://default:password@host:6379`
- 检查Upstash是否选择了正确的区域 (推荐US East)

### Q3: 环境变量不生效?

**A**: 
1. 确认变量名拼写正确 (区分大小写)
2. 重新部署项目 (环境变量修改后需要重新部署)
3. 检查变量是否添加到了正确的环境 (Production/Preview)

### Q4: 如何查看当前配置的环境变量?

**A**: 
```bash
# 方法1: Vercel CLI
vercel env ls

# 方法2: Vercel Dashboard
# Settings → Environment Variables
```

---

## 🧪 测试环境变量

创建测试页面验证配置:

```typescript
// app/api/config-test/route.ts
export async function GET() {
  return Response.json({
    database: !!process.env.YYC3_YY_DB_HOST,
    redis: !!process.env.REDIS_URL,
    encryption: !!process.env.ENCRYPTION_SECRET,
    timestamp: new Date().toISOString()
  })
}
```

访问: `https://your-domain.vercel.app/api/config-test`

---

## 📞 技术支持

- **文档**: `/docs/README.md`
- **环境变量模板**: `/.env.example`
- **GitHub Issues**: https://github.com/YYC-Cube/yyc3-admin-system/issues
- **邮箱**: admin@0379.email

---

## 📝 配置检查清单

部署前确认:

- [ ] 已添加6个必需环境变量
- [ ] 数据库连接测试成功
- [ ] Redis缓存配置完成
- [ ] 生成了安全的密钥
- [ ] 已在GitHub保存备份
- [ ] 生产环境变量与开发环境分离
- [ ] 敏感信息已加入.gitignore

---

**祝部署顺利!** 🎉
