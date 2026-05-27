# Plan: `jx-local:create-prompt` Skill

## Context

The `jx-local` plugin exists as a skeleton for creating local, project-scoped artifacts. The user wants a `create-prompt` skill that saves reusable prompt files under `.agent/prompts/` in the current project directory. This is the first real skill in `jx-local`.

Prompts use YAML frontmatter (`name`, `description`, `tags`) + markdown body. Collisions fail with an error. Body input is interactive by default, with a `--scaffold-only` flag to skip it.

## Decisions

| Decision | Choice |
|----------|--------|
| Folder | `.agent/prompts/` (plural, matches repo convention) |
| File format | YAML frontmatter + markdown body |
| Collision | Fail with error, suggest editing or renaming |
| Body input | Interactive by default; `--scaffold-only` flag skips |
| Discovery | `--list` flag on create-prompt to list existing prompts |
| Atomicity | Python helper (`prompt-creator.py`) for consistency with create-skill |
| Phase order | Collect body before confirmation so user sees full preview |
| Data transport | All user content (metadata + body) written to temp files via Write tool, passed as `--metadata-file` + `--body-file` — zero user data in shell args |
| Atomic write | `os.link()` from temp to final (fails on existing), not `os.rename()` |
| Validation boundary | `write` subcommand re-validates all inputs internally |

## Approach

1. Run `/jx-plugin:create-skill --plugin jx-local --skill create-prompt --triggers "create prompt, new prompt, add prompt, save prompt" --description "Create a reusable prompt file under .agent/prompts/" --argument-hint "[--name <slug>] [--description \"...\"] [--tags \"...\"] [--scaffold-only] [--list]"` to scaffold the skeleton.
2. Create `plugins/jx-local/scripts/prompt-creator.py` — a stdlib-only helper that handles root resolution, name validation, collision detection, listing, and atomic writes. All path-sensitive logic lives in the helper to keep the command allowlist tight.
3. Fill in `SKILL.md` with the full phase logic below.
4. Update `plugins/jx-local/README.md` to document the skill.

## Artifacts to Create

| # | File | Method |
|---|------|--------|
| 1 | `plugins/jx-local/skills/create-prompt/SKILL.md` | Scaffolded, then filled in |
| 2 | `plugins/jx-local/commands/create-prompt.md` | Scaffolded, then tuned |
| 3 | `plugins/jx-local/skills/create-prompt/evals/evals.json` | Scaffolded |
| 4 | `plugins/jx-local/scripts/prompt-creator.py` | New — atomic write helper |
| 5 | `plugins/jx-local/README.md` | Updated with skill docs |

## SKILL.md Phase Design

### Phase 1: Parse Arguments

| Argument | Flag | Required | Default | Notes |
|----------|------|----------|---------|-------|
| Prompt name | `--name` | Yes (unless `--list`) | — | kebab-case slug (e.g., `code-review`). Prompted if missing. |
| Description | `--description` | Yes (unless `--list`) | — | One-line summary. Prompted if missing. |
| Tags | `--tags` | No | `[]` | Comma-separated, each tag must match `^[a-z0-9]+(-[a-z0-9]+)*$`. |
| Scaffold only | `--scaffold-only` | No | `false` | If set, skip interactive body input. |
| List | `--list` | No | `false` | List existing prompts and exit. |

If `--list` is set → skip to **List Mode** (below), then exit.

If `--name` missing → ask: "What should this prompt be called? (kebab-case, e.g. `code-review`)"
If `--description` missing → ask: "One-line description of this prompt:"

#### List Mode

1. Run: `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" list`
   - Helper resolves project root internally via `git rev-parse --show-toplevel` (fallback: `$PWD`).
   - Returns JSON array of `{name, description, tags}`. Returns `[]` with exit 0 if dir missing or empty.
   - Gracefully skips malformed `.md` files (logs warning to stderr, omits from output).
2. Display table: `| Name | Description | Tags |` for each prompt found.
3. If empty, display: "No prompts found in .agent/prompts/. Create one with `/jx-local:create-prompt`."
4. Exit.

### Phase 2: Validate

1. **Agent-side name pre-check** (before any Bash call): verify `name` matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` and length <= 50. This is a shell-safety gate — only names passing this regex are safe to use as positional args. On failure: display error, ask user for corrected name. Do not invoke any Bash commands until this passes.
2. **Name format** (helper confirmation): run `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" validate-name <name>`. The helper re-validates the same regex. On failure: display error, ask user for corrected name.
3. **Tag validation**: each tag must match `^[a-z0-9]+(-[a-z0-9]+)*$`. Reject otherwise.
4. **Description validation**: must be single-line, max 200 chars.
5. **Pre-check collision** (advisory — `write` re-checks atomically): run `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" check-collision <name>`.
   - Helper resolves root internally, checks if `<root>/.agent/prompts/<name>.md` exists.
   - On collision → fail with: "Prompt '<name>' already exists at <absolute-path>. Edit it directly or choose a different name."

### Phase 3: Collect Body

- If **not** `--scaffold-only`: ask the user "Enter the prompt content (markdown):" and use their response as the body.
- If `--scaffold-only`: use placeholder body `<!-- TODO: Write your prompt here -->`.

### Phase 4: Confirm & Write

Display full preview for confirmation:

```
## Planned Prompt

File: .agent/prompts/<name>.md
Name: <name>
Description: <description>
Tags: <tags>

--- Preview ---
---
name: <name>
description: '<description>'
tags: [<tags>]
---

<first 5 lines of body or full body if short>
--- End Preview ---

Proceed? (yes/no)
```

On confirmation, write atomically via helper using **file-based data transport** — zero user content in shell args:

1. Use the **Write tool** to save a metadata JSON file at `$CLAUDE_JOB_DIR/metadata.json`:
   ```json
   {
     "name": "<name>",
     "description": "<description>",
     "tags": ["<tag1>", "<tag2>"]
   }
   ```
2. Use the **Write tool** to save the body content to `$CLAUDE_JOB_DIR/body.md`.
3. Invoke the helper with only file paths (no user content interpolated into shell):

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" write \
  --metadata-file "$CLAUDE_JOB_DIR/metadata.json" \
  --body-file "$CLAUDE_JOB_DIR/body.md"
```

The helper's `write` subcommand:
1. Reads metadata from `--metadata-file` (JSON), reads body from `--body-file`
2. **Re-validates all inputs**: name regex, tag format, description single-line + max 200 chars. Rejects invalid inputs with structured stderr. This is the enforcement boundary.
3. Resolves project root internally (`git rev-parse --show-toplevel`, fallback `$PWD`)
4. Ensures `<root>/.agent/prompts/` exists (`mkdir -p`)
5. Computes target path: `<root>/.agent/prompts/<name>.md` — rejects via `os.path.realpath` if resolved path escapes the prompts dir
6. YAML-safe serialization: description wrapped in single quotes (embedded `'` escaped as `''`), tags formatted as proper YAML array
7. **Atomic collision-safe write**: writes content to `.<name>.<pid>.tmp`, then `os.link(tmp, final)` (fails with `FileExistsError` if target exists — true no-overwrite), then `os.unlink(tmp)`. On any failure, cleans up temp file.
8. Exits 0 on success, 1 on failure with structured stderr

### Phase 5: Verify & Report

1. Read back `.agent/prompts/<name>.md`.
2. Verify:
   - File exists and is non-empty
   - Starts with `---`
   - Contains `name:`, `description:`, `tags:` fields exactly once each
   - `tags:` value is a YAML array
   - Body section is non-empty (unless `--scaffold-only`)
3. Report:

```
## Prompt Created

File: .agent/prompts/<name>.md
Name: <name>
Description: <description>
Tags: <tags>

Usage: reference this prompt in your workflows or read it with:
  cat .agent/prompts/<name>.md

List all prompts:
  /jx-local:create-prompt --list
```

## `prompt-creator.py` Design

All subcommands resolve project root internally via `git rev-parse --show-toplevel` (fallback: `$PWD`). This keeps `git` calls out of the command allowlist.

### Subcommands

| Subcommand | Args | Behavior |
|------------|------|----------|
| `validate-name <name>` | name string | Validates regex + length. Exit 0/1. |
| `check-collision <name>` | name string | Checks if prompt file exists. Exit 0 (no collision) / 1 (collision). |
| `list` | none | Parses frontmatter, outputs JSON array. Exit 0 always. |
| `write --metadata-file --body-file` | both inputs as file paths (no user content in args) | Enforcement boundary. Atomic no-overwrite write. Exit 0/1. |

### I/O Contract (per subcommand)

**`validate-name`**
- stdout (exit 0): `{"valid": true, "name": "<name>"}`
- stderr (exit 1): `{"valid": false, "name": "<name>", "error": "<reason>"}`

**`check-collision`**
- stdout (exit 0): `{"collision": false, "name": "<name>"}`
- stderr (exit 1): `{"collision": true, "name": "<name>", "path": "<absolute-path>"}`

**`list`**
- stdout (exit 0): `[{"name": "...", "description": "...", "tags": [...]}]` or `[]`
- stderr: one warning line per malformed file: `WARNING: skipping <filename>: <reason>`

**`write`**
- stdout (exit 0): `{"created": true, "path": "<absolute-path>"}`
- stderr (exit 1): `{"created": false, "error": "<reason>", "field": "<which-input-failed>"}`
  - `field` is one of: `name`, `description`, `tags`, `body-file`, `collision`, `path-escape`, `io`

Stdlib-only (no pip dependencies). Follows `skill-creator.py` conventions.

## Command Stub (`commands/create-prompt.md`)

```markdown
---
description: Create a reusable prompt file under .agent/prompts/
argument-hint: "[--name <slug>] [--description \"...\"] [--tags \"...\"] [--scaffold-only] [--list]"
allowed-tools: Read, Write, Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py":*)
---

Create a reusable prompt file using the `jx-local:create-prompt` skill.

$ARGUMENTS
```

Note: `Write` is needed to create the temp body file before invoking the helper.

## Verification

1. Run `/jx-plugin:create-skill --plugin jx-local --skill create-prompt --triggers "create prompt, new prompt, add prompt, save prompt" --description "Create a reusable prompt file under .agent/prompts/" --argument-hint "[--name <slug>] [--description \"...\"] [--tags \"...\"] [--scaffold-only] [--list]"` to scaffold
2. Create `prompt-creator.py` with the 4 subcommands
3. Replace SKILL.md content with the phase logic above
4. Update command stub with correct allowed-tools and argument-hint
5. Update `plugins/jx-local/README.md` with skill documentation
6. Test helper directly:
   - `python3 plugins/jx-local/scripts/prompt-creator.py validate-name test-prompt` → exit 0, JSON `{"valid": true, ...}`
   - `python3 plugins/jx-local/scripts/prompt-creator.py validate-name Test-Prompt` → exit 1, JSON error
   - `python3 plugins/jx-local/scripts/prompt-creator.py validate-name foo-` → exit 1, JSON error
   - `python3 plugins/jx-local/scripts/prompt-creator.py check-collision nonexistent` → exit 0
   - `python3 plugins/jx-local/scripts/prompt-creator.py list` → `[]`
7. Test YAML safety (write metadata + body files first, then invoke helper):
   - Metadata with description containing `$()`, backticks, single quotes, colons → correctly escaped in output
   - Body file with `$()`, backticks, newlines → preserved verbatim in output
   - Metadata with empty tags array → valid output
8. Test end-to-end: `/jx-local:create-prompt --name test-prompt --description "A test" --scaffold-only` → creates `.agent/prompts/test-prompt.md`
9. Test collision: run same command again → fails with error, existing file unchanged
10. Test list with malformed file: create a bad `.md` in prompts dir, run `--list` → skips it, warns stderr
11. Test list: `/jx-local:create-prompt --list` → shows test-prompt in table
12. Clean up test prompts after verification
