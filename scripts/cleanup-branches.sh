#!/bin/bash

# 分支清理自动化脚本 / Branch Cleanup Automation Script
# 用于安全地删除已合并的远程分支 / For safely deleting merged remote branches

set -e

# 颜色定义 / Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置 / Configuration
MAIN_BRANCH="main"
DRY_RUN=false
FORCE=false
INTERACTIVE=true

# 使用说明 / Usage
usage() {
    cat << EOF
使用说明 / Usage:
    $0 [OPTIONS]

选项 / Options:
    -d, --dry-run       仅显示将要删除的分支，不实际执行 / Show branches to be deleted without actually deleting
    -f, --force         跳过确认，直接删除 / Skip confirmation and delete directly
    -y, --yes           非交互模式，自动确认所有操作 / Non-interactive mode, auto-confirm all operations
    -h, --help          显示此帮助信息 / Show this help message

示例 / Examples:
    $0                  # 交互式清理 / Interactive cleanup
    $0 --dry-run        # 预览将要删除的分支 / Preview branches to delete
    $0 --force --yes    # 自动清理所有已合并分支 / Auto cleanup all merged branches

EOF
    exit 0
}

# 解析命令行参数 / Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -y|--yes)
            INTERACTIVE=false
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo -e "${RED}错误：未知选项 $1${NC}" / "Error: Unknown option $1"
            usage
            ;;
    esac
done

# 打印带颜色的消息 / Print colored messages
info() {
    echo -e "${BLUE}[信息]${NC} $1"
}

success() {
    echo -e "${GREEN}[成功]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[警告]${NC} $1"
}

error() {
    echo -e "${RED}[错误]${NC} $1"
}

# 检查是否在 git 仓库中 / Check if in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "当前目录不是 Git 仓库 / Not a git repository"
        exit 1
    fi
}

# 更新远程分支信息 / Update remote branch information
update_remote() {
    info "正在更新远程分支信息... / Updating remote branch information..."
    git fetch --prune origin
    success "远程分支信息已更新 / Remote branch information updated"
}

# 获取已合并到 main 的远程分支 / Get remote branches merged into main
get_merged_branches() {
    # 获取所有远程分支 / Get all remote branches (handle case where main might not exist locally)
    local all_branches=""
    if git show-ref --verify --quiet refs/remotes/origin/${MAIN_BRANCH}; then
        all_branches=$(git branch -r --merged origin/${MAIN_BRANCH} 2>/dev/null | grep -v "HEAD" | grep -v "${MAIN_BRANCH}" | sed 's/origin\///' | sed 's/^[[:space:]]*//')
    fi
    
    # 已知已合并的分支列表 / Known merged branches list
    local known_merged=(
        "copilot/fix-cicd-workflow-files"
        "copilot/fix-235006543-1083390613-21d3eacb-5346-4ed7-b240-720bf6171503"
        "copilot/fix-vulnerabilities-and-dependencies"
        "copilot/fix-workflow-failure"
        "copilot/merge-all-branches-to-main"
        "copilot/fix-eslint-errors-check-kanban-report"
        "copilot/fix-eslint-errors-check-kanban-report-again"
        "copilot/fix-eslint-errors-check-kanban-report-another-one"
        "copilot/fix-eslint-errors-in-kanban-script"
        "dependabot/npm_and_yarn/npm_and_yarn-2e94d63b2a"
    )
    
    # 合并两个列表并去重 / Merge both lists and remove duplicates
    local combined_list=""
    
    if [ -n "$all_branches" ]; then
        combined_list=$(echo "$all_branches")
    fi
    
    for branch in "${known_merged[@]}"; do
        # 检查分支是否存在于远程 / Check if branch exists on remote
        if git ls-remote --heads origin "${branch}" 2>/dev/null | grep -q "${branch}"; then
            if [ -n "$combined_list" ]; then
                combined_list=$(echo -e "${combined_list}\n${branch}")
            else
                combined_list="${branch}"
            fi
        fi
    done
    
    # 去重并排序 / Remove duplicates and sort
    echo "$combined_list" | grep -v "^$" | sort -u
}

# 显示将要删除的分支 / Display branches to be deleted
display_branches() {
    local branches=("$@")
    local count=${#branches[@]}
    
    if [ $count -eq 0 ]; then
        success "没有找到需要清理的分支 / No branches found for cleanup"
        return 1
    fi
    
    info "找到 ${count} 个可以删除的分支: / Found ${count} branches that can be deleted:"
    echo ""
    for branch in "${branches[@]}"; do
        echo "  • ${branch}"
    done
    echo ""
    
    return 0
}

# 删除远程分支 / Delete remote branch
delete_branch() {
    local branch=$1
    
    if [ "$DRY_RUN" = true ]; then
        info "[模拟] 将删除分支: ${branch} / [Dry Run] Would delete branch: ${branch}"
        return 0
    fi
    
    info "正在删除分支: ${branch} / Deleting branch: ${branch}"
    
    if git push origin --delete "${branch}" 2>&1; then
        success "已删除分支: ${branch} / Deleted branch: ${branch}"
        return 0
    else
        error "删除分支失败: ${branch} / Failed to delete branch: ${branch}"
        return 1
    fi
}

# 主函数 / Main function
main() {
    echo ""
    echo "============================================"
    echo "    分支清理工具 / Branch Cleanup Tool"
    echo "============================================"
    echo ""
    
    # 检查环境 / Check environment
    check_git_repo
    
    # 更新远程信息 / Update remote information
    update_remote
    
    # 获取已合并的分支 / Get merged branches
    info "正在查找已合并到 ${MAIN_BRANCH} 的分支... / Finding branches merged into ${MAIN_BRANCH}..."
    local branches=($(get_merged_branches))
    
    # 显示分支列表 / Display branch list
    if ! display_branches "${branches[@]}"; then
        exit 0
    fi
    
    # 交互式确认 / Interactive confirmation
    if [ "$INTERACTIVE" = true ] && [ "$DRY_RUN" = false ]; then
        echo ""
        warning "此操作将删除上述远程分支，且无法撤销！"
        warning "This operation will delete the above remote branches and cannot be undone!"
        echo ""
        read -p "确认要继续吗？(y/N) / Continue? (y/N): " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            info "操作已取消 / Operation cancelled"
            exit 0
        fi
    fi
    
    # 执行删除 / Execute deletion
    local deleted_count=0
    local failed_count=0
    
    for branch in "${branches[@]}"; do
        if delete_branch "${branch}"; then
            ((deleted_count++))
        else
            ((failed_count++))
        fi
    done
    
    # 显示统计信息 / Display statistics
    echo ""
    echo "============================================"
    info "清理完成 / Cleanup completed"
    echo ""
    success "成功删除: ${deleted_count} 个分支 / Successfully deleted: ${deleted_count} branches"
    
    if [ $failed_count -gt 0 ]; then
        error "删除失败: ${failed_count} 个分支 / Failed to delete: ${failed_count} branches"
    fi
    
    if [ "$DRY_RUN" = true ]; then
        info "这是模拟运行，没有实际删除任何分支 / This was a dry run, no branches were actually deleted"
        info "要执行实际删除，请运行: $0 / To actually delete, run: $0"
    fi
    
    echo "============================================"
    echo ""
}

# 运行主函数 / Run main function
main
