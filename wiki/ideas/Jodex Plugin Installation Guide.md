---
title: Jodex Plugin Installation Guide
type: idea
tags: [documentation, onboarding, plugin-architecture, marketplace, jx-core, jx-kb, jx-qa, jx-pm]
created: 2026-05-14
updated: 2026-05-14
source_count: 0
aliases: [Plugin Install Docs, Marketplace Setup Guide]
provenance: model-derived
status: backlogged
priority: P2
groomed: 2026-05-17
---

# Jodex Plugin Installation Guide

Create end-to-end documentation for installing the Jodex plugin ecosystem, structured as a layered guide:

## Proposed Structure

1. **Marketplace Setup** — How to add the Jodex marketplace source (directory-source or GitHub) so plugins are discoverable.
2. **Core Prerequisites** — Install jx-core (shared conventions, ADO sync, task skills) and jx-kb (knowledge base / wiki tooling). These are required by all role-specific plugins.
3. **Role-Specific Plugins** — Each role installs only the plugin relevant to them:
   - **QA Engineer** → jx-qa (test generation, execution, reporting)
   - **Product Manager** → jx-pm (BRD workflows, ADO integration, sprint planning)
   - (Future: **Developer** → jx-dev, once extracted)

## Key Considerations

- Should reference [[JX Foundational Onboarding (Promoted)]] for shared prerequisite steps (Claude Code, Git, GitHub CLI, uv, Node.js).
- Should align with [[Directory-Source Marketplace]] concept for local marketplace setup.
- Should include verification steps after each install (e.g., `/help` to confirm skills are loaded).
- Consider a quick-start vs. detailed version.

## Related

- [[Cross-Plugin Shared Convention Layer]]
- [[Executable Setup Documentation]]
