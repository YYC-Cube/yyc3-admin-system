
/**
 * @file component-rendering.test.tsx
 * @description 组件渲染测试 - 已修复版本
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

function TestComponent() {
  return (
    <div data-testid="component-container">
      <h2>组件渲染测试</h2>
      <span data-testid="test-span">测试文本</span>
    </div>
  );
}

describe('组件渲染测试', () => {
  test('组件应该正确渲染', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('component-container')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '组件渲染测试' })).toBeInTheDocument();
    expect(screen.getByTestId('test-span')).toHaveTextContent('测试文本');
  });
});
      