# 安全漏洞修复文档

本文档记录了所有已修复的安全漏洞及其解决方案。

## 修复日期：2025-11-03

### 1. 加密硬编码盐值漏洞 (Critical)

**文件位置**: `lib/security/encryption.ts:14`

**问题描述**:
- 使用静态字符串 `"salt"` 作为密钥派生函数的盐值
- 这削弱了加密强度，使得攻击者更容易进行字典攻击

**修复方案**:
```typescript
// 修复前
constructor(secret: string) {
  this.key = crypto.scryptSync(secret, "salt", KEY_LENGTH)
}

// 修复后
constructor(secret: string, salt?: Buffer) {
  // 如果未提供盐值，则生成随机盐值（用于新安装）
  // 对于现有安装，盐值应安全存储并传入
  this.salt = salt || crypto.randomBytes(SALT_LENGTH)
  this.key = crypto.scryptSync(secret, this.salt, KEY_LENGTH)
}
```

**影响**:
- 显著提高了加密安全性
- 使用随机盐值可防止预计算攻击
- 允许通过环境变量 `ENCRYPTION_SALT` 传入持久化的盐值

---

### 2. 默认加密密钥漏洞 (Critical)

**文件位置**: `lib/security/encryption.ts:49`

**问题描述**:
- 如果环境变量 `ENCRYPTION_SECRET` 未设置，代码会回退到默认密钥
- 这在生产环境中是严重的安全风险

**修复方案**:
```typescript
// 修复前
export const encryption = new Encryption(
  process.env.ENCRYPTION_SECRET || "default-secret-key-change-in-production"
)

// 修复后
// 验证 ENCRYPTION_SECRET 已设置
if (!process.env.ENCRYPTION_SECRET) {
  throw new Error(
    "ENCRYPTION_SECRET environment variable is not set. Please set it to a secure random string."
  )
}

// 加载或生成盐值（在生产环境中应安全存储）
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT
  ? Buffer.from(process.env.ENCRYPTION_SALT, "hex")
  : undefined

export const encryption = new Encryption(process.env.ENCRYPTION_SECRET, ENCRYPTION_SALT)
```

**影响**:
- 防止在生产环境中使用弱加密
- 强制开发人员显式配置加密密钥
- 提高了系统安全性

---

### 3. eval() 代码注入漏洞 (Critical)

**文件位置**: `lib/ai-ops/ops-execution-tracker-incentive.ts:538`

**问题描述**:
- 使用 `eval()` 评估条件表达式
- 允许任意代码执行，存在严重安全风险

**修复方案**:
```typescript
// 修复前
private evaluateCondition(condition: string, performance: PerformanceScore): boolean {
  try {
    const expr = condition
      .replace(/taskCompletionRate/g, performance.taskCompletionRate.toString())
      .replace(/qualityScore/g, performance.qualityScore.toString())
      // ... 更多替换
    
    return eval(expr)  // 危险！
  } catch (error) {
    return false
  }
}

// 修复后
private evaluateCondition(condition: string, performance: PerformanceScore): boolean {
  try {
    const context: Record<string, number> = {
      taskCompletionRate: performance.taskCompletionRate,
      qualityScore: performance.qualityScore,
      efficiencyScore: performance.efficiencyScore,
      overallScore: performance.overallScore,
      rank: performance.rank,
    }
    
    return this.safeEvaluateExpression(condition, context)
  } catch (error) {
    return false
  }
}

// 新增安全表达式评估器
private safeEvaluateExpression(expr: string, context: Record<string, number>): boolean {
  // 仅支持安全的比较操作: >, <, >=, <=, ==, !=, &&, ||
  // 不允许任意代码执行
  // 详见实现...
}
```

**影响**:
- 完全消除了任意代码执行的风险
- 仍然支持业务需要的条件评估功能
- 只允许预定义的安全操作

**支持的表达式示例**:
- `taskCompletionRate > 80`
- `qualityScore >= 70 && efficiencyScore > 60`
- `rank < 5 || overallScore > 90`

**被拒绝的恶意代码示例**:
- `console.log('hack')`
- `process.exit(1)`
- `require('fs')`

---

### 4. 正则表达式拒绝服务 (ReDoS) 漏洞 (Medium)

**文件位置**: `lib/ai-ops/ops-execution-tracker-incentive.ts:567`

**问题描述**:
- 正则表达式 `/^(\w+)\s*(>=|<=|>|<|==|!=)\s*(-?\d+\.?\d*)$/` 可能导致灾难性回溯
- 可被用于拒绝服务攻击

**修复方案**:
```typescript
// 修复前
const comparisonMatch = expr.match(/^(\w+)\s*(>=|<=|>|<|==|!=)\s*(-?\d+\.?\d*)$/)

// 修复后
const comparisonMatch = expr.match(/^(\w+)\s*(>=|<=|>|<|==|!=)\s*(-?\d+(?:\.\d+)?)$/)
```

**技术说明**:
- 将 `\d+\.?\d*` 改为 `\d+(?:\.\d+)?`
- 使用非捕获组 `(?:...)` 和更明确的可选模式 `?`
- 避免了潜在的指数级回溯

**影响**:
- 防止了潜在的拒绝服务攻击
- 提高了正则表达式的执行效率

---

## 验证结果

### CodeQL 安全扫描
- **扫描结果**: 0 个警告
- **状态**: ✅ 通过

### 自定义安全测试
所有测试均通过：
- ✅ 加密使用随机盐值
- ✅ 相同盐值可正确解密
- ✅ 安全表达式评估器正确处理比较操作
- ✅ 恶意代码被正确拒绝

### Linter 检查
- **状态**: ✅ 无新增错误

---

## 环境变量要求

修复后，系统需要以下环境变量：

### 必需
- `ENCRYPTION_SECRET`: 加密密钥（强随机字符串）
  - 示例: `openssl rand -hex 32`

### 可选
- `ENCRYPTION_SALT`: 加密盐值（十六进制字符串）
  - 用于已有数据的向后兼容
  - 如果未设置，将自动生成随机盐值（仅适用于新安装）

---

## 迁移指南

### 对于新安装
1. 设置 `ENCRYPTION_SECRET` 环境变量
2. 系统会自动生成随机盐值

### 对于现有安装
如果已有加密数据使用旧的硬编码盐值：

1. 设置 `ENCRYPTION_SECRET` 环境变量
2. 设置 `ENCRYPTION_SALT=73616c74` (对应旧的 "salt" 字符串的十六进制)
3. 建议：迁移数据到使用新随机盐值的加密方案

---

## 最佳实践

1. **永远不要**在代码中硬编码密钥或盐值
2. **始终**使用环境变量存储敏感信息
3. **定期**更新加密密钥和盐值
4. **避免**使用 `eval()` 或类似的动态代码执行
5. **使用**安全的表达式解析器代替 `eval()`
6. **审查**所有正则表达式以防止 ReDoS 攻击

---

## 相关文档

- [安全指南](./SECURITY_GUIDE.md)
- [安全实施指南](./SECURITY_IMPLEMENTATION.md)
- [主安全策略](../SECURITY.md)
