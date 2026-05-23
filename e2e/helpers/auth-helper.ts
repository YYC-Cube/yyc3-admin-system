/**
 * @file 认证辅助工具
 * @description 测试认证相关辅助函数
 */

import { Page } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/');
  await page.fill('[name="phone"]', '13103790379');
  await page.fill('[name="password"]', '123456');
  await page.click('[type="submit"]');
  await page.waitForURL('/dashboard');
}

export async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/');
}

export async function checkAuthStatus(page: Page) {
  const authToken = await page.evaluate(() => localStorage.getItem('auth-token'));
  return !!authToken;
}
