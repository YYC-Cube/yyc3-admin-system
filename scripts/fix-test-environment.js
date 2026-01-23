#!/usr/bin/env node

/**
 * 测试环境修复脚本
 * 修复测试配置、依赖和组件导入问题
 * @author YYC
 * @created 2025-11-15
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复测试环境...\n');

// 1. 检查并修复Jest配置
console.log('1️⃣ 检查Jest配置...');
const jestConfigPath = path.join(__dirname, '../jest.config.ts');
if (!fs.existsSync(jestConfigPath)) {
  console.log('⚠️  Jest配置文件不存在，创建基础配置...');
  
  const jestConfig = `import type { Config } from "jest"
import nextJest from "next/jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**"
  ],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  testTimeout: 15000,
  transform: {
    "^.+\\\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "tsconfig.json"
    }]
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@testing-library)/)"
  ]
}

export default createJestConfig(config)`;
  
  fs.writeFileSync(jestConfigPath, jestConfig);
  console.log('✅ Jest配置已创建');
}

// 2. 检查并修复测试设置文件
console.log('\n2️⃣ 检查测试设置文件...');
const setupPath = path.join(__dirname, '../jest.setup.ts');
if (!fs.existsSync(setupPath)) {
  console.log('⚠️  测试设置文件不存在，创建基础设置...');
  
  const setupContent = `"use client"

import "@testing-library/jest-dom"
import { jest } from "@jest/globals"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return "/"
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    button: "button",
    span: "span",
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Global test setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);`;
  
  fs.writeFileSync(setupPath, setupContent);
  console.log('✅ 测试设置文件已创建');
}

// 3. 检查测试目录结构
console.log('\n3️⃣ 检查测试目录结构...');
const testDirs = [
  '__tests__/unit',
  '__tests__/integration', 
  '__tests__/e2e',
  'tests/performance',
  'tests/security'
];

testDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '../', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 创建目录: ${dir}`);
  }
});

// 4. 创建基础测试文件示例
console.log('\n4️⃣ 创建基础测试示例...');
const basicTestPath = '__tests__/basic.test.tsx';
const basicTestContent = `/**
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
});`;

fs.writeFileSync(path.join(__dirname, '../', basicTestPath), basicTestContent);
console.log(`✅ 创建基础测试: ${basicTestPath}`);

// 5. 运行基础测试验证环境
console.log('\n5️⃣ 验证测试环境...');
const { spawn } = require('child_process');

const runTest = () => {
  return new Promise((resolve, reject) => {
    const testProcess = spawn('npx', ['jest', '__tests__/basic.test.tsx', '--verbose'], {
      cwd: path.join(__dirname, '../'),
      stdio: 'pipe',
    });

    let output = '';
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    testProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    testProcess.on('close', (code) => {
      console.log(output);
      if (code === 0) {
        console.log('✅ 测试环境验证成功！');
        resolve(true);
      } else {
        console.log('❌ 测试环境验证失败');
        reject(false);
      }
    });

    testProcess.on('error', (error) => {
      console.log('❌ 测试执行错误:', error.message);
      reject(false);
    });
  });
};

async function main() {
  try {
    await runTest();
    console.log('\n🎉 测试环境修复完成！');
    console.log('📋 下一步: 执行完整测试计划');
    console.log('🚀 运行命令: npm run test:unit');
  } catch (error) {
    console.log('\n❌ 测试环境修复失败，请检查配置');
    console.log('💡 建议手动检查:');
    console.log('   - npm install @testing-library/react @testing-library/jest-dom jest-environment-jsdom');
    console.log('   - npx jest --init');
  }
}

main();