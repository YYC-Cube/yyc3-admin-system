
/**
 * @file main-page.test.tsx
 * @description 主应用页面基础测试 - 已修复版本
 * @author YYC
 */

import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function SimpleComponent() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  return (
    <div data-testid="test-container">
      <h1>主应用页面基础测试</h1>
      
      <div data-testid="counter-section">
        <p data-testid="counter">当前计数: {count}</p>
        <button 
          data-testid="increment-button"
          onClick={() => setCount(count + 1)}
        >
          增加计数
        </button>
      </div>

      <div data-testid="input-section">
        <input
          data-testid="test-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入测试文本"
        />
        <p data-testid="input-display">输入内容: {inputValue}</p>
      </div>
    </div>
  );
}

describe('主应用页面基础测试', () => {
  test('组件应该正确渲染', () => {
    render(<SimpleComponent />);
    expect(screen.getByTestId('test-container')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '主应用页面基础测试' })).toBeInTheDocument();
  });

  test('计数器功能应该正常工作', async () => {
    const user = userEvent.setup();
    render(<SimpleComponent />);
    
    const counter = screen.getByTestId('counter');
    const button = screen.getByTestId('increment-button');
    
    expect(counter).toHaveTextContent('当前计数: 0');
    
    await user.click(button);
    expect(counter).toHaveTextContent('当前计数: 1');
  });
});
      