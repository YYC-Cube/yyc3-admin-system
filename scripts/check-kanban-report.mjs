/**
 * @file 看板报告门禁校验脚本（扩展版）
 * @description 校验 kanban-report.json 的任务 Schema 一致性：status/assignee/dateRange，
 *              并与 summary 统计结果进行一致性比对，发现问题时阻塞 CI。
 * @author YYC
 * @version 1.1.1
 * @created 2024-10-31
 * @updated 2025-10-31
 */

import fs from 'fs';
import path from 'path';

/**
 * 允许的任务状态枚举
 */
const ALLOWED_STATUS = new Set([
  'backlog',
  'todo',
  'doing',
  'in-progress',
  'blocked',
  'failed',
  'done',
]);

/**
 * 允许的时间误差（毫秒）
 */
const CLOCK_TOLERANCE_MS = 5 * 60 * 1000; // 5分钟误差

/**
 * @description 读取 JSON 工具，包含健壮的错误提示
 */
function readJson(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`未找到文件: ${filePath}`);
  }
  const raw = fs.readFileSync(abs, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON 解析失败: ${filePath}, 错误: ${e.message}`);
  }
}

/**
 * @description ISO 时间字符串校验
 */
function isValidISODate(str) {
  if (typeof str !== 'string') return false;
  const d = new Date(str);
  return (
    !Number.isNaN(d.getTime()) &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(str)
  );
}

/**
 * @description 统一的错误收集器
 */
class IssueCollector {
  constructor() {
    this.issues = [];
  }
  add(message) {
    this.issues.push(message);
  }
  hasIssues() {
    return this.issues.length > 0;
  }
  print() {
    if (!this.hasIssues()) return;
    console.error('❌ Kanban Gate 失败，发现以下问题:');
    this.issues.forEach((m, idx) => {
      console.error(`  ${idx + 1}. ${m}`);
    });
  }
}

/**
 * @description 校验任务的 Schema 一致性
 */
function validateTaskSchema(report, issues) {
  const tasks = Array.isArray(report.tasks) ? report.tasks : [];
  if (!tasks.length) {
    issues.add('kanban-report.json 中 tasks 为空或缺失');
    return { tasks };
  }

  tasks.forEach((t, i) => {
    const name = String(t.name || t.title || `#${i}`).trim();
    const status = String(t.status || '').toLowerCase();

    if (!t.status || !ALLOWED_STATUS.has(status)) {
      issues.add(`任务【${name}】状态无效或缺失，期望之一: ${Array.from(ALLOWED_STATUS).join(', ')}`);
    }

    const requireAssignee = status !== 'backlog';
    if (
      requireAssignee &&
      (!t.assignee || typeof t.assignee !== 'string' || !t.assignee.trim())
    ) {
      issues.add(`任务【${name}】缺少 assignee（非 backlog 任务必须指派负责人）`);
    }

    const dr = t.dateRange;
    if (!dr || typeof dr !== 'object') {
      issues.add(`任务【${name}】缺少 dateRange`);
    } else {
      const { start, end } = dr;
      if (!isValidISODate(start)) {
        issues.add(`任务【${name}】dateRange.start 非法或缺失（需 ISO 时间）`);
      }
      if (!isValidISODate(end)) {
        issues.add(`任务【${name}】dateRange.end 非法或缺失（需 ISO 时间）`);
      }
      if (isValidISODate(start) && isValidISODate(end)) {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        if (s > e) {
          issues.add(`任务【${name}】dateRange 起止时间不一致（start 不应晚于 end）`);
        }
      }

      if (status === 'done' && isValidISODate(end)) {
        const now = Date.now();
        const e = new Date(end).getTime();
        if (e - now > CLOCK_TOLERANCE_MS) {
          issues.add(`任务【${name}】状态为 done，但结束时间在未来（请检查时间或状态）`);
        }
      }
    }
  });

  return { tasks };
}

/**
 * @description 与 summary 进行一致性比对
 */
function validateSummaryConsistency(report, tasks, issues) {
  const summary = report.summary || {};
  const failedCountReported = Number(summary.failedCount ?? 0);
  const failedTasksReported = Array.isArray(summary.failedTasks) ? summary.failedTasks : [];

  const failedTasksActual = tasks.filter(
    (t) => String(t.status || '').toLowerCase() === 'failed'
  );

  if (failedCountReported !== failedTasksActual.length) {
    issues.add(`summary.failedCount 与实际失败任务数不一致：报告为 ${failedCountReported}，实际为 ${failedTasksActual.length}`);
  }

  if (
    failedTasksReported.length &&
    failedTasksReported.some(
      (name) => !failedTasksActual.find((t) => (t.name || t.title) === name)
    )
  ) {
    issues.add('summary.failedTasks 列表与实际失败任务集合不一致');
  }

  if (summary.statusCounts && typeof summary.statusCounts === 'object') {
    const counts = {};
    tasks.forEach((t) => {
      const k = String(t.status || '').toLowerCase();
      counts[k] = (counts[k] || 0) + 1;
    });
    for (const [k, v] of Object.entries(summary.statusCounts)) {
      const actual = counts[String(k).toLowerCase()] || 0;
      if (Number(v) !== actual) {
        issues.add(`summary.statusCounts[${k}]=${v} 与实际计数 ${actual} 不一致`);
      }
    }
  }

  if (typeof summary.totalCount === 'number' && summary.totalCount !== tasks.length) {
    issues.add(`summary.totalCount=${summary.totalCount} 与实际任务数 ${tasks.length} 不一致`);
  }
}

/**
 * @description 主流程入口
 */
function main() {
  try {
    const report = readJson('kanban-report.json');
    const issues = new IssueCollector();

    const { tasks } = validateTaskSchema(report, issues);
    validateSummaryConsistency(report, tasks, issues);

    const gateOutput = {
      version: '1.1.1',
      timestamp: new Date().toISOString(),
      pass: !issues.hasIssues(),
      reason: issues.hasIssues() ? 'Task schema or summary consistency issues' : undefined,
      issues: issues.issues,
    };

    if (issues.hasIssues()) {
      issues.print();
      fs.writeFileSync('kanban-schema-gate.json', JSON.stringify(gateOutput, null, 2));
      process.exit(1);
    }

    console.log('✅ Kanban structural & consistency check passed');
    fs.writeFileSync('kanban-schema-gate.json', JSON.stringify(gateOutput, null, 2));
  } catch (error) {
    console.error('🚨 Kanban Gate 执行异常:', error.message);
    const gateOutput = {
      version: '1.1.1',
      timestamp: new Date().toISOString(),
      pass: false,
      reason: 'Script error',
      error: String(error.message || error),
    };
    try {
      fs.writeFileSync('kanban-schema-gate.json', JSON.stringify(gateOutput, null, 2));
    } catch {
      // eslint-disable-next-line no-empty
      // 写入失败不再额外抛出，避免覆盖原始错误
    }
    process.exit(1);
  }
}

main();
