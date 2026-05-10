---
title: Agent Team Execution
type: concept
tags: [pattern, agent, orchestration, parallel]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [agent team, parallel agent execution]
provenance: synthesis
---

# Agent Team Execution

Pattern for orchestrating multiple Claude Code subagents in parallel to execute large multi-phase operations, with a sequential foundation phase and tmux-based visibility.

## Structure

```
Phase 1 (sequential) — foundation that all other phases depend on
    ↓ completes
Phase 2 ──┐
Phase 3 ──┤ (parallel agents, each writes to log file)
Phase 4 ──┤
Phase 5 ──┘
    ↓ all complete
Verification (sequential)
```

## Implementation

1. **Execute Phase 1 directly** — critical foundation (e.g., directory renames, manifest updates) runs in the main agent context
2. **Spawn parallel agents** — one per phase, each with:
   - Self-contained prompt describing exactly what to do
   - Log file path for progress output (`/tmp/rename-agents/phaseN.log`)
   - `run_in_background: true` for parallel execution
3. **Tmux dashboard** — 4-pane session, each pane tailing an agent's log file
4. **Collect results** — main agent receives completion notifications and runs verification

## Agent Prompt Rules

Each agent prompt must be self-contained:
- Full repo path
- What has ALREADY been done (prior phases)
- Exact operations to perform
- Safety rules and exclusions
- Log file path with start/end markers

## Tmux Setup

```bash
tmux new-session -d -s team
tmux split-window -h -t team
tmux split-window -v -t team:0.0
tmux split-window -v -t team:0.1
# Each pane: tail -f /tmp/agents/phaseN.log
```

## Failure Modes

- Agents that plan instead of executing (mode must be `auto` not `plan`)
- File conflicts when agents edit overlapping files — assign non-overlapping scopes
- Foundation phase incomplete before parallel launch — always verify Phase 1 before spawning

## Example from This Project

The jx namespace rebrand used 4 parallel agents:
- Phase 2: Wiki file renames (18 `git mv` operations)
- Phase 3: Plugin content updates (22 files)
- Phase 4: Wiki content updates (60+ files)
- Phase 5: Top-level file updates (2 files)

Phase 1 (directory renames + manifests) ran sequentially first.

## Related

- [[Multi-Phase Skill]] — single-agent phased execution
- [[Plugin Dogfooding Workflow]] — broader operational context
