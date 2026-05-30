---
title: Saved Workflow By-Name Invocation Drops Args
type: idea
tags: [claude-code, workflow, gotcha]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: []
provenance: session-observation
status: raw
---

# Saved Workflow By-Name Invocation Drops Args

Invoking a saved workflow by `name` (`Workflow({name, args})`) did **not** forward the `args` param — the
script fell back to its defaults (observed twice this session, reviewing the wrong plan/base until corrected).

- Workaround: invoke by `scriptPath` + `args`, or run a one-off copy with the values hardcoded as defaults.
- Verify whether this is a durable harness behavior or version-specific before relying on it.

## Sources
- Session: jx-qa reviewer build + tool-scoping security (2026-05-29)
