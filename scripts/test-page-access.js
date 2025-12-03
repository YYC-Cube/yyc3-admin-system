#!/usr/bin/env node

/**
 * @file 页面访问测试脚本
 * @description 用于测试套餐页面是否可以正常访问，检查是否还存在ERR_ABORTED错误
 * @author YYC
 */

// 使用正确的ES模块导入方式
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPageAccess() {
  console.log('开始测试页面访问...');
  
  try {
    // 测试套餐页面
    const packagesPageUrl = 'http://localhost:3555/dashboard/products/packages';
    console.log(`测试页面: ${packagesPageUrl}`);
    
    const response = await fetch(packagesPageUrl);
    
    console.log(`HTTP 状态码: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ 套餐页面可以正常访问');
      
      // 获取页面内容的前1000个字符
      const text = await response.text();
      console.log('页面内容预览:');
      console.log(text.substring(0, 1000) + '...');
      
      // 检查是否包含预期内容
      if (text.includes('商品套餐')) {
        console.log('✅ 页面包含预期的"商品套餐"标题');
      } else {
        console.log('⚠️  页面不包含预期的"商品套餐"标题');
      }
    } else {
      console.log('❌ 套餐页面访问失败');
      const errorText = await response.text();
      console.log('错误响应:', errorText);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testPageAccess();
