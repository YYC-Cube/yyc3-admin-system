# 贡献指南 🚀

感谢您考虑为 Easy Table Converter 项目做出贡献！这是一个功能强大的多格式表格转换工具，支持多种文件格式的转换和编辑。以下是帮助您开始的详细指南。

## 行为准则

本项目采用 [行为准则](CODE_OF_CONDUCT.md)。请确保您遵守这一准则，共同维护友好、包容的社区环境。

## 开发环境设置

### 前提条件

- Node.js 20+ 版本
- pnpm 8+ 包管理器
- Docker 和 Docker Compose (可选，用于容器化开发)

### 安装步骤

1. 克隆仓库

   ```bash
   git clone https://github.com/[owner]/easy-table-converter.git
   cd easy-table-converter
   ```

2. 安装依赖

   ```bash
   pnpm install
   ```

3. 配置环境变量

   ```bash
   cp .env.example .env
   ```

   根据需要修改 `.env` 文件中的配置项。

4. 启动开发服务器
   ```bash
   pnpm dev
   ```
   应用将运行在 http://localhost:3000

### 使用 Docker 开发环境

如果您更喜欢使用 Docker 进行开发，可以使用以下命令：

```bash
# 构建开发镜像并启动容器
docker-compose up app-dev
```

开发容器会自动挂载项目目录，支持热重载。您可以通过 http://localhost:3000 访问应用。

## 项目结构

```
Easy Table Converter/
├── app/                 # Next.js App Router (主要页面和API路由)
├── components/          # UI组件
├── lib/                 # 工具库
├── hooks/               # React Hooks
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
├── public/              # 静态资源
├── docker/              # Docker相关配置
└── tests/               # 测试文件
```

## 工作流程

1. 创建一个分支用于您的功能或修复

   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-fix-name
   ```

2. 进行更改并添加测试（如果适用）
   - 遵循项目的代码风格和最佳实践
   - 为新功能添加必要的文档
   - 确保向后兼容性

3. 确保测试通过

   ```bash
   # 运行单元测试
   pnpm test

   # 运行 E2E 测试
   pnpm test:e2e
   ```

4. 运行 linter 确保代码质量

   ```bash
   # 检查代码规范
   pnpm lint

   # 自动修复代码规范问题
   pnpm lint:fix

   # 格式化代码
   pnpm format
   ```

5. 运行类型检查

   ```bash
   pnpm type-check
   ```

6. 提交您的更改，使用语义化提交信息

   ```bash
   git commit -m "feat: 简短的功能描述"
   # 或
   git commit -m "fix: 简短的修复描述"
   ```

7. 推送到您的分支

   ```bash
   git push origin feature/your-feature-name
   ```

8. 创建 Pull Request

## 提交信息规范

我们遵循以下提交信息格式：

```
<type>: <description>

[可选的正文]

[可选的页脚]
```

### 类型

- `feat`: 添加新功能
- `fix`: 修复 bug
- `docs`: 文档更改
- `style`: 不影响代码含义的更改（空格、格式等）
- `refactor`: 既不修复 bug 也不添加功能的代码更改
- `perf`: 提高性能的代码更改
- `test`: 添加或更正测试
- `chore`: 更改构建过程或辅助工具和库

## 代码审查

所有 Pull Request 都需要通过代码审查才能合并。请确保您的代码：

1. 符合项目的编码标准和格式要求
2. 包含适当的测试，确保新功能正常工作且不会破坏现有功能
3. 文档已更新，包括 README.md、注释和 API 文档
4. 没有 linting 错误和类型检查错误
5. 遵循项目的架构和设计模式
6. 性能良好，没有明显的性能问题
7. 安全性考虑，特别是对于数据处理相关的代码

## 报告问题

在报告问题时，请提供以下详细信息：

1. 问题的清晰描述，包括当前行为和预期行为
2. 详细的重现步骤，最好能提供一个最小复现示例
3. 您的环境信息：
   - 浏览器类型和版本
   - 操作系统和版本
   - Node.js 版本
   - 应用版本（或 Git 提交哈希）
4. 如果可能，添加截图或视频演示问题
5. 相关的错误日志或控制台输出

## 项目文档

- [README.md](../README.md) - 项目概述和快速开始指南
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - 行为准则
- [SECURITY.md](./SECURITY.md) - 安全策略
- [LICENSE](../LICENSE) - 项目许可证

## 技术栈

- **前端框架**：Next.js 15.2.4 (App Router)
- **UI 库**：Radix UI + shadcn/ui
- **样式**：Tailwind CSS 4.1.9
- **语言**：TypeScript
- **状态管理**：React Context + Hooks
- **表单处理**：React Hook Form + Zod
- **测试**：Vitest (单元测试) + Playwright (E2E 测试)
- **部署**：Docker 容器化

## 性能和优化

在贡献代码时，请考虑以下性能优化建议：

1. 使用 React.memo 和 useCallback 减少不必要的重渲染
2. 优化组件拆分，遵循单一职责原则
3. 对于大型表格数据，考虑使用虚拟化技术
4. 避免在渲染过程中执行昂贵的计算
5. 合理使用缓存机制，特别是对于文件转换操作

## 安全注意事项

作为数据处理工具，安全性尤为重要：

1. 所有用户输入必须经过验证和清理
2. 文件上传应限制大小和格式，防止恶意文件上传
3. 避免在日志中记录敏感信息
4. 所有第三方库应及时更新，避免已知漏洞

## 通信渠道

- 项目 GitHub 仓库：提交 Issues 和 Pull Requests
- 电子邮件：[项目维护者邮箱]（可在项目组织页面找到）

感谢您对 Easy Table Converter 项目的贡献！我们期待您的参与，共同打造更好的表格转换工具。

## 许可

通过贡献，您同意您的贡献将在项目的许可下发布。
