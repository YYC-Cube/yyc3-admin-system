/**
 * @file UI 快照测试
 * @description 捕获关键组件的静态快照，辅助视觉一致性与 Tailwind v4 令牌对齐验证
 * @module e2e-ui-snapshots
 * @author YYC
 * @version 1.0.0
 * @created 2025-11-02
 * @updated 2025-11-02
 */

import fs from 'node:fs';
import path from 'node:path';

import { test, expect, Page } from '@playwright/test';

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

async function snap(page: Page, name: string, locator: ReturnType<Page['locator']>) {
  const dir = path.join(process.cwd(), 'ui-snapshots');
  ensureDir(dir);
  const file = path.join(dir, `${name}.png`);
  const el = await locator.first();
  await expect(el).toBeVisible();
  await el.screenshot({ path: file });
}

// 基础主页快照：Header/StepBar/Input/Preview/Table
test('UI 快照：主页关键组件', async ({ page }) => {
  const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  // Header（含品牌渐变与提示气泡）
  await snap(page, 'header', page.locator('header, [data-slot="header"], [data-testid="header"]'));

  // StepBar（渐变选中态 + muted 普通态）
  await snap(
    page,
    'stepbar',
    page.locator('[data-slot="stepbar"], [data-testid="stepbar"], div:has(button:has-text("1"))')
  );

  // InputPanel（Select + Textarea）
  await snap(
    page,
    'input-panel',
    page.locator(
      '[data-slot="input-panel"], [data-testid="input-panel"], textarea[data-slot="input-textarea"]'
    )
  );

  // PreviewPanel（搜索框 + 按钮）
  await snap(
    page,
    'preview-panel',
    page.locator('[data-slot="preview-panel"], [data-testid="preview-panel"], input[type="text"]')
  );

  // TableView（表头与单元格）
  await snap(page, 'table-view', page.locator('table'));
});

// 转换页快照：确保二级页面亦使用语义令牌
test('UI 快照：转换页（文档/矢量）', async ({ page }) => {
  const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
  for (const p of ['/convert/doc', '/convert/vector']) {
    await page.goto(`${BASE}${p}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(200);
    await snap(page, `convert-${p.includes('doc') ? 'doc' : 'vector'}`, page.locator('main'));
  }
});
