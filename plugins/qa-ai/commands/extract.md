---
description: Extract E2E test cases from a BRD/PRD markdown document into an xlsx test plan
argument-hint: "<brd_path> [xlsx_path] [mapping_path] [area_path] [assigned_to]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py":*), Read, Write
---

Extract E2E test cases from the provided BRD/PRD document using the `qa-ai:extract` skill.

$ARGUMENTS
