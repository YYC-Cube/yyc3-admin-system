# 分支清理指南 / Branch Cleanup Guide

## 概览 / Overview

本文档提供了清理和管理 `yyc3-admin-system` 仓库分支的完整指南。

This document provides a complete guide for cleaning up and managing branches in the `yyc3-admin-system` repository.

## 当前分支状态 / Current Branch Status

### 已合并的分支 / Merged Branches

以下分支的更改已合并到 `main`，可以安全删除：

The following branches have their changes merged into `main` and can be safely deleted:

1. **copilot/fix-cicd-workflow-files** - PR #21 已合并 / Merged
2. **copilot/fix-235006543-1083390613-21d3eacb-5346-4ed7-b240-720bf6171503** - PR #19 已合并 / Merged
3. **copilot/fix-vulnerabilities-and-dependencies** - PR #20 已合并 / Merged
4. **copilot/fix-workflow-failure** - PR #10 已合并 / Merged
5. **copilot/merge-all-branches-to-main** - PR #11 已合并 / Merged
6. **copilot/fix-eslint-errors-check-kanban-report** - PR #13 已合并 / Merged
7. **copilot/fix-eslint-errors-check-kanban-report-again** - PR #14 已合并 / Merged
8. **copilot/fix-eslint-errors-check-kanban-report-another-one** - PR #16 已合并 / Merged
9. **copilot/fix-eslint-errors-in-kanban-script** - PR #15 已合并 / Merged
10. **dependabot/npm_and_yarn/npm_and_yarn-2e94d63b2a** - PR #17, #18 已合并 / Merged

### 活跃分支 / Active Branches

1. **main** - 主分支（受保护）/ Main branch (protected)
2. **chore/kanban-ci-demo** - 看板 CI 演示分支 / Kanban CI demo branch
3. **copilot/cleanup-merge-branches** - 当前分支清理工作 / Current cleanup work

## 清理步骤 / Cleanup Steps

### 方法1：通过 GitHub 网页界面 / Method 1: Via GitHub Web Interface

1. 访问仓库页面 / Visit repository page:

   ```
   https://github.com/YYC-Cube/yyc3-admin-system
   ```

2. 点击 "Branches" 标签 / Click "Branches" tab

3. 对于每个已合并的分支：/ For each merged branch:
   - 找到分支名称旁边的删除按钮（垃圾桶图标）
   - Find the delete button (trash icon) next to the branch name
   - 点击确认删除 / Click to confirm deletion

### 方法2：使用 Git 命令行 / Method 2: Using Git Command Line

**注意：需要适当的仓库权限 / Note: Requires appropriate repository permissions**

```bash
# 删除远程分支 / Delete remote branch
git push origin --delete <branch-name>

# 批量删除示例 / Batch delete example
git push origin --delete \
  copilot/fix-cicd-workflow-files \
  copilot/fix-235006543-1083390613-21d3eacb-5346-4ed7-b240-720bf6171503 \
  copilot/fix-vulnerabilities-and-dependencies \
  copilot/fix-workflow-failure \
  copilot/merge-all-branches-to-main \
  copilot/fix-eslint-errors-check-kanban-report \
  copilot/fix-eslint-errors-check-kanban-report-again \
  copilot/fix-eslint-errors-check-kanban-report-another-one \
  copilot/fix-eslint-errors-in-kanban-script \
  dependabot/npm_and_yarn/npm_and_yarn-2e94d63b2a

# 清理本地已删除的远程分支引用 / Prune local references to deleted remote branches
git fetch --prune
```

### 方法3：使用自动化脚本 / Method 3: Using Automation Script

参见下面的 `scripts/cleanup-branches.sh` 脚本 / See the `scripts/cleanup-branches.sh` script below

## 分支管理最佳实践 / Branch Management Best Practices

### 命名规范 / Naming Conventions

- **feature/** - 新功能分支 / New feature branches
- **fix/** 或 **bugfix/** - 错误修复 / Bug fixes
- **chore/** - 维护任务 / Maintenance tasks
- **copilot/** - Copilot 自动生成的分支 / Copilot-generated branches
- **dependabot/** - Dependabot 自动更新 / Dependabot automated updates

### 分支生命周期 / Branch Lifecycle

1. **创建分支** / Create Branch
   - 从最新的 `main` 分支创建 / Create from latest `main`
   - 使用描述性名称 / Use descriptive names

2. **开发和提交** / Development and Commits
   - 定期与 `main` 同步 / Sync regularly with `main`
   - 保持提交历史清晰 / Keep commit history clean

3. **创建 Pull Request** / Create Pull Request
   - 填写详细的描述 / Provide detailed description
   - 关联相关 Issue / Link related issues
   - 等待代码审查 / Wait for code review

4. **合并后清理** / Post-Merge Cleanup
   - **立即删除已合并的分支** / Delete merged branches immediately
   - 更新本地仓库 / Update local repository

### 何时保留分支 / When to Keep Branches

保留分支的情况：/ Keep branches when:

- ✅ 分支代表长期开发工作 / Branch represents long-term development work
- ✅ 分支用于特定版本或发布 / Branch is for specific version or release
- ✅ 分支包含未完成的实验性功能 / Branch contains unfinished experimental features
- ✅ 分支是团队协作的基础 / Branch is foundation for team collaboration

### 何时删除分支 / When to Delete Branches

删除分支的情况：/ Delete branches when:

- ❌ PR 已合并到 `main` / PR has been merged to `main`
- ❌ 功能已弃用 / Feature has been abandoned
- ❌ 分支超过 30 天无活动 / Branch has been inactive for 30+ days
- ❌ 分支是一次性任务（如热修复）/ Branch was one-time task (like hotfix)

## 自动化清理 / Automated Cleanup

### 定期审查 / Regular Reviews

建议每月审查一次分支列表：/ Review branch list monthly:

```bash
# 查看所有远程分支及最后提交日期 / View all remote branches with last commit date
git for-each-ref --sort=-committerdate refs/remotes/origin --format='%(committerdate:short) %(refname:short)'
```

### GitHub Actions 工作流 / GitHub Actions Workflow

考虑添加自动化工作流来管理陈旧分支：/ Consider adding automated workflow for stale branches:

- 标记超过 30 天无活动的分支 / Flag branches inactive for 30+ days
- 通知分支所有者 / Notify branch owners
- 自动删除已合并且闲置的分支 / Auto-delete merged and idle branches

## 安全提示 / Safety Tips

⚠️ **在删除分支前请确认：** / Before deleting branches, confirm:

1. 分支的更改已合并或不再需要 / Changes are merged or no longer needed
2. 没有未合并的 Pull Request 引用该分支 / No open PRs reference the branch
3. 团队成员不再依赖该分支 / Team members no longer depend on the branch

## 恢复已删除的分支 / Recovering Deleted Branches

如果误删分支，可以通过以下方式恢复：/ If you accidentally delete a branch, recover it:

```bash
# 查找分支的最后提交 SHA / Find the last commit SHA of the branch
git reflog show origin/<branch-name>

# 或在 GitHub 的 PR 页面查看合并的 commit SHA
# Or check the merged commit SHA in the GitHub PR page

# 重新创建分支 / Recreate the branch
git checkout -b <branch-name> <commit-sha>
git push origin <branch-name>
```

## 参考资源 / Reference Resources

- [Git 分支管理](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86)
- [GitHub 分支保护规则](https://docs.github.com/cn/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Git 最佳实践](https://www.git-tower.com/learn/git/ebook/cn/command-line/appendix/best-practices)

---

**最后更新 / Last Updated:** 2025-11-04
**维护者 / Maintainer:** YYC-Cube Team
