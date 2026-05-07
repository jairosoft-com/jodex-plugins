# Hooks

Shell commands triggered by Claude Code lifecycle events.

## Format

Create a `hooks.json` file in this directory:

```json
{
  "SessionStart": [
    { "command": "node script.mjs", "timeout": 5000 }
  ],
  "Stop": [
    { "command": "node review-gate.mjs", "timeout": 900000 }
  ]
}
```

## Available events

- `SessionStart` — runs when Claude Code session begins
- `SessionEnd` — runs when session ends
- `Stop` — runs before Claude stops responding (can block if hook fails)

## When to use

- Auto-lint wiki on session start
- Index rebuild after session with wiki changes
- Review gate before stopping (verify index consistency)

## Reference

See qa-ai plugin's `hooks/ABOUT.md` for format details.
