---
title: POSIX Atomic No-Overwrite via os.link
type: idea
tags: [pattern, filesystem, atomicity, python, pinned-helper]
created: 2026-05-27
updated: 2026-05-28
status: completed
priority: P2
effort: small
source: Session — jx-local create-prompt adversarial review (2026-05-27)
provenance: observation
---

# POSIX Atomic No-Overwrite via os.link

On POSIX, `os.rename()` silently overwrites existing files. Use `os.link(tmp, final)` instead — it fails with `FileExistsError` if the target already exists.

## The Pattern

1. Write content to a temp file: `.<name>.<pid>.tmp`
2. Hard-link temp to final path: `os.link(tmp_path, final_path)`
3. Remove temp: `os.unlink(tmp_path)` (in a `finally` block)

If `final_path` already exists, step 2 raises `FileExistsError` — the existing file is untouched.

## Why Not os.rename

`os.rename` uses POSIX `rename(2)` which atomically replaces the target. A TOCTOU race between collision-check and rename can silently overwrite a file created in the gap.

## Related

- [[Atomic Rename Boundary]] — git commit scope (different domain, same word)
- [[File-Based Data Transport]]
