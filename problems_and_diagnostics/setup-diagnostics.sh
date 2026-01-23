#!/bin/bash

# === 问题诊断工具环境设置脚本 ===
# @file setup-diagnostics.sh
# @description 为项目设置问题诊断工具的环境变量和全局命令
# @author YYC
# @version 1.0.0
# @created 2025-11-15

set -euo pipefail  # 严格模式

# 配置变量
DIAGNOSTICS_DIR="/Users/yanyu/yyc3-admin-system-2/problems_and_diagnostics"
PROJECT_ROOT="/Users/yanyu/yyc3-admin-system-2"
BIN_DIR="$PROJECT_ROOT/bin"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示欢迎信息
show_welcome() {
    echo -e "${BLUE}🔧 问题诊断工具环境设置${NC}"
    echo -e "${YELLOW}为项目配置诊断工具包...${NC}"
    echo ""
}

# 创建全局启动脚本
create_global_launcher() {
    echo -e "${BLUE}📦 创建全局诊断命令...${NC}"
    
    # 确保bin目录存在
    mkdir -p "$BIN_DIR"
    
    # 创建全局诊断命令
    cat > "$BIN_DIR/diagnose" << EOF
#!/bin/bash
# 问题诊断工具全局启动器

# 设置诊断工具路径
DIAGNOSTICS_DIR="$DIAGNOSTICS_DIR"
PROJECT_ROOT="$PROJECT_ROOT"

# 检查诊断工具目录
if [[ ! -d "\$DIAGNOSTICS_DIR" ]]; then
    echo -e "${RED}❌ 诊断工具目录不存在: \$DIAGNOSTICS_DIR${NC}"
    exit 1
fi

# 切换到诊断工具目录并执行
cd "\$DIAGNOSTICS_DIR"
exec ./diagnose.sh "\$@"
EOF
    
    # 设置执行权限
    chmod +x "$BIN_DIR/diagnose"
    
    # 添加到PATH（如果需要）
    echo ""
    echo -e "${GREEN}✅ 全局诊断命令已创建: $BIN_DIR/diagnose${NC}"
    echo ""
    echo -e "${YELLOW}💡 使用方法:${NC}"
    echo -e "  在任何位置运行: ${BLUE}$BIN_DIR/diagnose${NC}"
    echo -e "  或在项目根目录: ${BLUE}./bin/diagnose${NC}"
    echo ""
}

# 设置环境变量
setup_environment() {
    echo -e "${BLUE}🌍 设置环境变量...${NC}"
    
    # 创建环境配置文件
    cat > "$DIAGNOSTICS_DIR/.env" << EOF
# 问题诊断工具环境配置
# Created: $(date)

# 项目路径
PROJECT_ROOT="$PROJECT_ROOT"
DIAGNOSTICS_DIR="$DIAGNOSTICS_DIR"

# 日志配置
LOG_LEVEL="info"
LOG_FILE="\$DIAGNOSTICS_DIR/reports/diagnostics.log"

# 报告配置
REPORTS_DIR="\$DIAGNOSTICS_DIR/reports"
MAX_REPORTS=10

# 性能配置
QUICK_CHECK_TIMEOUT=300000
FULL_DIAGNOSIS_TIMEOUT=900000

# 通知配置
ENABLE_NOTIFICATIONS=false
NOTIFICATION_LEVEL="warning"

# 高级配置
ENABLE_MACHINE_LEARNING=false
AUTO_SCAN_ENABLED=false
EOF
    
    echo -e "${GREEN}✅ 环境配置文件已创建: $DIAGNOSTICS_DIR/.env${NC}"
}

# 创建快捷别名
setup_aliases() {
    echo -e "${BLUE}⚡ 设置快捷别名...${NC}"
    
    # 创建别名配置文件
    cat > "$DIAGNOSTICS_DIR/.bash_aliases" << 'EOF'
# 问题诊断工具快捷别名
# Source this file in your .bashrc or .zshrc

# 诊断工具别名
alias diagnose="$PROJECT_ROOT/bin/diagnose"
alias diag-quick="$PROJECT_ROOT/bin/diagnose --quick"
alias diag-full="$PROJECT_ROOT/bin/diagnose --full"
alias diag-errors="$PROJECT_ROOT/bin/diagnose --errors"
alias diag-performance="$PROJECT_ROOT/bin/diagnose --performance"
alias diag-security="$PROJECT_ROOT/bin/diagnose --security"
alias diag-report="$PROJECT_ROOT/bin/diagnose --report"
alias diag-health="$PROJECT_ROOT/bin/diagnose --health-check"

# 项目相关别名
alias cd-diagnostics='cd $DIAGNOSTICS_DIR'
alias cat-diagnose-help='$PROJECT_ROOT/bin/diagnose --help'
EOF
    
    echo -e "${GREEN}✅ 别名配置文件已创建: $DIAGNOSTICS_DIR/.bash_aliases${NC}"
    echo ""
    echo -e "${YELLOW}💡 要使用别名，请将以下内容添加到你的 ~/.bashrc 或 ~/.zshrc:${NC}"
    echo -e "${CYAN}source $DIAGNOSTICS_DIR/.bash_aliases${NC}"
    echo ""
}

# 验证安装
verify_installation() {
    echo -e "${BLUE}🔍 验证安装...${NC}"
    
    local errors=0
    
    # 检查目录
    if [[ ! -d "$DIAGNOSTICS_DIR" ]]; then
        echo -e "${RED}❌ 诊断工具目录不存在: $DIAGNOSTICS_DIR${NC}"
        errors=$((errors + 1))
    fi
    
    # 检查脚本
    if [[ ! -x "$DIAGNOSTICS_DIR/diagnose.sh" ]]; then
        echo -e "${RED}❌ 诊断启动脚本不可执行${NC}"
        errors=$((errors + 1))
    fi
    
    # 检查全局命令
    if [[ ! -x "$BIN_DIR/diagnose" ]]; then
        echo -e "${RED}❌ 全局诊断命令不可执行${NC}"
        errors=$((errors + 1))
    fi
    
    # 检查配置文件
    if [[ ! -f "$DIAGNOSTICS_DIR/configs/config.json" ]]; then
        echo -e "${RED}❌ 配置文件不存在${NC}"
        errors=$((errors + 1))
    fi
    
    if [[ $errors -eq 0 ]]; then
        echo -e "${GREEN}✅ 安装验证通过${NC}"
        
        # 测试全局命令
        echo -e "${BLUE}🧪 测试全局命令...${NC}"
        if "$BIN_DIR/diagnose" --health-check > /dev/null 2>&1; then
            echo -e "${GREEN}✅ 全局命令测试成功${NC}"
        else
            echo -e "${YELLOW}⚠️ 全局命令测试警告${NC}"
        fi
    else
        echo -e "${RED}❌ 安装验证失败，发现 $errors 个问题${NC}"
        return 1
    fi
}

# 显示使用说明
show_usage() {
    echo ""
    echo -e "${GREEN}🎉 问题诊断工具安装完成！${NC}"
    echo ""
    echo -e "${CYAN}📋 使用方法:${NC}"
    echo -e "${YELLOW}1. 快速检查:${NC}"
    echo -e "   ${BLUE}$BIN_DIR/diagnose --quick${NC}"
    echo ""
    echo -e "${YELLOW}2. 完整诊断:${NC}"
    echo -e "   ${BLUE}$BIN_DIR/diagnose --full${NC}"
    echo ""
    echo -e "${YELLOW}3. 交互式诊断:${NC}"
    echo -e "   ${BLUE}$BIN_DIR/diagnose${NC}"
    echo ""
    echo -e "${YELLOW}4. 查看帮助:${NC}"
    echo -e "   ${BLUE}$BIN_DIR/diagnose --help${NC}"
    echo ""
    echo -e "${CYAN}📁 重要路径:${NC}"
    echo -e "   诊断工具: ${GREEN}$DIAGNOSTICS_DIR${NC}"
    echo -e "   全局命令: ${GREEN}$BIN_DIR/diagnose${NC}"
    echo -e "   配置文件: ${GREEN}$DIAGNOSTICS_DIR/configs/config.json${NC}"
    echo -e "   报告目录: ${GREEN}$DIAGNOSTICS_DIR/reports/${NC}"
    echo ""
    echo -e "${CYAN}🔧 快捷别名:${NC}"
    echo -e "   运行: ${GREEN}source $DIAGNOSTICS_DIR/.bash_aliases${NC}"
    echo -e "   然后使用: ${GREEN}diagnose --quick${NC}"
    echo ""
    echo -e "${GREEN}🌹 保持代码健康，稳步前行！${NC}"
}

# 主函数
main() {
    show_welcome
    
    echo -e "${BLUE}🔧 开始安装问题诊断工具...${NC}"
    echo ""
    
    # 创建全局启动脚本
    create_global_launcher
    
    # 设置环境变量
    setup_environment
    
    # 设置别名
    setup_aliases
    
    # 验证安装
    if verify_installation; then
        show_usage
    else
        echo -e "${RED}❌ 安装过程中出现问题，请检查错误信息${NC}"
        exit 1
    fi
}

# 脚本入口
main "$@"