---
description: Review an xlsx test plan's quality, testability, and AC traceability; returns an unverified, advisory (non-gating) report
argument-hint: "<xlsx_path> [brd_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py" read:*), Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/read-doc.py" read:*)
---

Review the xlsx test plan for quality, testability, and AC traceability using the `jx-qa:review-plan` skill. Output is an **unverified, advisory (NON-GATING)** report — never a quality gate; it never edits the plan, generates specs, runs tests, or opens a browser.

$ARGUMENTS
