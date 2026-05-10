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

Claude Code can create, manage, and interact with tmux sessions — but cannot attach to them (`open terminal failed: not a terminal`).

### What Works from Claude Code

| Command | Purpose |
|---------|---------|
| `tmux new-session -d -s team` | Create detached session |
| `tmux split-window -h -t team:W` | Split panes |
| `tmux list-windows -t team` | Query window indices |
| `tmux list-panes -t team:W` | Query pane indices |
| `tmux capture-pane -t team:W.P -p` | **Read pane output** |
| `tmux send-keys -t team:W.P "cmd" Enter` | **Send commands to pane** |
| `tmux kill-session -t team` | Destroy session |

### What Fails

| Command | Error |
|---------|-------|
| `tmux attach -t team` | `open terminal failed: not a terminal` |

`capture-pane` + `send-keys` means Claude Code can orchestrate AND monitor tmux panes without attaching. Terminal.app only needed for visual observation, not for programmatic interaction.

### Pane Index Gotchas

**Config-dependent start index:** Pane/window indices depend on user tmux config. If `base-index` or `pane-base-index` is set to 1, targeting `:0.0` will fail. Always query actual indices before splitting.

**Index shift on split:** Each `split-window` creates a new pane that takes the next index, bumping existing panes. Must re-query or track indices after each split to target the correct pane.

### Correct 4-Pane (2x2 Grid) Recipe

```bash
# Step 1: Create session (assumes base-index=1; query first if unsure)
tmux new-session -d -s team "tail -f /tmp/agents/phase1.log"

# Step 2: Horizontal split → left(1) | right(2)
tmux split-window -h -t team:1 "tail -f /tmp/agents/phase2.log"

# Step 3: Split LEFT vertically → TL(1) | BL(2) | right bumps to (3)
tmux split-window -v -t team:1.1 "tail -f /tmp/agents/phase3.log"

# Step 4: Split RIGHT (now index 3) vertically → TR(3) | BR(4)
tmux split-window -v -t team:1.3 "tail -f /tmp/agents/phase4.log"

# Result:  TL(1) | TR(3)
#          BL(2) | BR(4)
```

### Monitoring Panes Programmatically

```bash
# Read pane output (no attach needed)
tmux capture-pane -t team:1.1 -p   # top-left
tmux capture-pane -t team:1.3 -p   # top-right

# Send command to a pane
tmux send-keys -t team:1.2 "echo hello" Enter
```

User can optionally run `tmux attach -t team` from Terminal.app for visual monitoring.

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
- **Tmux attach fails from Claude Code** — `open terminal failed: not a terminal`; use `capture-pane`/`send-keys` instead for programmatic interaction
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
