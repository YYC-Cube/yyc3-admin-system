/**
 * @file reports/business 页面E2E测试
 * @description Reports 模块的端到端功能测试
 * @category Reports
 * @priority HIGH
 * @author YYC
 * @created 2025-11-13T18:02:33.469Z
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth-helper';
import { waitForPageLoad } from '../helpers/page-helper';

test.describe('reports/business 页面E2E测试', () => {
  test.beforeEach(async ({ page }) => {
    // 登录系统
    await loginAsAdmin(page);
    
    // 导航到目标页面
    await page.goto(`/dashboard/reports/business`);
    
    // 等待页面加载完成
    await waitForPageLoad(page);
  });

  test('页面应该正确加载', async ({ page }) => {
    // 验证页面标题
    await expect(page.getByRole('heading')).toBeVisible();
    
    // 验证核心元素存在
    await expect(page.getByTestId('page-content')).toBeVisible();
    await expect(page.getByTestId('navigation-menu')).toBeVisible();
  });

  test('主要按钮交互应该正常工作', async ({ page }) => {
    // 查找主要按钮
    const primaryButton = page.getByRole('button', { name: /主要操作/i });
    await expect(primaryButton).toBeVisible();
    
    // 点击按钮
    await primaryButton.click();
    
    // 验证结果
    await expect(page.getByTestId('action-result')).toBeVisible();
  });

  test('表单提交应该正常工作', async ({ page }) => {
    // 查找表单元素
    const form = page.getByRole('form');
    await expect(form).toBeVisible();
    
    // 填写表单
    await page.fill('[name="name"]', '测试数据');
    await page.fill('[name="description"]', '测试描述');
    
    // 提交表单
    await page.click('[type="submit"]');
    
    // 验证提交结果
    await expect(page.getByText(/操作成功/i)).toBeVisible();
  });

  test('数据表格功能应该正常工作', async ({ page }) => {
    // 验证表格存在
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    
    // 测试排序功能
    const sortButton = page.getByRole('button', { name: /排序/i });
    await sortButton.click();
    
    // 验证排序结果
    await expect(page.getByTestId('sorted-data')).toBeVisible();
  });

  test('搜索过滤功能应该正常工作', async ({ page }) => {
    // 查找搜索输入框
    const searchInput = page.getByPlaceholder(/搜索/i);
    await expect(searchInput).toBeVisible();
    
    // 输入搜索关键词
    await searchInput.fill('测试关键词');
    await searchInput.press('Enter');
    
    // 验证搜索结果
    await expect(page.getByTestId('search-results')).toBeVisible();
  });

  test('页面响应式布局应该正常工作', async ({ page }) => {
    // 桌面端测试
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByTestId('desktop-layout')).toBeVisible();
    
    // 平板端测试
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByTestId('tablet-layout')).toBeVisible();
    
    // 移动端测试
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId('mobile-layout')).toBeVisible();
  });

  test('错误处理和边界情况测试', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => {
      route.abort('failed');
    });
    
    // 触发API调用
    await page.click('[data-testid="refresh-button"]');
    
    // 验证错误处理
    await expect(page.getByText(/网络错误/i)).toBeVisible();
    
    // 恢复网络
    await page.unroute('**/api/**');
  });
});
