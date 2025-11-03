/**
 * @file cn 函数用例
 * @description 验证 clsx 复杂入参在 twMerge 合并后符合预期
 * @module utils.cn.test
 * @author YYC
 */
import { describe, expect, test } from 'vitest';
import { cn } from './utils';

describe('cn (ClassValue)', () => {
  test('合并对象条件样式', () => {
    const result = cn('a', { b: true, c: false }, { d: 1, e: 0 });
    expect(result).toContain('a');
    expect(result).toContain('b');
    expect(result).toContain('d');
    expect(result).not.toContain('c');
    expect(result).not.toContain('e');
  });

  test('合并数组入参', () => {
    const isFalse = false;
    const result = cn(['a', 'b'], ['c'], [isFalse && 'd', null, undefined, 'e']) as string;
    expect(result.split(' ')).toEqual(['a', 'b', 'c', 'e']);
  });

  test('条件入参与重复样式去重', () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn(isTrue && 'x', isFalse && 'y', 'z', 'p-2', 'p-2');
    expect(result).toContain('x');
    expect(result).toContain('z');
    expect(result.match(/p-2/g)?.length).toBe(1); // twMerge 去重
  });
});
