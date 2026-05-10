# Phase 3: Plugin Content Updates

## Status: READY TO EXECUTE

All files have been read. The plan below lists every edit needed.

---

## 3.1 jx-qa plugin (plugins/jx-qa/)

### README.md (~20 replacements)
1. Line 1: `# qa-ai —` -> `# jx-qa —`
2. Line 8: `/qa-ai:extract` -> `/jx-qa:extract` (2 occurrences on this line)
3. Line 8: `/qa-ai:generate` -> `/jx-qa:generate`
4. Line 22: `### `/qa-ai:extract`` -> `### `/jx-qa:extract``
5. Line 27-28: `/qa-ai:extract` -> `/jx-qa:extract` (2 occurrences)
6. Line 40: `### `/qa-ai:generate`` -> `### `/jx-qa:generate``
7. Line 44-45: `/qa-ai:generate` -> `/jx-qa:generate` (2 occurrences)
8. Line 58: `### `/qa-ai:browser`` -> `### `/jx-qa:browser``
9. Line 63-65: `/qa-ai:browser` -> `/jx-qa:browser` (3 occurrences)
10. Line 73: `qa-ai/` -> `jx-qa/` (directory tree)
11. Line 75: `(/qa-ai:*)` -> `(/jx-qa:*)`
12. Line 100: `qa-ai@jodex-qa-ai` -> `jx-qa@jodex-plugins`
13. Line 101: remove or update marketplace line if it mentions `jodex-qa-ai` as plugin name (careful: this is repo name, keep it)

### commands/extract.md
1. Line 7: `qa-ai:extract` -> `jx-qa:extract`

### commands/generate.md
1. Line 7: `qa-ai:generate` -> `jx-qa:generate`

### commands/test.md
1. Line 7: `qa-ai:test` -> `jx-qa:test`

### commands/browser.md
- No `qa-ai` references found (already clean)

### skills/generate/SKILL.md
1. Line 4: `/qa-ai:generate` -> `/jx-qa:generate`

---

## 3.2 jx-kb plugin (plugins/jx-kb/)

### README.md (~35 replacements)
All `/llm-wiki:` -> `/jx-kb:`
All `llm-wiki` as plugin slug -> `jx-kb`
`llm-wiki@jairosoft-com-jodex-qa-ai` -> `jx-kb@jodex-plugins`

### commands/init.md
- `llm-wiki:init` -> `jx-kb:init`

### commands/ingest.md
- `llm-wiki:ingest` -> `jx-kb:ingest`

### commands/lint.md
- `llm-wiki:lint` -> `jx-kb:lint`

### commands/query.md
- `llm-wiki:query` -> `jx-kb:query`

### commands/triage.md
- `llm-wiki:triage` -> `jx-kb:triage`

### skills/init/SKILL.md
- `/llm-wiki:init` -> `/jx-kb:init`
- `/llm-wiki:ingest` -> `/jx-kb:ingest`

### skills/ingest/SKILL.md
- `/llm-wiki:init` -> `/jx-kb:init`
- `/llm-wiki:ingest` -> `/jx-kb:ingest`

### skills/lint/SKILL.md
- `/llm-wiki:lint` -> `/jx-kb:lint`

### skills/query/SKILL.md
- `/llm-wiki:query` -> `/jx-kb:query`
- `/llm-wiki:ingest` -> `/jx-kb:ingest`

### skills/triage/SKILL.md
- `/llm-wiki:triage` -> `/jx-kb:triage`

---

## 3.3 ABOUT.md cross-references (4 files under plugins/jx-kb/)

### agents/ABOUT.md
- Line 31: `qa-ai plugin` -> `jx-qa plugin`

### schemas/ABOUT.md
- Line 29: `llm-wiki plugin` -> `jx-kb plugin` (if present)
- Line 33: `qa-ai plugin` -> `jx-qa plugin`

### hooks/ABOUT.md
- Line 34: `qa-ai plugin` -> `jx-qa plugin`

### prompts/ABOUT.md
- Line 14: `qa-ai plugin` -> `jx-qa plugin`

---

## Execution approach

Use `replace_all` for safe bulk replacements within each file. For the tricky `qa-ai` -> `jx-qa` in README where `jodex-qa-ai` must be preserved, use targeted individual Edit calls.

## Total files to update: ~22 files
