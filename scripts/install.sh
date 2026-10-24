#!/usr/bin/env bash
# =============================================================================
# dsh-dao 一键安装脚本（官方 CLI / 本地路径方式，macOS / Linux / Windows Git Bash）
#
# 用法：
#   # 从当前本地仓库安装到 DSH web profile
#   bash scripts/install.sh
#
#   # 指定 npm 版本或 git 地址安装
#   bash scripts/install.sh latest --profile web
# =============================================================================
set -euo pipefail

PROFILE_NAME="web"
SPEC="."

while [ $# -gt 0 ]; do
  case "$1" in
    --profile)
      PROFILE_NAME="$2"
      shift 2
      ;;
    -h|--help)
      echo "用法: bash scripts/install.sh [spec] [--profile <web|default>]"
      exit 0
      ;;
    *)
      SPEC="$1"
      shift
      ;;
  esac
done

DSH_HOME="${DSH_HOME:-${HOME:-${USERPROFILE:-}}/.dsh}"
PROFILE_DIR="$DSH_HOME/profiles/$PROFILE_NAME"
WS_YML="$PROFILE_DIR/pnpm-workspace.yaml"

say()  { printf '\033[32m[dsh-dao]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[warn]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || die "未找到 node（DSH 需要 Node.js >= 20）"

if [ -f "$WS_YML" ]; then
  node -e '
const fs = require("fs");
const p = process.argv[1];
let t = fs.readFileSync(p, "utf8");
const before = t;
if (!/^\s*-\s+dsh-dao\s*$/m.test(t)) {
  if (/^\s*minimumReleaseAgeExclude:\s*$/m.test(t)) {
    t = t.replace(/^(\s*minimumReleaseAgeExclude:\s*)$/m, "$1\n  - dsh-dao");
  } else {
    t += "\nminimumReleaseAgeExclude:\n  - dsh-dao\n";
  }
}
if (t !== before) fs.writeFileSync(p, t);
' "$WS_YML"
  say "已更新 workspace minimumReleaseAgeExclude (dsh-dao)"
fi

if command -v dsh >/dev/null 2>&1; then
  CLI="dsh"
elif command -v npx >/dev/null 2>&1; then
  CLI="npx -y --package @deepseek-ai/dsh@0.2.1-rc.2 dsh"
else
  die "未找到 dsh 或 npx，请先安装 DeepSeek Harness。"
fi

say "正在执行: $CLI plugin --profile $PROFILE_NAME add $SPEC"
$CLI plugin --profile "$PROFILE_NAME" add "$SPEC"
say "☯ dsh-dao 安装完成！请重启 DSH Web 或 DSH Desktop 并刷新页面。"
