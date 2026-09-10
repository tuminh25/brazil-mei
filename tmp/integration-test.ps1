# Integration test for the paid Transport Calculator funnel (local dev only).
$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3100'
$target = '/guides/singapore-transport-costs-2026-mrt-bus-grab-car-comparison'
$controls = @('/guides/hdb-resale-grants-2026-complete-guide','/guides/cpf-changes-2026-singapore-residents-guide')
$marker = 'Before you commit to a car'
$buyButton = 'Get the Calculator &#x2014; S$19|Get the Calculator . S\$19'

function Get-Page($url) {
  for ($i=1; $i -le 3; $i++) {
    try { return Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 180 } catch { Start-Sleep -Seconds 3 }
  }
  throw "unreachable after retries: $url"
}
function Get-Status($url) {
  try { $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 180; return @{code=$r.StatusCode; body=$r.Content} }
  catch { $resp = $_.Exception.Response; if ($resp) { return @{code=[int]$resp.StatusCode; body=''} }; throw }
}

$pass=0; $fail=0
function Check($name,$cond){ if($cond){$script:pass++; Write-Output "  PASS  $name"} else {$script:fail++; Write-Output "  FAIL  $name"} }

# wait for server
$ready=$false
for ($i=0; $i -lt 60; $i++) {
  try { Invoke-WebRequest -Uri "$base/" -UseBasicParsing -TimeoutSec 10 | Out-Null; $ready=$true; break } catch { Start-Sleep -Seconds 2 }
}
Check 'dev server ready' $ready
if (-not $ready) { exit 1 }

Write-Output "== ARTICLE GATING =="
$t = Get-Page "$base$target"
Check 'target article 200' ($t.StatusCode -eq 200)
Check 'target article shows CTA headline' ($t.Content.Contains($marker))
$hrefOk = $t.Content.Contains('https://www.paypal.com/ncp/payment/6JYXQ5WASJBQ6')
Check 'CTA points to real PayPal checkout URL' $hrefOk
Check 'target article keeps disclaimer copy' ($t.Content.Contains('not financial advice'))

$ctrlFound=$false; $ctrlClean=$false
foreach ($c in $controls) {
  try { $r = Invoke-WebRequest -Uri "$base$c" -UseBasicParsing -TimeoutSec 180 } catch { continue }
  if ($r.StatusCode -eq 200) { $ctrlFound=$true; if (-not $r.Content.Contains($marker)) { $ctrlClean=$true; Write-Output "        control: $c" } }
}
Check 'control article found' $ctrlFound
Check 'control article has NO paid CTA' $ctrlClean

Write-Output "== THANK-YOU PAGE =="
$k = Get-Page "$base/thanks/transport-calculator"
Check 'thanks page 200' ($k.StatusCode -eq 200)
Check 'confirmation message' ($k.Content.Contains('Your calculator is ready'))
Check 'noindex meta present' ($k.Content -match 'name="robots"[^>]*content="[^"]*noindex' -or $k.Content.Contains('noindex'))
Check 'mentions Excel & Google Sheets' ($k.Content.Contains('Google Sheets'))
$m = [regex]::Match($k.Content, '/api/download/transport-calculator\?token=([A-Za-z0-9_\-\.]+)')
Check 'download token minted into page' $m.Success

Write-Output "== DOWNLOAD ROUTE =="
if ($m.Success) {
  $tok = [uri]::EscapeDataString($m.Groups[1].Value)
  $d = Invoke-WebRequest -Uri "$base/api/download/transport-calculator?token=$tok" -UseBasicParsing -TimeoutSec 180
  Check 'valid token downloads 200' ($d.StatusCode -eq 200)
  Check 'xlsx content type' ("$($d.Headers['Content-Type'])".StartsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
  Check 'attachment filename' ("$($d.Headers['Content-Disposition'])".Contains('SGEventsHub-Car-vs-MRT-Grab-Calculator-2026.xlsx'))
  $bytes = $d.Content
  Check 'payload is ZIP/XLSX (PK magic)' ($bytes.Length -gt 10000 -and $bytes[0] -eq 0x50 -and $bytes[1] -eq 0x4B)
} else { Check 'download flow skipped (no token)', $false }

$bad = Get-Status "$base/api/download/transport-calculator?token=garbage.token"
Check ('invalid token -> 403 (got {0})' -f $bad.code) ($bad.code -eq 403)

$secretLine = Select-String -Path '.env' -Pattern '^DOWNLOAD_TOKEN_SECRET=(.+)$' | Select-Object -First 1
$sec = $secretLine.Matches[0].Groups[1].Value.Trim()
$expTs = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - 10
$payloadStr = "transport-calculator.$expTs"
$b64p = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($payloadStr)).TrimEnd('=').Replace('+','-').Replace('/','_')
$hmac = New-Object System.Security.Cryptography.HMACSHA256 @(,[Text.Encoding]::UTF8.GetBytes($sec))
$b64s = [Convert]::ToBase64String($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($payloadStr))).TrimEnd('=').Replace('+','-').Replace('/','_')
$expiredTok = [uri]::EscapeDataString("$b64p.$b64s")
$expResp = Get-Status "$base/api/download/transport-calculator?token=$expiredTok"
Check ('expired token -> 403 (got {0})' -f $expResp.code) ($expResp.code -eq 403)

$none = Get-Status "$base/api/download/transport-calculator"
Check ('missing token -> 403 (got {0})' -f $none.code) ($none.code -eq 403)

Write-Output "== PUBLIC EXPOSURE =="
$pub = Get-ChildItem public -Recurse -Filter *.xlsx
Check 'no xlsx under public/' ($pub.Count -eq 0)
$sm = Get-Content src/app/sitemap.ts -Raw
Check 'thanks path absent from sitemap.ts' (-not $sm.Contains('/thanks/'))

Write-Output ''
if ($fail -eq 0) { Write-Output "INTEGRATION TESTS PASSED ($pass checks)" } else { Write-Output "INTEGRATION TESTS FAILED ($fail of $($pass+$fail))"; exit 1 }
