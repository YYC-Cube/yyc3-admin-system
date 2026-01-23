/**
 * @file 页面辅助工具
 * @description 页面操作相关辅助函数
 */

import { Page } from '@playwright/test';

export async function waitForPageLoad(page: Page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
  await page.waitForSelector('[data-testid="page-loaded"]', { timeout });
}

export async function checkPageElements(page: Page, elements: string[]) {
  for (const element of elements) {
    await expect(page.getByTestId(element)).toBeVisible();
  }
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}-${Date.now()}.png`, fullPage: true });
}
