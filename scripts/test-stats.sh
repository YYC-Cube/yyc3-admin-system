#!/bin/bash

# 测试文件统计脚本
# 用于统计项目中所有测试文件的信息

echo "========================================"
echo "  YYC3-KTV 测试体系统计报告"
echo "========================================"
echo ""

# 统计单元测试
echo "📊 单元测试统计:"
unit_test_count=$(find __tests__/unit -name "*.test.ts" -type f | wc -l | tr -d ' ')
echo "  文件数: $unit_test_count"
unit_test_lines=$(find __tests__/unit -name "*.test.ts" -type f -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "  总行数: $unit_test_lines"
echo ""

# 统计集成测试
echo "📊 集成测试统计:"
integration_test_count=$(find __tests__/integration -name "*.test.ts" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "  文件数: $integration_test_count"
integration_test_lines=$(find __tests__/integration -name "*.test.ts" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
echo "  总行数: ${integration_test_lines:-0}"
echo ""

# 统计E2E测试
echo "📊 E2E测试统计:"
e2e_test_count=$(find e2e -name "*.spec.ts" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "  文件数: $e2e_test_count"
e2e_test_lines=$(find e2e -name "*.spec.ts" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
echo "  总行数: ${e2e_test_lines:-0}"
echo ""

# 统计性能测试
echo "📊 性能测试统计:"
perf_test_count=$(find performance -name "*.js" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "  文件数: $perf_test_count"
perf_test_lines=$(find performance -name "*.js" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
echo "  总行数: ${perf_test_lines:-0}"
echo ""

# 总计
echo "========================================"
echo "📈 总计:"
total_files=$((unit_test_count + integration_test_count + e2e_test_count + perf_test_count))
total_lines=$((unit_test_lines + ${integration_test_lines:-0} + ${e2e_test_lines:-0} + ${perf_test_lines:-0}))
echo "  总文件数: $total_files"
echo "  总代码行数: $total_lines"
echo "========================================"
echo ""

# 文档统计
echo "📚 文档统计:"
doc_count=$(find docs -name "*COMPLETION_REPORT.md" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "  完成报告数: $doc_count"
readme_count=$(find . -name "README.md" -type f | wc -l | tr -d ' ')
echo "  README文件数: $readme_count"
echo ""

echo "✅ 测试体系建设完成!"
echo ""
