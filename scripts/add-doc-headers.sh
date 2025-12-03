#!/bin/bash

/**
 * @fileoverview 批量为文档添加 YYC³ 标准头部
 * @description 扫描 docs/ 目录下的 Markdown 文件，为未添加 YYC³ 标识的文档
 *              添加统一的标准头部信息
 * @module yyc3-admin-system/scripts/add-doc-headers
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

# YYC³ 文档标准头部模板
read -r -d '' HEADER_TEMPLATE << 'EOF'
> **YYC³（YanYu Cloud Cube)**
> **标语**: 万象归元于云枢 | 深栈智启新纪元
> ***英文***: *All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era*

---

**项目**: yyc3-admin-system (KTV商家管理系统)
**文档类型**: {DOC_TYPE}
**创建日期**: {CREATED_DATE}
**更新日期**: $(date +%Y-%m-%d)
**作者**: YYC³团队

---
EOF

echo "🚀 开始为文档添加 YYC³ 标准头部..."
echo ""

# 统计信息
total=0
updated=0
skipped=0

# 遍历所有 Markdown 文件
find docs -name "*.md" -type f | while read -r file; do
  total=$((total + 1))

  # 检查文件是否已有 YYC³ 标识
  if grep -q "YYC³" "$file"; then
    echo "⏭️  跳过（已有标识）: $file"
    skipped=$((skipped + 1))
    continue
  fi

  # 读取原文件内容
  content=$(<"$file")

  # 提取第一行标题
  title=$(head -n 1 "$file" | sed 's/^# //')

  # 判断文档类型
  doc_type="技术文档"
  if [[ "$file" == *"REPORT"* ]]; then
    doc_type="技术报告"
  elif [[ "$file" == *"GUIDE"* ]]; then
    doc_type="使用指南"
  elif [[ "$file" == *"IMPLEMENTATION"* ]]; then
    doc_type="实现文档"
  elif [[ "$file" == *"TEST"* ]]; then
    doc_type="测试文档"
  fi

  # 提取创建日期（如果有）
  created_date=$(grep -m 1 "创建日期" "$file" | sed -n 's/.*创建日期.*: \([0-9-]*\).*/\1/p')
  if [ -z "$created_date" ]; then
    created_date="2025-01-19"
  fi

  # 生成新的头部
  new_header=$(echo "$HEADER_TEMPLATE" | sed "s/{DOC_TYPE}/$doc_type/" | sed "s/{CREATED_DATE}/$created_date/")

  # 在第一个标题后插入头部
  # 先备份原文件
  cp "$file" "$file.backup"

  # 提取第一行标题
  first_line=$(head -n 1 "$file")

  # 移除第一行，获取剩余内容
  rest_content=$(tail -n +2 "$file")

  # 重新组合：标题 + 新头部 + 空行 + 剩余内容
  {
    echo "$first_line"
    echo ""
    echo "$new_header"
    echo ""
    echo "$rest_content"
  } > "$file"

  echo "✅ 已更新: $file"
  updated=$((updated + 1))
done

echo ""
echo "📊 统计信息:"
echo "  - 总文件数: $total"
echo "  - 已更新: $updated"
echo "  - 已跳过: $skipped"
echo ""
echo "✅ 批量更新完成！"
echo ""
echo "💡 提示: 原文件已备份为 *.backup，请检查更新结果"
echo "   如需还原，运行: find docs -name '*.backup' -exec sh -c 'mv \"$1\" \"${1%.backup}\"' _ {} \\;"
