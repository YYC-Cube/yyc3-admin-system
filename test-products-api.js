// 测试商品API脚本
const https = require('https');
const http = require('http');

// 打印JSON响应，美化显示
function printResponse(title, data) {
  console.log(`\n${title}`);
  console.log(JSON.stringify(data, null, 2));
}

// 发送HTTP请求的工具函数
function httpRequest(path, callback) {
  const options = {
    hostname: 'localhost',
    port: 3555,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, res => {
    console.log(`状态码: ${res.statusCode}`);
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        callback(JSON.parse(data));
      } catch (e) {
        console.error('JSON解析错误:', e);
      }
    });
  });

  req.on('error', error => {
    console.error('请求错误:', error);
  });

  req.end();
}

// 测试基础API
function testBasicAPI() {
  console.log('测试基础商品API...');
  httpRequest('/api/products', (data) => {
    printResponse('基础API响应:', {
      success: data.success,
      productCount: data.data?.data?.length || 0,
      pagination: data.data?.pagination
    });
    console.log('\n商品列表详情:');
    data.data?.data?.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.id}, 分类: ${product.category_id}, 价格: ${product.price}元/${product.unit})`);
    });
    testFilterByCategory();
  });
}

// 测试分类筛选
function testFilterByCategory() {
  console.log('\n测试按分类筛选...');
  httpRequest('/api/products?category_id=1', (data) => {
    printResponse('分类筛选响应:', {
      success: data.success,
      productCount: data.data?.data?.length || 0,
      pagination: data.data?.pagination
    });
    console.log('\n分类下的商品:');
    data.data?.data?.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.id}, 分类: ${product.category_id}, 价格: ${product.price}元/${product.unit})`);
    });
    testKeywordSearch();
  });
}

// 测试关键词搜索
function testKeywordSearch() {
  console.log('\n测试关键词搜索...');
  const encodedKeyword = encodeURIComponent('啤酒');
  httpRequest(`/api/products?keyword=${encodedKeyword}`, (data) => {
    printResponse('关键词搜索响应:', {
      success: data.success,
      productCount: data.data?.data?.length || 0,
      pagination: data.data?.pagination
    });
    console.log('\n搜索结果:');
    data.data?.data?.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.id}, 分类: ${product.category_id}, 价格: ${product.price}元/${product.unit})`);
    });
    testCombinedFilters();
  });
}

// 测试组合筛选
function testCombinedFilters() {
  console.log('\n测试组合筛选 (分类+关键词)...');
  const encodedKeyword = encodeURIComponent('啤酒');
  httpRequest(`/api/products?category_id=1&keyword=${encodedKeyword}`, (data) => {
    printResponse('组合筛选响应:', {
      success: data.success,
      productCount: data.data?.data?.length || 0,
      pagination: data.data?.pagination
    });
    console.log('\n组合筛选结果:');
    data.data?.data?.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.id}, 分类: ${product.category_id}, 价格: ${product.price}元/${product.unit})`);
    });
    console.log('\n✅ 所有商品API测试完成！');
  });
}

// 运行测试
testBasicAPI();