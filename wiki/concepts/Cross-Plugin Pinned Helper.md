---
title: Cross-Plugin Pinned Helper
type: concept
tags: [pattern, security, plugin-architecture, DRY]
created: 2026-05-14
updated: 2026-05-14
source_count: 0
aliases: [cross-plugin script, sibling plugin helper, dependency-relative helper]
provenance: synthesis
---

# Cross-Plugin Pinned Helper

A resolution pattern for invoking a [[Pinned Helper]] script that lives in a dependency plugin rather than the invoking plugin.

## The Problem

The standard [[Pinned Helper]] pattern uses `${CLAUDE_PLUGIN_ROOT}/scripts/helper.py` — which resolves to the invoking plugin's root. When shared logic lives in a dependency plugin (e.g., jx-core), the helper script lives in a sibling directory, not the invoking plugin.

## The Pattern

Use relative sibling traversal from `CLAUDE_PLUGIN_ROOT`:

```
Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py":*)
```

This resolves from the invoking plugin's root up one level to `plugins/`, then into the dependency plugin.

## Why This Works

The sibling-plugin layout is already load-bearing in the codebase. Every [[Stub-Delegation Pattern]] stub uses cross-plugin traversal:

```
../../../jx-core/_shared/ado.md
```

This resolves from `plugins/<plugin>/skills/<skill>/SKILL.md` up three levels to `plugins/`, then into `jx-core/_shared/`. The cross-plugin pinned helper applies the same sibling assumption to `allowed-tools` Bash scopes.

## When to Use

- A shared executable (script, helper) lives in a dependency plugin (e.g., jx-core)
- Multiple role plugins need to invoke the same helper
- Duplicating the script across plugins would violate DRY and create version drift

## When NOT to Use

- The script is specific to one plugin → use standard `${CLAUDE_PLUGIN_ROOT}/scripts/...`
- The script is a general system utility → use an absolute path or global install

## Examples

- `jx-pm/commands/feedback.md` → `"${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py"` (SHA-256 normalization helper)
- `jx-qa/commands/feedback.md` → same path (shared via jx-core dependency)

## Related

- [[Pinned Helper]] — base pattern (same-plugin scripts)
- [[Stub-Delegation Pattern]] — same sibling traversal used for SKILL.md delegation
- [[Plugin Dependency Declaration]] — dependency relationship that makes sibling layout reliable
- [[Cross-Plugin Shared Convention Layer]] — architectural pattern for shared logic across plugins
