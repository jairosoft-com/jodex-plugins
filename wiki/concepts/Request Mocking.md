---
title: Request Mocking
type: concept
tags: [testing, network, playwright]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [network mocking, route interception]
provenance: source-derived
---

# Request Mocking

Pattern for intercepting, mocking, modifying, and blocking network requests during [[Browser Automation]]. [[Playwright]] provides both CLI commands and programmatic API.

## CLI Route Commands

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "**/api/users" --body='[{"id":1}]' --content-type=application/json
playwright-cli route "**/*" --remove-header=cookie,authorization
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
```

## Advanced Scenarios (via run-code)

- Conditional responses based on request body
- Modify real responses (intercept → mutate → fulfill)
- Simulate network failures (`abort('internetdisconnected')`)
- Delayed responses for timeout testing

## Use Cases

- Testing error states without breaking real APIs
- Isolating frontend from backend during E2E tests
- Simulating slow/unreliable network conditions
- Testing authentication flows with mocked tokens

## Sources
- [[Source - Request Mocking Reference]]
