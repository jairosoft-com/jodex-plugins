---
title: Self-Contained Documents via Metadata Persistence
type: idea
tags: [skill-design, metadata, portability, design-pattern, jx-core]
created: 2026-05-22
status: raw
source: Quality gates polyglot plan, Codex R2 (2026-05-20)
---

# Self-Contained Documents via Metadata Persistence

When a skill resolves config at generation time, persist the resolved values in the output document metadata — not just the config source name. Downstream consumers read from the document, not the filesystem.

Example: PRD quality gates. The PRD stores the resolved gate list in Document Metadata. ADO sync and task conversion read gates from the PRD, not from quality-gates.md on disk. The PRD works identically regardless of which machine syncs it, whether the config file exists, or whether preset definitions changed.

Pattern applies to any skill that resolves config during generation: docs-root path, tenant binding, quality profile, template version. The document becomes the single source of truth for its own downstream processing.
