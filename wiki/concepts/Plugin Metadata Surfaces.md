---
title: Plugin Metadata Surfaces
type: concept
tags: [plugin, metadata, marketplace]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [plugin description surfaces, marketplace metadata surfaces]
provenance: synthesis
---

# Plugin Metadata Surfaces

Plugin descriptions appear in more than one file, and each surface has a different job.

## Surfaces

| Surface | File | Role |
|---------|------|------|
| Marketplace listing | `.claude-plugin/marketplace.json` | Controls how plugins appear in marketplace/list views |
| Plugin package metadata | `plugins/<plugin>/.claude-plugin/plugin.json` | Describes the plugin package itself |
| User documentation | `README.md`, `plugins/<plugin>/README.md` | Explains installation, usage, and maintenance expectations |

## Rule of Thumb

Use the root [[Marketplace]] manifest as the listing source of truth. Mirror important wording into the plugin manifest and README so package metadata and documentation do not drift.

This is the specific convention captured by [[ADR-001 Treat Marketplace Metadata As Listing Source]].

## Example

For [[QA AI]], the short display description should be updated in both:

- `.claude-plugin/marketplace.json`
- `plugins/qa-ai/.claude-plugin/plugin.json`

The README should then use the same product language where it describes what users get.

## Related

- [[Naming Ripple Effect]]
- [[Jodex Plugin Marketplace]]
- [[Align qa-ai Generate Tool Contract]]

## Derived From
- [[Marketplace]]
- [[Naming Ripple Effect]]
- [[Plugin Architecture]]
- [[QA AI]]
- [[LLM Wiki]]
