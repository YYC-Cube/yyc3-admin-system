#!/usr/bin/env node
/**
 * @file 文档结构与 KPI 校验脚本（增强版）
 * @description 校验 FINAL_SUMMARY.md 与 PROGRESS_LOG_2025Q4.md 的关键章节与指标占位，生成 JSON 报告供 CI 工件与门禁使用。
 * @author YYC
 * @version 1.1.0
 */
import fs from 'fs';
import path from 'path';

const FINAL_SUMMARY = path.resolve(process.cwd(), 'docs/FINAL_SUMMARY.md');
const PROGRESS_LOG = path.resolve(process.cwd(), 'docs/PROGRESS_LOG_2025Q4.md');
const OUTPUT = path.resolve(process.cwd(), 'docs-check-report.json');

function readSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function hasSection(md, name) {
  const re = new RegExp(`^#+\\s*${name}\\s*$`, 'm');
  return re.test(md);
}

function hasLabel(md, label) {
  const re = new RegExp(`${label}:`, 'm');
  return re.test(md);
}

function countOccurrences(md, pattern) {
  const re = new RegExp(pattern, 'g');
  const m = md.match(re); return m ? m.length : 0;
}

function checkFinalSummary(md) {
  const required = [
    '概览',
    '完成项',
    '技术产出',
    '文档更新',
    '质量门禁与验收',
    '风险与回滚',
    '下一阶段',
  ];
  const sections = required.map(name => ({ name, present: hasSection(md, name) }));
  const missingSections = sections.filter(s => !s.present).map(s => s.name);
  // KPI 示例：统计“响应时间”“错误率”“内存”关键词出现次数作为占位校验
  const kpi = {
    responseTimeMentions: countOccurrences(md, '响应时间'),
    errorRateMentions: countOccurrences(md, '错误率'),
    memoryMentions: countOccurrences(md, '内存'),
  };
  const coverage = sections.filter(s => s.present).length / sections.length;
  return { sections, missingSections, kpi, coverage };
}

function checkProgressLog(md) {
  // 校验双周章节存在以及关键要素（主题、目标摘要、完成项、KPI、质量门禁与验收、风险与回滚、下一步）
  const entryTitle = /^##\s*2025-10-31\s*双周同步/m.test(md);
  const hasTheme = /阶段主题:\s*`.+?`/.test(md);
  const hasGoals = hasLabel(md, '目标摘要');
  const hasDeliverables = hasLabel(md, '完成项');
  const hasKpi = hasLabel(md, 'KPI 与健康');
  const hasQuality = hasLabel(md, '质量门禁与验收');
  const hasRisk = hasLabel(md, '风险与回滚');
  const hasNext = hasLabel(md, '下一步');
  return {
    entries: [{ date: '2025-10-31', present: entryTitle, hasTheme, hasGoals, hasDeliverables, hasKpi, hasQuality, hasRisk, hasNext }]
  };
}

function main() {
  const finalSummary = readSafe(FINAL_SUMMARY);
  const progressLog = readSafe(PROGRESS_LOG);

  const finalReport = checkFinalSummary(finalSummary);
  const progressReport = checkProgressLog(progressLog);

  const progressEntryOk = progressReport.entries.every(e => e.present && e.hasTheme && e.hasGoals && e.hasDeliverables && e.hasKpi && e.hasQuality && e.hasRisk && e.hasNext);

  const summary = {
    finalSummaryCoverage: finalReport.coverage,
    missingSections: finalReport.missingSections,
    kpiMentions: finalReport.kpi,
    progressEntryOk,
  };

  const result = { finalSummary: finalReport, progressLog: progressReport, summary };
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf8');
  console.log('📄 docs-check-report.json');
  console.log(JSON.stringify(summary, null, 2));
}

main();
