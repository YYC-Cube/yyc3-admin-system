#!/usr/bin/env node
/**
 * @file CI 统一总结与门禁校验（增强版）
 * @description 汇总 kanban-report.json 与 docs-check-report.json，Zod Schema 校验与统一门禁判断，输出 summary.json，附带建议字段。
 * @author YYC
 * @version 1.1.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const KANBAN_PATH = path.resolve(process.cwd(), 'kanban-report.json');
const DOCS_PATH = path.resolve(process.cwd(), 'docs-check-report.json');
const SUMMARY_PATH = path.resolve(process.cwd(), 'summary.json');

const coverageThreshold = Number(process.env.CI_DOCS_COVERAGE_THRESHOLD || '0.8');

const KanbanReportSchema = z.object({
  summary: z.object({
    failedCount: z.number().min(0),
    failedTasks: z.array(z.object({ name: z.string() })).optional(),
    assignee: z.string(),
    dateRange: z.string(),
  }),
  tasks: z.array(z.object({
    name: z.string(),
    status: z.enum(['Doing', 'Backlog', 'Missing']),
    assignee: z.string(),
    dateRange: z.string(),
  })).min(1),
});

const DocsCheckReportSchema = z.object({
  summary: z.object({
    finalSummaryCoverage: z.number().min(0).max(1),
    missingSections: z.array(z.string()).default([]),
    kpiMentions: z.object({
      responseTimeMentions: z.number().min(0),
      errorRateMentions: z.number().min(0),
      memoryMentions: z.number().min(0),
    }),
    progressEntryOk: z.boolean(),
  })
});

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function exitWith(message, code = 1) {
  console.error(message);
  process.exit(code);
}

(function main() {
  const kanbanJson = readJsonSafe(KANBAN_PATH);
  const docsJson = readJsonSafe(DOCS_PATH);

  if (!kanbanJson) exitWith(`未找到或无法解析 ${KANBAN_PATH}`);
  if (!docsJson) exitWith(`未找到或无法解析 ${DOCS_PATH}`);

  const kanbanParsed = KanbanReportSchema.safeParse(kanbanJson);
  if (!kanbanParsed.success) {
    exitWith('kanban-report.json 结构校验失败: ' + JSON.stringify(kanbanParsed.error.format()));
  }

  const docsParsed = DocsCheckReportSchema.safeParse(docsJson);
  if (!docsParsed.success) {
    exitWith('docs-check-report.json 结构校验失败: ' + JSON.stringify(docsParsed.error.format()));
  }

  const kanbanFailedCount = kanbanParsed.data.summary.failedCount;
  const docsCoverage = docsParsed.data.summary.finalSummaryCoverage;
  const progressEntryOk = docsParsed.data.summary.progressEntryOk;
  const missingSections = docsParsed.data.summary.missingSections || [];

  const pass = kanbanFailedCount === 0 && docsCoverage >= coverageThreshold && progressEntryOk === true;

  const suggestions = [];
  if (kanbanFailedCount > 0) {
    suggestions.push(`未完成任务(${kanbanFailedCount}): ${(kanbanParsed.data.summary.failedTasks||[]).map(t=>t.name).join(', ')}`);
  }
  if (docsCoverage < coverageThreshold) {
    if (missingSections.length) {
      suggestions.push(`缺失章节: ${missingSections.join(', ')}`);
    } else {
      suggestions.push('文档覆盖率低于阈值，请补充必备章节');
    }
  }
  if (!progressEntryOk) {
    suggestions.push('双周条目要素不完整（主题/目标/完成项/KPI/质量门禁/风险/下一步）');
  }

  const summary = {
    gate: { kanbanFailedCount, docsCoverage, progressEntryOk, coverageThreshold, pass },
    sources: { kanbanReportPath: KANBAN_PATH, docsReportPath: DOCS_PATH },
    details: { kanban: kanbanParsed.data.summary, docs: docsParsed.data.summary },
    suggestions,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2), 'utf8');
  console.log('✅ 已生成 summary.json');
  console.log(JSON.stringify(summary.gate, null, 2));

  if (!pass) {
    exitWith('❌ 统一门禁未通过：要求 failedCount=0 且文档覆盖率≥阈值，且进度条目有效');
  }
})();
