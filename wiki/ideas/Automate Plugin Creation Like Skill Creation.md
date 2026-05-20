---
title: Automate Plugin Creation Like Skill Creation
type: idea
status: backlogged
priority: P1
tags: [jx-skill, plugin, scaffolding, developer-experience, automation]
created: 2026-05-20
updated: 2026-05-20
groomed: 2026-05-20
source_count: 0
aliases: [plugin scaffolding, automated plugin creation]
provenance: synthesis
---

# Automate Plugin Creation Like Skill Creation

Build a `jx-skill` command that scaffolds a new Jodex plugin directory, mirroring the safety and convention enforcement in `/jx-skill:create`. The command creates the plugin skeleton and marketplace entry so contributors do not hand-edit the most failure-prone setup surfaces.

## Groomed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Plugin home | `jx-skill` | Tooling about plugin/skill authoring belongs with the existing scaffolding plugin. |
| Command | `/jx-skill:create-plugin` | Avoids colliding with Claude's native `/plugin` namespace. |
| V1 scope | Plugin skeleton + marketplace entry | Solves the recurring manual setup drift without generating fake user-facing commands. |
| First skill | Deferred | After plugin creation, use `/jx-skill:create` to add a real skill with triggers and description. |
| Write path | Pinned helper script only | Keep command permissions narrow and match the existing `skill-creator.py` safety model. |

## V1 Generated Artifacts

- `plugins/<plugin>/.claude-plugin/plugin.json`
- `plugins/<plugin>/README.md`
- `plugins/<plugin>/{commands,skills,scripts,agents,hooks,prompts,schemas}/ABOUT.md`
- `.claude-plugin/marketplace.json` entry with `source: "./plugins/<plugin>"`

Do not generate command stubs or empty `SKILL.md` files in v1. A command file implies a working skill behind it.

## Arguments

| Argument | Required | Notes |
|----------|----------|-------|
| `--plugin` | Yes | New plugin slug. Require `jx-<name>` lowercase hyphen format. |
| `--description` | Yes | One-line marketplace and manifest description. |
| `--category` | No | Default `productivity`; validate against known marketplace categories. |
| `--author` | No | Default `Jairosoft`. |

## Validation Gates

- Reject invalid plugin slugs, path separators, uppercase, shell metacharacters, and existing plugin names.
- Confirm no directory, manifest name, or marketplace name collision exists.
- Resolve all output paths under repo `plugins/`; fail closed on path escape.
- Show planned artifacts and require explicit user confirmation before writes.
- Use staging plus rollback so partial plugin directories or marketplace edits are not left behind.
- Validate all generated JSON with `python3 -m json.tool`.
- Verify 3-way naming sync: directory name = plugin manifest name = marketplace entry name.

## Acceptance Criteria

- Given valid inputs and confirmation, the command creates the plugin skeleton and updates the marketplace entry exactly once.
- Given invalid input or a collision, it halts before writing files and explains the fix.
- Generated plugin manifest and marketplace JSON pass JSON validation.
- The generated README includes local development commands and the next step to run `/jx-skill:create`.
- Command permissions allow only the pinned plugin creator helper, JSON validation, listing, and read operations.

## Deferred

- Optional first-skill generation.
- Plugin validation/list commands.
- Dependency prompts for `jx-core` or other sibling plugins.

## Related

- [[Creating a Plugin]]
- [[Creating a Skill]]
- [[Skill Creator for Jodex Plugins]]
- [[Three-Way Naming Sync Validation Gate]]

## Sources

- User backlog refinement request, 2026-05-20
