#!/bin/bash
# =============================================================================
# install-github-agy-plugins.sh
# Installs plugins into the Antigravity CLI directly from a GitHub repository.
#
# What this script does:
#   1. Validates that the GitHub CLI (gh) is installed and authenticated.
#   2. Clones or updates the target repository in a persistent cache directory
#      (~/.gemini/config/plugin-cache/<org>/<repo>).
#   3. Discovers plugins inside the cloned repository (looks in /plugins/ or root).
#   4. Symlinks the necessary directories and generates plugin.json manifests
#      into the Antigravity plugins folder (~/.gemini/config/plugins).
#
# Usage:
#   bash install-github-agy-plugins.sh -r jairosoft-com/jodex-plugins
#   bash install-github-agy-plugins.sh -r jairosoft-com/jodex-plugins jx-qa jx-kb
# =============================================================================

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
AGY_CONFIG_DIR="$HOME/.gemini/config"
AGY_PLUGINS_DIR="$AGY_CONFIG_DIR/plugins"
CACHE_DIR="$AGY_CONFIG_DIR/plugin-cache"
PUBLISHER_GROUP="Jairosoft.jodex" # Default publisher, could be derived from org

REPO=""
SPECIFIC_PLUGINS=()

# ─── Argument Parsing ─────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    -r|--repo)
      REPO="$2"
      shift 2
      ;;
    *)
      SPECIFIC_PLUGINS+=("$1")
      shift
      ;;
  esac
done

# ─── Helpers ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log_info()    { echo -e "  ${CYAN}ℹ${RESET}  $1"; }
log_success() { echo -e "  ${GREEN}✔${RESET}  $1"; }
log_warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; }

# ─── Pre-flight Checks ────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}GitHub Plugin Installer — Antigravity CLI${RESET}"
echo "────────────────────────────────────────────"

if [[ -z "$REPO" ]]; then
  echo -e "${RED}ERROR: You must specify a repository using -r or --repo.${RESET}"
  echo "Example: bash install-github-agy-plugins.sh -r jairosoft-com/jodex-plugins"
  exit 1
fi

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
  echo -e "${RED}ERROR: GitHub CLI (gh) is not installed.${RESET}"
  echo "Please install it from https://cli.github.com/ and run 'gh auth login'."
  exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
  echo -e "${RED}ERROR: GitHub CLI is not authenticated.${RESET}"
  echo "Please run 'gh auth login' to authenticate before running this script."
  exit 1
fi

# ─── Step 1: Resolve Cache Directory ──────────────────────────────────────────
# Handle both 'org/repo' and 'https://github.com/org/repo.git' formats
CLEAN_REPO=$(echo "$REPO" | sed -e 's|https://github.com/||' -e 's|\.git||')
ORG_NAME=$(echo "$CLEAN_REPO" | cut -d'/' -f1)
REPO_NAME=$(echo "$CLEAN_REPO" | cut -d'/' -f2)

# Override publisher group dynamically based on GitHub Org
PUBLISHER_GROUP=$(echo "$ORG_NAME" | tr '[:upper:]' '[:lower:]' | tr '-' '.')

REPO_CACHE_DIR="$CACHE_DIR/$ORG_NAME/$REPO_NAME"

# ─── Step 2: Clone or Pull Repository ─────────────────────────────────────────
echo -e "${BOLD}Fetching Repository: $CLEAN_REPO${RESET}"
mkdir -p "$CACHE_DIR/$ORG_NAME"

if [[ -d "$REPO_CACHE_DIR/.git" ]]; then
  log_info "Repository exists in cache. Pulling latest changes..."
  cd "$REPO_CACHE_DIR"
  gh repo view "$CLEAN_REPO" &> /dev/null # Quick check if accessible
  git pull origin main --quiet || git pull origin master --quiet || log_warn "Pull failed or branch not found. Using local cache."
  log_success "Repository updated."
else
  log_info "Cloning repository into cache..."
  gh repo clone "$CLEAN_REPO" "$REPO_CACHE_DIR" -- -q
  log_success "Repository cloned."
fi
echo ""

# ─── Step 3: Discover Plugins ─────────────────────────────────────────────────
# Determine if plugins are in a /plugins subdirectory (like jodex) or in root
if [[ -d "$REPO_CACHE_DIR/plugins" ]]; then
  SOURCE_PLUGINS_DIR="$REPO_CACHE_DIR/plugins"
else
  SOURCE_PLUGINS_DIR="$REPO_CACHE_DIR"
fi

declare -a PLUGIN_PATHS=()

if [[ ${#SPECIFIC_PLUGINS[@]} -gt 0 ]]; then
  for plugin_name in "${SPECIFIC_PLUGINS[@]}"; do
    plugin_path="$SOURCE_PLUGINS_DIR/$plugin_name"
    if [[ -d "$plugin_path" ]]; then
      PLUGIN_PATHS+=("$plugin_path")
    else
      log_warn "Plugin '$plugin_name' not found in $CLEAN_REPO, skipping."
    fi
  done
else
  for plugin_path in "$SOURCE_PLUGINS_DIR"/*/; do
    # Ignore hidden folders like .git or .github
    basename=$(basename "$plugin_path")
    if [[ -d "$plugin_path" && ! "$basename" =~ ^\. ]]; then
      PLUGIN_PATHS+=("$plugin_path")
    fi
  done
fi

if [[ ${#PLUGIN_PATHS[@]} -eq 0 ]]; then
  echo -e "${YELLOW}No plugins found to install from $CLEAN_REPO.${RESET}"
  exit 0
fi

echo -e "${BOLD}Plugins to be installed (${#PLUGIN_PATHS[@]} found):${RESET}"
for p in "${PLUGIN_PATHS[@]}"; do
  echo -e "  ${GREEN}•${RESET} $(basename "$p")"
done
echo ""

# ─── Step 4: Installation Loop ────────────────────────────────────────────────
mkdir -p "$AGY_PLUGINS_DIR"
INSTALLED_COUNT=0

for plugin_path in "${PLUGIN_PATHS[@]}"; do
  plugin_name=$(basename "$plugin_path")
  agy_plugin_dir="$AGY_PLUGINS_DIR/$PUBLISHER_GROUP.$plugin_name"

  echo -e "${BOLD}Installing: $PUBLISHER_GROUP.$plugin_name${RESET}"
  mkdir -p "$agy_plugin_dir"

  # Symlink skills
  if [[ -d "$plugin_path/skills" ]]; then
    rm -rf "$agy_plugin_dir/skills"
    ln -s "$plugin_path/skills" "$agy_plugin_dir/skills"
    log_success "Symlinked: skills/"
  fi

  # Symlink optional directories
  for extra_dir in scripts prompts commands hooks schemas agents; do
    if [[ -d "$plugin_path/$extra_dir" ]]; then
      rm -rf "$agy_plugin_dir/$extra_dir"
      ln -s "$plugin_path/$extra_dir" "$agy_plugin_dir/$extra_dir"
      log_success "Symlinked: $extra_dir/"
    fi
  done

  # Generate manifest
  claude_manifest="$plugin_path/.claude-plugin/plugin.json"
  agy_manifest="$agy_plugin_dir/plugin.json"

  if [[ -f "$claude_manifest" ]]; then
    desc=$(jq -r '.description // "No description provided"' "$claude_manifest")
  else
    desc="$ORG_NAME plugin: $plugin_name"
  fi

  printf '{\n  "name": "%s",\n  "description": "%s",\n  "disabled": false\n}\n' "$plugin_name" "$desc" > "$agy_manifest"
  log_success "Generated: plugin.json"

  (( INSTALLED_COUNT++ )) || true
  echo ""
done

# ─── Summary ──────────────────────────────────────────────────────────────────
echo "────────────────────────────────────────────"
echo -e "${GREEN}✔ Installation complete. $INSTALLED_COUNT plugin(s) installed.${RESET}"
echo -e "${CYAN}Source cache is located at: $REPO_CACHE_DIR${RESET}"
echo -e "${CYAN}Restart Antigravity CLI to activate the new plugins.${RESET}"
echo ""
