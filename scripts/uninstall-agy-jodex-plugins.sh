#!/bin/bash
# =============================================================================
# uninstall-agy-plugins.sh
# Removes Jodex plugin namespaces from the Antigravity CLI (agy) plugin directory.
#
# What this script does:
#   1. Discovers all installed jx-* plugin directories and removes them.
#
# What this script does NOT do:
#   - It does NOT touch your source repository in any way.
#   - It does NOT remove the Google.securecoder or any other third-party plugins.
#
# Usage:
#   bash uninstall-agy-plugins.sh                # Remove all jx-* plugins
#   bash uninstall-agy-plugins.sh --dry-run      # Preview what would be removed
#   bash uninstall-agy-plugins.sh --force        # Remove without confirmation
# =============================================================================

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
AGY_PLUGINS_DIR="$HOME/.gemini/config/plugins"
PLUGIN_PATH="$AGY_PLUGINS_DIR/jx-*"

# ─── Argument Parsing ─────────────────────────────────────────────────────────
DRY_RUN=false
FORCE=false

for arg in "$@"; do
  if [[ "$arg" == "--dry-run" ]]; then
    DRY_RUN=true
  elif [[ "$arg" == "--force" ]]; then
    FORCE=true
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

# ─── Pre-flight Checks ────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Jodex Plugin Uninstaller — Antigravity CLI${RESET}"
echo "────────────────────────────────────────────"

if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}Mode: DRY-RUN (no files will be deleted)${RESET}"
else
  echo -e "${RED}Mode: LIVE (files will be permanently removed)${RESET}"
fi
echo ""

# ─── Confirmation Prompt (skip in dry-run or if force) ───────────────────────
if [[ "$DRY_RUN" == false && "$FORCE" == false ]]; then
  read -rp "Are you sure you want to uninstall all jx-* plugins? [y/N] " confirm
  case "$confirm" in
    [yY][eE][sS]|[yY]) echo "" ;;
    *)
      echo "Aborted. No changes were made."
      exit 0
      ;;
  esac
fi

# ─── Main Removal Action ─────────────────────────────────────────────────────
if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}[DRY-RUN] Would remove items matching: $PLUGIN_PATH${RESET}"
  for item in $PLUGIN_PATH; do
    if [[ -d "$item" ]]; then
      echo -e "  ${YELLOW}Would remove:${RESET} $item"
    fi
  done
else
  echo -e "${BOLD}Removing all jodex plugins at $PLUGIN_PATH...${RESET}"
  rm -rf $PLUGIN_PATH
  echo -e "${GREEN}✔ Uninstall complete.${RESET}"
  echo ""
  echo -e "${CYAN}Restart Antigravity CLI to apply the changes.${RESET}"
fi
echo ""
