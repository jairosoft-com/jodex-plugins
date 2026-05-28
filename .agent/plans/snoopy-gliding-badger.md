# Plan: Extract ADO Sync and Task Skills to jx-core

## Context

`ado` and `task` are cross-role skills — any plugin may need ADO sync or task.json generation. Currently the full 276-line `ado` logic lives in `jx-pm` and the 219-line `task` logic in `jx-dev`. A second role needing either would have to duplicate the full skill body. This refactor centralizes both bodies in `jx-core/_shared/` so role plugins hold only thin delegating stubs. `jx-core` gains no user-invocable commands — it is reclassified from reference-only to shared-convention-plus-executable-logic, which requires explicit contract updates across all authority files.

---

## Files to Change

| File | Action |
|------|--------|
| `plugins/jx-core/_shared/ado.md` | **Create** — copy full body from jx-pm/skills/ado/SKILL.md verbatim; **do NOT rewrite internal paths** |
| `plugins/jx-core/_shared/task.md` | **Create** — copy full body from jx-dev/skills/task/SKILL.md verbatim; **do NOT rewrite internal paths** |
| `plugins/jx-pm/skills/ado/SKILL.md` | **Replace** with thin fail-closed stub |
| `plugins/jx-dev/skills/task/SKILL.md` | **Replace** with thin fail-closed stub |
| `plugins/jx-core/README.md` | **Update** — remove "reference-only" language; document new scope |
| `plugins/jx-core/.claude-plugin/plugin.json` | **Update** — remove "Reference-only — no commands or skills" from description |
| `wiki/plugins/Core Shared Conventions Plugin.md` | **Update** — remove `reference-only` tag, "no commands or skills" prose; add ado.md and task.md to contents table |
| `README.md` (root, line 13) | **Update** — jx-core row: remove "Reference-only — no commands" |
| `AGENTS.md` (line 35) | **Update** — remove "reference-only…no user-facing commands" sentence |
| `.claude-plugin/marketplace.json` | **Update unconditionally** — jx-core description must mention executable skill logic, ADO sync, task conversion |
| `wiki/projects/Jodex Plugin Marketplace.md` | **Update** — row `\| jx-core \| 0 \| Current \| Reference-only shared conventions \|` → include ado/task |
| `wiki/concepts/Cross-Plugin Shared Convention Layer.md` | **Update** — add note that jx-core now also holds executable shared logic, not only conventions |
| `wiki/concepts/Plugin Dependency Declaration.md` | **Update** — remove "Reference-only plugins (like jx-core) have NO dependencies field"; jx-core is no longer purely reference-only |
| `wiki/concepts/Emergent Design from Constraint.md` | **Update** — row `\| Reference-only plugin (jx-core) \| No commands, no skills… \|` → reflect expanded scope |
| `wiki/concepts/Shared Reference Extraction.md` | **Update** — "dedicated reference-only plugin" → "dedicated shared plugin" |
| `wiki/_watchlist.md` | **Update** — add `plugins/jx-core/_shared/ado.md` and `plugins/jx-core/_shared/task.md` to Pending list for ingest |

**Unchanged:** `jx-pm/commands/ado.md`, `jx-dev/commands/task.md`, all `plugin.json` dependencies (already correct).

**Do NOT update** (archived ideas — historical record accurate at time of writing):
- `wiki/ideas/Split Tech Spec Into jx-dev Plugin.md`
- `wiki/ideas/Cross-Plugin Shared Convention Layer (Promoted).md`

---

## Step-by-Step Implementation

### Step 1 — Create `plugins/jx-core/_shared/ado.md`

Copy full content of `plugins/jx-pm/skills/ado/SKILL.md` **verbatim — zero path changes**.

The repo's resolver anchors relative paths from the consuming SKILL.md (the stub), not from the included shared file. Since all role plugins follow the same depth (`plugins/X/skills/Y/SKILL.md`), the existing `../../../jx-core/_shared/` paths resolve correctly from any role stub's location. Rewriting them to `./` would break resolution.

All 4 destructive confirmation gates **must be preserved intact** (do not remove or alter):
- `--new-tenant` → typed word `rebind`
- `--prune` → typed word `prune`
- Force-recreate → typed word `recreate`
- State-sync → typed word `sync`

### Step 2 — Create `plugins/jx-core/_shared/task.md`

Copy full content of `plugins/jx-dev/skills/task/SKILL.md` **verbatim — zero path changes**.

Same reasoning: `../../../jx-core/_shared/` paths resolve from the consuming stub's location, which is correct for any role plugin at standard depth.

### Step 3 — Replace `plugins/jx-pm/skills/ado/SKILL.md` with thin stub

```markdown
---
name: ado
user-invocable: true
argument-hint: "[--dry-run] [--tenant <org>/<project>] [--docs-root <path>] [--prune] [--new-tenant]"
description: >
  Synchronize task.json to Azure Boards. Creates Feature, User Stories, and Tasks hierarchy.
  Supports dry-run preview, state sync, and stale item pruning.
  Triggers on: sync to azure boards, create azure work items, populate boards from task json, sync state to azure.
  Do not trigger for: PRD generation, tech spec generation, task breakdown, wiki operations.
---

# Azure Boards Sync

**Fail-closed guard:** Before proceeding, verify `../../../jx-core/_shared/ado.md` is readable.
If the file cannot be read, halt immediately:
> "Error: jx-core shared ADO skill not found. Ensure the jx-core plugin is installed."

Follow all instructions in `../../../jx-core/_shared/ado.md`.
```

### Step 4 — Replace `plugins/jx-dev/skills/task/SKILL.md` with thin stub

```markdown
---
name: task
user-invocable: true
argument-hint: "[--docs-root <path>] [--force-overwrite]"
description: >
  Convert a PRD.md or BRD_PRD.md (and optionally TECH_SPEC.md) into canonical task.json
  for execution and Azure Boards sync. Preserves all requirement IDs, adds hour estimates
  and story points. Triggers on: convert prd, create task json, task breakdown, jodex format.
  Do not trigger for: PRD generation, tech spec generation, Azure sync, wiki operations.
---

# Task JSON Converter

**Fail-closed guard:** Before proceeding, verify `../../../jx-core/_shared/task.md` is readable.
If the file cannot be read, halt immediately:
> "Error: jx-core shared task skill not found. Ensure the jx-core plugin is installed."

Follow all instructions in `../../../jx-core/_shared/task.md`.
```

### Step 5 — Update jx-core contract surfaces

**`plugins/jx-core/README.md`** — Replace "Reference-only plugin — no commands or skills." with description of new scope. Add entries for `_shared/ado.md` and `_shared/task.md` in the contents table.

**`plugins/jx-core/.claude-plugin/plugin.json`** — Update description field. Remove "Reference-only — no commands or skills." New: `"Shared plugin: conventions (ID rules, docs-root, task schema) and executable skill logic (ADO sync, task conversion) consumed by sibling role plugins."`

**`wiki/plugins/Core Shared Conventions Plugin.md`** — Remove `reference-only` tag, remove "no commands or skills" prose, update description of contents to include `ado.md` and `task.md`.

**`README.md` (root, line 13)** — Update jx-core row in plugin table. Remove "Reference-only — no commands" from description column.

**`AGENTS.md` (line 35)** — Update or remove the sentence "`jx-core` is reference-only and provides shared conventions. It has no user-facing commands." New: "`jx-core` provides shared conventions and executable skill logic. It has no user-facing commands but its `_shared/` files contain executable instructions consumed by role plugin stubs."

**`.claude-plugin/marketplace.json`** — Update unconditionally. Current jx-core entry: `"Shared conventions: ID rules, docs-root resolution, task JSON schema"`. New description must be: `"Shared plugin: conventions (ID rules, docs-root, task schema) and executable skill logic (ADO sync, task conversion) consumed by sibling role plugins."` Validate JSON after edit with `python3 -m json.tool .claude-plugin/marketplace.json`.

**`wiki/projects/Jodex Plugin Marketplace.md`** — Find the jx-core row in the plugin table (`| Reference-only shared conventions |`) and update to reflect expanded scope (shared conventions + executable skill logic: ADO sync, task conversion).

**`wiki/concepts/Cross-Plugin Shared Convention Layer.md`** — The concept remains valid; add a note that jx-core now also holds executable skill logic alongside conventions. Do not rewrite the pattern — it still applies. Suggested addition after the existing pattern description:

> **Note (2026-05-12):** `jx-core` has been expanded beyond pure conventions. `_shared/ado.md` and `_shared/task.md` contain executable skill logic consumed by role plugin stubs. The reference-via-relative-path pattern is unchanged; the scope of what can live in `_shared/` now includes executable logic, not only schema/rules files.

**`wiki/concepts/Plugin Dependency Declaration.md`** — Remove or qualify the line "Reference-only plugins (like jx-core) have NO dependencies field". New: "Core shared plugins (like jx-core) have NO dependencies field — they are the dependency, not the consumer."

**`wiki/concepts/Emergent Design from Constraint.md`** — Update the jx-core row in the constraints table. Change "No commands, no skills, just shared contracts" to "No user-invocable commands; `_shared/` holds both conventions and executable skill logic consumed by role plugins."

**`wiki/concepts/Shared Reference Extraction.md`** — Change "dedicated reference-only plugin" to "dedicated shared plugin". One occurrence.

**`wiki/_watchlist.md`** — Add `plugins/jx-core/_shared/ado.md` and `plugins/jx-core/_shared/task.md` to the "## Pending" section. The stubs at `plugins/jx-pm/skills/ado/SKILL.md` and `plugins/jx-dev/skills/task/SKILL.md` are already tracked and will re-ingest via hash change.

---

## Verification

1. **Shared files exist:** `ls plugins/jx-core/_shared/ado.md plugins/jx-core/_shared/task.md` — both must exist.

2. **Paths unchanged:** `grep -c "../../../jx-core/_shared/" plugins/jx-core/_shared/ado.md` — must match same count as original `jx-pm/skills/ado/SKILL.md`. No `./docs-root.md` or `./id-rules.md` style paths introduced.

3. **Gate preservation — exact string assertions** (each must return ≥1 match; failure = gates lost):
   ```bash
   # --new-tenant gate: exact prompt text
   rg -F "Type 'rebind' to strip Azure IDs" plugins/jx-core/_shared/ado.md

   # --prune gate: exact prompt text
   rg -F "Type 'prune' to close" plugins/jx-core/_shared/ado.md

   # Confirmation gates table header (covers force-recreate + state-sync rows)
   rg -F "Confirmation word" plugins/jx-core/_shared/ado.md

   # Force-recreate row in table
   rg -F "| Force recreate |" plugins/jx-core/_shared/ado.md

   # State-sync row in table
   rg -F "| State sync |" plugins/jx-core/_shared/ado.md
   ```

4. **Destructive-path review (manual):** Read `plugins/jx-core/_shared/ado.md` Phase 7 (Prune) and the `--new-tenant` section. Confirm each section still contains its typed-confirmation requirement before any Azure write call. No automated check can substitute for this read.

5. **Marketplace JSON valid + updated:**
   ```bash
   python3 -m json.tool .claude-plugin/marketplace.json
   rg "ADO sync\|task conversion\|executable" .claude-plugin/marketplace.json
   ```

6. **Stale language sweep (plugin files):** `rg "reference-only|no commands or skills" plugins/ README.md AGENTS.md .claude-plugin/` — expect zero matches.

7. **Stale language sweep (wiki — maintained pages only):** `rg "reference-only|no commands or skills" wiki/ -g "*.md" | grep -v "wiki/raw/" | grep -v "wiki/sources/" | grep -v "wiki/ideas/Split Tech Spec" | grep -v "wiki/ideas/Cross-Plugin"` — expect zero matches.

8. **Wiki health:** `python3 plugins/jx-kb/scripts/wiki-tools.py broken-links wiki` and `frontmatter-check wiki` — both clean.

9. **Smoke test:** Invoke `/jx-pm:ado --dry-run` and `/jx-dev:task` in a test folder — both should load and execute from the shared core files.
