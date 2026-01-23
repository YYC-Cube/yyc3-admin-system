#!/usr/bin/env python3
import os
import re
from pathlib import Path

# 找到所有 tsx 文件
tsx_files = []
for root, dirs, files in os.walk('/Users/yanyu/yyc3-admin-system-1'):
    # 跳过 node_modules 和 .next
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx'):
            tsx_files.append(os.path.join(root, file))

# 修复函数
def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否有 "use client"
    if '"use client"' not in content:
        return False

    # 检查是否已有 import * as React
    if 'import * as React from "react"' in content:
        return False

    # 验证这个文件是否使用了 JSX（简单检查）
    if '<' not in content or '>' not in content:
        return False

    # 检查是否有 import type React
    if 'import type React from "react"' in content:
        # 替换类型导入为命名空间导入
        new_content = content.replace(
            'import type React from "react"',
            'import * as React from "react"'
        )
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True

    # 查找 "use client" 并在其后插入 React 导入
    lines = content.split('\n')
    if lines[0] == '"use client"':
        # 查找第一个非空行
        insert_pos = 1
        while insert_pos < len(lines) and lines[insert_pos].strip() == '':
            insert_pos += 1

        # 检查是否已经有 React 导入
        for i in range(insert_pos, min(insert_pos + 5, len(lines))):
            if 'import' in lines[i] and 'React' in lines[i]:
                return False

        # 在第一个 import 之前插入
        lines.insert(insert_pos, 'import * as React from "react"')
        new_content = '\n'.join(lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True

    return False

# 执行修复
fixed_count = 0
for filepath in tsx_files:
    try:
        if fix_file(filepath):
            print(f"✓ Fixed: {filepath}")
            fixed_count += 1
    except Exception as e:
        print(f"✗ Error in {filepath}: {e}")

print(f"\n总共修复了 {fixed_count} 个文件")
