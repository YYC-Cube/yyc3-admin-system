/\*\*

- @file 项目架构标准文档
- @description 定义 Easy Table Converter 项目的架构规范、代码组织和最佳实践
- @project Easy Table Converter
- @author YYC
- @version 1.0.0
- @created 2025-01-01
- @updated 2025-01-01
  \*/

# 📐 Easy Table Converter 项目架构标准

## 1. 架构概述

本项目采用现代 Next.js 全栈架构，使用 App Router 模式，结合 TypeScript、Tailwind CSS 和 Radix UI 构建高性能的表格转换工具。

### 1.1 核心技术栈

- **框架**：Next.js 14+（App Router）
- **语言**：TypeScript 5.0+
- **样式**：Tailwind CSS 3.3+
- **UI组件**：Radix UI + 自定义组件
- **构建工具**：pnpm
- **测试**：Vitest + Playwright

### 1.2 架构原则

- **模块化**：清晰的模块边界和职责分离
- **类型安全**：全面的 TypeScript 类型覆盖
- **性能优先**：服务端渲染、静态生成、优化缓存
- **可测试性**：单元测试、集成测试和端到端测试
- **可维护性**：标准化的代码组织和文档

## 2. 目录结构

```
/Users/my/Downloads/Easy Table Converter/
├── app/                 # Next.js App Router 路由
│   ├── api/             # API 路由
│   ├── convert/         # 转换功能页面
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── components/          # React 组件
│   ├── ui/              # 通用 UI 组件
│   └── *.tsx            # 业务组件
├── lib/                 # 核心库和工具
│   ├── api/             # API 相关逻辑
│   ├── convert/         # 转换引擎
│   ├── parsers/         # 格式解析器
│   ├── queue/           # 任务队列
│   └── utils.ts         # 通用工具函数
├── hooks/               # React Hooks
├── types/               # TypeScript 类型定义
├── config/              # 配置文件
├── docs/                # 项目文档
├── e2e/                 # 端到端测试
└── public/              # 静态资源
```

## 3. 模块职责

### 3.1 App Router 模块 (`app/`)

- **路由定义**：定义应用的所有页面路由和 API 路由
- **页面渲染**：负责服务端和客户端渲染逻辑
- **布局管理**：全局布局和嵌套布局的定义

### 3.2 组件模块 (`components/`)

- **UI组件库**：封装 Radix UI 和自定义 UI 组件
- **业务组件**：实现特定业务功能的组件
- **组件规范**：
  - 遵循原子设计原则
  - 支持响应式设计
  - 类型安全的 props 定义

### 3.3 核心库模块 (`lib/`)

- **转换引擎**：各种格式的转换核心逻辑
- **解析器**：不同格式的解析和生成器
- **工具函数**：通用的辅助函数
- **队列管理**：异步任务处理

### 3.4 Hooks 模块 (`hooks/`)

- **状态管理**：业务相关的状态逻辑
- **副作用处理**：API 调用、事件监听等
- **性能优化**：缓存、防抖、节流等

## 4. API 设计规范

### 4.1 API 路由结构

遵循 RESTful 设计原则，路由格式为：

```
app/api/[resource]/[operation]/route.ts
```

### 4.2 请求/响应格式

- **请求**：支持 JSON 和 multipart/form-data
- **响应**：统一的 JSON 结构，包含状态码和数据/错误信息
- **错误处理**：统一的错误格式和状态码

### 4.3 安全规范

- **输入验证**：使用 Zod 进行严格的输入验证
- **文件上传**：大小限制、类型白名单、内容检查
- **错误处理**：不暴露敏感信息的错误消息

## 5. 组件设计模式

### 5.1 组件接口规范

```typescript
interface ComponentProps {
  // 必填属性
  requiredProp: string;
  // 可选属性
  optionalProp?: number;
  // 回调函数
  onEvent: (data: EventData) => void;
}

/**
 * @description 组件描述
 * @param props - 组件属性
 */
export const Component: React.FC<ComponentProps> = (props) => {
  // 组件实现
};
```

### 5.2 组件最佳实践

- **单一职责**：每个组件只负责一个功能
- **可复用性**：设计通用的、可配置的组件
- **性能优化**：使用 React.memo、useMemo、useCallback 等优化渲染
- **可测试性**：组件逻辑与 UI 展示分离，便于测试

## 6. 数据管理

### 6.1 状态管理策略

- **本地状态**：使用 React useState、useReducer
- **共享状态**：使用 Context API
- **异步数据**：使用自定义 Hooks + SWR 或 React Query

### 6.2 数据验证

- 使用 Zod 进行数据模式验证
- 严格的类型定义和运行时检查

## 7. 性能优化

### 7.1 前端优化

- **代码分割**：动态导入和懒加载
- **图像优化**：使用 Next.js Image 组件
- **缓存策略**：合理使用浏览器缓存和 HTTP 缓存头

### 7.2 后端优化

- **数据库优化**：合理的索引和查询优化
- **缓存层**：Redis 缓存热点数据
- **限流保护**：防止恶意请求和资源滥用

## 8. 测试策略

### 8.1 测试分类

- **单元测试**：测试独立的函数和组件
- **集成测试**：测试模块间的交互
- **端到端测试**：测试完整的用户流程

### 8.2 测试覆盖要求

- 核心业务逻辑：100% 覆盖
- UI 组件：关键交互路径覆盖
- API 接口：所有端点的成功和失败场景

## 9. 部署架构

### 9.1 部署环境

- **开发环境**：本地开发服务器
- **测试环境**：CI/CD 流水线自动部署
- **生产环境**：容器化部署，支持水平扩展

### 9.2 监控和日志

- **应用监控**：性能指标、错误率、响应时间
- **系统监控**：CPU、内存、磁盘使用情况
- **日志管理**：结构化日志、集中式日志存储

## 10. 代码规范

### 10.1 命名规范

- **文件命名**：PascalCase 用于组件，camelCase 用于工具文件
- **函数命名**：camelCase，清晰表达功能
- **变量命名**：camelCase，描述性名称

### 10.2 注释规范

- **文件头注释**：包含文件描述、作者、版本等信息
- **函数注释**：描述函数功能、参数、返回值
- **代码注释**：复杂逻辑和关键决策点的说明

### 10.3 代码风格

- 遵循 ESLint 和 Prettier 规范
- 使用 TypeScript 严格模式
- 保持代码简洁和可读性

---

保持架构一致性和代码质量是项目长期健康发展的关键。请所有团队成员严格遵循本规范。 🌹
