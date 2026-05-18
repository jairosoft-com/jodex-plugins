---
title: Over-Grooming Anti-Pattern
type: idea
tags: [pattern, wiki, idea-lifecycle, grooming, anti-pattern]
created: 2026-05-18
updated: 2026-05-18
source_count: 0
aliases: [scope inflation during grooming, grooming over-scope]
provenance: session-derived
status: raw
---

# Over-Grooming Anti-Pattern

Grooming has a failure mode where the groomer inflates the scope of an idea beyond its original intent. A simple idea enters grooming and exits with dense acceptance criteria, domain tables, auth matrices, and troubleshooting sections that the original requestor never asked for.

## Observed Instance (2026-05-18)

The "Azure DevOps MCP Installation" idea started as a simple request: install command + verification. During grooming, it expanded to 7 sections covering all 5 auth methods, all 9 domain filters, a 10-row troubleshooting table, and a reconfiguration guide. The user had to explicitly pull it back to just install + verify.

## Why It Happens

- The groomer discovers related context and tries to be comprehensive
- Each discovered gap feels like it "should" be covered
- No template or mode constrains the output density
- The groomer optimizes for completeness rather than the requestor's actual need

## Mitigation

- Ask the requestor for target density before grooming (lite vs standard vs dense)
- Use a shared idea template that makes the expected output explicit
- Treat grooming as scoping, not research — the goal is to clarify what to build, not to build it

## Related

- [[Idea Lifecycle]]
- [[Triage]]
- ADO Feature #204420 — Idea Format Template and Mode Skill for jx-kb
