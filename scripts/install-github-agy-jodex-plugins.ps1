<#
.SYNOPSIS
    Installs plugins into the Antigravity CLI directly from a GitHub repository.

.DESCRIPTION
    This script provides an automated way to install plugins from a remote GitHub
    repository into your local Antigravity CLI environment.

    What it does step-by-step:
      1. Validates that the GitHub CLI (gh) is installed and authenticated.
      2. Uses `gh` to clone or update the target repository into a persistent
         cache directory (~/.gemini/config/plugin-cache/<org>/<repo>).
      3. Discovers plugins inside the repository (looks in /plugins/ or root).
      4. Symlinks the necessary directories and generates an Antigravity-compatible
         plugin.json manifest.

.PARAMETER Repo
    The GitHub repository to install from. Can be 'org/repo' or the full URL.
    Example: 'jairosoft-com/jodex-plugins' or 'https://github.com/jairosoft-com/jodex-plugins.git'

.PARAMETER Plugins
    One or more specific plugin names to install from the repo (e.g., jx-qa, jx-kb).
    If omitted, all valid plugins found in the repository are installed.

.EXAMPLE
    .\install-github-agy-plugins.ps1 -Repo "jairosoft-com/jodex-plugins"
    .\install-github-agy-plugins.ps1 -Repo "https://github.com/jairosoft-com/jodex-plugins.git" jx-qa jx-kb

.NOTES
    Requires Windows 11 with PowerShell 5.1+ or PowerShell 7+.
    Requires the GitHub CLI (`gh`) to be installed and authenticated (`gh auth login`).
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, HelpMessage = "The GitHub repository to install from (e.g., org/repo)")]
    [string]$Repo,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Plugins
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ─── Configuration ────────────────────────────────────────────────────────────
$AgyConfigDir  = Join-Path $env:USERPROFILE '.gemini\config'
$AgyPluginsDir = Join-Path $AgyConfigDir 'plugins'
$CacheDir      = Join-Path $AgyConfigDir 'plugin-cache'

# ─── Helper Functions ─────────────────────────────────────────────────────────
function Write-Info { param([string]$Msg) Write-Host "  i  $Msg" -ForegroundColor Cyan }
function Write-Ok   { param([string]$Msg) Write-Host "  +  $Msg" -ForegroundColor Green }
function Write-Warn { param([string]$Msg) Write-Host "  !  $Msg" -ForegroundColor Yellow }

function New-SymlinkSafe {
    param([string]$LinkPath, [string]$TargetPath)
    if (Test-Path $LinkPath) { Remove-Item $LinkPath -Recurse -Force }
    New-Item -ItemType SymbolicLink -Path $LinkPath -Target $TargetPath -Force | Out-Null
}

# ─── Pre-flight Checks ────────────────────────────────────────────────────────
Write-Host ''
Write-Host 'GitHub Plugin Installer - Antigravity CLI' -ForegroundColor White
Write-Host ('=' * 44)

# Check for GitHub CLI
if (-not (Get-Command 'gh' -ErrorAction SilentlyContinue)) {
    Write-Host 'ERROR: GitHub CLI (gh) is not installed.' -ForegroundColor Red
    Write-Host 'Please install it from https://cli.github.com/ and run "gh auth login".'
    exit 1
}

# Check authentication
try {
    $null = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Not authenticated" }
}
catch {
    Write-Host 'ERROR: GitHub CLI is not authenticated.' -ForegroundColor Red
    Write-Host 'Please run "gh auth login" to authenticate before running this script.'
    exit 1
}

# ─── Step 1: Resolve Cache Directory ──────────────────────────────────────────
# Clean URL to 'org/repo'
$CleanRepo = $Repo -replace '^https://github\.com/', '' -replace '\.git$', ''
$parts = $CleanRepo -split '/'
if ($parts.Count -ne 2) {
    Write-Host "ERROR: Invalid repository format. Expected 'org/repo', got '$Repo'" -ForegroundColor Red
    exit 1
}

$OrgName  = $parts[0]
$RepoName = $parts[1]

$RepoCacheDir = Join-Path $CacheDir "$OrgName\$RepoName"

# ─── Step 2: Clone or Pull Repository ─────────────────────────────────────────
Write-Host "Fetching Repository: $CleanRepo" -ForegroundColor White
$OrgDir = Join-Path $CacheDir $OrgName
if (-not (Test-Path $OrgDir)) { New-Item -ItemType Directory -Path $OrgDir -Force | Out-Null }

if (Test-Path (Join-Path $RepoCacheDir '.git')) {
    Write-Info 'Repository exists in cache. Pulling latest changes...'
    Push-Location $RepoCacheDir
    try {
        # Suppress output, ignore minor branch errors if main vs master
        $null = git pull origin main -q 2>&1
        if ($LASTEXITCODE -ne 0) { $null = git pull origin master -q 2>&1 }
        Write-Ok 'Repository updated.'
    }
    catch {
        Write-Warn 'Pull failed. Using local cache.'
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Info 'Cloning repository into cache...'
    # Use gh repo clone which handles auth automatically
    gh repo clone $CleanRepo $RepoCacheDir -- -q
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to clone repository $CleanRepo" -ForegroundColor Red
        exit 1
    }
    Write-Ok 'Repository cloned.'
}
Write-Host ''

# ─── Step 3: Discover Plugins ─────────────────────────────────────────────────
$RepoPluginsDir = Join-Path $RepoCacheDir 'plugins'
if (Test-Path $RepoPluginsDir -PathType Container) {
    $SourcePluginsDir = $RepoPluginsDir
} else {
    $SourcePluginsDir = $RepoCacheDir
}

[System.Collections.Generic.List[string]]$PluginPaths = @()

if ($Plugins -and $Plugins.Count -gt 0) {
    foreach ($pluginName in $Plugins) {
        $pluginPath = Join-Path $SourcePluginsDir $pluginName
        if (Test-Path $pluginPath -PathType Container) {
            $PluginPaths.Add($pluginPath)
        } else {
            Write-Warn "Plugin '$pluginName' not found in $CleanRepo, skipping."
        }
    }
}
else {
    Get-ChildItem -Path $SourcePluginsDir -Directory | Where-Object {
        $_.Name -notmatch '^\.' # Skip .git, .github, etc.
    } | ForEach-Object {
        $PluginPaths.Add($_.FullName)
    }
}

if ($PluginPaths.Count -eq 0) {
    Write-Host "No plugins found to install from $CleanRepo." -ForegroundColor Yellow
    exit 0
}

Write-Host "Plugins to be installed ($($PluginPaths.Count) found):" -ForegroundColor White
foreach ($p in $PluginPaths) {
    Write-Host "  * $(Split-Path $p -Leaf)" -ForegroundColor Green
}
Write-Host ''

# ─── Step 4: Installation Loop ────────────────────────────────────────────────
if (-not (Test-Path $AgyPluginsDir)) { New-Item -ItemType Directory -Path $AgyPluginsDir -Force | Out-Null }
$InstalledCount = 0

foreach ($pluginPath in $PluginPaths) {
    $pluginName   = Split-Path $pluginPath -Leaf
    $agyPluginDir = Join-Path $AgyPluginsDir "$pluginName"

    Write-Host "Installing: $pluginName" -ForegroundColor White

    if (-not (Test-Path $agyPluginDir)) { New-Item -ItemType Directory -Path $agyPluginDir -Force | Out-Null }

    # Symlink skills
    $skillsSource = Join-Path $pluginPath 'skills'
    if (Test-Path $skillsSource -PathType Container) {
        New-SymlinkSafe -LinkPath (Join-Path $agyPluginDir 'skills') -TargetPath $skillsSource
        Write-Ok 'Symlinked: skills/'
    }

    # Symlink optional directories
    $extraDirs = @('scripts', 'prompts', 'commands', 'hooks', 'schemas', 'agents')
    foreach ($extraDir in $extraDirs) {
        $extraSource = Join-Path $pluginPath $extraDir
        if (Test-Path $extraSource -PathType Container) {
            New-SymlinkSafe -LinkPath (Join-Path $agyPluginDir $extraDir) -TargetPath $extraSource
            Write-Ok "Symlinked: $extraDir/"
        }
    }

    # Generate manifest
    $claudeManifest = Join-Path $pluginPath '.claude-plugin\plugin.json'
    $agyManifest    = Join-Path $agyPluginDir 'plugin.json'

    if (Test-Path $claudeManifest -PathType Leaf) {
        $manifestJson = Get-Content $claudeManifest -Raw | ConvertFrom-Json
        $desc = if ($manifestJson.description) { $manifestJson.description } else { 'No description provided' }
    } else {
        $desc = "$OrgName plugin: $pluginName"
    }

    [ordered]@{
        name        = $pluginName
        description = $desc
        disabled    = $false
    } | ConvertTo-Json -Depth 2 | Set-Content -Path $agyManifest -Encoding UTF8

    Write-Ok 'Generated: plugin.json'

    $InstalledCount++
    Write-Host ''
}

# ─── Summary ──────────────────────────────────────────────────────────────────
Write-Host ('=' * 44)
Write-Host "+ Installation complete. $InstalledCount plugin(s) installed." -ForegroundColor Green
Write-Host "Source cache is located at: $RepoCacheDir" -ForegroundColor Cyan
Write-Host 'Restart Antigravity CLI to activate the new plugins.' -ForegroundColor Cyan
Write-Host ''
