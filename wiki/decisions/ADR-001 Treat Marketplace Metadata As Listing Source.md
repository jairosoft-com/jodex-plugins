---
title: ADR-001 Treat Marketplace Metadata As Listing Source
type: decision
tags: [plugin, metadata, marketplace]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [marketplace metadata source of truth]
provenance: synthesis
status: accepted
---

# ADR-001: Treat Marketplace Metadata As Listing Source

## Context

Plugin descriptions are duplicated across the root [[Marketplace]] manifest, plugin manifests, and READMEs. Users notice the marketplace/listing text first, while plugin manifests and docs provide package and usage context.

## Decision

Treat `.claude-plugin/marketplace.json` as the source of truth for marketplace listing text. Keep each plugin's `.claude-plugin/plugin.json` and README aligned with the same product language.

## Consequences

- Updating a plugin description usually means touching at least two metadata files.
- Marketplace/list UI questions should be routed first to `.claude-plugin/marketplace.json`.
- [[Plugin Metadata Surfaces]] should be consulted before renaming or rewording user-facing plugin metadata.
- [[Naming Ripple Effect]] remains relevant because plugin names and marketplace names have a wider blast radius than descriptions.

## Related

- [[Jodex Plugin Marketplace]]
- [[Plugin Metadata Surfaces]]
- [[Marketplace]]

## Derived From
- [[Marketplace]]
- [[Plugin Metadata Surfaces]]
- [[Naming Ripple Effect]]
- [[Source - Marketplace Config]]
