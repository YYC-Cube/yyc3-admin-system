/**
 * 基础测试示例
 * 验证测试环境是否正常工作
 */

import { render, screen } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';

describe('基础测试环境', () => {
  test('应该正确渲染组件', () => {
    const TestComponent = () => <div>测试组件</div>;
    
    render(<TestComponent />);
    expect(screen.getByText('测试组件')).toBeInTheDocument();
  });

  test('Jest和Testing Library应该正常工作', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
  });
});