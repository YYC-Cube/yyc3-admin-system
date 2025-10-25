# 安全指南

## 安全措施

### 1. CSRF保护
- 所有非GET请求需要CSRF token
- Token存储在HTTP-only cookie中
- 每次请求验证token

### 2. 数据加密
- 敏感数据使用AES-256-GCM加密
- 密码使用bcrypt哈希
- 传输层使用HTTPS

### 3. 审计日志
- 记录所有关键操作
- 包含用户、时间、操作类型
- 支持日志查询和分析

### 4. 安全头部
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Content-Security-Policy

### 5. 输入验证
- 使用Zod进行类型验证
- 防止SQL注入
- 防止XSS攻击

## 使用示例

### CSRF保护
\`\`\`typescript
import { csrfProtection } from '@/lib/security/csrf'

export const POST = csrfProtection(async (request) => {
  // 处理请求
})
\`\`\`

### 数据加密
\`\`\`typescript
import { encryption } from '@/lib/security/encryption'

const encrypted = encryption.encrypt('sensitive data')
const decrypted = encryption.decrypt(encrypted)
\`\`\`

### 审计日志
\`\`\`typescript
import { auditLogger } from '@/lib/security/audit-log'

await auditLogger.log({
  userId: user.id,
  username: user.username,
  action: 'CREATE_PRODUCT',
  resource: 'products',
  resourceId: product.id,
  status: 'success',
})
\`\`\`

## 安全检查清单

- [ ] 所有API端点都有认证
- [ ] 敏感操作需要权限验证
- [ ] 输入数据都经过验证
- [ ] 密码安全存储
- [ ] 使用HTTPS
- [ ] 实施CSRF保护
- [ ] 配置安全头部
- [ ] 记录审计日志
- [ ] 定期安全审计
- [ ] 依赖包安全更新

## 应急响应

### 发现安全漏洞
1. 立即评估影响范围
2. 隔离受影响系统
3. 修复漏洞
4. 通知相关方
5. 更新安全文档

### 数据泄露
1. 确认泄露范围
2. 通知用户
3. 重置凭证
4. 加强监控
5. 事后分析
