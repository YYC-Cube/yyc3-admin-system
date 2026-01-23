# 分支清理脚本 / Branch Cleanup Scripts

## cleanup-branches.sh

自动化分支清理脚本，用于删除已合并到 `main` 的远程分支。

Automated branch cleanup script for deleting remote branches that have been merged into `main`.

### 功能特性 / Features

- ✅ 自动识别已合并的分支 / Automatically identify merged branches
- ✅ 支持模拟运行（预览模式）/ Support dry-run (preview mode)
- ✅ 交互式确认 / Interactive confirmation
- ✅ 彩色输出 / Colored output
- ✅ 详细的执行统计 / Detailed execution statistics
- ✅ 错误处理和恢复指导 / Error handling and recovery guidance

### 使用方法 / Usage

#### 基本用法 / Basic Usage

```bash
# 交互式清理（推荐）/ Interactive cleanup (recommended)
./scripts/cleanup-branches.sh

# 预览将要删除的分支 / Preview branches to be deleted
./scripts/cleanup-branches.sh --dry-run

# 非交互式自动清理 / Non-interactive auto cleanup
./scripts/cleanup-branches.sh --yes

# 强制删除（跳过确认）/ Force delete (skip confirmation)
./scripts/cleanup-branches.sh --force --yes
```

#### 命令行选项 / Command Line Options

| 选项 / Option | 说明 / Description |
|--------------|-------------------|
| `-d, --dry-run` | 仅显示将要删除的分支，不实际执行 / Show branches without deleting |
| `-f, --force` | 跳过确认，直接删除 / Skip confirmation |
| `-y, --yes` | 非交互模式，自动确认 / Non-interactive mode |
| `-h, --help` | 显示帮助信息 / Show help message |

### 工作流程 / Workflow

1. **检查 Git 仓库** / Check Git Repository
   - 验证当前目录是否为 Git 仓库
   - Verify current directory is a Git repository

2. **更新远程信息** / Update Remote Information
   - 执行 `git fetch --prune` 更新远程分支列表
   - Execute `git fetch --prune` to update remote branch list

3. **识别已合并分支** / Identify Merged Branches
   - 查找已合并到 `main` 的分支
   - Find branches merged into `main`
   - 包含预定义的已知已合并分支列表
   - Include predefined list of known merged branches

4. **显示分支列表** / Display Branch List
   - 列出所有可以删除的分支
   - List all branches that can be deleted

5. **确认删除** / Confirm Deletion
   - 交互模式下请求用户确认
   - Request user confirmation in interactive mode

6. **执行删除** / Execute Deletion
   - 逐个删除远程分支
   - Delete remote branches one by one
   - 显示每个分支的删除结果
   - Show deletion result for each branch

7. **显示统计** / Display Statistics
   - 汇总成功和失败的分支数量
   - Summarize successful and failed branch counts

### 安全机制 / Safety Mechanisms

🛡️ **多重保护** / Multiple Protections:

1. **交互式确认** / Interactive Confirmation
   - 默认需要手动确认才能执行删除
   - Manual confirmation required by default

2. **模拟运行** / Dry Run Mode
   - 使用 `--dry-run` 可以预览而不实际删除
   - Use `--dry-run` to preview without actually deleting

3. **受保护分支** / Protected Branches
   - 永远不会删除 `main` 分支
   - Never deletes the `main` branch
   - 不会删除 `HEAD` 引用
   - Won't delete `HEAD` reference

4. **错误处理** / Error Handling
   - 单个分支删除失败不会中断整个过程
   - Individual branch deletion failure won't stop the process
   - 最后提供详细的失败统计
   - Provides detailed failure statistics at the end

### 示例输出 / Example Output

```bash
$ ./scripts/cleanup-branches.sh --dry-run

============================================
    分支清理工具 / Branch Cleanup Tool
============================================

[信息] 正在更新远程分支信息... / Updating remote branch information...
[成功] 远程分支信息已更新 / Remote branch information updated
[信息] 正在查找已合并到 main 的分支... / Finding branches merged into main...
[信息] 找到 10 个可以删除的分支: / Found 10 branches that can be deleted:

  • copilot/fix-cicd-workflow-files
  • copilot/fix-eslint-errors-check-kanban-report
  • copilot/fix-vulnerabilities-and-dependencies
  • copilot/fix-workflow-failure
  • copilot/merge-all-branches-to-main
  • dependabot/npm_and_yarn/npm_and_yarn-2e94d63b2a
  ...

[信息] [模拟] 将删除分支: copilot/fix-cicd-workflow-files
...

============================================
[信息] 清理完成 / Cleanup completed

[成功] 成功删除: 10 个分支 / Successfully deleted: 10 branches
[信息] 这是模拟运行，没有实际删除任何分支
============================================
```

### 故障排除 / Troubleshooting

#### 问题：权限被拒绝 / Problem: Permission Denied

```bash
error: insufficient permission for adding an object to repository database
```

**解决方案 / Solution:**
- 确保你有仓库的写入权限 / Ensure you have write access to the repository
- 检查 GitHub token 或 SSH 密钥配置 / Check GitHub token or SSH key configuration

#### 问题：分支无法删除 / Problem: Branch Cannot Be Deleted

```bash
error: unable to delete 'branch-name': remote ref does not exist
```

**解决方案 / Solution:**
- 分支可能已被删除 / Branch may have already been deleted
- 运行 `git fetch --prune` 更新本地引用 / Run `git fetch --prune` to update local references

### 手动清理命令 / Manual Cleanup Commands

如果脚本无法运行，可以使用以下手动命令：

If the script doesn't work, use these manual commands:

```bash
# 查看所有远程分支 / View all remote branches
git branch -r

# 查看已合并的分支 / View merged branches
git branch -r --merged origin/main

# 删除单个远程分支 / Delete a single remote branch
git push origin --delete branch-name

# 批量删除（谨慎使用）/ Batch delete (use with caution)
git branch -r --merged origin/main | \
  grep -v "HEAD" | \
  grep -v "main" | \
  sed 's/origin\///' | \
  xargs -I {} git push origin --delete {}

# 清理本地引用 / Clean up local references
git fetch --prune
```

### 最佳实践 / Best Practices

1. **定期清理** / Regular Cleanup
   - 建议每月运行一次清理脚本
   - Run cleanup script monthly

2. **先预览再执行** / Preview Before Execute
   - 始终先使用 `--dry-run` 预览
   - Always preview with `--dry-run` first

3. **团队沟通** / Team Communication
   - 在清理前通知团队成员
   - Notify team members before cleanup

4. **保留重要分支** / Preserve Important Branches
   - 确认分支真的不再需要
   - Confirm branches are truly no longer needed

### 相关文档 / Related Documentation

- [分支清理指南](../docs/BRANCH_CLEANUP_GUIDE.md)
- [Git 分支管理最佳实践](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86)

---

**维护者 / Maintainer:** YYC-Cube Team
**最后更新 / Last Updated:** 2025-11-04
