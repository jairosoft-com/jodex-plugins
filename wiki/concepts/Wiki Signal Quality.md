---
title: Wiki Signal Quality
type: concept
tags: [wiki, lint, provenance, quality]
created: 2026-05-11
updated: 2026-05-11
source_count: 0
aliases: [lint signal quality, wiki health signal, provenance noise]
provenance: synthesis
---

# Wiki Signal Quality

Wiki signal quality is the reliability of automated wiki health checks as a guide to the maintained knowledge base. It depends on separating maintained knowledge pages from provenance artifacts.

## Core Distinction

The important boundary is not only directory-based (`raw/` vs. `sources/`). It is semantic:

- **Maintained knowledge**: taxonomy pages, source-summary pages, index, backlog, and log entries that the wiki is expected to keep coherent.
- **Provenance material**: immutable source snapshots preserved for auditability and re-ingest evidence.

[[Raw Sources]] should remain available for [[Ingest]], deduplication, and audit trails, but they should not affect [[Lint]] graph checks, frontmatter checks, orphan detection, broken-link scoring, or [[Health Score]].

## Failure Mode

When provenance snapshots are scanned as maintained pages, normal source content creates false wiki defects:

- Example wikilinks become broken links.
- Original source files without wiki frontmatter become frontmatter errors.
- Unlinked raw snapshots become orphan pages.
- A strict health score can collapse even when the maintained wiki is usable.

This is the failure captured by [[Raw Sources Should Be Excluded From Wiki Graph]].

## Design Rule

Wiki tooling should make page discovery explicit. Commands that evaluate wiki health should scan only maintained taxonomy directories and maintained source-summary pages. Commands that snapshot, fingerprint, or re-ingest sources should continue to read provenance paths.

This keeps auditability and signal quality from fighting each other.

## Related

- [[Raw Sources]]
- [[Lint]]
- [[Health Score]]
- [[Repository Source of Truth Precedence]]
- [[Watchlist Pattern]]

## Derived From

- [[Raw Sources Should Be Excluded From Wiki Graph]]
- [[Raw Sources]]
- [[Lint]]
- [[Health Score]]
- [[wiki-tools.py]]
