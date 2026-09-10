# Detached dev-server launcher (survives parent shell exit)
$env:NODE_ENV = 'development'
Start-Process -FilePath 'node.exe' `
  -ArgumentList 'node_modules\next\dist\bin\next','dev','-p','3100' `
  -WorkingDirectory (Split-Path $PSCommandPath -Parent | Split-Path -Parent) `
  -WindowStyle Hidden
Write-Output 'launched'
