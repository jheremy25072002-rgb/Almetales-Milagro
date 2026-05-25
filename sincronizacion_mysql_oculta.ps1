$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$logs = Join-Path $PSScriptRoot 'logs'
if (-not (Test-Path -LiteralPath $logs)) {
  New-Item -ItemType Directory -Path $logs | Out-Null
}

$node = Join-Path $env:ProgramFiles 'nodejs\node.exe'
if (-not (Test-Path -LiteralPath $node)) {
  $node = 'node'
}

$runLog = Join-Path $logs 'sincronizacion-mysql-run.log'
$errorLog = Join-Path $logs 'sincronizacion-mysql-error.log'
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
"[$stamp] Iniciando backend oculto de Almetales Milagro..." | Add-Content -LiteralPath $runLog

& $node --use-system-ca backend\server.js >> $runLog 2>> $errorLog
