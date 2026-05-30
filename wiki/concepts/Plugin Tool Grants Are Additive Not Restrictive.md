---
title: Plugin Tool Grants Are Additive Not Restrictive
type: concept
tags: [claude-code, permissions, allowed-tools, tools, plugins, security]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: [additive allowed-tools, no plugin-level tool clamping, tool scoping is session-level]
provenance: synthesis
---

# Plugin Tool Grants Are Additive Not Restrictive

In Claude Code, plugin-level tool declarations **pre-approve** tools but do **not restrict** them. Tool
*enforcement* lives only at the session-permissions layer — there is no way to soundly scope an agent,
command, or skill to a narrow tool set from inside the plugin.

## What is additive (does NOT clamp)

- **Subagent `tools:`** — lists allowed tools, but **omitting it inherits ALL tools**, and there is **no
  documented zero-tool syntax** (`tools: []` is undocumented and may be read as "omitted → inherit all"; a
  `disallowedTools` denylist is inherit-all-minus-an-enumerated-list, so it is fragile).
- **Skill `allowed-tools`** — additive: "does not restrict which tools are available; every tool remains callable."
- **Command `allowed-tools`** — the same (custom commands are merged into skills): additive, non-clamping.
- A skill's `allowed-tools` does **not clamp a subagent** it invokes.

## What actually restricts

- Session-level **`permissions`** (allow/deny rules in `settings.json`).
- **`disallowed-tools`** — removes tools **by name** while active. But it cannot express a scoped Bash
  prefix: disallowing `Bash` removes a pinned `Bash(helper read)` too, so you cannot "deny broad Bash while
  keeping the pinned helper."

## Why it matters

Any plugin component that ingests attacker-influenceable content (xlsx cells, BRD prose, browser text)
while holding tools has an injection / exfiltration surface that the **plugin cannot close** — it is
governed by the consuming session's permissions. This recurring constraint closed the jx-qa
`spec-generator` agent and forced the `test-plan-reviewer` (agent → command → skill) to an
accepted-residual posture: tool scoping is **not plugin-enforceable**; it is a session-permissions
responsibility, accepted as a residual for trusted/internal inputs. Related: [[Prefix-Only Permission Grammar]]
(allowed-tools prefixes match the raw command string before the shell). Verified twice against the Claude
Code docs (sub-agents, skills/custom-skills, permissions).

**Related:** [[Read-Only Is Not Injection-Safe]], [[Command + Skill Over Sub-Agent for Untrusted-Input Tools]], [[Adversarial Review Converges to a Narrowed Residual]].

## Sources
- Session — jx-qa sub-agent / command-skill security analysis (2026-05-29)
