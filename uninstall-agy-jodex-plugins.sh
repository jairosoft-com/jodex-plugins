#!/bin/bash
# =============================================================================
# uninstall-agy-plugins.sh
# Removes Jodex plugin namespaces from the Antigravity CLI (agy) plugin directory.
#
# What this script does:
#   1. Discovers all installed Jairosoft.jodex.* plugin directories.
#   2. Safely removes only the symlinks inside each directory (not the source).
#   3. Removes the generated plugin.json manifest (not the original in the repo).
#   4. Removes the now-empty plugin namespace directory itself.
#   5. Provides a clear summary of what was removed.
#
# What this script does NOT do:
#   - It does NOT touch your source repository in any way.
#   - It does NOT remove the Google.securecoder or any other third-party plugins.
#   - It does NOT perform a dry-run by default (use --dry-run flag to preview).
#
# Usage:
#   bash uninstall-agy-plugins.sh               # Remove all Jairosoft.jodex.* plugins
#   bash uninstall-agy-plugins.sh --dry-run      # Preview what would be removed
#   bash uninstall-agy-plugins.sh jx-qa jx-kb   # Remove only specific plugins
# =============================================================================

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
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
# Color codes for readable output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log_info()    { echo -e "  ${CYAN}ℹ${RESET}  $1"; }
log_success() { echo -e "  ${GREEN}✔${RESET}  $1"; }
log_warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; }
log_remove()  { echo -e "  ${RED}✖${RESET}  $1"; }
log_dry()     { echo -e "  ${YELLOW}[DRY-RUN]${RESET} Would remove: $1"; }

# Safely remove a file or symlink
safe_remove() {
  local target="$1"
  if [[ "$DRY_RUN" == true ]]; then
    log_dry "$target"
  else
    rm -rf "$target"
    log_remove "Removed: $(basename "$target")"
  fi
}

# ─── Pre-flight Checks ────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Jodex Plugin Uninstaller — Antigravity CLI${RESET}"
echo "────────────────────────────────────────────"

if [[ ! -d "$AGY_PLUGINS_DIR" ]]; then
  echo -e "${YELLOW}No plugins directory found at $AGY_PLUGINS_DIR. Nothing to uninstall.${RESET}"
  exit 0
fi

if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}Mode: DRY-RUN (no files will be deleted)${RESET}"
else
  echo -e "${RED}Mode: LIVE (files will be permanently removed)${RESET}"
fi
echo ""

# ─── Build Target List ────────────────────────────────────────────────────────
declare -a TARGETS=()

if [[ ${#SPECIFIC_PLUGINS[@]} -gt 0 ]]; then
  # User specified one or more plugin names (e.g., jx-qa jx-kb)
  for plugin_name in "${SPECIFIC_PLUGINS[@]}"; do
    plugin_dir="$AGY_PLUGINS_DIR/$PUBLISHER_GROUP.$plugin_name"
    if [[ -d "$plugin_dir" ]]; then
      TARGETS+=("$plugin_dir")
    else
      log_warn "Plugin not found, skipping: $PUBLISHER_GROUP.$plugin_name"
    fi
  done
else
  # No specific plugins given — discover all Jairosoft.jodex.* dirs
  while IFS= read -r -d '' dir; do
    TARGETS+=("$dir")
  done < <(find "$AGY_PLUGINS_DIR" -maxdepth 1 -type d -name "${PUBLISHER_GROUP}.*" -print0)
fi

# ─── Nothing to do? ───────────────────────────────────────────────────────────
if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo -e "${GREEN}No Jodex plugins are currently installed. Nothing to uninstall.${RESET}"
  exit 0
fi

echo -e "${BOLD}Plugins to be removed (${#TARGETS[@]} found):${RESET}"
for dir in "${TARGETS[@]}"; do
  echo -e "  ${RED}•${RESET} $(basename "$dir")"
done
echo ""

# ─── Confirmation Prompt (skip in dry-run) ────────────────────────────────────
if [[ "$DRY_RUN" == false ]]; then
  read -rp "Are you sure you want to uninstall these plugins? [y/N] " confirm
  case "$confirm" in
    [yY][eE][sS]|[yY]) echo "" ;;
    *)
      echo "Aborted. No changes were made."
      exit 0
      ;;
  esac
fi

# ─── Main Removal Loop ────────────────────────────────────────────────────────
REMOVED_COUNT=0
SKIPPED_COUNT=0

for plugin_dir in "${TARGETS[@]}"; do
  plugin_name=$(basename "$plugin_dir")
  echo -e "${BOLD}Uninstalling: $plugin_name${RESET}"

  # Step 1: Remove each symlink individually (defensive — won't touch real files)
  while IFS= read -r -d '' entry; do
    if [[ -L "$entry" ]]; then
      safe_remove "$entry"
    else
      # It's a real file — only remove plugin.json (the generated manifest)
      if [[ "$(basename "$entry")" == "plugin.json" ]]; then
        safe_remove "$entry"
      else
        log_warn "Unexpected real file found, skipping: $entry"
        (( SKIPPED_COUNT++ )) || true
      fi
    fi
  done < <(find "$plugin_dir" -maxdepth 1 \( -type l -o -type f \) -print0)

  # Step 2: Remove the now-empty plugin namespace directory
  if [[ "$DRY_RUN" == false ]]; then
    # Only remove if directory is actually empty
    if [[ -z "$(ls -A "$plugin_dir")" ]]; then
      rmdir "$plugin_dir"
      log_success "Removed plugin directory: $plugin_name"
    else
      log_warn "Directory not empty after cleanup, leaving in place: $plugin_dir"
      (( SKIPPED_COUNT++ )) || true
    fi
  else
    log_dry "$plugin_dir (directory)"
  fi

  (( REMOVED_COUNT++ )) || true
  echo ""
done

# ─── Summary ──────────────────────────────────────────────────────────────────
echo "────────────────────────────────────────────"
if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}Dry-run complete. $REMOVED_COUNT plugin(s) would have been removed.${RESET}"
  echo -e "Run without ${BOLD}--dry-run${RESET} to apply."
else
  echo -e "${GREEN}✔ Uninstall complete. $REMOVED_COUNT plugin(s) removed.${RESET}"
  if [[ $SKIPPED_COUNT -gt 0 ]]; then
    echo -e "${YELLOW}⚠ $SKIPPED_COUNT item(s) skipped (see warnings above).${RESET}"
  fi
  echo ""
  echo -e "${CYAN}Your source repository is untouched.${RESET}"
  echo -e "${CYAN}Restart Antigravity CLI to apply the changes.${RESET}"
fi
echo ""
