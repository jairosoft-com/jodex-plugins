---
title: Lock-File Guard for Atomic Scaffolding
type: concept
tags: [pattern, safety, concurrency, scaffolding]
created: 2026-05-27
updated: 2026-05-27
source_count: 0
aliases: []
provenance: synthesis
---

# Lock-File Guard for Atomic Scaffolding

Concurrency-safe pattern for file scaffolding operations using `os.open(path, O_CREAT | O_EXCL | O_WRONLY)` as an atomic reservation mechanism. The `O_EXCL` flag guarantees the call fails if the lock file already exists, preventing two processes from scaffolding the same target simultaneously.

- Track `lock_acquired` boolean separately from `lock_path` — if `O_EXCL` raises, the exception handler must not delete another process's lock
- Track `skill_dir_owned` boolean — only roll back the final artifact directory if this process created it via `shutil.move`, preventing a failing second process from deleting a valid artifact created by a concurrent first process
- Superior to `os.rename` guard on POSIX: rename can silently overwrite empty directories, defeating the collision check
- Related to [[Path Confinement]] (validates paths stay within allowed roots) and [[User Confirmation Gate]] (no writes before approval)

Discovered through 4 rounds of adversarial plan review and 5 rounds of Codex code review on the [[Local Skills Plugin]] implementation.

## Sources
- Session: jx-local create-skill implementation (2026-05-27)
