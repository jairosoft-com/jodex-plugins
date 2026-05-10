---
title: Agent Team Execution
type: concept
tags: [pattern, agent, orchestration, parallel]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
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

Claude Code can create and manage tmux sessions but cannot attach to them (`open terminal failed: not a terminal`). Create detached, monitor from Terminal.app.

**Important:** Pane/window indices depend on user tmux config. If `base-index` or `pane-base-index` is set to 1, targeting `:0.0` will fail silently. Always check with `tmux list-windows` and `tmux list-panes` before splitting.

```bash
# Works from Claude Code:
tmux new-session -d -s team
tmux list-windows -t team          # check window index (0 or 1)
tmux list-panes -t team:1          # check pane index (0 or 1)
tmux split-window -h -t team:1     # use actual indices from list
tmux split-window -v -t team:1.1
tmux split-window -v -t team:1.2
# Each pane: tail -f /tmp/agents/phaseN.log

# Does NOT work from Claude Code:
tmux attach -t team                # "open terminal failed: not a terminal"
```

User must run `tmux attach -t team` from real Terminal.app to observe.

## Coordination: Signal Files

When using separate Claude instances (not subagents), coordinate via filesystem signals:

```bash
# Agent B creates on completion:
touch /tmp/jx-split-track-b-done

# Agent C waits before starting:
until [ -f /tmp/jx-split-track-b-done ]; do sleep 5; done
```

This enforces ordering (e.g., B copies files before C deletes them) without inter-process communication.

## Two Execution Models

| Model | How | When |
|-------|-----|------|
| **Subagent** | `Agent()` tool with `run_in_background` | Work fits in one session, needs result back |
| **Separate instances** | `claude -p "..."` in tmux panes | Independent tracks, heavier isolation, visual monitoring |

Separate instances are heavier but avoid context window pressure and provide true parallel visibility.

## Failure Modes

- Agents that plan instead of executing (mode must be `auto` not `plan`)
- File conflicts when agents edit overlapping files — assign non-overlapping scopes
- Foundation phase incomplete before parallel launch — always verify Phase 1 before spawning
- **Race condition** — parallel agents reading/deleting same files; enforce ordering via signal files
- **Tmux attach fails from Claude Code** — `open terminal failed: not a terminal`; create detached, user monitors in Terminal.app
- **Pane index mismatch** — tmux `base-index`/`pane-base-index` config causes `:0.0` targeting to fail; always query actual indices first

## Examples from This Project

### [[Rebrand Skills to jx Namespace]] (subagent model)
4 parallel subagents with sequential Phase 1:
- Phase 2: Wiki file renames (18 `git mv`)
- Phase 3: Plugin content updates (22 files)
- Phase 4: Wiki content updates (60+ files)
- Phase 5: Top-level files (2 files)

### jx-pm plugin split (separate instance model)
4 Claude instances in tmux with signal file coordination:
- Track A: Build jx-core (parallel with B)
- Track B: Build jx-dev (parallel with A, signals C)
- Track C: Modify jx-pm (waits for B's signal)
- Track D: Verification (waits for A+B+C signals)

## Related

- [[Multi-Phase Skill]] — single-agent phased execution
- [[Plugin Dogfooding Workflow]] — broader operational context
- [[Cross-Plugin Shared Convention Layer]] — split that used this pattern
- [[Atomic Rename Boundary]] — why foundation phase must be atomic before parallel launch
- [[Dynamic Worklist Generation]] — generate file lists at execution time, not in plan
- [[Knowledge Flywheel]] — execution is one phase of the self-reinforcing knowledge loop

## Sources
- [[Source - Plugin Split Implementation Plan]]
