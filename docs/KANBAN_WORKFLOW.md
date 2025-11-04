# Kanban Auto Migration Workflow

## 概述

`kanban-migrate.yml` 是一个GitHub Actions工作流，用于自动化看板管理流程。当创建PR或处理Issue时，它会自动将相关任务移至"进行中"（Doing）列，并执行一系列CI检查。

## 触发条件

### Pull Request事件
- `opened`: 当PR首次创建时
- `reopened`: 当已关闭的PR重新打开时
- `ready_for_review`: 当PR从草稿状态变为可审查时

**触发分支**: `main`, `staging`

### Issue事件
- `opened`: 当Issue首次创建时
- `reopened`: 当已关闭的Issue重新打开时
- `assigned`: 当Issue被分配给某人时

## 权限配置

工作流需要以下权限：
- `contents: read` - 读取仓库内容
- `issues: write` - 写入Issue（添加标签、评论）
- `pull-requests: write` - 写入PR（添加标签、评论）
- `repository-projects: write` - 管理项目看板

## 工作流任务

### 1. migrate-to-doing

**功能**: 自动将PR或Issue移至看板的"进行中"列

**步骤**:
1. **Checkout repository** - 检出代码
2. **Move PR to Doing** - 将PR添加到项目看板（仅PR事件）
3. **Move Issue to Doing** - 将Issue添加到项目看板（仅Issue事件）
4. **Add labels to PR** - 为PR添加 `in-progress` 标签
5. **Comment on PR** - 在PR中添加自动化评论通知

**项目URL**: `https://github.com/orgs/YYC-Cube/projects/1`

### 2. validate-migration

**功能**: 验证PR质量和关联性

**依赖**: `migrate-to-doing`（仅在前一任务成功后运行）

**步骤**:
1. **Validate PR is linked to issue** - 检查PR是否引用了Issue
   - 支持的引用格式: `#123`, `closes #123`, `fixes #123`, `resolves #123`
   - 未关联时会发出警告，建议添加Issue引用

2. **Check PR description quality** - 评估PR描述质量
   - 评分维度（满分100分）:
     * 标题长度（20分）: 标题超过10个字符
     * 描述长度（30分）: 描述超过50个字符
     * 任务清单（25分）: 包含Markdown清单 `- [ ]`
     * 测试说明（25分）: 包含"test"或"测试"关键词
   - 评分低于50分时会提供改进建议

### 3. ci-gate-check

**功能**: 执行CI门禁检查

**依赖**: `validate-migration`

**环境变量**:
```env
NODE_ENV=test
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
JWT_SECRET=test_jwt_secret_for_ci
```

**步骤**:
1. **Setup Node.js** - 配置Node.js 20环境（带npm缓存）
2. **Install dependencies** - 安装项目依赖 (`npm ci`)
3. **Run linter** - 执行代码风格检查（允许失败）
4. **Run type check** - 执行TypeScript类型检查（允许失败）
5. **Build project** - 构建项目（允许失败，超时10分钟）
6. **Report CI Status** - 报告CI状态并在PR中评论结果

## 使用示例

### 示例1: 创建新PR

```bash
# 创建一个关联Issue的PR
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature, fixes #123"
git push origin feature/new-feature
# 在GitHub上创建PR，PR描述中包含:
# - [ ] 实现核心功能
# - [ ] 添加单元测试
# - [ ] 更新文档
```

**工作流会自动**:
1. 将PR移至"进行中"看板列
2. 添加 `in-progress` 标签
3. 评论"🎯 此 PR 已自动移至"进行中"看板列。CI 检查正在运行中..."
4. 检查PR质量（应该得到高分，因为有清单和Issue引用）
5. 运行CI检查并报告结果

### 示例2: 创建Issue并分配

```bash
# 通过GitHub UI创建Issue
# 分配给团队成员
```

**工作流会自动**:
1. 将Issue移至"进行中"看板列

## 自定义配置

### 修改项目URL

如果你的组织项目URL不同，请修改：

```yaml
- name: Move PR to Doing
  uses: actions/add-to-project@v0.5.0
  with:
    project-url: https://github.com/orgs/YOUR-ORG/projects/YOUR-PROJECT-NUMBER
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 修改标签

如果想使用不同的标签，请修改：

```yaml
labels: ['your-custom-label']
```

### 修改评分标准

在 `validate-migration` 任务中调整评分权重：

```javascript
if (title.length > 10) score += 20;  // 修改标题分数
if (body.length > 50) score += 30;   // 修改描述分数
```

## 已知问题

### 构建错误（React hooks prerendering）

当前存在一个已知的React hooks预渲染问题，影响部分AI仪表盘页面。错误表现为：

```
TypeError: (0 , I.useState) is not a function or its return value is not iterable
```

**受影响的页面**:
- `/dashboard/ai/pricing`
- `/dashboard/ai/marketing`
- `/dashboard/ai/traffic`
- 其他使用Radix UI Tabs组件的页面

**临时解决方案**:
1. CI工作流中构建步骤已设置为 `continue-on-error: true`，不会阻塞PR合并
2. 已将受影响页面标记为客户端组件（`"use client"`）
3. 已设置 `export const dynamic = 'force-dynamic'` 禁用静态生成

**正在调查的根本原因**:
- Next.js 15.5.4 与 React 19 的兼容性问题
- Radix UI组件与Next.js App Router的交互问题
- Webpack打包配置问题

**计划的永久解决方案**:
1. 等待Next.js或Radix UI的兼容性更新
2. 考虑降级React版本或升级Next.js版本
3. 重构受影响的组件，避免使用有问题的模式

## 最佳实践

### PR描述模板

```markdown
## 变更说明
简要说明此PR的目的和主要变更

## 相关Issue
Fixes #123

## 变更清单
- [ ] 核心功能实现
- [ ] 单元测试
- [ ] 集成测试
- [ ] 文档更新
- [ ] 性能测试

## 测试说明
描述如何测试这些变更

## 截图（如适用）
附加相关截图
```

### Issue创建规范

1. 使用清晰的标题
2. 提供详细的描述
3. 添加适当的标签
4. 设置优先级
5. 分配给相应的团队成员

## 故障排查

### 工作流未触发

**检查**:
1. PR是否针对 `main` 或 `staging` 分支
2. 仓库是否有正确的权限配置
3. GitHub Actions是否启用

### 无法移动到看板

**检查**:
1. 项目URL是否正确
2. `GITHUB_TOKEN` 是否有足够权限
3. 项目看板是否存在

### CI检查失败

**检查**:
1. 查看具体失败的步骤日志
2. 对于构建失败，检查是否是已知的React hooks问题
3. 对于linting失败，本地运行 `npm run lint` 修复

## 维护与更新

### 更新GitHub Actions版本

定期检查并更新使用的Actions版本：

```yaml
- uses: actions/checkout@v4          # 保持最新
- uses: actions/setup-node@v4        # 保持最新
- uses: actions/github-script@v7     # 保持最新
- uses: actions/add-to-project@v0.5.0  # 保持最新
```

### 监控工作流执行

1. 定期查看工作流运行历史
2. 关注失败率和执行时间
3. 根据反馈优化工作流

## 联系与支持

如有问题或建议，请：
1. 在仓库中创建Issue
2. 联系DevOps团队
3. 查看GitHub Actions文档：https://docs.github.com/en/actions
