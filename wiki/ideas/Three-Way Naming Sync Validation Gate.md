---
title: Three-Way Naming Sync Validation Gate
type: idea
tags: [jx-plugin, plugins, validation, marketplace]
created: 2026-05-20
updated: 2026-05-20
source_count: 0
aliases: [naming sync check, plugin naming validation]
provenance: synthesis
status: completed
---

# Three-Way Naming Sync Validation Gate

Add a post-scaffold validation step to `/jx-plugin:create-skill` (or future `/jx-plugin:validate`) that verifies 3-way naming sync: directory name = plugin.json name = marketplace.json name.

## Motivation

- Naming mismatch causes silent "Plugin not found" errors
- Currently a manual check documented in [[Creating a Plugin]]
- Automating this as part of scaffold or validate would catch drift early

## Context

Surfaced during Codex adversarial review of `/jx-plugin:create-skill` plan (round 4). Not a v1 blocker — the jx-plugin plugin itself is fully packaged in the plan with correct naming. This is about the *scaffolded output* for future plugins, which is deferred scope (v1 is skill-only).

## Sources

- Codex adversarial review round 4 (2026-05-20)
- [[Creating a Plugin]] (wiki/code/)
