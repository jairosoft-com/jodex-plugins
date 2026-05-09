---
title: Rebrand Skills to jx Namespace
type: idea
tags: [plugin, naming, branding, qa-ai, jx-namespace]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [jx rebrand, jx namespace, skill rebranding]
provenance: synthesis
status: backlogged
---

# Rebrand Skills to jx Namespace

Rebrand all [[QA AI]] skills (and future plugins) to a unified `jx-*` naming convention, matching the pattern established by [[Product Management Skills Plugin|jx-pm]].

## Proposed Mapping

| Current Name | New Name | Scope |
|---|---|---|
| qa-ai (extract) | **jx-brpd** | BRD → xlsx test plan extraction |
| qa-ai (generate) | **jx-gen** | xlsx → Playwright spec generation |
| qa-ai (playwright-cli) | **jx-pw** | Browser automation CLI |
| cc-gen-bprd / cc-gen-techspec / etc. | **jx-pm** | Product management docs + ADO |

## Rationale

- Consistent brand identity across all Jodex plugins
- Short, memorable prefixes (`jx-brpd` vs `qa-ai extract`)
- Aligns with [[Jodex Plugin Marketplace]] listing conventions
- Each `jx-*` plugin becomes independently installable
- Follows [[Naming Ripple Effect]] — rename cascades through marketplace, plugin.json, slash commands, and docs

## Open Questions

- Should `jx-ado` be standalone or stay inside `jx-pm`?
- Does `jx-wiki` make sense for [[LLM Wiki]] or keep separate brand?
- Migration path for existing users referencing `qa-ai:extract` etc.
