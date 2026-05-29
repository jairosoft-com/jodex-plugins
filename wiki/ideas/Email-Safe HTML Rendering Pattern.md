---
title: Email-Safe HTML Rendering Pattern
type: idea
tags: [pattern, email, html, jx-pm, reusable]
created: 2026-05-25
updated: 2026-05-28
source_count: 1
aliases: [inline-styled email HTML]
provenance: source-derived
status: completed
---

# Email-Safe HTML Rendering Pattern

Reusable pattern for converting Markdown skill output to email-compatible inline-styled HTML. Used by `portfolio-email` (iteration_audit) and `meet-email` ([[Product Management Skills Plugin|jx-pm]]).

## Rules

- Table-based layout only (no flexbox/grid)
- All styles inline (`style="..."` on every element)
- No external deps, `<script>`, CDN links, `<link>`, SVG, CSS variables, `<style>` blocks
- Safe fonts: `Arial, Helvetica, sans-serif`
- HTML-escape all source text before insertion (`&`, `<`, `>`, `"`)
- Allowlist rendering: only known safe tags (`table`, `tr`, `td`, `th`, `span`, `div`, `br`, `p`, `b`, `strong`)

## Potential Generalization

Could be extracted into a shared `_shared/email-html.md` reference in [[Core Shared Conventions Plugin|jx-core]] if more email skills emerge.

## Sources

- [[Source - FEAT-006 Meeting Prep Email Plan]]
