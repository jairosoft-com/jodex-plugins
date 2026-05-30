---
name: reference-claude-code-tool-scoping
description: "Claude Code plugin-level tool grants (agent tools:, command/skill allowed-tools) are ADDITIVE pre-approval — they do NOT restrict; only session permissions / disallowed-tools clamp"
metadata:
  node_type: memory
  type: reference
  originSessionId: 6a9bd770-c9e9-446d-bd88-17674619e1ca
---

In Claude Code, **plugin-level tool grants pre-approve but do NOT restrict** tool access — only the
session-permissions layer actually clamps.

- **Subagent `tools:`** — omitting it inherits **ALL** tools; there is **no documented zero-tool syntax**
  (`tools: []` is undocumented and may be read as "omitted → inherit all"; a `disallowedTools` denylist is
  inherit-all-minus-an-enumerated-list, so it is fragile).
- **Skill `allowed-tools`** — additive: "does not restrict which tools are available; every tool remains callable."
- **Command `allowed-tools`** — the same (custom commands are merged into skills): additive, non-clamping.
- A skill's `allowed-tools` does **not clamp a subagent** it invokes.

**Only these actually restrict:** session-level `permissions` (allow/deny in `settings.json`), or
`disallowed-tools` (removes tools **by name** while active — but it cannot express a scoped Bash prefix:
disallowing `Bash` also removes a pinned `Bash(helper read)`).

**Why it matters:** you cannot soundly scope an agent/command/skill to a narrow tool set at the plugin
layer. Any plugin component that ingests untrusted content (xlsx/BRD/browser text) while holding tools has
an injection/exfiltration surface the **plugin cannot close** — it is governed by the consuming session's
permissions, accepted as a residual for trusted/internal inputs. This closed the jx-qa `spec-generator`
agent and forced `test-plan-reviewer` (agent → command → skill) to the same accepted-residual posture.
Verified twice against the Claude Code docs (sub-agents, skills/custom-skills, permissions) on 2026-05-29.
Wiki concept: "Plugin Tool Grants Are Additive Not Restrictive". Related: "Prefix-Only Permission Grammar".
