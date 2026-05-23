# 贡献指南

感谢您对 **YYC3-KTV 商家管理系统** 的贡献!

## 📋 目录

- [开发环境设置](#开发环境设置)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [测试要求](#测试要求)
- [提交 PR](#提交pr)

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18.x 或 20.x
- npm 9.x+
- Git

### 克隆仓库

```bash
git clone https://github.com/YYC-Cube/yyc3-admin-system.git
cd yyc3-admin-system
```

### 安装依赖

```bash
npm install
```

### 环境变量配置

复制 `.env.example` 为 `.env.local` 并配置必要的环境变量:

```bash
cp .env.example .env.local
```

### 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 🔄 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 进行开发

- 遵循[代码规范](#代码规范)
- 编写必要的测试
- 确保代码通过所有检查

### 3. 提交变更

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式:

```bash
git commit -m "feat: 添加商品搜索功能"
git commit -m "fix: 修复订单计算错误"
git commit -m "docs: 更新API文档"
```

**提交类型**:

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试补充
- `chore`: 构建配置

## 📏 代码规范

### TypeScript

- 启用严格模式
- 所有函数必须定义类型
- 避免使用 `any`

```typescript
// ✅ 正确
function calculateTotal(items: Product[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ 错误
function calculateTotal(items: any): any {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### React 组件

- 优先使用 Server Components
- Client Component 必须标记 `'use client'`
- 使用函数式组件

```typescript
// ✅ Server Component
export default async function ProductsPage() {
  const products = await fetchProducts()
  return <ProductList products={products} />
}

// ✅ Client Component
;('use client')
export function ProductSearch() {
  const [query, setQuery] = useState('')
  // ...
}
```

### 样式规范

- 使用 Tailwind CSS 工具类
- 使用 `cn()` 工具合并样式

```typescript
// ✅ 正确
<div className={cn('rounded-lg p-4', isActive && 'bg-blue-50')}>

// ❌ 错误
<div style={{ padding: '16px' }}>
```

## ✅ 测试要求

### 运行测试

```bash
# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 覆盖率报告
npm run test:coverage
```

### 测试标准

- 新功能必须有单元测试
- API 变更必须有集成测试
- 测试覆盖率不得下降
- 所有测试必须通过

### 编写测试示例

```typescript
// __tests__/lib/utils/calculate.test.ts
describe('calculateTotal', () => {
  it('应该正确计算总价', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 },
    ]
    expect(calculateTotal(items)).toBe(40)
  })
})
```

## 🚀 提交 PR

### 1. 推送分支

```bash
git push origin feature/your-feature-name
```

### 2. 创建 Pull Request

- 访问 GitHub 仓库
- 点击 "New Pull Request"
- 选择您的分支
- 填写 PR 模板

### 3. PR 检查清单

确保以下项目全部完成:

- [ ] 代码通过 ESLint 检查
- [ ] TypeScript 类型检查通过
- [ ] 所有测试通过 (94/94)
- [ ] 添加了必要的测试
- [ ] 文档已更新
- [ ] 提交信息符合规范

### 4. 代码审查

- 至少需要 1 个审查者批准
- 解决所有审查意见
- CI/CD 检查必须通过

## 📊 CI/CD 流程

每个 PR 会自动运行:

1. **测试**: 单元测试 + 集成测试
2. **Lint**: ESLint 代码检查
3. **类型检查**: TypeScript 类型验证
4. **安全审计**: npm audit 安全扫描

所有检查通过后才能合并。

## 📞 获取帮助

- **Issues**: [GitHub Issues](https://github.com/YYC-Cube/yyc3-admin-system/issues)
- **讨论**: [GitHub Discussions](https://github.com/YYC-Cube/yyc3-admin-system/discussions)
- **文档**: 查看 `docs/` 目录

---

再次感谢您的贡献! 🎉
