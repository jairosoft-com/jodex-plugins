---
title: Storage State
type: concept
tags: [testing, browser, persistence]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [browser state, auth state]
provenance: source-derived
---

# Storage State

Browser state persistence mechanism in [[Playwright]]. Save and restore cookies, localStorage, and sessionStorage for authentication reuse and test isolation.

## Save/Restore

```bash
playwright-cli state-save auth.json
playwright-cli state-load auth.json
```

## Cookie Management

```bash
playwright-cli cookie-list [--domain=example.com]
playwright-cli cookie-get session_id
playwright-cli cookie-set session abc123 --httpOnly --secure
playwright-cli cookie-delete session_id
playwright-cli cookie-clear
```

## LocalStorage / SessionStorage

```bash
playwright-cli localstorage-list
playwright-cli localstorage-set theme dark
playwright-cli sessionstorage-list
```

## Common Pattern: Auth State Reuse

Login once, save state, restore in subsequent sessions to skip login flow. Critical for [[E2E Test Case]] efficiency.

## Security

- Never commit state files with auth tokens
- Add `*.auth-state.json` to `.gitignore`
- Delete state files after automation completes

## Sources
- [[Source - Storage State Reference]]
