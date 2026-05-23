#!/usr/bin/env node
/**
 * @file 看板自动迁移脚本（占位补齐版）
 * @description 将目标任务从 Backlog 迁移到 Doing，并标注执行人与日期；
 *              生成 JSON 报告时强制补齐缺失的 assignee/dateRange 占位，并记录 meta.placeholders，
 *              以便统一摘要脚本输出缺失清单与修复建议。
 * @author YYC
 * @version 1.3.0
 */
import fs from 'fs';
import path from 'path';

const BOARD_PATH = path.resolve(process.cwd(), 'docs/ITERATION_BOARD_2W.md');
const TXT_REPORT = path.resolve(process.cwd(), 'kanban-report.txt');
const JSON_REPORT = path.resolve(process.cwd(), 'kanban-report.json');

const DEFAULT_ASSIGNEE = process.env.KANBAN_ASSIGNEE || 'yanyu';
const START_DATE_RAW = process.env.KANBAN_START_DATE || '';
const END_DATE_RAW = process.env.KANBAN_END_DATE || '';

function toISOOrNull(s) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const startISO = toISOOrNull(START_DATE_RAW) || new Date().toISOString();
const endISO = toISOOrNull(END_DATE_RAW) || new Date().toISOString();
const dateRangeStr = `${START_DATE_RAW || startISO.slice(0,10)} → ${END_DATE_RAW || endISO.slice(0,10)}`;

// 与看板 Backlog 完全一致的目标任务（8项）
const targetTasks = [
  '[稳定性][sales-frontend] bills 表格水合一致性治理',
  '[稳定性][products-frontend] 列表页水合一致性治理',
  '[稳定性][sales-monitoring] 健康监控埋点与指标上报',
  '[稳定性][products-monitoring] 健康监控埋点与指标上报',
  '[稳定性][db-cache] 高频查询索引与缓存策略落地',
  '[稳定性][release-rollback] 发布回滚演练与脚本化',
  '[分化][销售-api] API 层 PoC 拆分与文档化',
  '[分化][产品-api] API 层 PoC 拆分与文档化',
];

function readBoard() {
  try { return fs.readFileSync(BOARD_PATH, 'utf8'); } catch { return ''; }
}

function writeBoard(content) {
  fs.writeFileSync(BOARD_PATH, content, 'utf8');
}

function migrate(content) {
  let updated = content;
  // 标注执行人与日期占位（若未存在则追加到文件头部）
  if (!updated.includes(`执行人：${DEFAULT_ASSIGNEE}`)) {
    updated = `执行人：${DEFAULT_ASSIGNEE}\n起止：${dateRangeStr}\n\n` + updated;
  }
  // 将目标任务状态标记为 Doing（完整匹配以避免误替换）
  for (const task of targetTasks) {
    const backlogPattern = new RegExp(`-\\s*\\[Backlog\\]\\s*${task.replace(/[.*+?^${}()|[\\]\\]/g, r => `\\${r}`)}`);
    const doingLine = `- [Doing] ${task}`;
    if (backlogPattern.test(updated)) {
      updated = updated.replace(backlogPattern, doingLine);
    } else if (!updated.includes(doingLine)) {
      // 如果不存在 Backlog 行，追加到末尾，保证报告可用
      updated += `\n${doingLine}`;
    }
  }
  return updated;
}

function analyze(content) {
  const tasks = targetTasks.map((name) => {
    const doing = new RegExp(`-\\s*\\[Doing\\]\\s*${name.replace(/[.*+?^${}()|[\\]\\]/g, r => `\\${r}`)}`).test(content);
    const backlog = new RegExp(`-\\s*\\[Backlog\\]\\s*${name.replace(/[.*+?^${}()|[\\]\\]/g, r => `\\${r}`)}`).test(content);
    const status = doing ? 'doing' : (backlog ? 'backlog' : 'missing');

    const placeholders = [];
    let assignee = DEFAULT_ASSIGNEE || 'TBD';
    if (!assignee || assignee === 'TBD') placeholders.push('assignee');

    // dateRange 转对象并补齐占位
    let dateRange = { start: startISO, end: endISO };
    if (!START_DATE_RAW || !END_DATE_RAW) placeholders.push('dateRange');

    return { name, status, assignee, dateRange, meta: { placeholders } };
  });

  const failedTasks = tasks.filter(t => t.status !== 'doing');
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const missingAssignee = tasks.filter(t => t.meta?.placeholders?.includes('assignee')).map(t => t.name);
  const missingDateRange = tasks.filter(t => t.meta?.placeholders?.includes('dateRange')).map(t => t.name);

  const summary = {
    migratedCount: tasks.filter(t => t.status === 'doing').length,
    failedCount: failedTasks.length,
    failedTasks: failedTasks.map(t => t.name),
    assignee: DEFAULT_ASSIGNEE,
    dateRange: dateRangeStr,
    statusCounts,
    placeholders: {
      assignee: missingAssignee,
      dateRange: missingDateRange,
    },
  };
  return { tasks, summary };
}

function writeReports(report) {
  const { tasks, summary } = report;
  const lines = [
    `assignee=${summary.assignee}`,
    `dateRange=${summary.dateRange}`,
    `migratedCount=${summary.migratedCount}`,
    `failedCount=${summary.failedCount}`,
  ];
  fs.writeFileSync(TXT_REPORT, lines.join('\n') + '\n', 'utf8');
  fs.writeFileSync(JSON_REPORT, JSON.stringify({ tasks, summary }, null, 2), 'utf8');
  console.log('✅ 输出报告: kanban-report.txt / kanban-report.json');
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check-only');
  const reportOnly = args.includes('--report-only');
  let content = readBoard();

  if (!reportOnly) {
    if (!checkOnly) {
      content = migrate(content);
      writeBoard(content);
    }
  }

  const report = analyze(content);
  writeReports(report);
}

main();
