---
title: "Source - Extract Command"
type: source
tags: [qa-ai, command, extract, brd, test-plan]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/qa-ai/commands/extract.md
provenance: source-derived
---

# Source - Extract Command

## Metadata
- **Original path**: plugins/qa-ai/commands/extract.md
- **SHA-256**: 257ffdfbb7d6b8433ce2eed10e361fcdadc2de7b0a20eef81d4ff09699cf84f8
- **Size**: 388 bytes

## Summary

Defines the `/qa-ai:extract` slash command for extracting E2E test cases from a BRD/PRD markdown document into an xlsx test plan. Accepts arguments for BRD path, xlsx output path, mapping path, area path, and assigned-to. Delegates to the `qa-ai:extract` skill and allows Python xlsx-writer, ls, Read, and Write tools.

## Key Concepts
- Command-to-skill delegation pattern
- BRD/PRD to xlsx test plan extraction
- Multi-argument command with positional parameters
- Tool allowlist for sandboxed execution

## Pages Created
None
