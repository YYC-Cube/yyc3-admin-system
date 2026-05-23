// 测试商品列表页面访问脚本
import('node-fetch').then(({default: fetch}) => {
  const testUrl = 'http://localhost:3555/dashboard/products/list';
  
  console.log('开始测试商品列表页面访问...');
  console.log('测试页面:', testUrl);
  
  fetch(testUrl)
    .then(response => {
      console.log('HTTP 状态码:', response.status);
      if (response.status === 200) {
        console.log('✅ 商品列表页面可以正常访问');
      } else {
        console.log('❌ 商品列表页面访问失败');
      }
      return response.text();
    })
    .then(html => {
      console.log('页面内容预览长度:', html.length, '字符');
      if (html.includes('商品管理')) {
        console.log('✅ 页面包含预期的"商品管理"标题');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 测试失败:', error.message);
      process.exit(1);
    });
});
