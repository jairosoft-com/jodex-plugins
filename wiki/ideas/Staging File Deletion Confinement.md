---
title: Staging File Deletion Confinement
type: idea
tags: [security, pattern, pinned-helper, filesystem]
created: 2026-05-27
updated: 2026-05-27
status: raw
priority: P2
effort: small
source: Session — jx-local create-prompt code review R4 (2026-05-27)
provenance: observation
---

# Staging File Deletion Confinement

Helper scripts that clean up input files after processing must confine deletion to known-safe paths. Accepting arbitrary paths for deletion creates a data-loss vector.

## The Rule

Only delete a staging file if it satisfies ALL of:
1. Resolves inside the expected directory (e.g., `.agent/prompts/`)
2. Has a dot-prefixed filename (convention for staging/temp files)

## Why

A helper that accepts `--metadata-file path` and deletes that file after use can be tricked into deleting any project file if the path argument is manipulated (prompt injection or accidental reuse of a real file path).

## Implementation

```python
staging_path = Path(staging).resolve()
if str(staging_path).startswith(str(real_pd) + os.sep) and staging_path.name.startswith('.'):
    os.unlink(str(staging_path))
```

## Related

- [[File-Based Data Transport]]
- [[Cross-Plugin Pinned Helper]]
