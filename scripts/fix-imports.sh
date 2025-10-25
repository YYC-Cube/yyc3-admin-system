#!/bin/bash

# 修复导入错误的脚本
# 清理所有构建缓存并重新构建项目

echo "🧹 清理 Next.js 缓存..."
rm -rf .next

echo "🧹 清理 TypeScript 缓存..."
rm -rf tsconfig.tsbuildinfo

echo "🧹 清理 Node 模块缓存..."
rm -rf node_modules/.cache

echo "🔄 重新安装依赖（可选）..."
# npm install

echo "✅ 缓存清理完成！"
echo ""
echo "现在请运行以下命令之一："
echo "  npm run dev    # 启动开发服务器"
echo "  npm run build  # 构建生产版本"
