---
title: Agent Persona Customization via Local Memory
type: idea
tags: [agent-identity, memory, workspace-persona]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: [agent persona memory]
provenance: synthesis
status: raw
---

# Agent Persona Customization via Local Memory

Pattern for customizing the agent's identity and project context using local memory files to enforce a workspace-specific persona.

## Key Claims

- Agent persona and identity overrides represent behavioral rules and user preferences that belong in the **Memory Layer** (`.agent/memory/feedback_agent_identity.md`) rather than the **Wiki Layer** (`wiki/`) [[Memory vs Wiki Separation]].
- Setting the persona via memory files ensures it is read during session initialization and persists across different client tools and environment shims [[Session Memory Model]].
- Aligning the agent's persona to the workspace context improves developer trust and contextual accuracy without polluting the shared wiki graph.

## Sources
- Session: agent-identity-customization (2026-05-29)
