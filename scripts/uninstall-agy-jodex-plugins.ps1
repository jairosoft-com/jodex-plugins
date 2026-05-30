<#
.SYNOPSIS
    Removes Jodex plugin namespaces from the Antigravity CLI (agy) plugin directory.

.DESCRIPTION
    This script discovers all installed jx-* plugin directories and removes them.
    It will ensure that all jodex plugins found on $HOME\.gemini\config\plugins\jx-* will be removed.

.PARAMETER DryRun
    Preview what would be removed without making any changes.

.PARAMETER Force
    Skip the confirmation prompt and remove immediately.

.EXAMPLE
    .\uninstall-agy-jodex-plugins.ps1                     # Remove all Jodex plugins
    .\uninstall-agy-jodex-plugins.ps1 -DryRun             # Preview what would be removed
    .\uninstall-agy-jodex-plugins.ps1 -Force              # Remove all without confirmation

.NOTES
    Requires Windows 11 with PowerShell 5.1+ or PowerShell 7+.
#>

[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$Force
)

# ─── Strict Mode ──────────────────────────────────────────────────────────────
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ─── Configuration ────────────────────────────────────────────────────────────
$AgyPluginsDir  = Join-Path $HOME '.gemini\config\plugins'

# ─── Pre-flight Checks ───────────────────────────────────────────────────────
Write-Host ''
Write-Host 'Jodex Plugin Uninstaller - Antigravity CLI' -ForegroundColor White
Write-Host ('=' * 44)

if ($DryRun) {
    Write-Host 'Mode: DRY-RUN (no files will be deleted)' -ForegroundColor Yellow
}
else {
    Write-Host 'Mode: LIVE (files will be permanently removed)' -ForegroundColor Red
}
Write-Host ''

# ─── Confirmation Prompt (skip in dry-run or if -Force) ───────────────────────
if (-not $DryRun -and -not $Force) {
    $confirm = Read-Host 'Are you sure you want to uninstall all jx-* plugins? [y/N]'
    if ($confirm -notmatch '^[yY](es)?$') {
        Write-Host 'Aborted. No changes were made.'
        exit 0
    }
    Write-Host ''
}

# ─── Main Removal Action ─────────────────────────────────────────────────────
$PluginPath = Join-Path $AgyPluginsDir 'jx-*'

if ($DryRun) {
    Write-Host "[DRY-RUN] Would remove items matching: $PluginPath" -ForegroundColor Yellow
    Get-ChildItem -Path $PluginPath -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "  Would remove: $($_.FullName)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Removing all jodex plugins at $PluginPath..." -ForegroundColor White
    Remove-Item -Path $PluginPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "+ Uninstall complete." -ForegroundColor Green
    Write-Host ''
    Write-Host 'Restart Antigravity CLI to apply the changes.' -ForegroundColor Cyan
}
Write-Host ''
