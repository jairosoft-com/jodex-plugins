---
title: Harden Interactive jx-qa Generate Path
type: idea
tags: [jx-qa, security, generate, hardening]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
provenance: session-observation
status: raw
---

# Harden Interactive jx-qa Generate Path

Adversarial review of the spec-generator Option-C decision flagged that the interactive
`/jx-qa:generate` path retains residual risks (currently **accepted for human-driven use**): bare
`Write` to `tests/`, sole-xlsx auto-discovery without provenance, and command-chaining via the allowed
`playwright-cli` / `npx` prefixes under the repo's [[Prefix-Only Permission Grammar]].

Optional hardening if/when we want to shrink that surface:
- Require an explicit xlsx path (drop sole-match auto-discovery) + a provenance / baseURL check.
- Route spec writes through a pinned, no-shell, path-confined helper (staged write → atomic commit) instead of bare `Write`.
- Add a command-chaining preflight for the allowed prefixes.

Relates to [[jx-qa Spec-Generator Subagent]] — Option C deferred the autonomous agent; these harden the interactive path that remains.

## Sources
- Session — adversarial review of the spec-generator Option-C decision (2026-05-29)
