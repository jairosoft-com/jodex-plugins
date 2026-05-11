---
title: Mermaid Obsidian Rendering Gotchas
type: concept
tags: [mermaid, obsidian, rendering, diagrams, troubleshooting]
created: 2026-05-10
source_count: 0
aliases: [Mermaid Rendering Issues, Mermaid Syntax Pitfalls]
provenance: session-derived
---

# Mermaid Obsidian Rendering Gotchas

Characters and patterns that silently break Mermaid rendering in Obsidian. Diagrams show a parse error or blank block instead of rendering. Discovered while fixing the [[Plugin Pipeline Sequence]] diagrams.

## Breaking Characters

| Character | Context | Fix |
|-----------|---------|-----|
| `→` `←` `—` (Unicode) | Subgraph names, Note text, messages | Use ASCII: `->`, `--`, `-` |
| `<word>` (angle brackets) | Message text e.g. `<source>` | Parsed as HTML tag. Remove brackets: `source` |
| `<i>`, `<br/>` (HTML tags) | Flowchart node labels | Use quoted multiline labels: `NODE["line1\nline2"]` |
| `/` (forward slash) | Participant alias e.g. `jx-core/_shared` | Replace with space or dash |
| `(text: value)` | Message text with colon inside parens | Remove parens or colon: `text value` |

## Safe Patterns

- **Multiline flowchart labels:** `NODE["line 1\nline 2\nline 3"]` with double quotes
- **Subgraph names:** ASCII only, no special chars
- **Sequence messages:** Plain text, no Unicode, no angle brackets, no parens with colons
- **Note text:** Use `-` not `—` for dashes
- **Pipe-separated lists:** `skill1 | skill2 | skill3` inside quoted labels

## Rule of Thumb

Mermaid in Obsidian = strict subset of Mermaid.js. When in doubt: ASCII only, no HTML, quote labels, avoid special chars in messages.

## Related

- [[Mermaid Diagram Patterns]]
- [[Plugin Pipeline Sequence]]
