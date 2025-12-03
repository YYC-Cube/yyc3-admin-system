/**
 * @file products/list 页面测试
 * @description Products 模块的页面功能测试
 * @category Products
 * @priority HIGH
 * @author YYC
 * @created 2025-11-13T18:02:33.469Z
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';

// 页面组件
import ListPage from '@/app/dashboard/products/list/page';

// Mock 数据
const mockData = {
  pageData: require('./fixtures/products/list.json'),
  userData: require('./fixtures/user.json'),
  authData: require('./fixtures/auth.json')
};

describe('products/list 页面测试', () => {
  beforeEach(() => {
    // 设置测试环境
    jest.clearAllMocks();
    
    // Mock API 调用
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.pageData),
      })
    );
    
    // Mock 路由
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
      }),
      useSearchParams: () => ({
        get: jest.fn(),
      }),
    }));
  });

  test('页面应该正确渲染', async () => {
    render(<ListPage />);
    
    // 检查页面标题
    expect(screen.getByRole('heading')).toBeInTheDocument();
    
    // 检查核心组件
    await waitFor(() => {
      expect(screen.getByTestId('page-content')).toBeInTheDocument();
    });
  });

  test('按钮交互应该正常工作', async () => {
    const user = userEvent.setup();
    render(<ListPage />);
    
    // 查找主要按钮
    const primaryButton = screen.getByRole('button', { name: /主要操作/i });
    expect(primaryButton).toBeInTheDocument();
    
    // 模拟点击
    await user.click(primaryButton);
    
    // 验证点击结果
    await waitFor(() => {
      expect(screen.getByTestId('action-result')).toBeInTheDocument();
    });
  });

  test('表单验证应该正常工作', async () => {
    const user = userEvent.setup();
    render(<ListPage />);
    
    // 查找表单元素
    const formElement = screen.getByRole('form');
    expect(formElement).toBeInTheDocument();
    
    // 测试必填字段
    const submitButton = screen.getByRole('button', { name: /提交/i });
    await user.click(submitButton);
    
    // 验证错误提示
    await waitFor(() => {
      expect(screen.getByText(/请填写必填项/i)).toBeInTheDocument();
    });
  });

  test('数据加载应该正确处理', async () => {
    render(<ListPage />);
    
    // 验证加载状态
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('data-content')).toBeInTheDocument();
    });
  });

  test('错误处理应该正常工作', async () => {
    // Mock 错误响应
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: '服务器错误' }),
      })
    );
    
    render(<ListPage />);
    
    // 验证错误提示
    await waitFor(() => {
      expect(screen.getByText(/服务器错误/i)).toBeInTheDocument();
    });
  });

  test('响应式布局应该正常工作', () => {
    // 桌面端测试
    window.innerWidth = 1200;
    render(<ListPage />);
    expect(screen.getByTestId('desktop-layout')).toBeInTheDocument();
    
    // 移动端测试
    window.innerWidth = 375;
    render(<ListPage />);
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
  });
});
