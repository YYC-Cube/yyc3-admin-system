# LOGIN_OVERVIEW.md

## 登录入口总览

本文件汇总启智商家后台管理系统（ktv-admin-system）与 YYC³ 启智管理系统（yyc3-frontend）中的所有登录入口、组件路径、权限逻辑与联动机制，确保系统具备完整的身份识别、权限链加载与审计能力。

---

## 1. 登录页面路径

| 系统 | 页面路径 | 说明 |
|------|-----------|------|
| ktv-admin-system | `app/page.tsx` | 主后台登录页，支持手机号登录 |
| yyc3-frontend | `app/page.tsx` | 启智管理系统登录页，支持扫码与多角色登录 |

---

## 2. 登录组件路径

| 系统 | 组件文件 | 功能说明 |
|------|-----------|----------|
| ktv-admin-system | `components/auth/login-form.tsx` | 登录表单组件，含手机号/密码输入 |
| yyc3-frontend | `components/login/entry-panel.tsx` | 登录入口面板，支持扫码、手机号、角色切换 |
| yyc3-frontend | `components/login/scan-login.tsx` | 二维码扫码登录组件 |
| yyc3-frontend | `components/login/role-switch.tsx` | 员工/管理员角色切换组件 |

---

## 3. 登录权限逻辑

- 所有登录请求通过 `api/auth/login.ts` 或 `api/auth/scan.ts` 接入统一认证服务
- 登录成功后写入 token / cookie，持久化身份状态
- 使用 `auth.guard.ts` 或 `middleware.ts` 控制页面访问权限
- 登录状态支持多端同步（Web + Mobile）

---

## 4. 登录相关环境变量

```env
NEXT_PUBLIC_AUTH_API_URL=https://api.yyc3.com/auth
LOGIN_REDIRECT_PATH=/dashboard
ENABLE_SCAN_LOGIN=true

5. 登录审计与安全机制
登录行为记录至 audit-log.ts，包含时间戳、IP、设备信息

登录失败触发安全评分机制（security.score.ts）

多次失败登录触发风控策略（如验证码、锁定）

6. 登录流程文档
登录流程图与状态流转详见：docs/AUTH_FLOW.md

扫码登录协议详见：docs/SCAN_LOGIN_PROTOCOL.md

备注
请确保所有登录入口均已接入权限链与审计机制，并在系统结构图中标注其归属与联动模块。


---

## ✅ `README.frontend.md`（yyc3-frontend 专属说明）

```md
# yyc3-frontend

YYC³ 启智管理系统 · 门店经营房态收款系统

---

## 项目定位

本项目为 YYC³ 启智管理系统的前端子系统，专注于门店运营、房态管理、收款流程与权限链联动。它是整个启智平台的运营中枢，承载模块导航、权限入口、远程插件加载与审计评分等核心能力。

---

## 功能范围

- 门店房态管理（房间状态、预定、开房、结账）
- 收款流程（账单生成、支付方式、打印配置）
- 权限链联动（员工权限、角色识别、审计评分）
- 模块导航与入口（加载 M7.1–M7.9 模块）
- 登录与身份识别（支持扫码、手机号、角色切换）
- 多端适配（桌面端 + 移动端）

---

## 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 登录页 | `app/page.tsx` | 登录入口，支持扫码与多角色 |
| 主视图 | `app/dashboard/index.tsx` | 模块导航与运营总览 |
| 房态页 | `app/dashboard/rooms/page.tsx` | 房间状态与开房操作 |
| 收款页 | `app/dashboard/billing/page.tsx` | 账单生成与支付流程 |

---

## 技术栈

- Next.js 15 + React 19 + Tailwind CSS v4
- Zustand 状态管理
- Framer Motion 动画
- shadcn/ui + Radix UI 组件库
- ECharts 图表 + React Hook Form 表单
- 插件加载机制：`plugin-system.ts`
- 权限控制：`auth.guard.ts` + `middleware.ts`
- 审计机制：`security.audit.chain.ts` + `audit-log.ts`

---

## 模块加载

通过 `plugin-system.ts` 加载以下模块：

- M7.1 盈亏计算器
- M7.2 客户营销系统
- M7.3 回访邀约系统
- M7.4 运维执行跟踪系统
- M7.5 沟通反馈体系
- M7.6 内部沟通体系
- M7.7 人力资源管理
- M7.8 战略决策支持
- M7.9 合规与审计自动化

---

## 登录入口说明

详见：`docs/LOGIN_OVERVIEW.md`

---

## 项目状态

- ✅ 已完成模块加载与权限链接入
- ✅ 已接入审计评分与远程插件机制
- ✅ 已完成登录流程与扫码登录适配
- ✅ 已通过系统健康检查与 v0 提交准备

---

© 2025 启智网络科技有限公司
