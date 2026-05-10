# Phase 5 Plan: Top-Level File Updates

## Files Read

1. `/Users/jairo/Projects/jodex-qa-ai/README.md` (78 lines)
2. `/Users/jairo/Projects/jodex-qa-ai/ai_docs/claude_desktop_wsl_integration.md` (48 lines)
3. `/Users/jairo/Projects/jodex-qa-ai/ai_docs/claude_cli_vs_desktop_mcp_guide.md` (58 lines)

---

## 5.1 README.md — 13 edits needed

### Prose description (L3)
- **L3**: `**qa-ai**` -> `**jx-qa**` (standalone plugin name)
- **L3**: `Qa.Ai` rule — does NOT apply (no such string exists; description says "qa-ai"). Instead change "qa-ai" plugin name reference.

### Slash commands (L7-9)
- **L7**: `/qa-ai:extract` -> `/jx-qa:extract`
- **L8**: `/qa-ai:generate` -> `/jx-qa:generate`
- **L9**: `/qa-ai:browser` -> `/jx-qa:browser`

### Install examples (L26-27)
- **L26**: `/plugin install qa-ai@jodex-qa-ai` -> `/plugin install jx-qa@jodex-plugins`
- KEEP L24 (`jairosoft-com/jodex-qa-ai`) — repo name, unchanged

### Install examples Desktop (L38-39)
- **L38**: `/plugin install qa-ai@jodex-qa-ai` -> `/plugin install jx-qa@jodex-plugins`
- KEEP L37 (`jairosoft-com/jodex-qa-ai`) — repo name, unchanged

### Local development (L46, L50)
- **L46**: `plugins/qa-ai` -> `plugins/jx-qa` (path in `--plugin-dir` flag; KEEP `/path/to/jodex-qa-ai/` portion)
- **L50**: `plugin install qa-ai@jodex-qa-ai` -> `plugin install jx-qa@jodex-plugins`

### Usage examples (L57, L60, L63)
- **L57**: `/qa-ai:extract` -> `/jx-qa:extract`
- **L60**: `/qa-ai:generate` -> `/jx-qa:generate`
- **L63**: `/qa-ai:browser` -> `/jx-qa:browser`

### See also link (L66)
- **L66**: `plugins/qa-ai/README.md` -> `plugins/jx-qa/README.md` (both the path and the link text)

### Uninstall (L71-72)
- **L71**: `/plugin uninstall qa-ai@jodex-qa-ai` -> `/plugin uninstall jx-qa@jodex-plugins`
- **L72**: `/plugin marketplace remove jodex-qa-ai` -> `/plugin marketplace remove jodex-plugins`

### No-ops in README.md
- No `/llm-wiki:` references found — no changes needed for that rule.
- No `Qa.Ai` string found — no changes needed for that rule.
- All `jodex-qa-ai` occurrences are repo name references and are KEPT unchanged (L1 heading, L24, L37, L49, etc.)

---

## 5.2 ai_docs/claude_desktop_wsl_integration.md — 1 edit needed

### Plugin name reference (L10)
- **L10**: `your \`qa-ai\` skills` -> `your \`jx-qa\` skills`

### No-ops
- L5: `jodex-qa-ai` — repo name, KEEP
- L26: `jodex-qa-ai-mcp` — MCP server name, KEEP
- L31: path contains `jodex-qa-ai` — repo name in filesystem path, KEEP

---

## 5.3 ai_docs/claude_cli_vs_desktop_mcp_guide.md — 0 edits needed

All references are to:
- L20: `jairosoft-com/jodex-qa-ai` — repo name, KEEP
- L42: `jodex-qa-ai-mcp` — MCP server name, KEEP
- L47: path contains `jodex-qa-ai` — repo name in filesystem path, KEEP

No standalone plugin slug references (`qa-ai:`, `plugins/qa-ai`, etc.) found.

---

## ai_docs/llm-wiki.md — NOT TOUCHED (per instructions)

This is a Karpathy pattern doc, not a plugin reference.

---

## Decision Point

**Marketplace identifier**: The task says install/uninstall examples should be updated to use new names with `@jodex-plugins`. I am applying this as:
- `qa-ai@jodex-qa-ai` -> `jx-qa@jodex-plugins`
- `marketplace remove jodex-qa-ai` -> `marketplace remove jodex-plugins`

If the marketplace repo name has NOT actually been renamed to `jodex-plugins`, this could be incorrect. Confirm before execution.

---

## Summary

| File | Edits | Status |
|------|-------|--------|
| README.md | 13 | Planned |
| ai_docs/claude_desktop_wsl_integration.md | 1 | Planned |
| ai_docs/claude_cli_vs_desktop_mcp_guide.md | 0 | No changes needed |
| ai_docs/llm-wiki.md | 0 | Excluded per instructions |

**Total files to update: 2** (README.md and claude_desktop_wsl_integration.md)
