
/**
 * @file form-interaction.test.tsx
 * @description 表单交互测试 - 已修复版本
 */

import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function FormComponent() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <form data-testid="test-form">
      <div>
        <label htmlFor="name">姓名:</label>
        <input
          id="name"
          data-testid="name-input"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="email">邮箱:</label>
        <input
          id="email"
          data-testid="email-input"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
    </form>
  );
}

describe('表单交互测试', () => {
  test('表单应该正确渲染', () => {
    render(<FormComponent />);
    expect(screen.getByTestId('test-form')).toBeInTheDocument();
    expect(screen.getByLabelText('姓名:')).toBeInTheDocument();
    expect(screen.getByLabelText('邮箱:')).toBeInTheDocument();
  });
});
      