<#
.SYNOPSIS
    Removes Jodex plugin namespaces from the Antigravity CLI (agy) plugin directory.

.DESCRIPTION
    This script discovers all installed Jairosoft.jodex.* plugin directories and:
      1. Safely removes only the symlinks inside each directory (not the source).
      2. Removes the generated plugin.json manifest (not the original in the repo).
      3. Removes the now-empty plugin namespace directory itself.

    It does NOT touch your source repository in any way.
    It does NOT remove the Google.securecoder or any other third-party plugins.

.PARAMETER DryRun
    Preview what would be removed without making any changes.

.PARAMETER Plugins
    One or more specific plugin names to uninstall (e.g., jx-qa, jx-kb).
    If omitted, all Jairosoft.jodex.* plugins are removed.

.PARAMETER Force
    Skip the confirmation prompt and remove immediately.

.EXAMPLE
    .\uninstall-agy-jodex-plugins.ps1                     # Remove all Jodex plugins
    .\uninstall-agy-jodex-plugins.ps1 -DryRun              # Preview what would be removed
    .\uninstall-agy-jodex-plugins.ps1 jx-qa jx-kb          # Remove only specific plugins
    .\uninstall-agy-jodex-plugins.ps1 -Force                # Remove all without confirmation

.NOTES
    Requires Windows 11 with PowerShell 5.1+ or PowerShell 7+.
#>

[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$Force,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Plugins
)

# ─── Strict Mode ──────────────────────────────────────────────────────────────
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ─── Configuration ────────────────────────────────────────────────────────────
$AgyPluginsDir  = Join-Path $env:USERPROFILE '.gemini\config\plugins'
$PublisherGroup = 'Jairosoft.jodex'

# ─── Helper Functions ─────────────────────────────────────────────────────────

function Write-Info     { param([string]$Message) Write-Host "  i  $Message" -ForegroundColor Cyan }
function Write-Ok       { param([string]$Message) Write-Host "  +  $Message" -ForegroundColor Green }
function Write-Warn     { param([string]$Message) Write-Host "  !  $Message" -ForegroundColor Yellow }
function Write-Removed  { param([string]$Message) Write-Host "  x  $Message" -ForegroundColor Red }
function Write-DryRun   { param([string]$Message) Write-Host "  [DRY-RUN] Would remove: $Message" -ForegroundColor Yellow }

function Remove-SafeItem {
    <#
    .SYNOPSIS
        Safely removes a file or symlink. In dry-run mode, only prints what
        would happen.
    #>
    param([string]$TargetPath)

    if ($DryRun) {
        Write-DryRun $TargetPath
    }
    else {
        # Use .NET to delete reparse points (symlinks) without recursing into target
        $item = Get-Item $TargetPath -Force
        if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
            # This is a symbolic link — delete the link itself, not its target
            $item.Delete()
        }
        else {
            Remove-Item $TargetPath -Force
        }
        Write-Removed "Removed: $($item.Name)"
    }
}

# ─── Pre-flight Checks ───────────────────────────────────────────────────────
Write-Host ''
Write-Host 'Jodex Plugin Uninstaller - Antigravity CLI' -ForegroundColor White
Write-Host ('=' * 44)

if (-not (Test-Path $AgyPluginsDir -PathType Container)) {
    Write-Host "No plugins directory found at $AgyPluginsDir. Nothing to uninstall." -ForegroundColor Yellow
    exit 0
}

if ($DryRun) {
    Write-Host 'Mode: DRY-RUN (no files will be deleted)' -ForegroundColor Yellow
}
else {
    Write-Host 'Mode: LIVE (files will be permanently removed)' -ForegroundColor Red
}
Write-Host ''

# ─── Build Target List ───────────────────────────────────────────────────────
[System.Collections.Generic.List[string]]$Targets = @()

if ($Plugins -and $Plugins.Count -gt 0) {
    # User specified one or more plugin names
    foreach ($pluginName in $Plugins) {
        $pluginDir = Join-Path $AgyPluginsDir "$pluginName"
        if (Test-Path $pluginDir -PathType Container) {
            $Targets.Add($pluginDir)
        }
        else {
            Write-Warn "Plugin not found, skipping: $pluginName"
        }
    }
}
else {
    # No specific plugins given — discover all Jodex (jx-*) directories
    Get-ChildItem -Path $AgyPluginsDir -Directory -Filter "jx-*" | ForEach-Object {
        $Targets.Add($_.FullName)
    }
}

# ─── Nothing to do? ──────────────────────────────────────────────────────────
if ($Targets.Count -eq 0) {
    Write-Host 'No Jodex plugins are currently installed. Nothing to uninstall.' -ForegroundColor Green
    exit 0
}

Write-Host "Plugins to be removed ($($Targets.Count) found):" -ForegroundColor White
foreach ($dir in $Targets) {
    $name = Split-Path $dir -Leaf
    Write-Host "  * $name" -ForegroundColor Red
}
Write-Host ''

# ─── Confirmation Prompt (skip in dry-run or if -Force) ───────────────────────
if (-not $DryRun -and -not $Force) {
    $confirm = Read-Host 'Are you sure you want to uninstall these plugins? [y/N]'
    if ($confirm -notmatch '^[yY](es)?$') {
        Write-Host 'Aborted. No changes were made.'
        exit 0
    }
    Write-Host ''
}

# ─── Main Removal Loop ───────────────────────────────────────────────────────
$RemovedCount  = 0
$SkippedCount  = 0

foreach ($pluginDir in $Targets) {
    $pluginName = Split-Path $pluginDir -Leaf
    Write-Host "Uninstalling: $pluginName" -ForegroundColor White

    # Step 1: Remove each symlink and the generated plugin.json individually
    $children = Get-ChildItem -Path $pluginDir -Force
    foreach ($entry in $children) {
        $isSymlink = ($entry.Attributes -band [System.IO.FileAttributes]::ReparsePoint)

        if ($isSymlink) {
            # Symbolic link — safe to remove (it only removes the link, not the target)
            Remove-SafeItem -TargetPath $entry.FullName
        }
        elseif ($entry.Name -eq 'plugin.json') {
            # Generated manifest — safe to remove
            Remove-SafeItem -TargetPath $entry.FullName
        }
        else {
            Write-Warn "Unexpected real file found, skipping: $($entry.FullName)"
            $SkippedCount++
        }
    }

    # Step 2: Remove the now-empty plugin namespace directory
    if (-not $DryRun) {
        $remaining = Get-ChildItem -Path $pluginDir -Force
        if ($null -eq $remaining -or $remaining.Count -eq 0) {
            Remove-Item $pluginDir -Force
            Write-Ok "Removed plugin directory: $pluginName"
        }
        else {
            Write-Warn "Directory not empty after cleanup, leaving in place: $pluginDir"
            $SkippedCount++
        }
    }
    else {
        Write-DryRun "$pluginDir (directory)"
    }

    $RemovedCount++
    Write-Host ''
}

# ─── Summary ──────────────────────────────────────────────────────────────────
Write-Host ('=' * 44)
if ($DryRun) {
    Write-Host "Dry-run complete. $RemovedCount plugin(s) would have been removed." -ForegroundColor Yellow
    Write-Host 'Run without -DryRun to apply.'
}
else {
    Write-Host "+ Uninstall complete. $RemovedCount plugin(s) removed." -ForegroundColor Green
    if ($SkippedCount -gt 0) {
        Write-Host "! $SkippedCount item(s) skipped (see warnings above)." -ForegroundColor Yellow
    }
    Write-Host ''
    Write-Host 'Your source repository is untouched.' -ForegroundColor Cyan
    Write-Host 'Restart Antigravity CLI to apply the changes.' -ForegroundColor Cyan
}
Write-Host ''
