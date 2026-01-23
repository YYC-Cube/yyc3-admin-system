
/**
 * @file button-interaction.test.tsx
 * @description 按钮交互测试 - 已修复版本
 */

import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

function ButtonComponent() {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <button 
        data-testid="test-button"
        onClick={() => setClicked(!clicked)}
      >
        {clicked ? '已点击' : '点击我'}
      </button>
      <p data-testid="status">{clicked ? '已点击状态' : '未点击状态'}</p>
    </div>
  );
}

describe('按钮交互测试', () => {
  test('按钮应该正确渲染', () => {
    render(<ButtonComponent />);
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('点击我');
  });

  test('按钮点击应该改变状态', () => {
    render(<ButtonComponent />);
    const button = screen.getByTestId('test-button');
    const status = screen.getByTestId('status');
    
    fireEvent.click(button);
    expect(status).toHaveTextContent('已点击状态');
    expect(button).toHaveTextContent('已点击');
  });
});
      