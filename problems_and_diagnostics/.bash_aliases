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
