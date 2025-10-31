#!/usr/bin/env node
/**
 * @file 看板自动迁移脚本（增强版）
 * @description 将目标任务从 Backlog 迁移到 Doing，并标注执行人与日期；支持结构校验与 JSON/TXT 报告输出，包含任务级字段。
 * @author YYC
 * @version 1.1.0
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

// 目标任务（示例），可根据需要扩展或从文件读取
const targetTasks = [
  'CI: 增强门禁与报告输出',
  'Docs: 迭代日志与健康指南完善',
  'Scripts: 结构校验与统一 summary 集成',
  'PR: 自动评论与可观测性提升',
  'Kanban: Backlog→Doing 演示与校验',
  'API: 健康指标采集占位',
  'Workflow: permissions 与触发策略优化',
  'Testing: 增强 CI 用例',
  'Security: 权限策略审查',
  'Performance: 指标阈值与建议优化',
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
  // 将目标任务状态标记为 Doing（简单替换示例）
  for (const task of targetTasks) {
    const backlogPattern = new RegExp(`-\\s*\\[Backlog\\]\\s*${task}`);
    const doingLine = `- [Doing] ${task}`;
    if (backlogPattern.test(updated)) {
      updated = updated.replace(backlogPattern, doingLine);
    } else if (!updated.includes(doingLine)) {
      // 如果不存在 Backlog 行，尝试追加到 Doing 区域占位
      updated += `\n${doingLine}`;
    }
  }
  return updated;
}

function analyze(content) {
  const tasks = targetTasks.map(name => {
    const doing = new RegExp(`-\\s*\\[Doing\\]\\s*${name}`).test(content);
    const backlog = new RegExp(`-\\s*\\[Backlog\\]\\s*${name}`).test(content);
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
