---
title: "Source - Test Command"
type: source
tags: [jx-qa, command, playwright, test]
created: 2026-05-11
updated: 2026-05-11
raw_path: wiki/raw/sources/1fa71e7c-test.md
provenance: source-derived
---

# Source - Test Command

## Metadata
- **Original path**: plugins/jx-qa/commands/test.md
- **SHA-256**: 1fa71e7c6ee342382a5e94fa013eaaeae5605e572152beeb5ce9f50b587839d8
- **Size**: 211 bytes

## Summary

Defines the `/jx-qa:test` [[Slash Command]] for running [[Playwright]] tests through the [[QA Testing Plugin|jx-qa]] test [[Skill]]. The command accepts optional `ui` or `headed` arguments and restricts shell execution to `Bash(npx playwright test:*)`.

## Key Concepts
- User-facing test execution command for generated Playwright specs
- Command-to-skill delegation through `$ARGUMENTS`
- Narrow command allowlist for `npx playwright test`
- UI and headed test-run mode selection

## Pages Updated
- [[QA Testing Plugin]]
- [[Slash Command]]
