# 🚀 5分钟快速上手指南

欢迎使用启智商家后台管理系统！本指南将帮助您在5分钟内完成系统的基本配置和运行。

---

## 📋 前置要求

确保您的开发环境满足以下要求：

- ✅ Node.js 18+ 已安装
- ✅ npm/yarn/pnpm 包管理器
- ✅ MySQL 8.0+ 数据库（可选）
- ✅ Redis（可选，用于缓存）
- ✅ Git（用于克隆代码）

---

## 🎯 快速开始（3步）

### 步骤1: 克隆项目并安装依赖（1分钟）

\`\`\`bash
# 克隆项目
git clone https://github.com/your-org/ktv-admin-system.git
cd ktv-admin-system

# 安装依赖
npm install
# 或使用 yarn/pnpm
# yarn install
# pnpm install
\`\`\`

### 步骤2: 配置环境变量（2分钟）

\`\`\`bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 文件，配置必要的环境变量
# 最小化配置（使用Mock数据，无需数据库）
NEXT_PUBLIC_APP_NAME=启智KTV商家后台
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
\`\`\`

**可选配置**（如果需要真实数据库）：
\`\`\`env
DATABASE_URL=mysql://root:password@localhost:3306/ktv_admin
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=ktv_admin
\`\`\`

### 步骤3: 启动开发服务器（1分钟）

\`\`\`bash
# 启动开发服务器
npm run dev

# 等待编译完成，然后在浏览器中打开
# http://localhost:3000
\`\`\`

🎉 **恭喜！系统已启动成功！**

---

## 🔐 默认登录信息

访问 `http://localhost:3000` 后，使用以下账号登录：

- **手机号**: `13103790379`
- **密码**: `123456`

---

## 🎨 快速导航

登录后，您可以访问以下核心模块：

1. **📊 仪表盘** (`/dashboard`) - 系统总览与统计
2. **💰 销售管理** (`/dashboard/sales`) - 订单与账单管理
3. **📦 商品管理** (`/dashboard/products`) - 商品与套餐配置
4. **🏪 仓库管理** (`/dashboard/warehouse`) - 库存与采购管理
5. **📈 报表中心** (`/dashboard/reports`) - 各类业务报表
6. **👥 员工管理** (`/dashboard/employees`) - 员工信息与权限
7. **🤖 AI运营系统** (`/dashboard/ai-ops`) - 九大智能运营模块

---

## 🔧 开发模式功能

开发模式下系统提供以下便利功能：

### 1. Mock数据模式
默认使用Mock数据，无需配置数据库即可体验完整功能：
- 模拟真实业务数据
- 支持CRUD操作（数据仅保存在内存）
- 适合快速原型开发和演示

### 2. 热更新
修改代码后自动刷新浏览器，提升开发效率。

### 3. 详细错误提示
在开发模式下显示详细的错误堆栈和调试信息。

### 4. 开发工具
- React DevTools 支持
- Redux DevTools 支持（如使用Redux）
- 性能分析工具

---

## 📚 下一步学习

### 初级开发者
1. 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解系统架构
2. 查看 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) 学习组件开发
3. 浏览 [API_REFERENCE.md](./API_REFERENCE.md) 了解API使用

### 进阶开发者
1. 学习 [AI_OPS_OVERVIEW.md](./AI_OPS_OVERVIEW.md) 了解AI运营系统
2. 阅读 [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) 掌握状态管理
3. 查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 编写测试用例

### 运维人员
1. 阅读 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 了解部署流程
2. 查看 [MONITORING.md](./MONITORING.md) 配置监控系统
3. 学习 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 处理常见问题

---

## 🆘 常见问题

### Q: 启动失败，提示端口被占用？
**A**: 修改启动端口或关闭占用3000端口的进程
\`\`\`bash
# 方式1: 使用其他端口
PORT=3001 npm run dev

# 方式2: 查找并关闭占用进程
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
\`\`\`

### Q: 安装依赖失败？
**A**: 尝试以下方法：
\`\`\`bash
# 清除缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用镜像源
npm install --registry=https://registry.npmmirror.com
\`\`\`

### Q: 如何切换到真实数据库？
**A**: 参考 [README.env.md](./README.env.md) 配置数据库环境变量，然后运行：
\`\`\`bash
# 初始化数据库
npm run db:migrate

# 填充示例数据（可选）
npm run db:seed
\`\`\`

### Q: 如何启用热重载？
**A**: 开发模式默认启用。如果不生效，尝试：
\`\`\`bash
# 确保使用开发模式
NODE_ENV=development npm run dev
\`\`\`

更多问题请查看 [FAQ.md](./FAQ.md)

---

## 🎯 快速命令参考

\`\`\`bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 测试
npm run test             # 运行所有测试
npm run test:unit        # 单元测试
npm run test:e2e         # E2E测试

# 代码质量
npm run lint             # 代码检查
npm run format           # 代码格式化

# 数据库
npm run db:migrate       # 运行数据库迁移
npm run db:seed          # 填充示例数据

# 环境验证
npm run validate:env     # 验证环境变量配置
\`\`\`

---

## 🌟 推荐开发工具

### VSCode扩展
- ESLint - 代码检查
- Prettier - 代码格式化
- Tailwind CSS IntelliSense - Tailwind自动补全
- TypeScript Vue Plugin - TypeScript支持
- GitLens - Git增强工具

### Chrome扩展
- React Developer Tools - React调试
- Redux DevTools - Redux调试
- Lighthouse - 性能分析

---

## 📞 获取帮助

- 📖 完整文档: [docs/INDEX.md](./INDEX.md)
- 🐛 问题反馈: GitHub Issues
- 💬 技术交流: docs@yyc3.com
- 📱 技术支持: WeChat/QQ群

---

**祝您使用愉快！** 🎉

如有任何问题，请随时查阅文档或联系技术支持团队。

---

**最后更新**: 2025-01-18  
**适用版本**: v4.0  
**维护团队**: 启智网络科技有限公司
