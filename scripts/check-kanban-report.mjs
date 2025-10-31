name: Kanban Auto-Migrate

on:
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  validate-and-migrate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
          run_install: true

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: Unit Tests (CI)
        run: pnpm test:ci

      - name: Metrics & Docs Check (placeholder)
        run: |
          node -e "console.log('metrics ok')"
          test -f docs/ITERATION_BOARD_2W.md

      - name: Kanban Migrate (Backlog → Doing)
        env:
          KANBAN_ASSIGNEE: yanyu
          KANBAN_START_DATE: 2025-10-31
          KANBAN_END_DATE: 2025-11-14
        run: |
          node scripts/kanban-migrate.mjs

      - name: Verify Kanban Changes (grep quick check)
        continue-on-error: true
        run: |
          echo "Verifying Kanban changes..."
          OCC_ASSIGNEE=$(grep -c '执行人：yanyu' docs/ITERATION_BOARD_2W.md || true)
          OCC_DATE=$(grep -c '起止：2025-10-31 → 2025-11-14' docs/ITERATION_BOARD_2W.md || true)
          OCC_DOING=$(grep -c '\[Doing\]' docs/ITERATION_BOARD_2W.md || true)
          {
            echo "assignee_lines=$OCC_ASSIGNEE";
            echo "date_lines=$OCC_DATE";
            echo "doing_lines=$OCC_DOING";
          } > kanban-report.txt
          cat kanban-report.txt

      - name: Upload Kanban TXT Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: kanban-migrate-report
          path: kanban-report.txt

      - name: Generate JSON Report (structural check)
        run: |
          node scripts/kanban-migrate.mjs --check-only

      - name: Upload Kanban JSON Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: kanban-migrate-report-json
          path: kanban-report.json

      - name: Docs & KPI Structure Check (blocking)
        run: |
          node scripts/doc-kpi-check.mjs

      - name: Upload Docs/KPI Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: docs-check-report
          path: docs-check-report.json

      - name: Gate: fail if any task incomplete
        run: |
          node scripts/check-kanban-report.mjs

      - name: Unified Summary Gate (blocking)
        env:
          CI_DOCS_COVERAGE_THRESHOLD: 0.8
        run: |
          node scripts/ci-summary.mjs

      - name: Upload Unified Summary
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: ci-summary
          path: summary.json

      - name: Post Summary to PR (always)
        if: ${{ github.event_name == 'pull_request' }}
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const summary = JSON.parse(fs.readFileSync('summary.json','utf8'));
            const pass = summary.gate.pass;
            const gate = summary.gate;
            const suggestions = summary.suggestions || [];
            const body = [
              `**CI Unified Gate**`,
              `- pass: ${pass}`,
              `- kanbanFailedCount: ${gate.kanbanFailedCount}`,
              `- docsCoverage: ${gate.docsCoverage} (threshold=${gate.coverageThreshold})`,
              `- progressEntryOk: ${gate.progressEntryOk}`,
              suggestions.length ? `**建议**: \n- ${suggestions.join('\n- ')}` : '',
            ].filter(Boolean).join('\n');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body,
            });

      - name: Commit Kanban Changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "ci: Kanban auto-migrate Backlog→Doing with assignee & dates"
          file_pattern: docs/ITERATION_BOARD_2W.md
