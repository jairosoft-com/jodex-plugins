---
title: xlsx-writer.py
type: code
tags: [script, python, helper]
created: 2026-05-07
updated: 2026-05-08
source_count: 1
aliases: [xlsx-writer]
provenance: source-derived
---

# xlsx-writer.py

[[Pinned Helper]] script for the [[QA Testing Plugin|jx-qa]] plugin. Python 3 with `openpyxl` dependency.

## Location

`plugins/jx-qa/scripts/xlsx-writer.py`

## Purpose

Reads and writes xlsx test plan files in Azure DevOps format. Used by both `/jx-qa:extract` (writes test cases) and `/jx-qa:generate` (reads test cases for Playwright spec generation). Replaced `npx xlsx` as the xlsx parser in the generate skill.

## Security

- Execution pinned: only callable as `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py"`
- Path validation and metacharacter rejection on inputs

## Sources
- [[Source - QA AI README]]
