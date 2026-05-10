# Plan: Split jx-pm into jx-pm + jx-dev + jx-core

## Context

The jx-pm plugin currently bundles 5 skills (prd, techspec, task, pipeline, ado). Tech spec and task are developer-facing while prd, ado, and pipeline are PM-facing. This plan extracts dev skills into a new jx-dev plugin and shared conventions into jx-core. Groomed idea with 14 AC items survived 3 adversarial rounds (24 findings resolved).

**Source:** `wiki/ideas/Split Tech Spec Into jx-dev Plugin.md`

---

## Architecture

```
Track A (jx-core)  ──┐
                     ├──> Track C (jx-pm mod, after B completes) ──> Phase D (verification)
Track B (jx-dev)   ──┘
```

Tracks A and B are fully parallel. Track C starts after Track B completes (B copies files from jx-pm that C deletes). Phase D runs after all complete.

---

## Track A: Build jx-core (reference-only plugin)

### A1. Create directory structure
```
plugins/jx-core/.claude-plugin/
plugins/jx-core/_shared/
```

### A2. Create `plugins/jx-core/.claude-plugin/plugin.json`
```json
{
  "name": "jx-core",
  "version": "1.0.0",
  "description": "Shared conventions: ID rules, docs-root resolution, task JSON schema. Reference-only — no commands or skills.",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" }
}
```

### A3. Create `plugins/jx-core/README.md`
- Reference-only plugin, no commands/skills
- Documents sibling layout and relative path convention

### A4. Create `plugins/jx-core/_shared/id-rules.md`
Adapt from `plugins/jx-pm/skills/_shared/id-rules.md`:
- "All jx-pm skills" → "All jx skills"
- "techspec" → "spec skill", "task" → "task skill", etc. (plugin-neutral)

### A5. Create `plugins/jx-core/_shared/docs-root.md`
Adapt from `plugins/jx-pm/skills/_shared/docs-root.md`:
- "All jx-pm skills" → "All jx skills"
- Env var precedence: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` (backward compat) > `docs/`
- Remove "Passing Between Skills" chain section
- Remove plugin-specific command names from output structure annotations

### A6. Create `plugins/jx-core/_shared/task-json-schema.md`
Adapt from `plugins/jx-pm/schemas/task-json-schema.md`:
- "Consumed by `/jx-pm:ado`" → "Produced by the task skill and consumed by the ado skill"

### A7. No commands/, skills/, agents/, hooks/, prompts/, schemas/, scripts/ dirs

---

## Track B: Build jx-dev (new plugin)

**Runs parallel with Track A. Must complete before Track C starts.**

### B1. Create directory structure
```
plugins/jx-dev/.claude-plugin/
plugins/jx-dev/commands/
plugins/jx-dev/skills/spec/references/
plugins/jx-dev/skills/task/
plugins/jx-dev/agents/
plugins/jx-dev/hooks/
plugins/jx-dev/prompts/
plugins/jx-dev/schemas/
plugins/jx-dev/scripts/
```

### B2. Create `plugins/jx-dev/.claude-plugin/plugin.json`
```json
{
  "name": "jx-dev",
  "version": "1.0.0",
  "description": "Developer skills: generate technical specifications and task breakdowns from PRDs.",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" },
  "dependencies": ["jx-core"]
}
```

### B3. Create `plugins/jx-dev/README.md`
- Skills: spec, task
- Dependencies: jx-core
- Env var: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` > `docs/`

### B4. Create `plugins/jx-dev/commands/spec.md`
Adapt from `plugins/jx-pm/commands/techspec.md`:
- Remove `--chain`, `--chain-all` from argument-hint
- Reference `jx-dev:spec` skill

### B5. Create `plugins/jx-dev/commands/task.md`
Adapt from `plugins/jx-pm/commands/task.md`:
- Remove `--chain`, `--chain-all` from argument-hint
- Reference `jx-dev:task` skill

### B6. Create `plugins/jx-dev/skills/spec/SKILL.md`
Adapt from `plugins/jx-pm/skills/techspec/SKILL.md`:
- `name: spec` (was `techspec`)
- Remove `--chain`, `--chain-all` args and all chain invocation lines
- `$JX_PM_DOCS_ROOT` → `$JX_DOCS_ROOT` in defaults
- `_shared/*.md` → `../../../jx-core/_shared/*.md` (3 levels from SKILL.md)
- Delete chain invocation lines in Phase 5

### B7. Copy reference files (no content changes)
- `plugins/jx-pm/skills/techspec/references/template.md` → `plugins/jx-dev/skills/spec/references/template.md`
- `plugins/jx-pm/skills/techspec/references/diagram-patterns.md` → `plugins/jx-dev/skills/spec/references/diagram-patterns.md`

### B8. Create `plugins/jx-dev/skills/task/SKILL.md`
Adapt from `plugins/jx-pm/skills/task/SKILL.md`:
- Remove `--chain`, `--chain-all` args and all chain invocation lines
- `$JX_PM_DOCS_ROOT` → `$JX_DOCS_ROOT`
- `_shared/*.md` → `../../../jx-core/_shared/*.md`
- `schemas/task-json-schema.md` → `../../../jx-core/_shared/task-json-schema.md`
- Delete chain-coupling line: "If chained from /jx-pm:techspec and TECH_SPEC not found: HALT"

### B9. Create scaffold ABOUT.md files
- agents/ABOUT.md, hooks/ABOUT.md, prompts/ABOUT.md, schemas/ABOUT.md, scripts/ABOUT.md

---

## Track C: Modify jx-pm

**Depends on Track B completing (B copies source files that C deletes).**

### C1. Delete moved files
```
plugins/jx-pm/commands/techspec.md
plugins/jx-pm/commands/task.md
plugins/jx-pm/skills/techspec/ (entire dir)
plugins/jx-pm/skills/task/ (entire dir)
plugins/jx-pm/skills/_shared/ (entire dir)
plugins/jx-pm/schemas/task-json-schema.md
```

### C2. Update `plugins/jx-pm/.claude-plugin/plugin.json`
- Description: "Pm.Ai Harness: generate PRDs and sync to Azure Boards."
- Add `"dependencies": ["jx-core"]`

### C3. Update `plugins/jx-pm/commands/prd.md`
- Remove `--chain`, `--chain-all` from argument-hint
- Delete chain invocation lines

### C4. Update `plugins/jx-pm/commands/pipeline.md`
- Reduced to prd-only delegation
- Remove `--skip-ado`
- Remove all `mcp__azure-devops__*` from allowed-tools
- Add deprecated flags section (error on old flags: `--skip-ado`, `--chain-all`)

### C5. Update `plugins/jx-pm/skills/prd/SKILL.md`
- Remove `--chain`, `--chain-all` args
- `_shared/*.md` → `../../../jx-core/_shared/*.md` (3 levels from prd/SKILL.md)
- `$JX_PM_DOCS_ROOT` → `$JX_DOCS_ROOT`
- Delete chain invocation lines in Phase 6
- PRESERVE "traceability chain" and "Golden Thread" (methodology terms, not skill chaining)

### C6. Update `plugins/jx-pm/skills/pipeline/SKILL.md`
Major rewrite:
- Reduced to prd-only delegation
- `$JX_PM_DOCS_ROOT` → `$JX_DOCS_ROOT` in docs-root defaults
- Deprecated flags return errors
- Note full workflow requires manual `/jx-dev:spec`, `/jx-dev:task`, `/jx-pm:ado`

### C7. Update `plugins/jx-pm/skills/ado/SKILL.md`
- `_shared/*.md` → `../../../jx-core/_shared/*.md`
- `$JX_PM_DOCS_ROOT` → `$JX_DOCS_ROOT`
- Add explicit schema path reference: `../../../jx-core/_shared/task-json-schema.md`

### C8. Update `plugins/jx-pm/README.md`
- Remove techspec/task from skills table
- Update to reflect prd + ado + pipeline (reduced) only
- Add dependency on jx-core
- Update env var section: `$JX_DOCS_ROOT` canonical, `$JX_PM_DOCS_ROOT` as backward-compat fallback

### C9. Update `plugins/jx-pm/agents/ABOUT.md`
- Remove "Generating Tech Spec" and "Generating Task" from "When to use" list
- Keep "Generating BRD/PRD"

### C10. Update `.claude-plugin/marketplace.json`
- Update jx-pm description: "Pm.Ai Harness: generate PRDs and sync to Azure Boards."
- Add jx-dev entry: `{ "name": "jx-dev", "description": "Developer skills: generate technical specifications and task breakdowns from PRDs.", "author": { "name": "Jairosoft" }, "category": "productivity", "source": "./plugins/jx-dev" }`
- Add jx-core entry: `{ "name": "jx-core", "description": "Shared conventions: ID rules, docs-root resolution, task JSON schema.", "author": { "name": "Jairosoft" }, "category": "core", "source": "./plugins/jx-core" }`

---

## Phase D: Verification (after all tracks)

### D1. No stale cross-references
```bash
grep -rE "jx-pm:(techspec|task)" plugins/
# Expected: 0 matches
```

### D2. Chain flags properly handled
```bash
# No chain flags in argument tables
grep -rE "argument-hint:.*--chain" plugins/jx-pm/ plugins/jx-dev/
# Expected: 0 matches

# No chain invocation lines (e.g., "invoke /jx-pm:", "If --chain")
# Exclude pipeline deprecated-flags section
grep -rE "invoke /jx-pm:(techspec|task)|If --chain" plugins/jx-pm/skills/prd/ plugins/jx-dev/
# Expected: 0 matches

# Pipeline deprecated section SHOULD mention --chain-all (as error handler)
grep -c "chain-all" plugins/jx-pm/skills/pipeline/SKILL.md
# Expected: >=1 (in deprecated flags section only)
```

### D3. jx-core plugin-neutrality
```bash
grep -r "jx-pm" plugins/jx-core/
# Expected: only "$JX_PM_DOCS_ROOT" in docs-root.md
```

### D4. jx-core has no commands/
```bash
test -d plugins/jx-core/commands && echo "FAIL" || echo "PASS"
```

### D5. Relative paths resolve (grep checks)
Verify all SKILL.md files contain `../../../jx-core/_shared/` references.
```bash
for f in plugins/jx-dev/skills/spec/SKILL.md plugins/jx-dev/skills/task/SKILL.md plugins/jx-pm/skills/prd/SKILL.md plugins/jx-pm/skills/ado/SKILL.md; do
  echo "=== $f ==="
  grep -c "../../../jx-core/_shared/" "$f"
done
```

### D6. Plugin manifests correct
```bash
python3 -c "import json; d=json.load(open('plugins/jx-dev/.claude-plugin/plugin.json')); assert 'jx-core' in d.get('dependencies',[]); print('PASS: jx-dev deps')"
python3 -c "import json; d=json.load(open('plugins/jx-pm/.claude-plugin/plugin.json')); assert 'jx-core' in d.get('dependencies',[]); print('PASS: jx-pm deps')"
python3 -c "import json; d=json.load(open('plugins/jx-core/.claude-plugin/plugin.json')); assert 'dependencies' not in d; print('PASS: jx-core no deps')"
```

### D7. Env var references
```bash
grep -l "JX_DOCS_ROOT" plugins/jx-dev/skills/spec/SKILL.md plugins/jx-dev/skills/task/SKILL.md plugins/jx-pm/skills/prd/SKILL.md plugins/jx-pm/skills/ado/SKILL.md plugins/jx-pm/skills/pipeline/SKILL.md
# Expected: all 5 files listed
```

### D8. READMEs exist
```bash
test -f plugins/jx-core/README.md && echo "PASS" || echo "FAIL"
test -f plugins/jx-dev/README.md && echo "PASS" || echo "FAIL"
```

### D9. File inventory
```bash
# jx-core: 5 files
find plugins/jx-core -type f | wc -l

# jx-dev: ~12 files
find plugins/jx-dev -type f | wc -l

# jx-pm: no moved files remain
test -f plugins/jx-pm/commands/techspec.md && echo "FAIL" || echo "PASS"
test -f plugins/jx-pm/commands/task.md && echo "FAIL" || echo "PASS"
test -d plugins/jx-pm/skills/techspec && echo "FAIL" || echo "PASS"
test -d plugins/jx-pm/skills/task && echo "FAIL" || echo "PASS"
test -d plugins/jx-pm/skills/_shared && echo "FAIL" || echo "PASS"
test -f plugins/jx-pm/schemas/task-json-schema.md && echo "FAIL" || echo "PASS"
```

### D10. Marketplace updated
```bash
python3 -c "import json; m=json.load(open('.claude-plugin/marketplace.json')); names=[p['name'] for p in m['plugins']]; assert 'jx-core' in names; assert 'jx-dev' in names; assert 'jx-pm' in names; print('PASS: all 3 plugins in marketplace')"
```

### D11. Behavioral smoke tests
```bash
# Verify skill files are well-formed (have YAML frontmatter with correct names)
for f in plugins/jx-dev/skills/spec/SKILL.md plugins/jx-dev/skills/task/SKILL.md plugins/jx-pm/skills/prd/SKILL.md plugins/jx-pm/skills/ado/SKILL.md plugins/jx-pm/skills/pipeline/SKILL.md; do
  head -1 "$f" | grep -q "^---" && echo "PASS: $f has frontmatter" || echo "FAIL: $f missing frontmatter"
done

# Verify skill names after rename
grep -q "^name: spec$" plugins/jx-dev/skills/spec/SKILL.md && echo "PASS: spec name" || echo "FAIL: spec name wrong"
grep -q "^name: task$" plugins/jx-dev/skills/task/SKILL.md && echo "PASS: task name" || echo "FAIL: task name wrong"

# Verify command bodies reference correct skill names
grep -q "jx-dev:spec" plugins/jx-dev/commands/spec.md && echo "PASS: spec cmd ref" || echo "FAIL"
grep -q "jx-dev:task" plugins/jx-dev/commands/task.md && echo "PASS: task cmd ref" || echo "FAIL"

# Verify reference files exist for spec skill
test -f plugins/jx-dev/skills/spec/references/template.md && echo "PASS" || echo "FAIL: template.md missing"
test -f plugins/jx-dev/skills/spec/references/diagram-patterns.md && echo "PASS" || echo "FAIL: diagram-patterns.md missing"

# Verify relative path resolution (from skill dirs)
cd plugins/jx-dev/skills/spec && test -f ../../../jx-core/_shared/id-rules.md && echo "PASS: spec->id-rules resolves" || echo "FAIL"; cd -
cd plugins/jx-dev/skills/task && test -f ../../../jx-core/_shared/task-json-schema.md && echo "PASS: task->schema resolves" || echo "FAIL"; cd -
cd plugins/jx-pm/skills/prd && test -f ../../../jx-core/_shared/id-rules.md && echo "PASS: prd->id-rules resolves" || echo "FAIL"; cd -
cd plugins/jx-pm/skills/ado && test -f ../../../jx-core/_shared/task-json-schema.md && echo "PASS: ado->schema resolves" || echo "FAIL"; cd -

# Verify JX_PM_DOCS_ROOT only appears in jx-core and jx-pm README (backward compat)
grep -rl "JX_PM_DOCS_ROOT" plugins/ | grep -v "jx-core/_shared/docs-root.md" | grep -v "README.md"
# Expected: 0 matches (only in docs-root.md and READMEs as documented fallback)
```

### D12. jx-pm agents/ABOUT.md cleaned
```bash
grep -c "Tech Spec\|Generating Task" plugins/jx-pm/agents/ABOUT.md
# Expected: 0
```

---

## Pitfalls
1. Do NOT strip "traceability chain" or "Golden Thread" from prd — those are methodology terms
2. Task SKILL.md chain-coupling ("If chained from /jx-pm:techspec") must be deleted entirely, not reworded
3. Pipeline allowed-tools must drop all `mcp__azure-devops__*` tools
4. ado SKILL.md currently doesn't reference schema by path — this plan adds explicit reference
5. `$JX_DOCS_ROOT` is canonical; `$JX_PM_DOCS_ROOT` only in jx-core/docs-root.md as fallback
6. scripts/ dir in jx-dev gets ABOUT.md (empty dirs not tracked by git)
7. Pipeline deprecated-flags section WILL contain `--chain-all` string — this is correct (error handler), not a stale reference
8. Track B must complete before Track C deletions start (race condition prevention)

## Out of Scope
Wiki pages referencing `jx-pm:techspec` or `jx-pm:task` — separate follow-up task.

---

## Agent Team — Tmux Execution

### Layout
```
┌──────────────┬──────────────┐
│ Track A      │ Track B      │
│ jx-core      │ jx-dev       │
├──────────────┼──────────────┤
│ Track C      │ Track D      │
│ jx-pm modify │ verifier     │
└──────────────┴──────────────┘
```

### Execution Order
1. Panes A + B launch simultaneously (no dependencies)
2. Pane C launches after B completes (B copies files C deletes)
3. Pane D launches after A + B + C complete

### Tmux Setup Commands
```bash
# Create session with 4 panes
tmux new-session -d -s jx-split -x 200 -y 50
tmux split-window -h -t jx-split
tmux split-window -v -t jx-split:0.0
tmux split-window -v -t jx-split:0.1

# Label panes
tmux select-pane -t jx-split:0.0 -T "Track A: jx-core"
tmux select-pane -t jx-split:0.1 -T "Track B: jx-dev"
tmux select-pane -t jx-split:0.2 -T "Track C: jx-pm"
tmux select-pane -t jx-split:0.3 -T "Track D: verifier"
```

### Pane A: jx-core-builder
```bash
tmux send-keys -t jx-split:0.0 'claude -p "You are building the jx-core plugin. Read the plan at .agent/plans/sparkling-squishing-boole.md, execute Track A steps A1-A7 exactly. Working dir: /Users/jairo/Projects/jodex-qa-ai. Adapt source files from plugins/jx-pm/skills/_shared/ and plugins/jx-pm/schemas/. When done, create a file at /tmp/jx-split-track-a-done to signal completion." --allowedTools "Bash,Read,Write,Edit"' Enter
```

### Pane B: jx-dev-builder
```bash
tmux send-keys -t jx-split:0.1 'claude -p "You are building the jx-dev plugin. Read the plan at .agent/plans/sparkling-squishing-boole.md, execute Track B steps B1-B9 exactly. Working dir: /Users/jairo/Projects/jodex-qa-ai. Copy/adapt source files from plugins/jx-pm/. When done, create a file at /tmp/jx-split-track-b-done to signal completion." --allowedTools "Bash,Read,Write,Edit"' Enter
```

### Pane C: jx-pm-modifier (waits for B)
```bash
tmux send-keys -t jx-split:0.2 'claude -p "WAIT: First run: until [ -f /tmp/jx-split-track-b-done ]; do sleep 5; done. Then read the plan at .agent/plans/sparkling-squishing-boole.md and execute Track C steps C1-C10 exactly. Working dir: /Users/jairo/Projects/jodex-qa-ai. When done, create a file at /tmp/jx-split-track-c-done to signal completion." --allowedTools "Bash,Read,Write,Edit"' Enter
```

### Pane D: verifier (waits for A+B+C)
```bash
tmux send-keys -t jx-split:0.3 'claude -p "WAIT: First run: until [ -f /tmp/jx-split-track-a-done ] && [ -f /tmp/jx-split-track-b-done ] && [ -f /tmp/jx-split-track-c-done ]; do sleep 5; done. Then read the plan at .agent/plans/sparkling-squishing-boole.md and execute Phase D verification steps D1-D12. Working dir: /Users/jairo/Projects/jodex-qa-ai. Report PASS/FAIL for each check." --allowedTools "Bash,Read"' Enter
```

### Attach
```bash
tmux attach -t jx-split
```

### Cleanup (after verification passes)
```bash
rm -f /tmp/jx-split-track-{a,b,c}-done
tmux kill-session -t jx-split
```
