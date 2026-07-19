# Creates a clean zip for cofounder handover (no secrets, no node_modules).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/make-handover-zip.ps1

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$stamp = Get-Date -Format "yyyyMMdd"
$outDir = Join-Path $root "dist-handover"
$zipName = "tripzy-cofounder-handover-$stamp.zip"
$zipPath = Join-Path $root $zipName
$stage = Join-Path $outDir "tripzy-handover"

Write-Host "Root: $root"
Write-Host "Staging: $stage"

if (Test-Path $outDir) { Remove-Item $outDir -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null

$excludeDirNames = @(
  "node_modules", ".next", ".git", ".vercel", ".sessions",
  "scratch", "test-results", "coverage", "dist", "build", "dist-handover"
)

$excludeFilePatterns = @(
  "*.log", "*.tsbuildinfo", "Thumbs.db", ".DS_Store"
)

$excludeExactFiles = @(
  ".env", ".env.vercel", ".env.vercel.check", ".env.vercel.final",
  ".env.vercel.pull", "prisma/dev.db", "prisma/dev.db-journal"
)

function ShouldSkip([System.IO.FileSystemInfo]$item, [string]$rel) {
  $parts = $rel -split "[\\/]"
  foreach ($p in $parts) {
    if ($excludeDirNames -contains $p) { return $true }
  }
  foreach ($pat in $excludeFilePatterns) {
    if ($item.Name -like $pat) { return $true }
  }
  $norm = $rel -replace "\\", "/"
  foreach ($ex in $excludeExactFiles) {
    if ($norm -eq $ex) { return $true }
  }
  # Any .env* except .env.example
  if ($item.Name -like ".env*" -and $item.Name -ne ".env.example") { return $true }
  return $false
}

Get-ChildItem -Path $root -Force | ForEach-Object {
  $name = $_.Name
  if ($name -eq "dist-handover") { return }
  if ($name -like "tripzy-cofounder-handover-*.zip") { return }

  if ($_.PSIsContainer) {
    if ($excludeDirNames -contains $name) { return }
    $dest = Join-Path $stage $name
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Get-ChildItem -Path $_.FullName -Recurse -Force | ForEach-Object {
      $rel = $_.FullName.Substring($_.FullName.IndexOf($name))
      # better relative from root
      $relFromRoot = $_.FullName.Substring($root.Path.Length).TrimStart("\", "/")
      if (ShouldSkip $_ $relFromRoot) { return }
      $target = Join-Path $stage $relFromRoot
      if ($_.PSIsContainer) {
        New-Item -ItemType Directory -Path $target -Force | Out-Null
      } else {
        $parent = Split-Path $target -Parent
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        Copy-Item $_.FullName -Destination $target -Force
      }
    }
  } else {
    if (ShouldSkip $_ $name) { return }
    Copy-Item $_.FullName -Destination (Join-Path $stage $name) -Force
  }
}

# Ensure README pointer exists
$readFirst = Join-Path $stage "READ_ME_FIRST.txt"
@"
TRIPZY — COFOUNDER PACKAGE
==========================

1. Open COFOUNDER_HANDOVER.md and follow it end-to-end.
2. Copy .env.example to .env and fill secrets (Gemini, Neon, Google OAuth, etc.).
3. npm install → npx prisma db push → npm run dev (http://localhost:3030)
4. Promote admin, set Vercel env vars, smoke test, then hand CLIENT_HANDOVER.md to the client.

Do NOT commit or share a filled .env file.
"@ | Set-Content -Path $readFirst -Encoding UTF8

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Push-Location $outDir
Compress-Archive -Path "tripzy-handover" -DestinationPath $zipPath -Force
Pop-Location

Remove-Item $outDir -Recurse -Force

$sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "Created: $zipPath ($sizeMB MB)"
Write-Host "Give this zip + COFOUNDER_HANDOVER.md instructions to your cofounder."
