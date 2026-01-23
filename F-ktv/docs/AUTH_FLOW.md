当然可以，Yu 🌹。以下是你请求的两份文档，分别用于登录流程说明与移动端发布说明：

---

## ✅ `docs/AUTH_FLOW.md` 登录流程图文说明

```md
# AUTH_FLOW.md

## 登录流程说明（启智商家后台管理系统 + YYC³ 启智管理）

本文件描述系统的完整登录流程，包括页面入口、身份验证、权限链加载、审计机制与登录状态持久化，适用于 Web 与移动端。

---

## 1. 登录入口

| 系统 | 页面路径 | 登录方式 |
|------|-----------|-----------|
| ktv-admin-system | `app/page.tsx` | 手机号 + 密码登录 |
| yyc3-frontend | `app/page.tsx` | 扫码登录 / 手机号登录 / 角色切换 |

---

## 2. 登录流程图

```plaintext
[用户访问登录页]
       ↓
[输入手机号/扫码 → 提交登录请求]
       ↓
[API验证身份 → /api/auth/login 或 /api/auth/scan]
       ↓
[返回 token / session → 写入 cookie / localStorage]
       ↓
[加载用户角色 → admin / staff / auditor]
       ↓
[加载权限链 → auth.guard.ts / middleware.ts]
       ↓
[记录审计日志 → audit-log.ts]
       ↓
[重定向至主视图 → /dashboard 或 /manager]
```

---

## 3. 权限链加载机制

- 登录成功后，系统根据角色加载权限链：
  - `auth.guard.ts` 控制页面访问
  - `security.audit.chain.ts` 记录权限路径
  - `security.score.ts` 计算安全评分

---

## 4. 登录状态持久化

- 使用 cookie + localStorage 存储 token
- 支持多端同步（Web + Mobile）
- 登录状态在刷新后自动恢复

---

## 5. 登录失败处理

- 登录失败记录至 `audit-log.ts`
- 超过阈值触发验证码或锁定机制
- 登录失败评分纳入 `security.score.ts`

---

## 6. 登录相关环境变量

```env
NEXT_PUBLIC_AUTH_API_URL=https://api.yyc3.com/auth
LOGIN_REDIRECT_PATH=/dashboard
ENABLE_SCAN_LOGIN=true
```

---

## 7. 登录组件路径

| 文件 | 功能 |
|------|------|
| `components/login/entry-panel.tsx` | 登录入口面板 |
| `components/login/scan-login.tsx` | 扫码登录组件 |
| `components/login/role-switch.tsx` | 角色切换组件 |
| `components/auth/login-form.tsx` | 手机号登录表单 |

---

## 8. 审计与安全机制

- 登录行为记录至 `audit-log.ts`
- 登录评分纳入 `security.score.ts`
- 登录路径纳入权限链审计

---

## 备注

请确保所有登录入口已接入权限链与审计机制，并在系统结构图中标注其归属与联动模块。
```

---

## ✅ `docs/MOBILE_DEPLOYMENT.md` 移动端发布说明

```md
# MOBILE_DEPLOYMENT.md

## 移动端发布说明（YYC³ 启智管理 · 门店经营 App）

本文件说明移动端 App 的构建、配置、打包、发布与使用流程，适用于门店员工、收银员与管理者。

---

## 1. 项目定位

- 项目目录：`mobile-app/`
- 系统名称：YYC³ 启智管理 · 移动端
- 功能范围：
  - 登录与扫码识别
  - 房态查看与开房操作
  - 收款与账单生成
  - 员工权限识别与审计评分
  - 多门店切换与数据同步

---

## 2. 技术栈

- React Native + Expo
- Zustand 状态管理
- Tailwind CSS（via NativeWind）
- Axios + unified-client.tsx
- React Navigation
- ECharts for React Native
- SQLite（本地缓存）

---

## 3. 页面结构

| 页面 | 路径 | 功能 |
|------|------|------|
| 登录页 | `screens/LoginScreen.tsx` | 手机号 / 扫码登录 |
| 房态页 | `screens/RoomStatus.tsx` | 房间状态与开房操作 |
| 收款页 | `screens/Billing.tsx` | 账单生成与支付流程 |
| 审计页 | `screens/Audit.tsx` | 操作记录与评分展示 |

---

## 4. 环境变量配置

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yyc3.com
ENABLE_SCAN_LOGIN=true
MOBILE_APP_VERSION=1.0.0
```

---

## 5. 构建与打包

```bash
# 安装依赖
npm install

# 启动开发
npm run start

# 构建 Android APK
eas build --platform android

# 构建 iOS IPA
eas build --platform ios
```

---

## 6. 发布方式

- Android：上传至 Google Play 或提供 APK 下载链接
- iOS：上传至 TestFlight 或 App Store
- PWA：支持浏览器访问，自动适配移动端

---

## 7. 登录与权限机制

- 登录页接入 `/api/auth/login` 与 `/api/auth/scan`
- 登录成功后写入 token，加载角色与权限链
- 所有操作记录至 `audit-log.ts`

---

## 8. 使用指南

- 安装 App 后，首次登录需扫码或输入手机号
- 登录后进入房态页，可查看房间状态并执行开房
- 收款页支持账单生成、支付方式选择与打印配置
- 审计页展示员工操作记录与评分

---

## 备注

请确保移动端已接入权限链、审计机制与远程插件加载，并在系统结构图中标注其归属与联动模块。
```

---

这两份文档将帮助v0审核系统：

- 全面理解登录流程与权限链加载机制  
- 明确移动端的构建方式、功能范围与发布路径  
- 支持多端联动、审计评分与模块归属标注
