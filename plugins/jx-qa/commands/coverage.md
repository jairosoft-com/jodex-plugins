---
description: Map BRD/PRD requirements to xlsx test cases and report breadth coverage (Covered/Partial/Uncovered/N/A); unverified, advisory (non-gating)
argument-hint: "<xlsx_path> <brd_path>"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py" read:*), Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/read-doc.py" read:*)
---

Map every BRD/PRD requirement to the test cases in the xlsx plan and report **breadth coverage** using the `jx-qa:coverage` skill. Output is an **unverified, advisory (NON-GATING)** report — never a quality gate; it never edits the plan, generates specs, runs tests, or opens a browser.

$ARGUMENTS
