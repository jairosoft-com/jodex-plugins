---
title: Playwright Tests for jx-pm ADO Skills
type: idea
tags: [jx-pm, jx-qa, playwright, ado, integration-test, testing]
created: 2026-05-22
updated: 2026-05-28
source_count: 0
aliases: [ado skill playwright tests, playwright ado integration tests]
provenance: synthesis
status: completed
---

# Playwright Tests for jx-pm ADO Skills

Build a Playwright test suite that exercises [[Product Management Skills Plugin|jx-pm]] ADO skills end-to-end — run the skill, then assert state in Azure DevOps.

## Motivation

- ADO skills (`/jx-pm:ado`, pipeline sync) have no automated test coverage
- Manual verification is slow and inconsistent
- End-to-end tests catch regressions in skill logic and ADO API contract

## Scope (initial)

- `/jx-pm:ado` sync flow: PRD → ADO Features/Stories creation and update
- Verify work items created with correct fields (title, description, ACs)
- Verify dry-run mode produces no side effects

## Open Questions

- Browser automation vs pure API assertions — does the test need the ADO portal UI?
- Test project setup: use a dedicated ADO sandbox project or CI-isolated project?
- Where does the suite live — `jx-qa` plugin or `jx-pm` plugin tests?
- Trigger model: manual, CI gate, or post-merge hook?
- Auth strategy: PAT in env var, or managed identity for CI?

## Related

- [[Product Management Skills Plugin|jx-pm]] — plugin under test
- [[Direct PRD-to-ADO Sync Without task.json]] — refactor that changes sync contract; tests should follow
- [[Dry-Run Gate Must Include Explicit Docs-Root]] — dry-run safety behavior to cover
- [[QA Testing Plugin|jx-qa]] — possible home for the test suite
- [[Scaffold QA Project From Skill]] — could scaffold the test project structure

## Sources
