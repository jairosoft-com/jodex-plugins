---
title: Escape User Descriptions in Scaffold Frontmatter
type: idea
tags: [jx-plugin, yaml, safety, frontmatter]
created: 2026-05-20
updated: 2026-05-20
source_count: 0
aliases: [yaml escaping, description quoting]
provenance: synthesis
status: backlogged
---

# Escape User Descriptions in Scaffold Frontmatter

Quote or escape user-provided descriptions in `/jx-plugin:create-skill` generated command stubs to prevent malformed YAML from colons, newlines, or special characters.

## Context

The scaffold writes `description: <raw text>` as an unquoted YAML value. Descriptions with colons (e.g., "ADO sync: create work items") or embedded newlines could produce malformed frontmatter. Tested with colons — parses fine in practice since YAML allows unquoted colons in values. The LLM prompts for a one-line description, making newlines unlikely.

Urgency: 3/10 — hardening, not a bug.

## Sources

- Codex review round 5 finding P2 (2026-05-20)
