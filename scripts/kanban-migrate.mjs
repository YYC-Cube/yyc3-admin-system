#!/usr/bin/env node
/**
 * @file 看板自动迁移脚本（Backlog → Doing）
 * @description 在 CI 中使用，批量把 docs/ITERATION_BOARD_2W.md 内的指定任务迁移到 Doing 并标注执行人与起止日期
 * @author YYC
 * @version 1.0.0
 */
import fs from 'fs';
import path from 'path';

const BOARD_PATH = path.resolve(process.cwd(), 'docs/ITERATION_BOARD_2W.md');
const assignee = process.env.KANBAN_ASSIGNEE || 'yanyu';
const startDate = process.env.KANBAN_START_DATE || new Date().toISOString().slice(0, 10);
const endDate = process.env.KANBAN_END_DATE || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

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

function migrate(content) {
  let updated = content;
  for (const t of targets) {
    // 把前缀列标识从 [Backlog] → [Doing]
    updated = updated.replace(new RegExp(`- \[Backlog\] ${t}`), `- [Doing] ${t}`);
    // 插入/更新执行人与起止日期
    const blockRegex = new RegExp(`(- \[(?:Backlog|Doing)\] ${t}[\s\S]*?)(\n\s*- 链接：.*?)([\s\S]*?)(?=\n\s*- \[|\n---|$)`, 'g');
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

try {
  const original = fs.readFileSync(BOARD_PATH, 'utf8');
  const result = migrate(original);
  if (result !== original) {
    fs.writeFileSync(BOARD_PATH, result, 'utf8');
    console.log('✅ Kanban 已自动迁移到 Doing，并标注执行人与起止日期');
  } else {
    console.log('ℹ️ Kanban 无需变更（已是最新状态）');
  }
} catch (err) {
  console.error('🚨 Kanban 迁移失败：', err);
  process.exit(1);
}
