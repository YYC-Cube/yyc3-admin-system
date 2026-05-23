#!/usr/bin/env node

/**
 * @file 同步Mock数据脚本
 * @description 将mock-db.json中的数据同步到localStorage中，解决页面看不到商品的问题
 * @author YYC
 */

const fs = require('fs');
const path = require('path');

// 读取mock-db.json文件
function syncMockData() {
  try {
    // 构建mock-db.json的绝对路径
    const mockDbPath = path.join(__dirname, '../lib/utils/storage/mock-db.json');
    console.log(`读取数据文件: ${mockDbPath}`);
    
    // 读取文件内容
    const fileContent = fs.readFileSync(mockDbPath, 'utf-8');
    const mockData = JSON.parse(fileContent);
    
    console.log('数据文件读取成功，开始处理...');
    
    // 模拟localStorage环境
    const localStorage = {};
    
    // 同步products数据
    if (mockData.products && mockData.products.length > 0) {
      const productsKey = 'ktv_admin_db_products';
      localStorage[productsKey] = JSON.stringify(mockData.products);
      console.log(`✓ 成功同步 ${mockData.products.length} 条商品数据到 ${productsKey}`);
    }
    
    // 同步categories数据
    if (mockData.categories && mockData.categories.length > 0) {
      const categoriesKey = 'ktv_admin_db_categories';
      localStorage[categoriesKey] = JSON.stringify(mockData.categories);
      console.log(`✓ 成功同步 ${mockData.categories.length} 条分类数据到 ${categoriesKey}`);
    }
    
    // 输出导入到localStorage的脚本
    const outputPath = path.join(__dirname, '../public/import-local-storage.js');
    const scriptContent = generateImportScript(localStorage);
    fs.writeFileSync(outputPath, scriptContent);
    
    console.log('\n🎉 数据同步完成！');
    console.log('\n请按照以下步骤操作：');
    console.log('1. 打开浏览器控制台（F12 -> Console）');
    console.log('2. 复制以下代码并粘贴到控制台中执行：');
    console.log('   ========================================================');
    console.log(scriptContent);
    console.log('   ========================================================');
    console.log('3. 刷新页面即可看到商品数据');
    
  } catch (error) {
    console.error('❌ 数据同步失败:', error.message);
    process.exit(1);
  }
}

// 生成导入到localStorage的脚本
function generateImportScript(localStorageData) {
  let script = '// 导入数据到localStorage\n';
  
  Object.entries(localStorageData).forEach(([key, value]) => {
    script += `localStorage.setItem('${key}', '${escapeQuotes(value)}');\n`;
  });
  
  script += '\nconsole.log("✅ 数据成功导入到localStorage！");\n';
  script += 'console.log("商品数量:", JSON.parse(localStorage.getItem("ktv_admin_db_products")).length);\n';
  
  return script;
}

// 转义引号
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

// 直接运行脚本
syncMockData();
