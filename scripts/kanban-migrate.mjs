#!/usr/bin/env node
/**
 * @file 看板自动迁移脚本（对齐 GitHub Issues 名称）
 * @description 将目标任务从 Backlog 迁移到 Doing，并标注执行人与日期；支持结构校验与 JSON/TXT 报告输出，包含任务级字段。
 * @author YYC
 * @version 1.2.0
 */
import fs from 'fs';
import path from 'path';

const BOARD_PATH = path.resolve(process.cwd(), 'docs/ITERATION_BOARD_2W.md');
const TXT_REPORT = path.resolve(process.cwd(), 'kanban-report.txt');
const JSON_REPORT = path.resolve(process.cwd(), 'kanban-report.json');

const assignee = process.env.KANBAN_ASSIGNEE || 'yanyu';
const startDate = process.env.KANBAN_START_DATE || '2025-10-31';
const endDate = process.env.KANBAN_END_DATE || '2025-11-14';
const dateRangeStr = `${startDate} → ${endDate}`;

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
  if (!updated.includes(`执行人：${assignee}`)) {
    updated = `执行人：${assignee}\n起止：${dateRangeStr}\n\n` + updated;
  }
  // 将目标任务状态标记为 Doing（完整匹配以避免误替换）
  for (const task of targetTasks) {
    const backlogPattern = new RegExp(`-\\s*\\[Backlog\\]\\s*${task.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`)}`);
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
  const tasks = targetTasks.map(name => {
    const doing = new RegExp(`-\\s*\\[Doing\\]\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`)}`).test(content);
    const backlog = new RegExp(`-\\s*\\[Backlog\\]\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`)}`).test(content);
    const status = doing ? 'Doing' : (backlog ? 'Backlog' : 'Missing');
    return { name, status, assignee, dateRange: dateRangeStr };
  });
  const failedTasks = tasks.filter(t => t.status !== 'Doing');
  const summary = {
    migratedCount: tasks.filter(t => t.status === 'Doing').length,
    failedCount: failedTasks.length,
    failedTasks: failedTasks.map(t => ({ name: t.name })),
    assignee,
    dateRange: dateRangeStr,
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
