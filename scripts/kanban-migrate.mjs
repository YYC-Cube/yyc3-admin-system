#!/usr/bin/env node
/**
 * @file 看板自动迁移与结构校验脚本（Backlog → Doing + 报告输出）
 * @description 在 CI 中批量把 docs/ITERATION_BOARD_2W.md 的指定任务迁移到 Doing，并补充执行人与起止日期；随后生成 JSON 与文本报告，作为门禁校验与可观测性输出。
 * @module ci-kanban
 * @author YYC
 * @version 1.1.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import fs from 'fs';
import path from 'path';

// === 配置 ===
const BOARD_PATH = path.resolve(process.cwd(), 'docs/ITERATION_BOARD_2W.md');
const REPORT_JSON = path.resolve(process.cwd(), 'kanban-report.json');
const REPORT_TXT = path.resolve(process.cwd(), 'kanban-report.txt');

const assignee = process.env.KANBAN_ASSIGNEE || 'yanyu';
// 默认采用演示周期的固定日期，支持通过环境覆盖
const startDate = process.env.KANBAN_START_DATE || '2025-10-31';
const endDate = process.env.KANBAN_END_DATE || '2025-11-14';

// 目标任务（通过宽松关键词匹配，兼容文档微调）
const targets = [
  '[稳定性][sales-monitoring] 健康监控埋点与指标上报',
  '[稳定性][sales-frontend] ESLint/TS/Prettier 门禁与基础修复',
  '[稳定性][products-monitoring] 健康监控埋点与指标上报',
  '[稳定性][products-frontend] ESLint/TS/Prettier 门禁与基础修复',
  '[稳定性][sales-frontend] 表格组件水合一致性治理',
  '[稳定性][products-frontend] 列表/明细页水合一致性治理',
  '[稳定性][db-cache] 数据库索引与 Redis 缓存策略',
  '[稳定性][release-rollback] 发布回滚演练与自动化脚本',
  '[分化][sales-api] API 层 PoC 拆分与文档化',
  '[分化][products-api] API 层 PoC 拆分与文档化'
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 执行迁移：将指定任务从 [Backlog] 改为 [Doing]，并补充执行人与起止日期
 */
function migrate(content) {
  let updated = content;
  for (const t of targets) {
    const title = escapeRegExp(t);
    // 1) 状态迁移
    updated = updated.replace(new RegExp(`- \\[Backlog\\] ${title}`), `- [Doing] ${t}`);

    // 2) 插入/更新执行人与起止日期（在任务块的链接行后注入）
    const blockRegex = new RegExp(
      `(- \\[(?:Backlog|Doing)\\] ${title}[\\s\\S]*?)(\\n\\s*- 链接：.*?)([\\s\\S]*?)(?=\\n\\s*- \\[|\\n---|$)`,
      'g'
    );
    updated = updated.replace(blockRegex, (match, head, linkLine, tail) => {
      const assigneeLine = `\n  - 执行人：${assignee}`;
      const dateLine = `\n  - 起止：${startDate} → ${endDate}`;
      const hasAssignee = /\n\s*- 执行人：/.test(match);
      const hasDates = /\n\s*- 起止：/.test(match);
      let injected = head + linkLine;
      if (!hasAssignee) injected += assigneeLine;
      if (!hasDates) injected += dateLine;
      injected += tail;
      return injected;
    });
  }
  return updated;
}

/**
 * 结构校验并生成报告：统计每个任务的迁移状态、执行人与日期标注
 */
function generateReport(content) {
  const lines = content.split('\n');
  const reportItems = [];

  for (const t of targets) {
    const title = escapeRegExp(t);
    const statusRegex = new RegExp(`- \\[(Backlog|Doing)\\] ${title}`);

    let foundIndex = -1;
    let status = 'missing';
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(statusRegex);
      if (m) {
        foundIndex = i;
        status = m[1];
        break;
      }
    }

    let hasAssignee = false;
    let hasDate = false;
    if (foundIndex >= 0) {
      // 在后续 6 行窗口内检查标注（兼容不同块结构）
      const window = lines.slice(foundIndex + 1, foundIndex + 7).join('\n');
      hasAssignee = new RegExp(`执行人：${escapeRegExp(assignee)}`).test(window);
      hasDate = new RegExp(`起止：${escapeRegExp(startDate)} → ${escapeRegExp(endDate)}`).test(window);
    }

    const migrated = status === 'Doing';
    reportItems.push({
      name: t,
      status,
      migrated,
      hasAssignee,
      hasDate,
      line: foundIndex
    });
  }

  const failedTasks = reportItems.filter(
    (r) => r.status !== 'Doing' || !r.hasAssignee || !r.hasDate
  );

  const summary = {
    total: reportItems.length,
    migrated: reportItems.filter((r) => r.migrated).length,
    assigneeCompleted: reportItems.filter((r) => r.hasAssignee).length,
    dateCompleted: reportItems.filter((r) => r.hasDate).length,
    failedCount: failedTasks.length,
    failedTasks: failedTasks.map((r) => ({ name: r.name, status: r.status, hasAssignee: r.hasAssignee, hasDate: r.hasDate }))
  };

  const jsonReport = { assignee, startDate, endDate, items: reportItems, summary };
  fs.writeFileSync(REPORT_JSON, JSON.stringify(jsonReport, null, 2), 'utf8');

  const txt = [
    `assignee_lines=${summary.assigneeCompleted}`,
    `date_lines=${summary.dateCompleted}`,
    `doing_lines=${summary.migrated}`,
    `failed_count=${summary.failedCount}`,
    `failed_tasks=${summary.failedTasks.map((t) => t.name).join('; ')}`
  ].join('\n');
  fs.writeFileSync(REPORT_TXT, txt + '\n', 'utf8');

  return jsonReport;
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check-only') || args.includes('--report-only');

  try {
    const original = fs.readFileSync(BOARD_PATH, 'utf8');
    let working = original;

    if (!checkOnly) {
      const migrated = migrate(original);
      if (migrated !== original) {
        fs.writeFileSync(BOARD_PATH, migrated, 'utf8');
        working = migrated;
        console.log('✅ Kanban 已自动迁移到 Doing，并标注执行人与起止日期');
      } else {
        console.log('ℹ️ Kanban 无需变更（已是最新状态）');
      }
    }

    const report = generateReport(working);
    console.log('📄 Kanban 迁移校验报告：');
    console.log(JSON.stringify(report.summary, null, 2));

    // 若需要强制门禁，可依据失败数退出非零码（交由工作流控制）
  } catch (err) {
    console.error('🚨 Kanban 迁移/校验失败：', err);
    process.exit(1);
  }
}

main();
