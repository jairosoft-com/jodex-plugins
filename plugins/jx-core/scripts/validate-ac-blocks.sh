#!/usr/bin/env bash
set -euo pipefail

# Validates AC blocks in a PRD or BRD_PRD markdown file.
# Exits 0 if valid, 1 if invalid (with line-numbered errors on stderr).

usage() { echo "Usage: validate-ac-blocks.sh <prd-file>" >&2; exit 2; }
[[ $# -eq 1 ]] || usage
[[ -f "$1" ]] || { echo "Error: file not found: $1" >&2; exit 2; }

FILE="$1"
ERRORS=0
IN_AC_BLOCK=false
PREV_AC_LINE=0

AC_BULLET='^- AC-([0-9]{3}|\{feature_number\})-[0-9]{2}: .+'
SUB_HEADER='^(\*\*Scenarios:\*\*|\*\*Rules:\*\*|\*\*System Behavior:\*\*|\*\*System State:\*\*|\*\*Quality Gates:\*\*)$'
FORMAT_RATIONALE='^\*Format:'
HTML_COMMENT='^<!--'
AC_CONTAINER='^\*\*Acceptance Criteria:\*\*'
BLOCK_END='^(\*\*Validates:\*\*|### US-|## )'

line_num=0
while IFS= read -r line; do
  line_num=$((line_num + 1))

  if [[ "$line" =~ $AC_CONTAINER ]]; then
    IN_AC_BLOCK=true
    PREV_AC_LINE=0
    continue
  fi

  if $IN_AC_BLOCK; then
    if [[ "$line" =~ $BLOCK_END ]]; then
      IN_AC_BLOCK=false
      PREV_AC_LINE=0
      continue
    fi

    [[ -z "$line" ]] && continue

    if [[ "$line" =~ $AC_BULLET ]] || [[ "$line" =~ $SUB_HEADER ]] || [[ "$line" =~ $FORMAT_RATIONALE ]] || [[ "$line" =~ $HTML_COMMENT ]]; then
      [[ "$line" =~ $AC_BULLET ]] && PREV_AC_LINE=$line_num
      continue
    fi

    echo "Error: Orphan line detected in AC block (line $line_num)" >&2
    echo "  Expected: AC bullet, sub-header, format rationale, or blank line" >&2
    echo "  Found: \"$line\"" >&2
    if [[ $PREV_AC_LINE -gt 0 ]]; then
      echo "  Possible continuation of AC on line $PREV_AC_LINE" >&2
    fi
    echo "" >&2
    ERRORS=$((ERRORS + 1))
  fi
done < "$FILE"

if [[ $ERRORS -gt 0 ]]; then
  echo "$ERRORS orphan line(s) found in AC blocks. Fix before save/sync." >&2
  exit 1
fi

echo "AC block validation passed." >&1
exit 0
