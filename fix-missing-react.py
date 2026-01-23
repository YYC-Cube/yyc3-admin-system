#!/usr/bin/env python3
"""修复缺少 React 导入的文件"""

import os
import re
from pathlib import Path

problem_files = [
    "components/ui/aspect-ratio.tsx",
    "components/ui/input-group.tsx",
    "components/ui/toaster.tsx",
    "components/ui/field.tsx",
    "components/ui/sonner.tsx",
    "components/ui/collapsible.tsx",
    "components/products/product-filters.tsx",
    "components/products/product-list-table.tsx",
    "app/mobile/page.tsx",
    "app/api-docs/page.tsx"
]

def fix_file(filepath):
    """修复单个文件的 React 导入"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已经有 React 导入
    if re.search(r'^import .* from ["\']react["\']', content, re.MULTILINE):
        print(f"  跳过 {filepath} (已有 React 导入)")
        return False

    # 找到 "use client" 的位置
    use_client_match = re.search(r'^(["\'])use client\1\s*$', content, re.MULTILINE)
    if not use_client_match:
        print(f"  跳过 {filepath} (没有 use client)")
        return False

    # 在 "use client" 后面插入 React 导入
    insert_pos = use_client_match.end()
    new_content = (
        content[:insert_pos] +
        '\n\nimport * as React from "react"' +
        content[insert_pos:]
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True

def main():
    fixed_count = 0

    for filepath in problem_files:
        if os.path.exists(filepath):
            if fix_file(filepath):
                print(f"✅ 修复: {filepath}")
                fixed_count += 1
        else:
            print(f"⚠️  文件不存在: {filepath}")

    print(f"\n总共修复了 {fixed_count} 个文件")

if __name__ == '__main__':
    main()
