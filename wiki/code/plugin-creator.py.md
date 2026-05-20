---
title: plugin-creator.py
type: code
tags: [script, python, helper, jx-skill, plugin-scaffolding]
created: 2026-05-20
updated: 2026-05-20
source_count: 0
aliases: [plugin-creator, plugin creator helper]
provenance: synthesis
---

# plugin-creator.py

[[Pinned Helper]] script for `/jx-skill:create-plugin`. It creates a new Jodex plugin skeleton and appends the corresponding root [[Marketplace]] entry without giving the slash command broad write permissions.

## Location

`plugins/jx-skill/scripts/plugin-creator.py`

## Commands

| Command | Purpose |
|---------|---------|
| `validate-name <plugin>` | Validate `jx-...` lowercase hyphenated plugin names. |
| `check-collision <plugin> <repo_root>` | Detect existing plugin directories plus marketplace name/source collisions. |
| `scaffold <plugin> <repo_root> --description ... --category ... --author ...` | Create the v1 plugin skeleton and append the marketplace entry. |
| `verify <plugin> <repo_root>` | Verify exact generated files, plugin manifest, and marketplace entry. |

## V1 Contract

The helper intentionally creates only package-level scaffolding:

- `plugins/<plugin>/.claude-plugin/plugin.json`
- `plugins/<plugin>/README.md`
- `plugins/<plugin>/{commands,skills,scripts,agents,hooks,prompts,schemas}/ABOUT.md`
- `.claude-plugin/marketplace.json` entry with `source: "./plugins/<plugin>"`

It does not create command stubs, skill stubs, dependencies, or first-skill content. The generated README points the user to `/jx-skill:create --plugin <plugin>` for the first real skill.

## Safety Contract

- Plugin names must match `^jx-[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Category is limited to `productivity`, `knowledge`, or `core`.
- Output paths are confined under the repository root with [[Path Confinement]].
- Marketplace insertion appends to the current `plugins` array without sorting or restructuring unrelated entries.
- Scaffold writes stage the plugin directory first, append the marketplace entry second, then verify the result.
- On failure after writes begin, the helper restores the original marketplace file and removes created plugin artifacts.

## Session Insight

For plugin scaffolding, the safest v1 is package skeleton plus marketplace registration only. Generating a command or empty `SKILL.md` would create a discoverable user-facing surface before behavior exists. Splitting plugin creation from first-skill creation keeps `/jx-skill:create-plugin` focused on structural correctness and lets `/jx-skill:create` own trigger and command behavior.

## Related

- [[Automate Plugin Creation Like Skill Creation]]
- [[Creating a Plugin]]
- [[Creating a Skill]]
- [[Pinned Helper]]
- [[User Confirmation Gate]]

## Sources

- Implementation session, 2026-05-20
