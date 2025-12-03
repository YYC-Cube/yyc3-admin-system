# ❓ 常见问题解答 (FAQ)

本文档收录了使用启智商家后台管理系统过程中的常见问题及解决方案。

---

## 📑 目录

- [安装与配置](#安装与配置)
- [开发相关](#开发相关)
- [部署相关](#部署相关)
- [功能使用](#功能使用)
- [性能优化](#性能优化)
- [安全相关](#安全相关)
- [故障排查](#故障排查)

---

## 安装与配置

### Q1: 系统运行需要什么环境？

**A**: 基本环境要求：
- Node.js 18.0 或更高版本
- npm 8.0+ 或 yarn 1.22+ 或 pnpm 7.0+
- MySQL 8.0+（可选，开发环境可使用Mock数据）
- Redis（可选，用于缓存）

推荐配置：
- CPU: 4核心以上
- 内存: 8GB以上
- 硬盘: 50GB以上可用空间

### Q2: 如何安装依赖？

**A**: 执行以下命令：
\`\`\`bash
npm install
# 或
yarn install
# 或
pnpm install
\`\`\`

如果安装过程中遇到网络问题，可以使用国内镜像：
\`\`\`bash
npm install --registry=https://registry.npmmirror.com
\`\`\`

### Q3: .env.local文件怎么配置？

**A**: 复制 `.env.example` 为 `.env.local`，然后根据需要修改：

最小化配置（使用Mock数据）：
\`\`\`env
NEXT_PUBLIC_APP_NAME=启智KTV商家后台
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
\`\`\`

完整配置（使用真实数据库）请参考 [README.env.md](./README.env.md)

### Q4: 如何验证环境变量配置是否正确？

**A**: 运行环境变量验证命令：
\`\`\`bash
npm run validate:env
\`\`\`

---

## 开发相关

### Q5: 如何启动开发服务器？

**A**: 运行以下命令：
\`\`\`bash
npm run dev
\`\`\`

然后访问 `http://localhost:3000`

### Q6: 热更新不生效怎么办？

**A**: 尝试以下方法：
1. 确保使用开发模式：`NODE_ENV=development npm run dev`
2. 清除 `.next` 缓存目录：`rm -rf .next`
3. 重启开发服务器
4. 检查文件保存是否成功

### Q7: 如何添加新的页面？

**A**: 在 `app/` 目录下创建新的文件夹和 `page.tsx` 文件：
\`\`\`typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>新页面</div>
}
\`\`\`

### Q8: 如何创建新的API接口？

**A**: 在 `app/api/` 目录下创建新的路由文件：
\`\`\`typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}
\`\`\`

### Q9: 如何使用shadcn/ui组件？

**A**: 直接导入使用：
\`\`\`typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MyComponent() {
  return (
    <Card>
      <Button>点击</Button>
    </Card>
  )
}
\`\`\`

### Q10: 如何添加动画效果？

**A**: 使用Framer Motion：
\`\`\`typescript
import { motion } from 'framer-motion'

export default function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      内容
    </motion.div>
  )
}
\`\`\`

---

## 部署相关

### Q11: 如何构建生产版本？

**A**: 运行构建命令：
\`\`\`bash
npm run build
npm run start
\`\`\`

### Q12: 推荐的部署平台是什么？

**A**: 推荐使用 Vercel：
1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 点击部署

也支持部署到其他平台（Docker、AWS、Azure等）。

### Q13: 如何配置生产环境的数据库？

**A**: 在部署平台配置环境变量：
\`\`\`env
DATABASE_URL=mysql://user:password@host:port/database
DATABASE_HOST=your-db-host
DATABASE_PORT=3306
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name
\`\`\`

### Q14: 部署后访问慢怎么办？

**A**: 检查以下几点：
1. 是否启用了CDN
2. 图片是否优化
3. 是否使用了代码分割
4. 数据库是否在同一区域
5. 是否配置了缓存策略

---

## 功能使用

### Q15: 默认登录账号是什么？

**A**: 
- 手机号: `13103790379`
- 密码: `123456`

### Q16: 如何添加新用户？

**A**: 
1. 登录系统
2. 进入"员工管理"模块
3. 点击"添加员工"
4. 填写员工信息并保存

### Q17: 如何设置员工权限？

**A**:
1. 进入"员工管理"
2. 点击员工的"权限配置"
3. 选择对应的角色和权限
4. 保存配置

### Q18: 报表数据如何导出？

**A**:
1. 进入对应的报表页面
2. 设置筛选条件
3. 点击"导出"按钮
4. 选择导出格式（Excel/PDF）

### Q19: 如何使用AI运营系统？

**A**:
1. 进入"AI运营系统"模块
2. 选择需要使用的子系统（M7.1 - M7.9）
3. 根据界面提示操作
4. 查看AI生成的分析和建议

详细使用说明请参考 [AI_OPS_OVERVIEW.md](./AI_OPS_OVERVIEW.md)

### Q20: 如何查看审计日志？

**A**:
1. 进入"合规与审计"模块
2. 选择时间范围
3. 设置筛选条件
4. 查看操作记录和审计报告

---

## 性能优化

### Q21: 系统运行慢怎么办？

**A**: 按以下步骤排查：
1. 检查网络连接
2. 清理浏览器缓存
3. 检查数据库性能
4. 查看服务器资源使用情况
5. 启用缓存机制

### Q22: 如何优化首屏加载速度？

**A**:
1. 使用代码分割（Code Splitting）
2. 启用懒加载（Lazy Loading）
3. 优化图片（使用WebP格式）
4. 使用CDN加速
5. 启用边缘缓存

### Q23: 大量数据加载慢怎么办？

**A**:
1. 使用分页加载
2. 实现虚拟滚动
3. 添加搜索和筛选功能
4. 使用数据缓存
5. 考虑使用服务端渲染

---

## 安全相关

### Q24: 如何保证系统安全？

**A**: 系统内置多重安全机制：
1. JWT Token认证
2. HTTPS加密传输
3. SQL注入防护
4. XSS攻击防护
5. CSRF防护
6. 操作审计日志
7. 区块链存证

### Q25: 忘记密码怎么办？

**A**: 
1. 联系系统管理员重置密码
2. 或使用"忘记密码"功能（如已配置）
3. 临时方案：管理员可在数据库中直接修改密码

### Q26: 如何设置密码复杂度要求？

**A**: 在系统设置中配置：
1. 进入"系统设置" > "安全配置"
2. 设置密码最小长度
3. 设置密码复杂度要求
4. 设置密码过期时间

### Q27: 如何防止暴力破解？

**A**: 系统内置防护机制：
1. 登录失败次数限制
2. 账号临时锁定
3. 验证码验证
4. IP黑名单
5. 异常行为检测

---

## 故障排查

### Q28: 启动失败，提示端口被占用？

**A**: 
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

### Q29: 数据库连接失败？

**A**: 检查以下几点：
1. 数据库服务是否启动
2. 数据库连接配置是否正确
3. 数据库用户权限是否足够
4. 防火墙是否允许连接
5. 网络是否畅通

### Q30: API请求失败？

**A**: 排查步骤：
1. 检查网络连接
2. 查看浏览器控制台错误信息
3. 检查API地址是否正确
4. 验证Token是否有效
5. 查看服务器日志

### Q31: 页面显示404错误？

**A**:
1. 检查URL是否正确
2. 确认页面文件是否存在
3. 检查路由配置
4. 清除浏览器缓存
5. 重启开发服务器

### Q32: 样式显示异常？

**A**:
1. 清除浏览器缓存
2. 检查Tailwind配置
3. 确认CSS文件是否正确导入
4. 检查浏览器兼容性
5. 查看控制台CSS错误

### Q33: 图片无法显示？

**A**:
1. 检查图片路径是否正确
2. 确认图片文件是否存在
3. 检查图片格式是否支持
4. 查看网络请求是否成功
5. 验证CDN配置

### Q34: WebSocket连接失败？

**A**:
1. 检查WebSocket服务是否启动
2. 验证连接地址是否正确
3. 检查防火墙设置
4. 确认协议是否匹配（ws/wss）
5. 查看代理配置

### Q35: 内存占用过高？

**A**:
1. 检查是否有内存泄漏
2. 优化大数据加载
3. 使用虚拟滚动
4. 清理无用的事件监听
5. 重启服务释放内存

---

## 其他问题

### Q36: 如何获取技术支持？

**A**: 多种方式获取帮助：
1. 查阅完整文档：[docs/INDEX.md](./INDEX.md)
2. 提交GitHub Issue
3. 发送邮件：support@yyc3.com
4. 加入技术交流群
5. 查看故障排查指南：[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Q37: 如何贡献代码？

**A**: 欢迎贡献！请参考：
1. 阅读贡献指南：[CONTRIBUTING.md](./CONTRIBUTING.md)
2. Fork项目仓库
3. 创建功能分支
4. 提交Pull Request
5. 等待代码审查

### Q38: 系统支持哪些浏览器？

**A**: 支持主流浏览器：
- Chrome（推荐）
- Firefox
- Safari
- Edge

不支持IE浏览器。

### Q39: 移动端如何访问？

**A**: 支持多种方式：
1. 浏览器访问（自适应）
2. 下载移动端APP
3. 使用PWA（添加到主屏幕）
4. 扫码登录

详见：[MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md)

### Q40: 是否支持多语言？

**A**: 
当前版本仅支持中文。
多语言支持在v5.0版本计划中，将支持：
- 中文（简体/繁体）
- 英文
- 日文
- 韩文

---

## 🔍 找不到答案？

如果以上FAQ没有解决您的问题，请：

1. 📚 查阅完整文档：[docs/INDEX.md](./INDEX.md)
2. 🔧 查看故障排查指南：[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. 💬 提交Issue：GitHub Issues
4. 📧 联系支持：support@yyc3.com

---

**最后更新**: 2025-01-18  
**文档版本**: v4.0  
**维护团队**: 启智网络科技有限公司

© 2025 All Rights Reserved
