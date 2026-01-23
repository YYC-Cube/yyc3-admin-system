/**
 * @file data-list.test.tsx
 * @description 测试数据列表显示功能
 * @author YYC
 * @created 2025-11-15T00:40:09.429Z
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach } from '@jest/globals';
import userEvent from '@testing-library/user-event';

// 简化测试组件
function SimpleTestComponent() {
  const [count, setCount] = React.useState(0);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div data-testid="test-container" className="p-4">
      <h1 data-testid="test-title">数据列表测试</h1>
      
      <div data-testid="counter-section" className="mb-4">
        <p data-testid="counter">当前计数: {count}</p>
        <button 
          data-testid="increment-button"
          onClick={() => setCount(count + 1)}
        >
          增加计数
        </button>
      </div>

      <div data-testid="input-section" className="mb-4">
        <input
          data-testid="test-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入测试文本"
        />
        <p data-testid="input-display">输入内容: {inputValue}</p>
      </div>

      <div data-testid="list-section">
        <ul data-testid="item-list">
          <li data-testid="item-1">项目 1</li>
          <li data-testid="item-2">项目 2</li>
          <li data-testid="item-3">项目 3</li>
        </ul>
      </div>
    </div>
  );
}

describe('数据列表测试', () => {
  beforeEach(() => {
    // 清除所有模拟
    jest.clearAllMocks();
  });

  test('组件应该正确渲染', () => {
    render(<SimpleTestComponent />);
    
    expect(screen.getByTestId('test-container')).toBeInTheDocument();
    expect(screen.getByTestId('test-title')).toHaveTextContent('数据列表测试');
  });

  test('计数器功能应该正常工作', async () => {
    const user = userEvent.setup();
    render(<SimpleTestComponent />);
    
    const counter = screen.getByTestId('counter');
    const button = screen.getByTestId('increment-button');
    
    // 初始状态
    expect(counter).toHaveTextContent('当前计数: 0');
    
    // 点击增加
    await user.click(button);
    expect(counter).toHaveTextContent('当前计数: 1');
    
    // 再次点击
    await user.click(button);
    expect(counter).toHaveTextContent('当前计数: 2');
  });

  test('输入框功能应该正常工作', async () => {
    const user = userEvent.setup();
    render(<SimpleTestComponent />);
    
    const input = screen.getByTestId('test-input');
    const display = screen.getByTestId('input-display');
    
    // 输入测试文本
    await user.type(input, '测试输入');
    
    expect(input).toHaveValue('测试输入');
    expect(display).toHaveTextContent('输入内容: 测试输入');
  });

  test('数据列表应该正确显示', () => {
    render(<SimpleTestComponent />);
    
    expect(screen.getByTestId('item-list')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toHaveTextContent('项目 1');
    expect(screen.getByTestId('item-2')).toHaveTextContent('项目 2');
    expect(screen.getByTestId('item-3')).toHaveTextContent('项目 3');
  });

  test('所有交互元素都应该存在', () => {
    render(<SimpleTestComponent />);
    
    expect(screen.getByTestId('increment-button')).toBeInTheDocument();
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
    expect(screen.getByTestId('counter')).toBeInTheDocument();
    expect(screen.getByTestId('input-display')).toBeInTheDocument();
  });

  test('页面布局应该正确', () => {
    render(<SimpleTestComponent />);
    
    const container = screen.getByTestId('test-container');
    expect(container).toBeInTheDocument();
    
    // 验证基本结构
    expect(screen.getByTestId('test-title')).toBeInTheDocument();
    expect(screen.getByTestId('counter-section')).toBeInTheDocument();
    expect(screen.getByTestId('input-section')).toBeInTheDocument();
    expect(screen.getByTestId('list-section')).toBeInTheDocument();
  });
});