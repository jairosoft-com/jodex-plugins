---
title: Command + Skill Over Sub-Agent for Untrusted-Input Tools
type: concept
tags: [claude-code, plugins, agent-design, decision]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: [command vs subagent, when not to use a subagent]
provenance: synthesis
---

# Command + Skill Over Sub-Agent for Untrusted-Input Tools

For an advisory tool that ingests untrusted content, a **command + skill** is usually a better fit than a
sub-agent. Because tool scoping is not plugin-enforceable
([[Plugin Tool Grants Are Additive Not Restrictive]]), the security posture is a wash between the two — so
the choice turns on ergonomics and a human in the loop.

- Command + skill is the standard jx-qa pattern: simpler, convention-fitting, reusable/testable, and
  **human-in-the-loop** (a person sees the run and can intervene — a safety plus when ingesting untrusted
  input). It also dodges the no-documented-zero-tool-agent dead end.
- Reserve **sub-agents** for genuinely parallel, context-isolated, or autonomous/background work — not
  one-shot, human-driven advisory reviews.
- This drove the jx-qa test-plan reviewer from a tool-less sub-agent design to a `/jx-qa:review-plan`
  command + skill. Related: [[Read-Only Is Not Injection-Safe]].

## Sources
- Session: jx-qa reviewer build + tool-scoping security (2026-05-29)
