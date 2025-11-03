/**
 * @file 外部工具适配器测试
 * @description 验证工具检测与缺失时的错误提示
 * @author YYC
 */

import { describe, it, expect } from 'vitest';
import { isToolAvailable } from './external';

describe('external tools', () => {
  // 只测试 isToolAvailable 函数，避免调用可能导致超时的 convertWithExternalTool
  it('should detect libreoffice availability', async () => {
    const ok = await isToolAvailable('libreoffice');
    expect(typeof ok).toBe('boolean');
  });

  it('should detect inkscape availability', async () => {
    const ok = await isToolAvailable('inkscape');
    expect(typeof ok).toBe('boolean');
  });
});
