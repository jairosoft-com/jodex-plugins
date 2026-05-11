---
title: "Source - jx-core Docs Root Config"
type: source
tags: [jx-core, shared, configuration, docs-root]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-core/_shared/docs-root.md"
source_hash: "7a46981c2ff61844be37f9dbcd869b29c02a6b19ba0959024cdd73057a391423"
---

# Source - jx-core Docs Root Config

## Metadata
- **Original path**: plugins/jx-core/_shared/docs-root.md
- **SHA-256**: 7a46981c2ff61844be37f9dbcd869b29c02a6b19ba0959024cdd73057a391423
- **Size**: 642 bytes
- **Raw snapshot**: wiki/raw/sources/7a46981c-docs-root.md

## Provenance Note

This is the **canonical post-split location** of the docs-root configuration. The pre-split content (when this file lived at `plugins/jx-pm/skills/_shared/docs-root.md`) is captured in [[Source - Docs Root Config]]. The content has been updated to reflect the cross-plugin scope: the env var resolution now includes `$JX_DOCS_ROOT` (new, plugin-neutral) ahead of `$JX_PM_DOCS_ROOT` (backward compatibility).

## Summary

Shared configuration file referenced by all jx skills (across both jx-pm and jx-dev) for output directory resolution. Defines a four-level resolution order:

1. `--docs-root <path>` CLI argument (highest priority)
2. `$JX_DOCS_ROOT` environment variable (new, plugin-neutral)
3. `$JX_PM_DOCS_ROOT` environment variable (backward compatibility)
4. Default: `docs/`

Also specifies the standard output folder structure (`{docs_root}/{NNN}_{feature_name}/` containing PRD.md, TECH_SPEC.md, task.json) and the user prompting convention for folder path input.

## Key Concepts
- [[Configurable Default Chain]] -- four-level resolution: CLI flag > new env var > legacy env var > hardcoded default
- [[Shared Reference Extraction]] -- canonical reference for docs-root logic, now in cross-plugin shared layer
- [[Cross-Plugin Shared Convention Layer]] -- this file is one of three shared conventions in jx-core

## Pages Created
None
