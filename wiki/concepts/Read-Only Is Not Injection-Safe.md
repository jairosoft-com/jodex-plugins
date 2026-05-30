---
title: Read-Only Is Not Injection-Safe
type: concept
tags: [security, prompt-injection, agent-design, claude-code]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: [read-only exfiltration, read tools leak]
provenance: synthesis
---

# Read-Only Is Not Injection-Safe

A "read-only" agent, command, or skill that ingests **untrusted** content still has an exfiltration
channel. Read-only prevents *mutation*, not *disclosure*: prompt-injected text can steer the model's read
tools to leak data into its output.

- Injected content (xlsx cells, BRD prose, browser text) can drive `Read`/`Grep`/`Glob`, or **reuse an
  allowed pinned read-only helper on an off-scope path**, to read secrets/unrelated files and echo them
  into the report.
- "No mutation / no Write" addresses spec-corruption, not the read-side leak — so a read-only design is
  not automatically safe over untrusted input.
- Mitigation: deterministic pinned-helper ingestion (no broad `Read`/`ls`), treat all content as
  **data, not instructions**, and ship an injection eval. Full closure needs runtime tool-phase support,
  so it remains an accepted residual for trusted inputs. See
  [[Plugin Tool Grants Are Additive Not Restrictive]].

## Sources
- Session: jx-qa reviewer build + tool-scoping security (2026-05-29)
