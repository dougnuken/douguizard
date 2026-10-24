# Windows version of fetch-mockups.sh: downloads the device mockups into
# assets\mockups so the deck works offline. Run from this folder:
#   powershell -ExecutionPolicy Bypass -File fetch-mockups.ps1
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
New-Item -ItemType Directory -Force -Path "assets\mockups" | Out-Null
$cdn = "https://d2ol7oe51mr4n9.cloudfront.net/user_3IvZCcP0Hh0Iw00znaf8bruzl4p"
Get-Content "fetch-mockups.sh" | ForEach-Object {
  if ($_ -match '^([a-z0-9-]+) ([0-9a-f-]{36})$') {
    Invoke-WebRequest -Uri "$cdn/$($Matches[2]).jpg" -OutFile "assets\mockups\$($Matches[1]).jpg"
    Write-Host "ok  $($Matches[1])"
  }
}
