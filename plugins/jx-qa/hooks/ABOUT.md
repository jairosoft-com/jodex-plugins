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

- Auto-lint after test generation
- Session setup/teardown (start/stop services)
- Review gates before stopping

## Reference

See Codex plugin's `hooks/hooks.json` for a working example.
