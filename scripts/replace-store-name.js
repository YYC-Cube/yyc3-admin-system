#!/usr/bin/env node

/**
 * @file 门店名称替换脚本
 * @description 批量替换项目中所有"启智"和"启智"为"启智"
 * @author YYC
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const PROJECT_ROOT = '/Users/yanyu/yyc3-admin-system-2';

// 要忽略的目录
const IGNORE_DIRS = [
  'node_modules',
  '.git',
  '.next',
  '.swc',
  'coverage',
  'dist',
  'build',
  'out'
];

// 要忽略的文件类型
const IGNORE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.mp3',
  '.mp4',
  '.avi',
  '.mov',
  '.zip',
  '.tar',
  '.gz',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx'
];

// 要替换的关键词
const REPLACEMENTS = [
  { from: '启智', to: '启智' },
  { from: '启智', to: '启智' },
  { from: '启智', to: '启智' }
];

let totalFilesScanned = 0;
let totalFilesModified = 0;
let totalReplacements = 0;

/**
 * 检查文件是否应该被忽略
 */
function shouldIgnoreFile(filePath) {
  // 检查是否在忽略的目录中
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const pathParts = relativePath.split(path.sep);
  
  // 忽略以点开头的目录和文件
  if (pathParts.some(part => part.startsWith('.'))) {
    return true;
  }
  
  // 忽略指定的目录
  if (pathParts.some(part => IGNORE_DIRS.includes(part))) {
    return true;
  }
  
  // 忽略指定的文件扩展名
  const ext = path.extname(filePath).toLowerCase();
  if (IGNORE_EXTENSIONS.includes(ext)) {
    return true;
  }
  
  return false;
}

/**
 * 替换文件中的关键词
 */
async function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let replacementsInFile = 0;
    
    // 执行替换
    REPLACEMENTS.forEach(({ from, to }) => {
      const regex = new RegExp(from, 'g');
      const matches = (content.match(regex) || []).length;
      replacementsInFile += matches;
      newContent = newContent.replace(regex, to);
    });
    
    // 如果有替换，写回文件
    if (replacementsInFile > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      totalFilesModified++;
      totalReplacements += replacementsInFile;
      console.log(`✓ ${filePath} - 替换了 ${replacementsInFile} 处`);
    }
    
    totalFilesScanned++;
  } catch (error) {
    console.error(`✗ 处理 ${filePath} 时出错: ${error.message}`);
  }
}

/**
 * 递归遍历目录
 */
async function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (shouldIgnoreFile(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else {
        await replaceInFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`✗ 扫描目录 ${dir} 时出错: ${error.message}`);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始替换门店名称...');
  console.log(`根目录: ${PROJECT_ROOT}`);
  console.log('替换规则:', REPLACEMENTS);
  console.log('='.repeat(80));
  
  const startTime = Date.now();
  
  await scanDirectory(PROJECT_ROOT);
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('='.repeat(80));
  console.log('替换完成!');
  console.log(`扫描文件数: ${totalFilesScanned}`);
  console.log(`修改文件数: ${totalFilesModified}`);
  console.log(`替换次数: ${totalReplacements}`);
  console.log(`用时: ${duration.toFixed(2)} 秒`);
}

// 执行主函数
main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
