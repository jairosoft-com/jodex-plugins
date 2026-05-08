---
title: xlsx-writer.py
type: code
tags: [script, python, helper]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [xlsx-writer]
provenance: source-derived
---

# xlsx-writer.py

[[Pinned Helper]] script for the [[QA AI]] plugin. Python 3 with `openpyxl` dependency.

## Location

`plugins/qa-ai/scripts/xlsx-writer.py`

## Purpose

Reads and writes xlsx test plan files in Azure DevOps format. Used by the `/qa-ai:extract` command to output structured test cases from BRD/PRD analysis.

## Security

- Execution pinned: only callable as `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py"`
- Path validation and metacharacter rejection on inputs

## Sources
- [[Source - QA AI README]]
