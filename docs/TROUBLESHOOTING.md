# 故障排除指南

## 导入错误问题

### 问题描述
如果您遇到以下错误：
- `config/env.validator` 缺少 `validateEnv` 导出
- `env.sync` 缺少 `env` 导出

### 原因
这通常是由于 TypeScript 或 Next.js 的构建缓存导致的。即使文件中有正确的导出，缓存的类型信息可能已过期。

### 解决方案

#### 方法 1：快速清理（推荐）
\`\`\`bash
npm run clean
npm run dev
\`\`\`

#### 方法 2：完全清理
\`\`\`bash
npm run clean:all
npm run dev
\`\`\`

#### 方法 3：手动清理
\`\`\`bash
# 删除 Next.js 缓存
rm -rf .next

# 删除 TypeScript 缓存
rm -rf tsconfig.tsbuildinfo

# 删除 Node 模块缓存
rm -rf node_modules/.cache

# 重新启动开发服务器
npm run dev
\`\`\`

#### 方法 4：使用清理脚本
\`\`\`bash
chmod +x scripts/fix-imports.sh
./scripts/fix-imports.sh
npm run dev
\`\`\`

### 验证修复
运行以下命令验证导出是否正确：
\`\`\`bash
npm run validate:env
\`\`\`

### 如果问题仍然存在

1. **检查文件路径**：确保以下文件存在且有正确的导出
   - `config/env.validator.ts` - 应该有 `export function validateEnv()`
   - `env.sync.ts` - 应该有 `export const env = {...}`
   - `configs/env.sync.ts` - 应该有 `export const env = {...}` 和 `export default env`

2. **检查 tsconfig.json**：确保路径别名配置正确
   \`\`\`json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   \`\`\`

3. **重启 IDE**：有时 IDE 的 TypeScript 服务器也需要重启
   - VS Code: 按 `Cmd/Ctrl + Shift + P`，输入 "TypeScript: Restart TS Server"

4. **检查 Node 版本**：确保使用 Node.js 18+
   \`\`\`bash
   node --version
   \`\`\`

## 其他常见问题

### 环境变量未加载
如果环境变量未正确加载，请检查：
1. `.env.local` 文件是否存在
2. 环境变量名称是否正确
3. 重启开发服务器

### 数据库连接失败
1. 检查数据库配置是否正确
2. 确保数据库服务正在运行
3. 验证数据库凭据

### 端口已被占用
\`\`\`bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>
\`\`\`

## 获取帮助

如果以上方法都无法解决问题，请：
1. 查看完整的错误日志
2. 检查 GitHub Issues
3. 联系技术支持：admin@0379.email
