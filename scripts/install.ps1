# =============================================================================
# dsh-dao 一键安装脚本（Windows PowerShell 5.1+ / pwsh）
#
# 用法：
#   # 从当前本地仓库目录安装
#   powershell -ExecutionPolicy Bypass -File scripts/install.ps1
#
#   # 指定版本或 Profile
#   powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Spec . -Profile web
# =============================================================================
param(
  [string]$Spec = '.',
  [string]$Profile = 'web'
)

$ErrorActionPreference = 'Stop'
$DSH_HOME = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
$PROFILE_DIR = Join-Path $DSH_HOME "profiles\$Profile"
$WS_YML = Join-Path $PROFILE_DIR 'pnpm-workspace.yaml'

function Say([string]$m)  { Write-Host "[dsh-dao] $m" -ForegroundColor Green }
function Warn([string]$m) { Write-Host "[warn] $m" -ForegroundColor Yellow }
function Die([string]$m)  { Write-Host "[error] $m" -ForegroundColor Red; exit 1 }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Die '未找到 node（DSH 需要 Node.js >= 20）'
}

if (Test-Path $WS_YML) {
  $wsScript = @'
const fs = require("fs");
const p = process.argv[2];
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
'@
  $tmpJs = Join-Path $env:TEMP ("dsh-dao-ws-" + [guid]::NewGuid().ToString("N") + ".js")
  Set-Content -LiteralPath $tmpJs -Value $wsScript -Encoding UTF8
  node $tmpJs "$WS_YML" | Out-Null
  Remove-Item -LiteralPath $tmpJs -Force -ErrorAction SilentlyContinue
  Say "已就绪 $WS_YML minimumReleaseAgeExclude (dsh-dao)"
}

if (Get-Command dsh -ErrorAction SilentlyContinue) {
  Say "执行: dsh plugin --profile $Profile add $Spec"
  & dsh plugin --profile $Profile add $Spec
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
  Say "执行: npx -y --package @deepseek-ai/dsh@0.2.1-rc.2 dsh plugin --profile $Profile add $Spec"
  & npx -y --package '@deepseek-ai/dsh@0.2.1-rc.2' dsh plugin --profile $Profile add $Spec
} else {
  Die '未找到 dsh 或 npx，请先安装 DeepSeek Harness。'
}

Say '☯ dsh-dao 安装完成！请重启 DSH Web 或 DSH Desktop 并按 Ctrl+Shift+R 刷新页面。'
