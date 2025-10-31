#!/usr/bin/env node
/**
 * @file CI 统一总结与门禁校验
 * @description 汇总 kanban-report.json 与 docs-check-report.json，进行 Zod Schema 校验与统一门禁判断，输出 summary.json 并根据门槛退出非零。
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// 输入/输出路径
const KANBAN_PATH = path.resolve(process.cwd(), 'kanban-report.json');
const DOCS_PATH = path.resolve(process.cwd(), 'docs-check-report.json');
const SUMMARY_PATH = path.resolve(process.cwd(), 'summary.json');

// 可配置文档覆盖率阈值（默认 0.8）
const coverageThreshold = Number(process.env.CI_DOCS_COVERAGE_THRESHOLD || '0.8');

// === Zod Schema 定义（最小结构约束，聚焦门禁所需字段） ===
const KanbanReportSchema = z.object({
  summary: z.object({
    failedCount: z.number().min(0),
    failedTasks: z.array(z.object({ name: z.string() })).optional()
  })
});

const DocsCheckReportSchema = z.object({
  summary: z.object({
    finalSummaryCoverage: z.number().min(0).max(1),
    kpiMentions: z.object({
      responseTimeMentions: z.number().min(0),
      errorRateMentions: z.number().min(0),
      memoryMentions: z.number().min(0),
    }),
    progressEntryOk: z.boolean(),
  })
});

// === 工具函数 ===
function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

function exitWith(message, code = 1) {
  console.error(message);
  process.exit(code);
}

// === 主流程 ===
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

  const pass = kanbanFailedCount === 0 && docsCoverage >= coverageThreshold && progressEntryOk === true;

  const summary = {
    gate: {
      kanbanFailedCount,
      docsCoverage,
      progressEntryOk,
      coverageThreshold,
      pass,
    },
    sources: {
      kanbanReportPath: KANBAN_PATH,
      docsReportPath: DOCS_PATH,
    },
    details: {
      kanban: kanbanParsed.data.summary,
      docs: docsParsed.data.summary,
    },
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2), 'utf8');
  console.log('✅ 已生成 summary.json');
  console.log(JSON.stringify(summary.gate, null, 2));

  if (!pass) {
    exitWith('❌ 统一门禁未通过：要求 failedCount=0 且文档覆盖率≥阈值，且进度条目有效');
  }
})();
