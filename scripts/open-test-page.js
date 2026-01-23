#!/usr/bin/env node

/**
 * @file 打开测试页面脚本
 * @description 帮助用户在浏览器中打开测试页面以验证商品数据
 * @author YYC
 */

const { exec } = require('child_process');
const path = require('path');

// 测试页面的URL
const testPageUrl = 'http://localhost:3555/test-data.html';

console.log('🔍 正在准备打开测试页面...');
console.log('📋 这个页面将帮助您：');
console.log('   • 测试浏览器localStorage中的商品数据');
console.log('   • 清除缓存并重新初始化商品数据');
console.log('   • 直接跳转到商品列表页面');
console.log('\n');

// 根据不同操作系统打开浏览器
const openBrowser = (url) => {
  const platform = process.platform;
  let cmd = '';

  switch (platform) {
    case 'win32': // Windows
      cmd = `start "" "${url}"`;
      break;
    case 'darwin': // macOS
      cmd = `open "${url}"`;
      break;
    case 'linux': // Linux
      cmd = `xdg-open "${url}"`;
      break;
    default:
      console.error('❌ 不支持的操作系统，无法自动打开浏览器');
      return;
  }

  exec(cmd, (error) => {
    if (error) {
      console.error('❌ 打开浏览器失败:', error.message);
      console.log(`\n📝 请手动在浏览器中访问: ${testPageUrl}`);
    } else {
      console.log(`✅ 测试页面已打开: ${testPageUrl}`);
      console.log('💡 请按照页面上的指引进行操作');
    }
  });
};

// 打开测试页面
openBrowser(testPageUrl);

// 额外提示信息
setTimeout(() => {
  console.log('\n📋 操作步骤：');
  console.log('1. 在打开的页面中点击「测试商品数据加载」按钮');
  console.log('2. 检查是否显示有91件商品和5个分类');
  console.log('3. 如果数据不正确，请点击「清除缓存并重新初始化」');
  console.log('4. 完成后点击「查看商品列表页面」查看效果');
  console.log('\n✅ 祝您使用愉快！');
}, 1000);