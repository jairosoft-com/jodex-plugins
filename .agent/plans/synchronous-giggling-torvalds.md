# Implementation Plan: JX QA Workflow Page
## Feature 001 — QA Documentation Workflow

### Context

The jx-qa plugin has no unified workflow guide. Users must read 3+ documents (README, JX QA Onboarding, individual SKILL.md files) to understand the BRD → test pipeline. This plan delivers `wiki/code/JX QA Workflow.md` — a numbered happy-path walkthrough — per `docs/001_qa_documentation_workflow/BRD_PRD.md`.

**Pre-plan adversarial finding:** AC-001-09 and the BRD pipeline diagram both incorrectly state specs go to `tests/specs/`. The actual `generate/SKILL.md` writes to `tests/<filename>.spec.ts` (flat `tests/` directory). Both must be corrected.

---

### Files to Create

#### 1. `wiki/code/JX QA Workflow.md` ← primary deliverable

**Frontmatter:**
```yaml
title: JX QA Workflow
type: code
tags: [jx-qa, workflow, process, playwright]
created: 2026-05-21
updated: 2026-05-21
source_count: 0
aliases: [qa workflow, jx-qa workflow, qa pipeline walkthrough]
provenance: synthesis
```

**Page structure (5 numbered steps, happy path only):**

```
# JX QA Workflow

> Not set up yet? See [[JX QA Onboarding]] first.

## Overview
Pipeline: BRD → /jx-qa:extract → xlsx → /jx-qa:generate → .spec.ts → /jx-qa:test → results

> Command syntax sourced from `plugins/jx-qa/README.md` (see [[Source - JX QA README]]).
> Check there for the full flag reference.

## Step 1 — Prepare your BRD
Command: none — prepare a BRD/PRD markdown file and place it in raw/articles/.
Expected output: a markdown file ready to pass to /jx-qa:extract.

## Step 2 — Extract test cases
Command: /jx-qa:extract <brd-file>
Human checkpoint: Claude presents test case classifications; user approves or requests revisions.
Expected output: xlsx test plan written to test-plans/; coverage report printed.

## Step 3 — Generate Playwright specs
Command: /jx-qa:generate
Notes: opens live browser to auto-discover locators; idempotent (skips existing specs).
Expected output: .spec.ts files written to tests/.

## Step 4 — Run tests
Command: /jx-qa:test  (or /jx-qa:test ui / /jx-qa:test headed for debugging)
Expected output: N passed / N failed summary printed.

## Step 5 — Debug (optional)
Command: /jx-qa:browser open <url>
When to use: only if /jx-qa:test reports failures; use for manual locator exploration.
Expected output: browser session open; use snapshot or manual inspection to find locators.

## Related
- [[QA Testing Plugin]] — pipeline reference, command flags, and security model
- [[JX QA Onboarding]] — environment setup prerequisite

## Sources
- [[QA Testing Plugin]]
- [[JX QA Onboarding]]
- [[Source - JX QA README]]
```

---

### Files to Edit

#### 2. `wiki/plugins/QA Testing Plugin.md`

Add to the **Onboarding** section, after the `[[JX QA Onboarding]]` line:

```markdown
For the day-to-day pipeline walkthrough (extract → generate → test with expected outputs), see [[JX QA Workflow]].
```

Also bump `updated: 2026-05-21`.

#### 3. `wiki/code/JX QA Onboarding.md`

Insert a new `## Next Step` section **before `## Derived From`** (which must remain the final section per wiki schema):

```markdown
## Next Step

Ready to run a full QA cycle on a feature? Follow [[JX QA Workflow]] for the step-by-step pipeline with expected outputs at each stage.
```

Also bump `updated: 2026-05-21`.

#### 4. `docs/001_qa_documentation_workflow/BRD_PRD.md`

Two fixes — both reference the wrong `tests/specs/` path:

**Fix 0 — AC-001-24 and AC-001-30:**
These ACs say "wiki lint reports a missing cross-reference" — but wiki-tools.py cannot detect this. Rewrite both to reference the grep check (consistent with how AC-001-09 was fixed):

AC-001-24 change:
```
Given [[JX QA Workflow]] link is missing from the plugin page, When wiki lint runs, Then lint reports a missing cross-reference — unhappy path detected
```
→
```
Given [[JX QA Workflow]] link is missing from the plugin page, When grep -c "\[\[JX QA Workflow\]\]" is run on QA Testing Plugin.md, Then the count is zero — unhappy path detectable via grep
```

AC-001-30 change (same pattern for `JX QA Onboarding.md`).

**Fix 1 — AC-001-09:**
```
- AC-001-09: Step 3 (generate) documents expected output: `.spec.ts` files written to `tests/`
```
(was `tests/specs/`)

**Fix 2 — Pipeline diagram (line ~41):**
Change `tests/specs/*.spec.ts` → `tests/*.spec.ts`.
Also remove step number labels from diagram nodes (Step 1/2/3) to avoid contradicting the 5-step structure on the workflow page (AC-001-02). Use command names instead: label nodes as `/jx-qa:extract`, `/jx-qa:generate`, `/jx-qa:test`.

#### 5. `wiki/ideas/QA Documentation Workflow.md`

The Page Outline section still contains `tests/specs/*.spec.ts`. Update to `tests/*.spec.ts` to match the corrected path. This is a maintained wiki page — stale content would contradict the new workflow page.

Change in the page outline block:
```
Expected output: tests/specs/*.spec.ts files written
```
→
```
Expected output: tests/*.spec.ts files written
```

Also bump `updated: 2026-05-21`.

#### 6. `wiki/_index.md`

Add entry in the `code/` section near other `JX QA` entries:

```
- [[JX QA Workflow]] — Day-to-day numbered walkthrough of the jx-qa pipeline: extract → generate → test (#jx-qa, #workflow, #process)
```

---

### Constraints

- Expected outputs use **prose descriptions** only (not terminal snippets) — per decision log BRD_PRD §12.
- Commands must match `plugins/jx-qa/README.md` exactly — no invented flags.
- Happy path only — no edge cases, troubleshooting, or command reference.
- Specs go to `tests/` not `tests/specs/` — matches live SKILL.md.
- Wiki schema: `type: code`, `provenance: synthesis`, must include `## Sources` section.
- Bump `updated:` on all edited wiki pages.

---

### Execution Order

1. Fix `docs/001_qa_documentation_workflow/BRD_PRD.md` — AC-001-09, AC-001-24, AC-001-30 + diagram (path + remove step labels)
2. Create `wiki/code/JX QA Workflow.md`
3. Edit `wiki/plugins/QA Testing Plugin.md` — add link, bump updated
4. Edit `wiki/code/JX QA Onboarding.md` — add ## Next Step before ## Derived From, bump updated
5. Edit `wiki/ideas/QA Documentation Workflow.md` — fix tests/specs/ → tests/ in outline, bump updated
6. Edit `wiki/_index.md` — add index entry
7. Run verification (see below)
8. Commit all in one worktree, merge to main

---

### Verification

```bash
# 0. Confirm new page exists (AC-001-01)
test -f wiki/code/JX\ QA\ Workflow.md && echo "EXISTS" || echo "MISSING"

# 1. No broken links
python3 plugins/jx-kb/scripts/wiki-tools.py broken-links wiki/

# 2. JX QA Workflow must NOT be an orphan.
# NOTE: _index.md is excluded from orphan detection (underscore prefix).
# Inbound links must come from QA Testing Plugin.md and JX QA Onboarding.md.
python3 plugins/jx-kb/scripts/wiki-tools.py orphans wiki/
# Then confirm JX QA Workflow is not in that list.

# 3. Frontmatter valid
python3 plugins/jx-kb/scripts/wiki-tools.py frontmatter-check wiki/

# 4. Targeted grep — confirm [[JX QA Workflow]] is present in both inbound pages
# (This is the acceptance check for AC-001-24 and AC-001-30 — wiki-tools.py orphan detection
#  cannot verify these because _index.md is excluded and one inbound link hides the orphan.
#  The grep is the authoritative check for these ACs.)
grep -c "\[\[JX QA Workflow\]\]" wiki/plugins/QA\ Testing\ Plugin.md
grep -c "\[\[JX QA Workflow\]\]" wiki/code/JX\ QA\ Onboarding.md
# Each must return >= 1

# 5. Spot-check commands against plugins/jx-qa/README.md
grep -E "jx-qa:(extract|generate|test|browser)" wiki/code/JX\ QA\ Workflow.md
```
