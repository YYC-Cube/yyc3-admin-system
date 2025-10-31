#!/usr/bin/env node
/**
 * @file 看板报告门禁校验脚本
 * @description 读取并校验 kanban-report.json 结构与失败任务计数，失败时输出明细并以非零码退出；用于替代 YAML 中的内联 node -e。
 * @author YYC
 * @version 1.0.0
 */
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const REPORT_PATH = path.resolve(process.cwd(), 'kanban-report.json');

const ReportSchema = z.object({
  summary: z.object({
    failedCount: z.number().min(0),
    failedTasks: z.array(z.object({ name: z.string() })).default([]),
    migratedCount: z.number().min(0).optional(),
    assignee: z.string().optional(),
    dateRange: z.string().optional(),
  }),
  tasks: z.array(z.object({
    name: z.string(),
    status: z.enum(['Doing', 'Backlog', 'Missing']).optional(),
  })).optional(),
});

function exitWith(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

(function main() {
  let raw;
  try {
    raw = fs.readFileSync(REPORT_PATH, 'utf8');
  } catch (e) {
    exitWith(`未找到报告文件: ${REPORT_PATH}`);
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    exitWith('报告 JSON 解析失败: ' + String(e));
  }

  const parsed = ReportSchema.safeParse(json);
  if (!parsed.success) {
    exitWith('报告结构校验失败: ' + JSON.stringify(parsed.error.format()));
  }

  const { failedCount, failedTasks } = parsed.data.summary;
  if ((failedCount || 0) > 0) {
    const names = (failedTasks || []).map(t => t.name).join(', ');
    exitWith(`Kanban structural check failed: ${names}`);
  }

  console.log('Kanban structural check passed');
})();
