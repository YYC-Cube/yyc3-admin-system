/**
 * @file 统一 CI 摘要生成脚本（强化版）
 * @description 汇总 docs-check-report.json、kanban-report.json、kanban-schema-gate.json；
 *              提供更细化的建议模板（阻塞依赖、测试失败、资源额度不足），并列出占位补齐缺失清单。
 * @author YYC
 * @version 1.2.0
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
      type: 'docs', priority: 'high', title: '文档覆盖率偏低',
      description: `当前总覆盖率 ${(coverage * 100).toFixed(1)}%，低于 80% 门槛`,
      action: '补充 FINAL_SUMMARY 关键章节（质量门禁与验收、风险与回滚），检查测试与链接引用',
      expectedImprovement: '覆盖率 +20%～30%', effort: 'medium'
    });
  }
  if (missingSections.length) {
    suggestions.push({
      type: 'docs', priority: 'medium', title: '缺失章节补全',
      description: `缺失章节: ${missingSections.join(', ')}`,
      action: '按模板补全章节结构与要点，确保索引与引用一致',
      expectedImprovement: '覆盖率提升与一致性改善', effort: 'low'
    });
  }
  return { coverage, missingSections, suggestions };
}

function buildKanbanSuggestions(kanbanReport, schemaGate) {
  const suggestions = [];
  const summary = kanbanReport?.summary || {};
  const tasks = Array.isArray(kanbanReport?.tasks) ? kanbanReport.tasks : [];
  const failedCount = Number(summary.failedCount ?? 0);

  // Schema gate 异常
  if (schemaGate && schemaGate.pass === false && Array.isArray(schemaGate.issues) && schemaGate.issues.length) {
    suggestions.push({
      type: 'kanban', priority: 'high', title: '看板任务 Schema 异常',
      description: `发现 ${schemaGate.issues.length} 处不一致：${schemaGate.issues.slice(0, 5).join('; ')}`,
      action: '修正任务 status/assignee/dateRange，对齐 summary 统计',
      expectedImprovement: '门禁通过，报告一致性提升', effort: 'low'
    });
  }

  // 任务类型建议：blocked / failed / resource
  const blockedTasks = tasks.filter(t => String(t.status||'').toLowerCase() === 'blocked').map(t => t.name || t.title);
  const failedTasks = tasks.filter(t => String(t.status||'').toLowerCase() === 'failed').map(t => t.name || t.title);
  const resourceHintTasks = tasks.filter(t => {
    const name = (t.name || t.title || '').toLowerCase();
    const labels = (t.labels || []).map(l => String(l).toLowerCase());
    return name.includes('quota') || name.includes('容量') || name.includes('资源') || labels.includes('resource');
  }).map(t => t.name || t.title);

  if (blockedTasks.length) {
    suggestions.push({
      type: 'kanban', priority: 'high', title: '阻塞依赖解除',
      description: `被阻塞的任务: ${blockedTasks.join(', ')}`,
      action: '明确阻塞原因、拆分子任务、调整优先级或更换依赖路径；必要时提请跨团队支持',
      expectedImprovement: '解除阻塞，提高吞吐', effort: 'medium'
    });
  }
  if (failedTasks.length) {
    suggestions.push({
      type: 'kanban', priority: 'high', title: '测试失败修复与回滚',
      description: `失败任务: ${failedTasks.join(', ')}`,
      action: '定位失败日志、修复缺陷、必要时回滚并建立重试策略',
      expectedImprovement: '失败归零，进度恢复', effort: 'medium'
    });
  }
  if (resourceHintTasks.length) {
    suggestions.push({
      type: 'kanban', priority: 'medium', title: '资源额度提升/申请',
      description: `疑似资源问题任务: ${resourceHintTasks.join(', ')}`,
      action: '评估 CPU/内存/并发配额，提出临时额度申请或进行性能优化',
      expectedImprovement: '消除资源瓶颈', effort: 'medium'
    });
  }

  // 占位缺失清单
  const missingAssignee = Array.isArray(summary?.placeholders?.assignee) ? summary.placeholders.assignee : [];
  const missingDateRange = Array.isArray(summary?.placeholders?.dateRange) ? summary.placeholders.dateRange : [];
  if (missingAssignee.length) {
    suggestions.push({
      type: 'kanban', priority: 'medium', title: '补齐指派人',
      description: `缺失 assignee 的任务: ${missingAssignee.join(', ')}`,
      action: '为每个非 backlog 任务指定负责人，明确交付责任',
      expectedImprovement: '减少协调成本，提高推进效率', effort: 'low'
    });
  }
  if (missingDateRange.length) {
    suggestions.push({
      type: 'kanban', priority: 'medium', title: '补齐起止日期',
      description: `缺失 dateRange 的任务: ${missingDateRange.join(', ')}`,
      action: '为任务设置合理的 start/end，并与迭代节奏对齐',
      expectedImprovement: '进度可视化与计划可信度提升', effort: 'low'
    });
  }

  return { failedCount, suggestions, missing: { assignee: missingAssignee, dateRange: missingDateRange } };
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
    docs: { missingSections: docs.missingSections },
    kanban: { schemaGate: schemaGate || { pass: true }, missing: kanban.missing }
  };

  fs.writeFileSync('summary.json', JSON.stringify(summary, null, 2));
  console.log('✅ 统一 CI 摘要已生成 -> summary.json');
}

main();
