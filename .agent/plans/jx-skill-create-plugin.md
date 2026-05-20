# Implementation Plan: `/jx-skill:create-plugin`

Status: implemented on 2026-05-20.

## Summary

Add a new `jx-skill` scaffolding command that creates a new Jodex plugin skeleton and registers it in the root marketplace. The implementation mirrors `/jx-skill:create`: thin command wrapper, phased `SKILL.md`, pinned Python helper, eval coverage, narrow permissions, explicit confirmation before writes, path confinement, rollback on failure, and post-scaffold validation.

## Key Changes

- Add the new `jx-skill` feature using the same layout as the existing skill creator:
  - `plugins/jx-skill/commands/create-plugin.md`
  - `plugins/jx-skill/skills/create-plugin/SKILL.md`
  - `plugins/jx-skill/skills/create-plugin/evals/evals.json`
  - `plugins/jx-skill/scripts/plugin-creator.py`
- Add new public command `/jx-skill:create-plugin` with flags:
  - `--plugin <jx-name>` required; validate with `^jx-[a-z0-9]+(?:-[a-z0-9]+)*$`
  - `--description "<text>"` required
  - `--category <productivity|knowledge|core>` optional, default `productivity`
  - `--author "<name>"` optional, default `Jairosoft`
- Implement `create-plugin/SKILL.md` phases:
  - Parse args
  - Validate inputs
  - Show planned artifacts
  - Require confirmation
  - Scaffold
  - Verify and report
- Add pinned helper `plugin-creator.py` with subcommands:
  - `validate-name <plugin>`
  - `check-collision <plugin> <repo_root>`
  - `scaffold <plugin> <repo_root> --description ... --category ... --author ...`
  - `verify <plugin> <repo_root>`
- Scaffold only these v1 artifacts:
  - `plugins/<plugin>/.claude-plugin/plugin.json`
  - `plugins/<plugin>/README.md`
  - `plugins/<plugin>/{commands,skills,scripts,agents,hooks,prompts,schemas}/ABOUT.md`
  - `.claude-plugin/marketplace.json` entry appended with `source: "./plugins/<plugin>"`
- Do not generate command stubs, skill stubs, dependencies, or first-skill content.
- The generated README should tell users to run `/jx-skill:create --plugin <plugin>` next.
- Update `plugins/jx-skill/README.md`, root `README.md`, marketplace/plugin descriptions for `jx-skill`, and `AGENTS.md` helper-script validation to include `plugin-creator.py`.

## Public Interfaces

- New slash command:
  - `/jx-skill:create-plugin [--plugin <name>] [--description "..."] [--category <category>] [--author "..."]`
- New helper CLI:
  - `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-creator.py" ...`
- Command permissions:
  - pinned helper only
  - `python3 -m json.tool`
  - `ls`
  - `Read`

## Test Plan

- Validate helper behavior:
  - valid name: `jx-example`
  - invalid names: `example`, `jx-Bad`, `jx-bad/escape`, `jx-`
  - collision with existing plugin name and marketplace source
  - scaffold into a temporary repo fixture, then verify exact generated files and no command/skill stubs
- Run repo checks:
  - `python3 -m py_compile plugins/jx-kb/scripts/wiki-tools.py plugins/jx-qa/scripts/xlsx-writer.py plugins/jx-skill/scripts/skill-creator.py plugins/jx-skill/scripts/plugin-creator.py`
  - `python3 -m json.tool .claude-plugin/marketplace.json`
  - `python3 -m json.tool plugins/*/.claude-plugin/plugin.json`
  - `python3 -m json.tool plugins/jx-skill/skills/create-plugin/evals/evals.json`
  - `python3 plugins/jx-skill/scripts/skill-creator.py self-test plugins`
- Add eval cases for:
  - happy path
  - invalid name
  - collision
  - marketplace duplicate
  - confirmation-before-write

## Assumptions

- Preserve existing uncommitted wiki grooming changes; do not revert or rewrite them.
- `--author` is name-only in v1. If omitted, use existing Jairosoft defaults.
- Marketplace insertion appends to the current `plugins` array; do not sort or restructure unrelated entries.
- Do not change backlog status or mark the idea complete during implementation unless explicitly requested.
