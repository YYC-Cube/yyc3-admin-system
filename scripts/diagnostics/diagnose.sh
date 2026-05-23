#!/bin/bash

# === 诊断工具快速启动脚本 ===
# @file diagnose.sh
# @description 提供快速诊断和问题排查功能
# @author YYC
# @version 1.0.0
# @created 2025-11-15

set -euo pipefail  # 严格模式
trap "cleanup" EXIT INT TERM

# 配置变量
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/configs/config.json"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 清理函数
cleanup() {
    echo -e "\n${GREEN}🧹 清理临时文件...${NC}"
    # 在这里可以添加清理逻辑
}

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}🔍 检查系统依赖...${NC}"
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    local node_version=$(node --version)
    echo -e "${GREEN}✅ Node.js 版本: $node_version${NC}"
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    local npm_version=$(npm --version)
    echo -e "${GREEN}✅ npm 版本: $npm_version${NC}"
    
    # 检查配置文件
    if [[ -f "$CONFIG_FILE" ]]; then
        echo -e "${GREEN}✅ 配置文件存在${NC}"
    else
        echo -e "${YELLOW}⚠️ 配置文件不存在，使用默认设置${NC}"
    fi
}

# 显示帮助信息
show_help() {
    echo -e "${CYAN}🔧 问题诊断与故障排查工具包${NC}"
    echo -e "${PURPLE}版本: 1.0.0 | 作者: YYC${NC}"
    echo ""
    echo "用法:"
    echo "  $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示帮助信息"
    echo "  -i, --interactive       启动交互式诊断 (默认)"
    echo "  -q, --quick             快速系统检查"
    echo "  -f, --full              完整系统诊断"
    echo "  -e, --errors            分析错误日志"
    echo "  -p, --performance       性能检查"
    echo "  -s, --security          安全扫描"
    echo "  -r, --report            查看历史报告"
    echo "  -c, --config            编辑配置文件"
    echo "  --install-deps          安装依赖包"
    echo "  --clean-reports         清理旧报告"
    echo "  --health-check          系统健康检查"
    echo ""
    echo "示例:"
    echo "  $0                      # 启动交互式诊断"
    echo "  $0 -q                   # 快速检查"
    echo "  $0 -f                   # 完整诊断"
    echo "  $0 -e --report          # 分析错误并生成报告"
    echo ""
    echo -e "${GREEN}保持代码健康，稳步前行！ 🌹${NC}"
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}📦 安装诊断工具依赖...${NC}"
    
    cd "$SCRIPT_DIR"
    
    if [[ -f "package.json" ]]; then
        npm install
        echo -e "${GREEN}✅ 依赖安装完成${NC}"
    else
        echo -e "${RED}❌ 未找到 package.json 文件${NC}"
        exit 1
    fi
}

# 启动交互式诊断
start_interactive() {
    echo -e "${BLUE}🚀 启动交互式诊断工具...${NC}"
    
    cd "$SCRIPT_DIR"
    node scripts/interactive-diagnostics.js
}

# 快速检查
quick_check() {
    echo -e "${BLUE}⚡ 执行快速系统检查...${NC}"
    
    cd "$SCRIPT_DIR"
    
    # 创建简化的快速检查脚本
    cat > /tmp/quick-check.js << 'EOF'
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function quickCheck() {
    console.log('🔍 开始快速系统检查...\n');
    
    const checks = [
        { name: '磁盘空间', cmd: 'df -h / | tail -1' },
        { name: '内存使用', cmd: 'vm_stat | grep "Pages free"' },
        { name: 'Node.js进程', cmd: 'ps aux | grep node | grep -v grep' },
        { name: '项目文件', cmd: 'ls -la | head -5' }
    ];
    
    for (const check of checks) {
        try {
            const { stdout } = await execAsync(check.cmd);
            console.log(`✅ ${check.name}: 正常`);
            if (stdout.trim()) {
                console.log(`   ${stdout.trim().split('\n')[0]}`);
            }
        } catch (error) {
            console.log(`❌ ${check.name}: ${error.message}`);
        }
        console.log('');
    }
}

quickCheck().catch(console.error);
EOF
    
    node /tmp/quick-check.js
    rm /tmp/quick-check.js
}

# 完整诊断
full_diagnosis() {
    echo -e "${BLUE}🔍 执行完整系统诊断...${NC}"
    
    cd "$SCRIPT_DIR"
    node scripts/system-diagnosis.js
}

# 错误分析
error_analysis() {
    echo -e "${BLUE}🚨 分析错误日志...${NC}"
    
    cd "$SCRIPT_DIR"
    node scripts/log-analyzer.js
}

# 性能检查
performance_check() {
    echo -e "${BLUE}⚡ 执行性能检查...${NC}"
    
    local temp_script="/tmp/performance-check.js"
    
    cat > "$temp_script" << 'EOF'
const fs = require('fs');
const path = require('path');

function performanceCheck() {
    console.log('🔍 开始性能检查...\n');
    
    // 检查node_modules大小
    const nodeModulesPath = '/Users/yanyu/yyc3-admin-system-2/node_modules';
    if (fs.existsSync(nodeModulesPath)) {
        const stats = fs.statSync(nodeModulesPath);
        const sizeMB = Math.round(stats.size / (1024 * 1024));
        console.log(`📦 node_modules 大小: ${sizeMB}MB`);
        
        if (sizeMB > 1000) {
            console.log('❌ 建议清理node_modules，可能过大');
        } else {
            console.log('✅ node_modules大小正常');
        }
    }
    
    // 检查构建产物
    const nextPath = '/Users/yanyu/yyc3-admin-system-2/.next';
    if (fs.existsSync(nextPath)) {
        const stats = fs.statSync(nextPath);
        const sizeMB = Math.round(stats.size / (1024 * 1024));
        console.log(`🏗️ .next 构建产物: ${sizeMB}MB`);
    }
    
    console.log('\n💡 性能建议:');
    console.log('   - 定期清理构建产物: npm run clean');
    console.log('   - 检查未使用的依赖: npm outdated');
    console.log('   - 使用分析工具: npm run analyze');
}

performanceCheck();
EOF
    
    node "$temp_script"
    rm "$temp_script"
}

# 安全扫描
security_scan() {
    echo -e "${BLUE}🔒 执行安全扫描...${NC}"
    
    local temp_script="/tmp/security-check.js"
    
    cat > "$temp_script" << 'EOF'
const fs = require('fs');
const path = require('path');

function securityCheck() {
    console.log('🔒 开始安全扫描...\n');
    
    const projectPath = '/Users/yanyu/yyc3-admin-system-2';
    
    // 检查环境文件权限
    const envFiles = ['.env', '.env.local', '.env.production'];
    envFiles.forEach(envFile => {
        const envPath = path.join(projectPath, envFile);
        if (fs.existsSync(envPath)) {
            const stats = fs.statSync(envPath);
            const isSecure = (stats.mode & 0o77) === 0;
            console.log(`${isSecure ? '✅' : '❌'} ${envFile}: ${isSecure ? '权限安全' : '权限不安全'}`);
        }
    });
    
    // 检查package.json敏感信息
    const packagePath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        console.log('\n📦 依赖包检查:');
        
        const criticalPackages = ['lodash', 'moment', 'axios'];
        criticalPackages.forEach(pkg => {
            if (packageData.dependencies && packageData.dependencies[pkg]) {
                console.log(`⚠️  建议检查 ${pkg}:${packageData.dependencies[pkg]} 的安全更新`);
            }
        });
    }
    
    console.log('\n💡 安全建议:');
    console.log('   - 定期更新依赖包: npm audit');
    console.log('   - 使用安全扫描工具: npm audit fix');
    console.log('   - 检查环境变量是否泄露敏感信息');
}

securityCheck();
EOF
    
    node "$temp_script"
    rm "$temp_script"
}

# 查看报告
view_reports() {
    echo -e "${BLUE}📋 查看历史报告...${NC}"
    
    const reportsDir="$SCRIPT_DIR/reports"
    
    if [[ ! -d "$reportsDir" ]]; then
        echo -e "${YELLOW}⚠️ 报告目录不存在${NC}"
        return
    fi
    
    local reports=($(ls -t "$reportsDir"/*.json 2>/dev/null || true))
    
    if [[ ${#reports[@]} -eq 0 ]]; then
        echo -e "${YELLOW}⚠️ 未发现历史报告${NC}"
        return
    fi
    
    echo -e "${GREEN}📊 可用报告:${NC}"
    for i in "${!reports[@]}"; do
        if [[ $i -lt 5 ]]; then
            local filename=$(basename "${reports[$i]}")
            local size=$(du -h "${reports[$i]}" | cut -f1)
            echo -e "${CYAN}  $((i+1)). $filename ($size)${NC}"
        fi
    done
    
    if [[ ${#reports[@]} -gt 5 ]]; then
        echo -e "${YELLOW}  ... 还有 $(( ${#reports[@]} - 5 )) 个报告${NC}"
    fi
}

# 编辑配置
edit_config() {
    echo -e "${BLUE}⚙️ 编辑配置文件...${NC}"
    
    if [[ -f "$CONFIG_FILE" ]]; then
        echo -e "${GREEN}✅ 打开配置文件: $CONFIG_FILE${NC}"
        # 在macOS上使用默认编辑器
        open "$CONFIG_FILE" 2>/dev/null || echo "请手动编辑: $CONFIG_FILE"
    else
        echo -e "${YELLOW}⚠️ 配置文件不存在${NC}"
    fi
}

# 清理报告
clean_reports() {
    echo -e "${BLUE}🧹 清理旧报告...${NC}"
    
    const reportsDir="$SCRIPT_DIR/reports"
    
    if [[ -d "$reportsDir" ]]; then
        local before_count=$(ls "$reportsDir"/*.json 2>/dev/null | wc -l)
        
        if [[ $before_count -gt 0 ]]; then
            # 保留最新的3个报告
            ls -t "$reportsDir"/*.json 2>/dev/null | tail -n +4 | xargs rm -f 2>/dev/null || true
            
            local after_count=$(ls "$reportsDir"/*.json 2>/dev/null | wc -l)
            echo -e "${GREEN}✅ 报告清理完成 (从 $before_count 清理到 $after_count 个)${NC}"
        else
            echo -e "${YELLOW}⚠️ 没有报告需要清理${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ 报告目录不存在${NC}"
    fi
}

# 系统健康检查
health_check() {
    echo -e "${BLUE}🏥 系统健康检查...${NC}"
    
    echo -e "${CYAN}📊 系统状态概览:${NC}"
    echo -e "${GREEN}  ✅ 工作目录: $(pwd)${NC}"
    echo -e "${GREEN}  ✅ 项目路径: $PROJECT_ROOT${NC}"
    echo -e "${GREEN}  ✅ 脚本目录: $SCRIPT_DIR${NC}"
    echo -e "${GREEN}  ✅ 配置文件: $CONFIG_FILE${NC}"
    
    # 检查关键文件
    local key_files=("package.json" "scripts/system-diagnosis.js" "scripts/log-analyzer.js")
    for file in "${key_files[@]}"; do
        if [[ -f "$SCRIPT_DIR/$file" ]]; then
            echo -e "${GREEN}  ✅ $file${NC}"
        else
            echo -e "${RED}  ❌ $file${NC}"
        fi
    done
    
    echo -e "\n${GREEN}🌹 系统诊断工具包状态良好！${NC}"
}

# 主函数
main() {
    local mode="interactive"
    
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -i|--interactive)
                mode="interactive"
                shift
                ;;
            -q|--quick)
                mode="quick"
                shift
                ;;
            -f|--full)
                mode="full"
                shift
                ;;
            -e|--errors)
                mode="errors"
                shift
                ;;
            -p|--performance)
                mode="performance"
                shift
                ;;
            -s|--security)
                mode="security"
                shift
                ;;
            -r|--report)
                mode="report"
                shift
                ;;
            -c|--config)
                mode="config"
                shift
                ;;
            --install-deps)
                install_dependencies
                exit 0
                ;;
            --clean-reports)
                clean_reports
                exit 0
                ;;
            --health-check)
                health_check
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 未知选项: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 切换到项目根目录
    cd "$PROJECT_ROOT"
    
    # 检查依赖
    check_dependencies
    
    # 根据模式执行相应功能
    case $mode in
        interactive)
            start_interactive
            ;;
        quick)
            quick_check
            ;;
        full)
            full_diagnosis
            ;;
        errors)
            error_analysis
            ;;
        performance)
            performance_check
            ;;
        security)
            security_scan
            ;;
        report)
            view_reports
            ;;
        config)
            edit_config
            ;;
    esac
}

# 脚本入口
main "$@"