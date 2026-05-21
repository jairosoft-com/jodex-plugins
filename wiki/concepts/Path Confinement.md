---
title: Path Confinement
type: concept
tags: [security, pattern, validation]
created: 2026-05-07
updated: 2026-05-21
source_count: 1
aliases: [path safety contract, path containment]
provenance: source-derived
---

# Path Confinement

A security pattern ensuring all file operations stay within the project root directory. Prevents path traversal attacks and accidental access to files outside the project.

## Implementation

- Uses `Path.relative_to()` — not string prefix matching (immune to sibling-prefix bypass like `/project-evil/` matching `/project/`)
- Resolves symlinks before checking containment
- Rejects shell metacharacters in user-supplied paths
- Normalizes paths to prevent `..` escape sequences

## cwd() Fragility in Plugin Helpers (2026-05-20)

A common mistake: confining paths against `Path.cwd()`. This works during development (cwd = repo root) but breaks in production — Claude Code sets cwd to the user's project directory, not the plugin install directory. Plugin helpers receive paths via `CLAUDE_PLUGIN_ROOT`, which may be outside cwd entirely.

**Anti-pattern:**
```python
def confine_to_project_root(user_path):
    return confine_under(Path.cwd(), user_path)  # breaks when cwd != repo root
```

**Correct pattern:**
```python
def confine_to_project_root(user_path):
    resolved = Path(user_path).resolve()
    if not resolved.exists():
        output_error(f"path does not exist: {str(resolved)}")
    return resolved
```

For write operations, confine output paths under the *target directory* (e.g., the plugin being scaffolded), not under cwd. Use `confine_under(plugin_path, output_path)` for the security-critical check.

Discovered during [[Iterative Adversarial Review]] of the jx-skill scaffolder — Codex flagged that `check-collision` and `scaffold` subcommands would reject valid plugin paths when invoked from any directory other than the repo root.

## Used By

- [[wiki-tools.py]] — validates all paths before file operations
- [[Knowledge Base Plugin|jx-kb]] plugin — all source paths checked during [[Ingest]]
- jx-skill plugin — confines scaffold output under target plugin directory

## Sources
- [[Source - JX KB README]]
