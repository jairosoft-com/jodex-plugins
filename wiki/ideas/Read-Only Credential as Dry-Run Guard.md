---
title: Read-Only Credential as Dry-Run Guard
type: idea
tags: [testing, safety, ado, dry-run, integration-test, credentials]
created: 2026-05-22
updated: 2026-05-22
source_count: 0
aliases: [read-only PAT dry-run, write-denial testing]
provenance: synthesis
status: backlogged
---

# Read-Only Credential as Dry-Run Guard

Use a read-only PAT (no write scope) when testing dry-run skill behavior. Any write tool call returns 401, which surfaces as a test failure — stronger than checking state after the fact.

## Why Tag/State Checks Are Insufficient

Asserting "no new tagged items in ADO" after a dry-run only catches correctly tagged items in the expected project. A regression could:
- Create an untagged item
- Write to a different tag or project
- Update an existing item (which doesn't appear as a new item)

None of these show up in a tag-range scan.

## The Pattern

1. Provision two PATs scoped to the sandbox project only:
   - `TOKEN_RW` — Work Items: Read & Write (for E2E tests)
   - `TOKEN_RO` — Work Items: Read only (for dry-run tests)
2. Inject `TOKEN_RO` into the MCP/SDK process for dry-run tests
3. Any write attempt (create, update, link) returns 401 immediately
4. 401 from a write call surfaces as a skill error → test failure

## Prerequisite

The credential must reach the MCP server (not just the SDK process). Verify in setup that the PAT swap actually affects the MCP write path — if the MCP server uses stored credentials independently of the calling process, this pattern provides no protection.

## Related

- [[Skill Integration Testing via Agent SDK]] — broader pattern this belongs to
- [[Playwright Tests for jx-pm ADO Skills]] — first planned application
- [[jx-pm]] — skill under test

## Sources
