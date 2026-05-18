---
title: Wrong-Tenant Filing as Tenant Binding Validation
type: idea
tags: [jx-pm, ado, tenant-binding, fail-closed, incident]
created: 2026-05-18
updated: 2026-05-18
source_count: 0
aliases: [wrong project filing, feedback-target missing incident]
provenance: session-derived
status: raw
---

# Wrong-Tenant Filing as Tenant Binding Validation

During the 2026-05-18 session, the `/jx-pm:feedback` skill created Feature #204416 in the wrong ADO project (Jairosoft Portfolio instead of Jodex) because `feedback-target.json` did not exist. The skill prompted for the project ad-hoc rather than failing closed.

## What Happened

1. User ran `/jx-pm:feedback` to file an idea as an ADO Feature
2. No `feedback-target.json` existed in the repo
3. The skill asked the user to pick from a list of 20+ ADO projects
4. The wrong project was selected (Jairosoft Portfolio)
5. Feature #204416 was created in the wrong project
6. Manual cleanup: created #204420 in the correct project (Jodex), marked #204416 as Removed
7. User corrected `feedback-target.json` to point to Jodex

## Lessons

- The skill should fail closed when `feedback-target.json` is missing, not fall back to ad-hoc project selection — validates [[Fail-Closed Lookup]]
- Tenant binding must be file-authoritative, not prompt-derived — validates [[Tenant Binding]]
- The corrective action (create in right project + mark old as Removed) worked but cost time and left a stale work item

## Possible Improvements

- Make `feedback-target.json` a prerequisite gate in the feedback skill — halt with a clear message if missing
- Add a confirmation step that shows the target project before creating the work item
- Consider scaffolding `feedback-target.json` during `/jx-kb:init` or foundational onboarding

## Related

- [[Tenant Binding]]
- [[Fail-Closed Lookup]]
- [[User Confirmation Gate]]
- [[ADO State Sync Model]]
