# ✅ 模块注册与权限说明

本项目包含以下核心模块，每个模块具备独立数据库、权限结构与审计机制：

## 🔹 HR模块
- 数据库：yyc3_hr
- 权限角色：hr_admin（读写员工与绩效数据）
- 接口路径：/hr/employee, /hr/performance

## 🔹 审计模块
- 数据库：yyc3_audit
- 权限角色：audit_viewer（只读审计日志）
- 接口路径：/audit/logs, /audit/verify
- 安全机制：哈希链 + 不可抵赖记录

## 🔹 战略仪表板模块
- 数据库：yyc3_yy
- 权限角色：exec_user（访问战略指标）
- 接口路径：/dashboard/kpi, /dashboard/roi

## 🔹 奖惩系统模块
- 接口路径：/incentive/apply
- 权限角色：hr_admin
- 数据同步：Kafka → sync.hr

## 🔹 内部沟通模块
- 接口路径：/org/structure
- 权限角色：exec_user
- 数据来源：组织架构服务

所有模块均已注册于 `module.registration.ts`，并通过 GraphQL 网关统一访问。
