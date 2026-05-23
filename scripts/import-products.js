#!/usr/bin/env node
/**
 * @file 商品数据导入脚本
 * @description 将商品列表文件数据导入到系统中
 * @author YYC
 * @created 2024-10-15
 */

const fs = require('fs');
const path = require('path');

// 模拟浏览器环境的File对象
class File {
  constructor(buffer, name, type) {
    this.buffer = buffer;
    this.name = name;
    this.type = type;
    this.size = buffer.length;
  }
}

// 解析制表符分隔的文件
function parseTabSeparatedFile(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // 跳过前两行标题信息，获取实际的表头
  const headerLine = lines[2];
  const headers = headerLine.split('\t').map(h => h.trim()).filter(h => h);
  
  // 从第三行开始处理数据（索引为2）
  return lines.slice(3).filter(line => line.trim()).map((line, index) => {
    const values = line.split('\t').map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

// 导入商品数据
async function importProducts(filePath) {
  console.log('🚀 开始导入商品数据...');
  
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log(`📁 成功读取文件: ${filePath}`);
    
    // 解析制表符分隔的数据
    const data = parseTabSeparatedFile(fileContent);
    console.log(`📊 解析到 ${data.length} 条商品记录`);
    
    // 导入结果统计
    const result = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    // 准备商品数据存储文件路径
    const storageDir = path.join(__dirname, '..', 'lib', 'utils', 'storage');
    const storageFilePath = path.join(storageDir, 'mock-db.json');
    
    // 确保目录存在
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
      console.log(`📁 创建目录: ${storageDir}`);
    }
    
    // 读取现有数据
    let mockDB = {};
    try {
      if (fs.existsSync(storageFilePath)) {
        mockDB = JSON.parse(fs.readFileSync(storageFilePath, 'utf8'));
        console.log(`📚 读取现有商品: ${Array.isArray(mockDB.products) ? mockDB.products.length : 0} 条`);
      }
    } catch (err) {
      console.log('⚠️  未找到或无法读取现有数据，将创建新的数据文件');
      mockDB = {};
    }
    
    // 确保products数组存在
    if (!Array.isArray(mockDB.products)) {
      mockDB.products = [];
    }
    
    // 处理每条商品记录
    data.forEach((row, index) => {
      try {
        // 验证必填字段
        if (!row['商品别名']) {
          throw new Error('商品别名不能为空');
        }
        
        // 创建商品对象
        const product = {
          id: `PROD${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          name: row['商品别名'],
          alias: row['商品别名'],
          barcode: row['商品条形码'] ? [row['商品条形码']] : [],
          categoryId: mapCategory(row['商品类型']),
          unit: row['商品单位'] || '个',
          originalPrice: parseFloat(row['原价']) || 0,
          price: parseFloat(row['优惠价']) || parseFloat(row['原价']) || 0,
          memberPrice: parseFloat(row['会员价']) || parseFloat(row['优惠价']) || parseFloat(row['原价']) || 0,
          stock: 100, // 默认库存
          minStock: 10,
          costPrice: 0,
          images: [],
          flavors: [],
          isGift: false,
          allowDiscount: true,
          isSale: row['销售商品'] === '是',
          isRecommend: row['推荐商品'] === '是',
          isLowConsumption: false,
          displayOrder: parseInt(row['显示顺序']) || 0,
          storeId: row['门店'] === '启智' ? 'qizhi' : 'default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        mockDB.products.push(product);
        result.success++;
        
        // 输出进度
        if ((index + 1) % 10 === 0 || index + 1 === data.length) {
          console.log(`⚡ 已处理 ${index + 1}/${data.length} 条记录`);
        }
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: index + 2,
          message: error.message,
          data: row
        });
      }
    });
    
    // 保存数据到文件
    fs.writeFileSync(storageFilePath, JSON.stringify(mockDB, null, 2));
    console.log(`💾 数据已保存到: ${storageFilePath}`);
    
    // 输出导入结果
    console.log('✅ 导入完成!');
    console.log(`✅ 成功: ${result.success}`);
    console.log(`❌ 失败: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('📋 错误详情:');
      result.errors.slice(0, 5).forEach(error => {
        console.log(`  行 ${error.row}: ${error.message}`);
      });
      if (result.errors.length > 5) {
        console.log(`  ... 还有 ${result.errors.length - 5} 个错误未显示`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ 导入过程发生错误:', error.message);
    throw error;
  }
}

// 商品类型映射
function mapCategory(type) {
  const categoryMap = {
    '小吃': 'snack',
    '饮料': 'drink',
    '烟酒': 'tobacco',
    '客赔物品': 'compensation',
    '其他': 'other'
  };
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (type && type.includes(key)) {
      return value;
    }
  }
  
  return 'other';
}

// 主函数
async function main() {
  const filePath = '/Users/yanyu/yyc3-admin-system-2/商品列表';
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }
  
  try {
    await importProducts(filePath);
  } catch (error) {
    console.error('❌ 导入失败');
    process.exit(1);
  }
}

// 执行主函数
main().then(() => {
  console.log('🎉 商品数据导入任务已完成!');
}).catch((error) => {
  console.error('❌ 任务执行失败:', error);
  process.exit(1);
});