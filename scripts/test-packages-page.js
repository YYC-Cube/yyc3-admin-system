import('node-fetch').then(({ default: fetch }) => {
  const url = 'http://localhost:3555/dashboard/products/packages';
  
  console.log(`正在测试页面访问: ${url}`);
  
  fetch(url)
    .then(response => {
      console.log(`HTTP状态码: ${response.status}`);
      return response.text();
    })
    .then(html => {
      // 检查页面是否包含预期内容
      const hasTitle = html.includes('商品套餐');
      console.log(`页面包含"商品套餐"标题: ${hasTitle}`);
      
      if (hasTitle) {
        console.log('✅ 测试通过: 套餐页面可以正常访问');
        process.exit(0);
      } else {
        console.log('❌ 测试失败: 页面缺少预期内容');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 测试失败:', error.message);
      process.exit(1);
    });
});