#!/bin/bash
# =============================================================================
# install-agy-jodex-plugins.sh
# Installs Jodex plugins into the Antigravity CLI (agy) plugin directory by
# symlinking the source directories and generating compatible plugin.json files.
#
# What this script does:
#   1. Discovers all plugin directories in the source repository.
#   2. Creates a namespaced directory in ~/.gemini/config/plugins/ for each.
#   3. Symlinks skills/, scripts/, prompts/, commands/, hooks/, schemas/, agents/.
#   4. Generates an Antigravity-compatible plugin.json from the Claude manifest.
#   5. Provides a clear summary of what was installed.
#
# What this script does NOT do:
#   - It does NOT copy files — only symlinks, so source stays the single truth.
#   - It does NOT touch Google.securecoder or any other third-party plugins.
#
# Usage:
#   bash install-agy-jodex-plugins.sh               # Install all plugins
#   bash install-agy-jodex-plugins.sh --dry-run      # Preview without changes
#   bash install-agy-jodex-plugins.sh jx-qa jx-kb   # Install specific plugins only
# =============================================================================

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
SOURCE_PLUGINS_DIR="$HOME/projects/jairosoft/ai-tools/jodex-plugins/plugins"
AGY_PLUGINS_DIR="$HOME/.gemini/config/plugins"
PUBLISHER_GROUP="Jairosoft.jodex"

# ─── Argument Parsing ─────────────────────────────────────────────────────────
DRY_RUN=false
SPECIFIC_PLUGINS=()

for arg in "$@"; do
  if [[ "$arg" == "--dry-run" ]]; then
    DRY_RUN=true
  else
    SPECIFIC_PLUGINS+=("$arg")
  fi
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
log_dry()     { echo -e "  ${YELLOW}[DRY-RUN]${RESET} Would create: $1"; }

# Perform an action or print what would happen in dry-run mode.
# Usage: dry_run_exec <description> <command...>
dry_run_exec() {
  local description="$1"; shift
  if [[ "$DRY_RUN" == true ]]; then
    log_dry "$description"
  else
    "$@"
    log_success "$description"
  fi
}

# ─── Pre-flight Checks ────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Jodex Plugin Installer — Antigravity CLI${RESET}"
echo "────────────────────────────────────────────"

if [[ ! -d "$SOURCE_PLUGINS_DIR" ]]; then
  echo -e "${RED}ERROR: Source plugins directory not found:${RESET} $SOURCE_PLUGINS_DIR"
  exit 1
fi

if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}Mode: DRY-RUN (no files will be created or modified)${RESET}"
else
  echo -e "${GREEN}Mode: LIVE (symlinks and manifests will be written)${RESET}"
fi
echo ""

# ─── Build Target List ────────────────────────────────────────────────────────
declare -a PLUGIN_PATHS=()

if [[ ${#SPECIFIC_PLUGINS[@]} -gt 0 ]]; then
  # User named specific plugins — validate and collect
  for plugin_name in "${SPECIFIC_PLUGINS[@]}"; do
    plugin_path="$SOURCE_PLUGINS_DIR/$plugin_name"
    if [[ -d "$plugin_path" ]]; then
      PLUGIN_PATHS+=("$plugin_path")
    else
      log_warn "Plugin source not found, skipping: $plugin_name"
    fi
  done
else
  # No specific plugins given — install all from source directory
  for plugin_path in "$SOURCE_PLUGINS_DIR"/*/; do
    [[ -d "$plugin_path" ]] && PLUGIN_PATHS+=("$plugin_path")
  done
fi

# ─── Nothing to do? ───────────────────────────────────────────────────────────
if [[ ${#PLUGIN_PATHS[@]} -eq 0 ]]; then
  echo -e "${YELLOW}No plugins found to install.${RESET}"
  exit 0
fi

echo -e "${BOLD}Plugins to be installed (${#PLUGIN_PATHS[@]} found):${RESET}"
for p in "${PLUGIN_PATHS[@]}"; do
  echo -e "  ${GREEN}•${RESET} $(basename "$p")"
done
echo ""

# ─── Ensure the AGY plugins directory exists ──────────────────────────────────
if [[ "$DRY_RUN" == false ]]; then
  mkdir -p "$AGY_PLUGINS_DIR"
fi

# ─── Main Installation Loop ───────────────────────────────────────────────────
INSTALLED_COUNT=0

for plugin_path in "${PLUGIN_PATHS[@]}"; do
  plugin_name=$(basename "$plugin_path")
  agy_plugin_dir="$AGY_PLUGINS_DIR/$PUBLISHER_GROUP.$plugin_name"

  echo -e "${BOLD}Installing: $PUBLISHER_GROUP.$plugin_name${RESET}"

  # ── 1. Create the namespaced plugin directory ─────────────────────────────
  dry_run_exec "Directory: $agy_plugin_dir" mkdir -p "$agy_plugin_dir"

  # ── 2. Symlink skills/ ────────────────────────────────────────────────────
  if [[ -d "$plugin_path/skills" ]]; then
    # Remove any stale symlink or leftover directory before re-linking
    if [[ "$DRY_RUN" == false ]]; then
      rm -rf "$agy_plugin_dir/skills"
    fi
    dry_run_exec "Symlink: skills/ -> $plugin_path/skills" \
      ln -s "$plugin_path/skills" "$agy_plugin_dir/skills"
  else
    log_info "No skills/ directory in source — skipping."
  fi

  # ── 3. Symlink optional companion directories ─────────────────────────────
  for extra_dir in scripts prompts commands hooks schemas agents; do
    if [[ -d "$plugin_path/$extra_dir" ]]; then
      if [[ "$DRY_RUN" == false ]]; then
        rm -rf "$agy_plugin_dir/$extra_dir"
      fi
      dry_run_exec "Symlink: $extra_dir/ -> $plugin_path/$extra_dir" \
        ln -s "$plugin_path/$extra_dir" "$agy_plugin_dir/$extra_dir"
    fi
  done

  # ── 4. Generate Antigravity plugin.json from Claude manifest ──────────────
  claude_manifest="$plugin_path/.claude-plugin/plugin.json"
  agy_manifest="$agy_plugin_dir/plugin.json"

  if [[ -f "$claude_manifest" ]]; then
    desc=$(jq -r '.description // "No description provided"' "$claude_manifest")
  else
    log_warn "No .claude-plugin/plugin.json found — using default description."
    desc="Jodex plugin: $plugin_name"
  fi

  manifest_content="{\n  \"name\": \"$plugin_name\",\n  \"description\": \"$desc\",\n  \"disabled\": false\n}"

  if [[ "$DRY_RUN" == true ]]; then
    log_dry "plugin.json (content preview):"
    echo -e "        ${YELLOW}$manifest_content${RESET}"
  else
    printf '%b\n' "$manifest_content" > "$agy_manifest"
    log_success "Generated: plugin.json"
  fi

  (( INSTALLED_COUNT++ )) || true
  echo ""
done

# ─── Summary ──────────────────────────────────────────────────────────────────
echo "────────────────────────────────────────────"
if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}Dry-run complete. $INSTALLED_COUNT plugin(s) would have been installed.${RESET}"
  echo -e "Run without ${BOLD}--dry-run${RESET} to apply."
else
  echo -e "${GREEN}✔ Installation complete. $INSTALLED_COUNT plugin(s) installed.${RESET}"
  echo ""
  echo -e "${CYAN}Symlinks point to your source repo — edits there apply instantly.${RESET}"
  echo -e "${CYAN}Restart Antigravity CLI to activate the new plugins.${RESET}"
fi
echo ""