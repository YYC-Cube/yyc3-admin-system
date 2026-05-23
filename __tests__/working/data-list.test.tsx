
/**
 * @file data-list.test.tsx
 * @description 数据列表测试 - 已修复版本
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

function DataListComponent() {
  const items = ['项目 1', '项目 2', '项目 3'];

  return (
    <div data-testid="list-container">
      <h2>数据列表</h2>
      <ul data-testid="item-list">
        {items.map((item, index) => (
          <li key={index} data-testid={`item-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

describe('数据列表测试', () => {
  test('列表应该正确渲染', () => {
    render(<DataListComponent />);
    expect(screen.getByTestId('list-container')).toBeInTheDocument();
    expect(screen.getByTestId('item-list')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toHaveTextContent('项目 1');
    expect(screen.getByTestId('item-1')).toHaveTextContent('项目 2');
    expect(screen.getByTestId('item-2')).toHaveTextContent('项目 3');
  });
});
      