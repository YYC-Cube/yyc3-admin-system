# 测试执行指南

## 快速开始

### 环境准备

\`\`\`bash
# 安装依赖
npm install

# 安装Playwright浏览器
npx playwright install
\`\`\`

### 运行测试

\`\`\`bash
# 运行完整测试套件（推荐）
npm run test:all
# 或
npm run test:run

# 开发模式下运行单元测试（监听文件变化）
npm run test

# CI模式运行单元测试
npm run test:ci

# 查看测试覆盖率
npm run test:coverage

# 运行E2E测试
npm run test:e2e

# 运行E2E测试（UI模式）
npm run test:e2e:ui

# 运行性能测试
npm run test:performance

# 运行安全测试
npm run test:security
\`\`\`

## 完整测试套件

### 自动化测试运行

使用 `npm run test:all` 命令会自动执行以下测试流程：

1. 单元测试
2. 集成测试
3. 代码覆盖率分析
4. 生成详细测试报告

测试报告会自动保存在 `docs/TEST_REPORT.md` 文件中。

### 测试报告内容

测试报告包含以下信息：

- 测试概览（总数、通过、失败、跳过）
- 各测试套件详情
- 代码覆盖率统计
- 改进建议

## 测试类型详解

### 1. 单元测试

**目的**: 测试独立的函数、类和组件

**工具**: Jest + React Testing Library

**示例**:

\`\`\`typescript
// __tests__/lib/utils/format.test.ts
import { formatPrice } from '@/lib/utils/format'

describe('formatPrice', () => {
  it('应该正确格式化价格', () => {
    expect(formatPrice(1234.56)).toBe('¥1,234.56')
  })
})
\`\`\`

**最佳实践**:
- 每个函数至少一个测试用例
- 测试正常情况和边界情况
- 使用描述性的测试名称
- 保持测试独立性

### 2. 集成测试

**目的**: 测试多个模块协同工作

**工具**: Jest + Supertest

**示例**:

\`\`\`typescript
// __tests__/integration/api/products.test.ts
import { GET } from '@/app/api/products/route'

describe('Products API', () => {
  it('应该返回商品列表', async () => {
    const response = await GET(request)
    expect(response.status).toBe(200)
  })
})
\`\`\`

**最佳实践**:
- 测试API端到端流程
- 验证数据库交互
- 检查错误处理
- 测试权限控制

### 3. E2E测试

**目的**: 模拟真实用户操作

**工具**: Playwright

**示例**:

\`\`\`typescript
// e2e/products.spec.ts
test('应该能够创建商品', async ({ page }) => {
  await page.goto('/dashboard/products')
  await page.click('text=新增商品')
  await page.fill('input[name="name"]', '测试商品')
  await page.click('button:has-text("保存")')
  await expect(page.locator('text=创建成功')).toBeVisible()
})
\`\`\`

**最佳实践**:
- 测试关键业务流程
- 使用Page Object模式
- 添加等待和重试机制
- 截图保存失败场景

### 4. 性能测试

**目的**: 验证系统性能指标

**工具**: k6

**示例**:

\`\`\`javascript
// tests/performance/load-test.js
export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
  ],
}

export default function () {
  http.get('http://localhost:3000/api/products')
}
\`\`\`

**最佳实践**:
- 设置合理的负载阶段
- 定义性能阈值
- 监控系统资源
- 生成性能报告

### 5. 安全测试

**目的**: 发现安全漏洞

**工具**: Playwright + 自定义脚本

**测试项目**:
- SQL注入
- XSS攻击
- CSRF攻击
- 权限绕过
- 敏感信息泄露

## 测试覆盖率

### 查看覆盖率报告

\`\`\`bash
npm run test:coverage
\`\`\`

覆盖率报告将生成在 `coverage/` 目录下。

### 覆盖率目标

- 语句覆盖率: ≥80%
- 分支覆盖率: ≥80%
- 函数覆盖率: ≥80%
- 行覆盖率: ≥80%

## 调试测试

### 调试单元测试

\`\`\`bash
# 使用VS Code调试
# 1. 在测试文件中设置断点
# 2. 按F5启动调试
# 3. 选择"Jest: Current File"

# 使用Chrome DevTools
node --inspect-brk node_modules/.bin/jest --runInBand
\`\`\`

### 调试E2E测试

\`\`\`bash
# UI模式（推荐）
npm run test:e2e:ui

# 调试模式
npx playwright test --debug

# 慢速模式
npx playwright test --slow-mo=1000
\`\`\`

## CI/CD集成

### GitHub Actions配置

\`\`\`yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
\`\`\`

## 常见问题

### Q: 测试运行很慢怎么办？

A: 
- 使用 `--maxWorkers=50%` 限制并行数
- 只运行相关测试 `jest path/to/test`
- 使用 `--onlyChanged` 只测试改动文件

### Q: E2E测试不稳定怎么办？

A:
- 增加等待时间
- 使用显式等待而非固定延迟
- 检查网络请求是否完成
- 使用重试机制

### Q: 如何提高测试覆盖率？

A:
- 识别未覆盖的代码
- 补充边界条件测试
- 测试错误处理逻辑
- 测试异步操作

## 最佳实践总结

1. **测试金字塔**: 70%单元测试 + 20%集成测试 + 10%E2E测试
2. **测试独立性**: 每个测试应该独立运行
3. **测试可读性**: 使用描述性的测试名称
4. **测试维护性**: 避免重复代码，使用辅助函数
5. **持续集成**: 每次提交都运行测试
6. **性能监控**: 定期运行性能测试
7. **安全审计**: 定期进行安全测试

---

更多信息请参考：
- [Jest文档](https://jestjs.io/)
- [Playwright文档](https://playwright.dev/)
- [k6文档](https://k6.io/docs/)
