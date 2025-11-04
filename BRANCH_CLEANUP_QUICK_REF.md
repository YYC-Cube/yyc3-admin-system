# 分支清理快速参考 / Branch Cleanup Quick Reference

## 快速命令 / Quick Commands

### 方式1：使用自动化脚本 / Method 1: Using Automation Script

```bash
# 预览将要删除的分支（推荐第一次运行）
# Preview branches to be deleted (recommended for first run)
./scripts/cleanup-branches.sh --dry-run

# 交互式清理（安全模式）
# Interactive cleanup (safe mode)
./scripts/cleanup-branches.sh

# 自动清理（非交互模式）
# Auto cleanup (non-interactive)
./scripts/cleanup-branches.sh --yes
```

### 方式2：手动删除 / Method 2: Manual Deletion

```bash
# 删除单个分支 / Delete single branch
git push origin --delete branch-name

# 批量删除已合并的分支 / Batch delete merged branches
git push origin --delete \
  copilot/fix-cicd-workflow-files \
  copilot/fix-eslint-errors-check-kanban-report \
  copilot/fix-vulnerabilities-and-dependencies

# 清理本地引用 / Clean local references
git fetch --prune
```

### 方式3：GitHub 网页界面 / Method 3: GitHub Web Interface

1. 访问 https://github.com/YYC-Cube/yyc3-admin-system/branches
2. 找到已合并的分支
3. 点击删除按钮（垃圾桶图标）

## 当前需要清理的分支 / Branches to Clean Up

### 已合并 PR（可安全删除）/ Merged PRs (Safe to Delete)

- ✅ `copilot/fix-cicd-workflow-files` (PR #21)
- ✅ `copilot/fix-235006543-1083390613-21d3eacb-5346-4ed7-b240-720bf6171503` (PR #19)
- ✅ `copilot/fix-vulnerabilities-and-dependencies` (PR #20)
- ✅ `copilot/fix-workflow-failure` (PR #10)
- ✅ `copilot/merge-all-branches-to-main` (PR #11)
- ✅ `copilot/fix-eslint-errors-check-kanban-report` (PR #13)
- ✅ `copilot/fix-eslint-errors-check-kanban-report-again` (PR #14)
- ✅ `copilot/fix-eslint-errors-check-kanban-report-another-one` (PR #16)
- ✅ `copilot/fix-eslint-errors-in-kanban-script` (PR #15)
- ✅ `dependabot/npm_and_yarn/npm_and_yarn-2e94d63b2a` (PR #17, #18)

### 保留分支 / Keep Branches

- 🔒 `main` - 主分支（受保护）/ Main branch (protected)
- 🔧 `chore/kanban-ci-demo` - 活跃开发 / Active development

## 故障恢复 / Recovery

如果误删分支：/ If you accidentally delete a branch:

```bash
# 1. 在 GitHub PR 页面找到合并的 commit SHA
# Find the merged commit SHA on GitHub PR page

# 2. 重新创建分支
# Recreate the branch
git checkout -b branch-name commit-sha
git push origin branch-name
```

## 检查清单 / Checklist

删除分支前确认：/ Before deleting, confirm:

- [ ] PR 已合并到 main
- [ ] 没有开放的 PR 依赖此分支
- [ ] 团队成员已确认不再需要
- [ ] 已在 GitHub 上查看分支状态

## 定期维护 / Regular Maintenance

- 📅 每月检查一次分支状态 / Check branch status monthly
- 🧹 及时清理已合并的分支 / Clean merged branches promptly
- 📊 使用 `git branch -r --merged` 查看已合并分支 / Use `git branch -r --merged` to view merged branches

## 相关文档 / Related Docs

- 📖 [完整清理指南](../docs/BRANCH_CLEANUP_GUIDE.md)
- 🔧 [清理脚本文档](./README_CLEANUP.md)

---

**快速帮助 / Quick Help:** `./scripts/cleanup-branches.sh --help`
