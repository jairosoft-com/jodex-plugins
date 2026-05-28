<#
.SYNOPSIS
    Installs Jodex plugins into the Antigravity CLI (agy) plugin directory.

.DESCRIPTION
    This script discovers plugin directories in the source repository and
    installs them into ~/.gemini/config/plugins/ by:
      1. Creating a namespaced directory for each plugin.
      2. Symlinking skills/, scripts/, prompts/, commands/, hooks/, schemas/, agents/.
      3. Generating an Antigravity-compatible plugin.json from the Claude manifest.

    It does NOT copy files — only symlinks, so the source stays the single truth.
    It does NOT touch Google.securecoder or any other third-party plugins.

.PARAMETER DryRun
    Preview what would happen without making any changes.

.PARAMETER Plugins
    One or more specific plugin names to install (e.g., jx-qa, jx-kb).
    If omitted, all plugins in the source directory are installed.

.EXAMPLE
    .\install-agy-jodex-plugins.ps1                     # Install all plugins
    .\install-agy-jodex-plugins.ps1 -DryRun              # Preview without changes
    .\install-agy-jodex-plugins.ps1 jx-qa jx-kb          # Install specific plugins only
    .\install-agy-jodex-plugins.ps1 jx-qa -DryRun        # Dry-run for specific plugins

.NOTES
    Requires Windows 11 with PowerShell 5.1+ or PowerShell 7+.
    Creating symbolic links may require Developer Mode enabled or
    an elevated (Administrator) terminal.
#>

[CmdletBinding()]
param(
    [switch]$DryRun,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Plugins
)

# ─── Strict Mode ──────────────────────────────────────────────────────────────
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ─── Configuration ────────────────────────────────────────────────────────────
# Resolve paths using the Windows user-profile directory.
$SourcePluginsDir = Join-Path $env:USERPROFILE 'projects\jairosoft\ai-tools\jodex-plugins\plugins'
$AgyPluginsDir    = Join-Path $env:USERPROFILE '.gemini\config\plugins'
$PublisherGroup   = 'Jairosoft.jodex'

# ─── Helper Functions ─────────────────────────────────────────────────────────

function Write-Info    { param([string]$Message) Write-Host "  i  $Message" -ForegroundColor Cyan }
function Write-Ok      { param([string]$Message) Write-Host "  +  $Message" -ForegroundColor Green }
function Write-Warn    { param([string]$Message) Write-Host "  !  $Message" -ForegroundColor Yellow }
function Write-DryRun  { param([string]$Message) Write-Host "  [DRY-RUN] Would create: $Message" -ForegroundColor Yellow }

function Invoke-OrDryRun {
    <#
    .SYNOPSIS
        Executes a script block in live mode, or prints what would happen in dry-run mode.
    #>
    param(
        [string]      $Description,
        [scriptblock] $Action
    )

    if ($DryRun) {
        Write-DryRun $Description
    }
    else {
        & $Action
        Write-Ok $Description
    }
}

function New-SymlinkSafe {
    <#
    .SYNOPSIS
        Creates a directory symbolic link, removing any stale link or leftover
        directory at the target path first.
    .NOTES
        Uses New-Item -ItemType SymbolicLink which requires Developer Mode on
        Windows 10 1703+ or an elevated prompt.
    #>
    param(
        [string]$LinkPath,
        [string]$TargetPath
    )

    # Clean up any existing item at the link location
    if (Test-Path $LinkPath) {
        Remove-Item $LinkPath -Recurse -Force
    }

    New-Item -ItemType SymbolicLink -Path $LinkPath -Target $TargetPath -Force | Out-Null
}

# ─── Pre-flight Checks ───────────────────────────────────────────────────────
Write-Host ''
Write-Host 'Jodex Plugin Installer - Antigravity CLI' -ForegroundColor White -NoNewline
Write-Host '' # newline
Write-Host ('=' * 44)

if (-not (Test-Path $SourcePluginsDir -PathType Container)) {
    Write-Host "ERROR: Source plugins directory not found: $SourcePluginsDir" -ForegroundColor Red
    exit 1
}

if ($DryRun) {
    Write-Host 'Mode: DRY-RUN (no files will be created or modified)' -ForegroundColor Yellow
}
else {
    Write-Host 'Mode: LIVE (symlinks and manifests will be written)' -ForegroundColor Green
}
Write-Host ''

# ─── Build Target List ───────────────────────────────────────────────────────
[System.Collections.Generic.List[string]]$PluginPaths = @()

if ($Plugins -and $Plugins.Count -gt 0) {
    # User specified one or more plugin names
    foreach ($pluginName in $Plugins) {
        $pluginPath = Join-Path $SourcePluginsDir $pluginName
        if (Test-Path $pluginPath -PathType Container) {
            $PluginPaths.Add($pluginPath)
        }
        else {
            Write-Warn "Plugin source not found, skipping: $pluginName"
        }
    }
}
else {
    # No specific plugins given — install every child directory
    Get-ChildItem -Path $SourcePluginsDir -Directory | ForEach-Object {
        $PluginPaths.Add($_.FullName)
    }
}

# ─── Nothing to do? ──────────────────────────────────────────────────────────
if ($PluginPaths.Count -eq 0) {
    Write-Host 'No plugins found to install.' -ForegroundColor Yellow
    exit 0
}

Write-Host "Plugins to be installed ($($PluginPaths.Count) found):" -ForegroundColor White
foreach ($p in $PluginPaths) {
    $name = Split-Path $p -Leaf
    Write-Host "  * $name" -ForegroundColor Green
}
Write-Host ''

# ─── Ensure the AGY plugins directory exists ──────────────────────────────────
if (-not $DryRun) {
    if (-not (Test-Path $AgyPluginsDir)) {
        New-Item -ItemType Directory -Path $AgyPluginsDir -Force | Out-Null
    }
}

# ─── Main Installation Loop ──────────────────────────────────────────────────
$InstalledCount = 0

foreach ($pluginPath in $PluginPaths) {
    $pluginName   = Split-Path $pluginPath -Leaf
    $agyPluginDir = Join-Path $AgyPluginsDir "$PublisherGroup.$pluginName"

    Write-Host "Installing: $PublisherGroup.$pluginName" -ForegroundColor White

    # ── 1. Create the namespaced plugin directory ─────────────────────────────
    Invoke-OrDryRun -Description "Directory: $agyPluginDir" -Action {
        if (-not (Test-Path $agyPluginDir)) {
            New-Item -ItemType Directory -Path $agyPluginDir -Force | Out-Null
        }
    }

    # ── 2. Symlink skills/ ────────────────────────────────────────────────────
    $skillsSource = Join-Path $pluginPath 'skills'
    if (Test-Path $skillsSource -PathType Container) {
        $skillsLink = Join-Path $agyPluginDir 'skills'
        Invoke-OrDryRun -Description "Symlink: skills/ -> $skillsSource" -Action {
            New-SymlinkSafe -LinkPath $skillsLink -TargetPath $skillsSource
        }
    }
    else {
        Write-Info 'No skills/ directory in source - skipping.'
    }

    # ── 3. Symlink optional companion directories ─────────────────────────────
    $extraDirs = @('scripts', 'prompts', 'commands', 'hooks', 'schemas', 'agents')
    foreach ($extraDir in $extraDirs) {
        $extraSource = Join-Path $pluginPath $extraDir
        if (Test-Path $extraSource -PathType Container) {
            $extraLink = Join-Path $agyPluginDir $extraDir
            Invoke-OrDryRun -Description "Symlink: $extraDir/ -> $extraSource" -Action {
                New-SymlinkSafe -LinkPath $extraLink -TargetPath $extraSource
            }
        }
    }

    # ── 4. Generate Antigravity plugin.json from Claude manifest ──────────────
    $claudeManifest = Join-Path $pluginPath '.claude-plugin\plugin.json'
    $agyManifest    = Join-Path $agyPluginDir 'plugin.json'

    if (Test-Path $claudeManifest -PathType Leaf) {
        $manifestJson = Get-Content $claudeManifest -Raw | ConvertFrom-Json
        $desc = if ($manifestJson.description) { $manifestJson.description } else { 'No description provided' }
    }
    else {
        Write-Warn 'No .claude-plugin/plugin.json found - using default description.'
        $desc = "Jodex plugin: $pluginName"
    }

    # Build the Antigravity manifest as a PowerShell object, then serialise
    $manifestContent = [ordered]@{
        name        = $pluginName
        description = $desc
        disabled    = $false
    } | ConvertTo-Json -Depth 2

    if ($DryRun) {
        Write-DryRun 'plugin.json (content preview):'
        Write-Host "        $manifestContent" -ForegroundColor Yellow
    }
    else {
        $manifestContent | Set-Content -Path $agyManifest -Encoding UTF8
        Write-Ok 'Generated: plugin.json'
    }

    $InstalledCount++
    Write-Host ''
}

# ─── Summary ──────────────────────────────────────────────────────────────────
Write-Host ('=' * 44)
if ($DryRun) {
    Write-Host "Dry-run complete. $InstalledCount plugin(s) would have been installed." -ForegroundColor Yellow
    Write-Host 'Run without -DryRun to apply.'
}
else {
    Write-Host "+ Installation complete. $InstalledCount plugin(s) installed." -ForegroundColor Green
    Write-Host ''
    Write-Host 'Symlinks point to your source repo - edits there apply instantly.' -ForegroundColor Cyan
    Write-Host 'Restart Antigravity CLI to activate the new plugins.' -ForegroundColor Cyan
}
Write-Host ''
