#!/usr/bin/env python3
"""验证所有 React 导入是否正确"""

import os
import re
from pathlib import Path

def check_file(filepath):
    """检查单个文件的 React 导入"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    has_use_client = '"use client"' in content or "'use client'" in content
    has_jsx = bool(re.search(r'<[A-Z][a-zA-Z0-9]*', content))
    has_type_react = re.search(r'^import type React from ["\']react["\']', content, re.MULTILINE)
    has_namespace_react = re.search(r'^import \* as React from ["\']react["\']', content, re.MULTILINE)

    return {
        'filepath': filepath,
        'has_use_client': has_use_client,
        'has_jsx': has_jsx,
        'has_type_react': bool(has_type_react),
        'has_namespace_react': bool(has_namespace_react)
    }

def main():
    root_dir = Path('.')
    problem_files = []

    # 扫描所有 .tsx 和 .ts 文件
    for pattern in ['**/*.tsx', '**/*.ts']:
        for filepath in root_dir.glob(pattern):
            # 跳过 node_modules 和 .next
            if 'node_modules' in str(filepath) or '.next' in str(filepath):
                continue

            # 只检查 app/ 和 components/ 下的文件
            if not (str(filepath).startswith('app/') or str(filepath).startswith('components/')):
                continue

            result = check_file(filepath)

            # 如果文件有 "use client" 且有 JSX,但使用了 type React 导入
            if result['has_use_client'] and result['has_jsx'] and result['has_type_react']:
                problem_files.append(result)

            # 如果文件有 "use client" 且有 JSX,但既没有 type 也没有 namespace 导入
            elif result['has_use_client'] and result['has_jsx'] and not result['has_type_react'] and not result['has_namespace_react']:
                problem_files.append({**result, 'missing_import': True})

    if problem_files:
        print(f"\n发现 {len(problem_files)} 个问题文件:\n")
        for file in problem_files:
            print(f"  {file['filepath']}")
            if file.get('missing_import'):
                print(f"    ❌ 缺少 React 命名空间导入")
            elif file['has_type_react']:
                print(f"    ❌ 使用了 type React 导入(应该使用 * as React)")
    else:
        print("\n✅ 所有文件的 React 导入都正确!")

    return len(problem_files)

if __name__ == '__main__':
    exit(main())
