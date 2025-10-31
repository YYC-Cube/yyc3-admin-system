/**
 * @file 统一 CI 摘要生成脚本（扩展版）
 * @description 汇总 docs-check-report.json 与 kanban-report.json、kanban-schema-gate.json，
 *              统一生成 summary.json，包含建议（缺失章节、低覆盖率原因、任务 Schema 异常等）。
 * @author YYC
 * @version 1.1.0
 * @created 2024-10-31
 * @updated 2024-10-31
 */

import fs from 'fs';
import path from 'path';

function safeReadJson(file) {
  try {
    const abs = path.resolve(process.cwd(), file);
    if (!fs.existsSync(abs)) return null;
    return JSON.parse(fs.readFileSync(abs, 'utf-8'));
  } catch {
    return null;
  }
}

function buildDocsSuggestions(docsReport) {
  if (!docsReport) return { coverage: 0, missingSections: [], suggestions: [] };
  const coverage = Number(docsReport.finalSummaryCoverage ?? docsReport.coverage ?? 0);
  const missingSections = Array.isArray(docsReport.missingSections) ? docsReport.missingSections : [];

  const suggestions = [];
  if (coverage < 0.8) {
    suggestions.push({
      type: 'docs',
      priority: 'high',
      title: '文档覆盖率偏低',
      description: `当前总覆盖率 ${(coverage * 100).toFixed(1)}%，低于 80% 门槛`,
      action: '补充 FINAL_SUMMARY 关键章节（质量门禁与验收、风险与回滚），检查测试与链接引用',
      expectedImprovement: '覆盖率 +20%～30%',
      effort: 'medium'
    });
  }
  if (missingSections.length) {
    suggestions.push({
      type: 'docs',
      priority: 'medium',
      title: '缺失章节补全',
      description: `缺失章节: ${missingSections.join(', ')}`,
      action: '按模板补全章节结构与要点，确保索引与引用一致',
      expectedImprovement: '覆盖率提升与一致性改善',
      effort: 'low'
    });
  }

  return { coverage, missingSections, suggestions };
}

function buildKanbanSuggestions(kanbanReport, schemaGate) {
  const suggestions = [];
  const summary = kanbanReport?.summary || {};
  const failedCount = Number(summary.failedCount ?? 0);

  if (schemaGate && schemaGate.pass === false && Array.isArray(schemaGate.issues) && schemaGate.issues.length) {
    suggestions.push({
      type: 'kanban',
      priority: 'high',
      title: '看板任务 Schema 异常',
      description: `发现 ${schemaGate.issues.length} 处不一致：${schemaGate.issues.slice(0, 5).join('; ')}`,
      action: '修正任务 status/assignee/dateRange，对齐 summary 统计',
      expectedImprovement: '门禁通过，报告一致性提升',
      effort: 'low'
    });
  }

  if (failedCount > 0) {
    const failedTasks = Array.isArray(summary.failedTasks) ? summary.failedTasks : [];
    suggestions.push({
      type: 'kanban',
      priority: 'high',
      title: '存在失败任务',
      description: `失败数: ${failedCount}；任务: ${failedTasks.join(', ')}`,
      action: '定位失败原因（阻塞依赖、测试未通过、资源不足），制定修复计划并回滚或重试',
      expectedImprovement: '失败归零，进度恢复',
      effort: 'medium'
    });
  }

  return { failedCount, suggestions };
}

function main() {
  const docsReport = safeReadJson('docs-check-report.json');
  const kanbanReport = safeReadJson('kanban-report.json');
  const schemaGate = safeReadJson('kanban-schema-gate.json');

  const docs = buildDocsSuggestions(docsReport);
  const kanban = buildKanbanSuggestions(kanbanReport, schemaGate);

  const pass = (docs.coverage >= 0.8) && (kanban.failedCount === 0) && (!schemaGate || schemaGate.pass !== false);

  const summary = {
    pass,
    metrics: {
      docsCoverage: docs.coverage,
      failedCount: kanban.failedCount,
    },
    suggestions: [...docs.suggestions, ...kanban.suggestions],
    docs: {
      missingSections: docs.missingSections,
    },
    kanban: {
      schemaGate: schemaGate || { pass: true },
    }
  };

  fs.writeFileSync('summary.json', JSON.stringify(summary, null, 2));
  console.log('✅ 统一 CI 摘要已生成 -> summary.json');
}

main();
