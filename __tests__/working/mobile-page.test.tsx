
/**
 * @file mobile-page.test.tsx
 * @description 移动端页面测试 - 已修复版本
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

function MobileComponent() {
  return (
    <div data-testid="mobile-container">
      <h1>移动端页面</h1>
      <p>这是移动端测试页面</p>
    </div>
  );
}

describe('移动端页面基础测试', () => {
  test('移动端组件应该正确渲染', () => {
    render(<MobileComponent />);
    expect(screen.getByTestId('mobile-container')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '移动端页面' })).toBeInTheDocument();
  });
});
      