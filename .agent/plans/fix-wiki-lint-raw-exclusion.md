# Fix Wiki Lint Signal and Exclude Raw Snapshots

## Summary

Implement the actionable lint cleanup by making `jx-kb` lint tooling ignore `wiki/raw/` for normal wiki graph checks, then fix the small maintained-page issues that remain visible once raw snapshot noise is removed. Keep `wiki/raw/` available for ingest snapshots and fingerprints, but exclude it from page graph, frontmatter, backlink, broken-link, and page-list scoring.

## Key Changes

- Update `plugins/jx-kb/scripts/wiki-tools.py` page discovery:
  - Add a maintained-page discovery helper that includes only wiki taxonomy directories such as `concepts/`, `ideas/`, `entities/`, `topics/`, `plugins/`, `platforms/`, `projects/`, `decisions/`, `code/`, and `sources/`.
  - Exclude `wiki/raw/` from `orphans`, `broken-links`, `backlinks`, `frontmatter-check`, `page-list`, and directory-mode `wikilinks`.
  - Leave `snapshot` and `fingerprint` unchanged so ingest can still write/read raw snapshots.

- Update lint workflow docs:
  - Revise `plugins/jx-kb/skills/lint/SKILL.md` to state that raw snapshots are provenance and are excluded from normal lint scoring.
  - Optionally add one line to `plugins/jx-kb/README.md` under `/jx-kb:lint` clarifying the same behavior.

- Fix the clearly actionable maintained wiki issues:
  - Add missing `updated` frontmatter to `Mermaid Obsidian Rendering Gotchas.md` and `Schema Sources Rule Exception for Source Pages.md`.
  - Change `[[Wiki Schema]]` in `Repository Source of Truth Precedence.md` to `[[Schema]]`.
  - Repair the malformed wikilink in `Agent Team Execution.md`.
  - Convert unresolved placeholder/example links such as `[[wikilinks]]`, `[[Page Name]]`, `[[Source A]]`, and similar instructional examples to code spans where they are not meant to resolve as real pages.

- Do not resolve subjective/content-heavy warnings in this pass:
  - Leave orphan pages, conflict callouts, and thin pages for a later triage pass unless they are directly caused by the raw-snapshot bug or obvious placeholder links.

## Test Plan

- Run:
  - `python3 plugins/jx-kb/scripts/wiki-tools.py page-list wiki`
  - `python3 plugins/jx-kb/scripts/wiki-tools.py orphans wiki`
  - `python3 plugins/jx-kb/scripts/wiki-tools.py broken-links wiki`
  - `python3 plugins/jx-kb/scripts/wiki-tools.py frontmatter-check wiki`
- Confirm none of those outputs include paths under `raw/sources/`.
- Confirm `frontmatter-check` no longer reports the two missing `updated` fields.
- Confirm `broken-links` no longer reports the fixed maintained-page placeholder links.
- Run `python3 -m py_compile plugins/jx-kb/scripts/wiki-tools.py`.
- Run `git diff --check`.
- Re-run `$jx-kb:lint wiki/` and append the new lint result to `wiki/_log.md`.

## Assumptions

- `wiki/raw/` remains ignored and untracked.
- Source summary pages under `wiki/sources/` remain maintained wiki pages and should still be linted.
- The first implementation pass optimizes lint signal quality; subjective orphan/conflict/thin-page cleanup is deferred.
