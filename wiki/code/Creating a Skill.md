---
title: Creating a Skill
type: code
tags: [skill, plugin, how-to, architecture]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [skill creation, new skill, writing a skill]
provenance: conversation-derived
---

# Creating a Skill

Step-by-step guide for manually adding a new skill to a Claude Code plugin in this repo. For creating an entirely new plugin first, see [[Creating a Plugin]].

## Anatomy

Every skill lives inside a **plugin** under `plugins/<plugin-name>/`. Two required pieces:

1. **Plugin manifest**: `plugins/<plugin-name>/.claude-plugin/plugin.json`
2. **Skill directory**: `plugins/<plugin-name>/skills/<skill-name>/`

## Step 1: Pick Your Plugin

Skill goes inside existing plugin or new one. Existing plugins:
- `plugins/jx-qa/` — QA automation ([[QA Testing Plugin|jx-qa]])
- `plugins/jx-kb/` — knowledge base operations

New plugin? Create:

```
plugins/<your-plugin>/
├── .claude-plugin/
│   └── plugin.json
├── skills/
├── commands/
├── agents/
├── hooks/
├── prompts/
├── schemas/
├── scripts/
└── README.md
```

**`plugin.json`** — minimal:

```json
{
  "name": "your-plugin",
  "version": "1.0.0",
  "description": "What it does",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" }
}
```

## Step 2: Create the Skill Directory

```
plugins/<plugin>/skills/<skill-name>/
├── SKILL.md               # Required
├── SEQUENCE.md            # Optional — mermaid sequence diagram
├── evals/
│   └── evals.json         # Optional — test cases
└── references/            # Optional — reference docs
    └── some-topic.md
```

Only `SKILL.md` is required. Everything else is optional.

## Step 3: Write SKILL.md

Core file. Two parts: **frontmatter** + **body**.

### Frontmatter

YAML between `---` fences:

```yaml
---
name: your-skill-name
user-invocable: true
argument-hint: "<required> [optional]"
description: >
  First sentence: what it does.
  Middle: trigger phrases (when Claude auto-activates).
  Last sentence: negative triggers (when NOT to activate).
---
```

| Field | Purpose |
|-------|---------|
| `name` | Must match directory name exactly |
| `user-invocable` | `true` = available as slash command |
| `argument-hint` | Shows user what args to pass |
| `description` | Claude reads this to decide when to auto-trigger |

### Body

Structured instructions Claude follows when skill activates:

```markdown
# Skill Title

One-liner summary.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|

## Phase 1: First Step
What to do, rules, edge cases.

## Phase 2: Second Step
...

## Error Handling
What breaks, what to do about it.
```

Break work into **numbered phases**. Each phase = one logical step. Include **gate points** where skill stops and asks user before continuing. See [[Multi-Phase Skill]] for the pattern.

## Step 4: (Optional) Command Wrapper

File: `plugins/<plugin>/commands/<skill-name>.md`

```yaml
---
description: Short description for /command help
argument-hint: "<args>"
allowed-tools: Bash(python3:*), Read, Write
---

Brief instruction that references the skill.

$ARGUMENTS
```

Command = thin wrapper declaring tool permissions. Skill = full logic.

## Step 5: (Optional) Evals

File: `plugins/<plugin>/skills/<skill-name>/evals/evals.json`

```json
{
  "skill_name": "your-skill",
  "evals": [
    {
      "id": 0,
      "name": "happy-path",
      "prompt": "what user would type",
      "expected_output": "what should happen",
      "files": [],
      "assertions": [
        {
          "name": "check-name",
          "description": "What to verify"
        }
      ]
    }
  ]
}
```

## Step 6: (Optional) SEQUENCE.md

Mermaid sequence diagram showing data flow between actor, skill, and external systems. Helps Claude (and humans) understand interaction pattern. See `plugins/jx-qa/skills/extract/SEQUENCE.md` for example.

## Key Patterns

1. **Gate points** — skill stops, asks user confirmation before proceeding (see [[E2E Test Case]] classification gate in extract skill)
2. **[[Multi-Phase Skill]]** — numbered phases with clear inputs/outputs
3. **Error handling section** — what breaks, what to do
4. **Negative triggers** in description — "Do not trigger for X, Y, Z"
5. **Concrete examples** — exact invocation and expected output
6. **References directory** — supplementary docs for complex skills (see `playwright-cli/references/`)

## Minimal Working Example

Skill called `audit` in `qa-ai` plugin:

```
plugins/jx-qa/skills/audit/
└── SKILL.md
```

```markdown
---
name: audit
user-invocable: true
argument-hint: "[target_path]"
description: >
  Audit test coverage gaps in a test plan xlsx.
  Triggers on: "audit test plan", "find coverage gaps",
  "check test coverage", /jx-qa:audit.
  Do not trigger for generating tests or extracting requirements.
---

# Audit Test Plan Coverage

Scan xlsx test plan and report coverage gaps.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| target_path | No | Auto-discover in test-plans/ | Path to xlsx |

## Phase 1: Load Test Plan
Read xlsx, parse header+step rows.

## Phase 2: Analyze Coverage
Compare test cases against BRD requirements.

## Phase 3: Report
Print gap analysis table.
```

Available as `/jx-qa:audit` after next session start.

## Sources

- Derived from inspection of existing skills in `plugins/jx-qa/` and `plugins/jx-kb/`
