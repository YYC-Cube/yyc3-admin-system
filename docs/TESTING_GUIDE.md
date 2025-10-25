# 测试指南

## 概述

本项目采用完整的测试策略，包括单元测试、集成测试和E2E测试。

## 测试框架

### 单元测试
- **Jest**: JavaScript测试框架
- **React Testing Library**: React组件测试
- **@testing-library/user-event**: 用户交互模拟

### E2E测试
- **Playwright**: 端到端测试框架
- 支持多浏览器测试（Chrome、Firefox、Safari）
- 支持移动端测试

## 运行测试

### 单元测试
\`\`\`bash
# 开发模式（监听文件变化）
npm run test

# CI模式
npm run test:ci

# 生成覆盖率报告
npm run test:coverage
\`\`\`

### E2E测试
\`\`\`bash
# 运行所有E2E测试
npm run test:e2e

# 使用UI模式运行
npm run test:e2e:ui
\`\`\`

## 测试覆盖率目标

- 组件测试覆盖率: ≥80%
- 工具函数覆盖率: ≥90%
- 关键业务流程E2E覆盖率: 100%

## 编写测试

### 组件测试示例
\`\`\`typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
\`\`\`

### E2E测试示例
\`\`\`typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/')
  await page.fill('[name="username"]', 'admin')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
\`\`\`

## 最佳实践

1. **测试用户行为，而非实现细节**
2. **使用语义化查询**（getByRole, getByLabelText）
3. **避免测试第三方库**
4. **保持测试简单和可维护**
5. **使用测试数据工厂**
6. **Mock外部依赖**
