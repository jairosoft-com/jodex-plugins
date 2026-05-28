---
ado_sync:
  organization: jairo
  project: Jodex-Test
  feature_work_item_id: 99903
  feature_work_item_url: https://dev.azure.com/jairo/Jodex-Test/_workitems/edit/99903
  last_synced: "2026-01-01T00:00:00Z"
  stories:
    US-903-01: 99901
    US-903-02: 99902
    US-903-STALE: 99999
---

## Document Metadata
- **Feature ID**: 903
- **Feature Name**: test_orphan_detection
- **Document Type**: PRD
- **Generated Date**: 2026-05-22
- Quality Gates:
  - Lint passes

## Overview

Feature 903 is a test fixture for orphan story detection. The frontmatter contains `US-903-STALE: 99999` which does not correspond to any story in the PRD body. Dry-run output must report this orphan story ID.

## User Stories

### US-903-01: Active story one
**As a** tester
**I want** the skill to detect orphan frontmatter entries
**So that** stale IDs are surfaced in dry-run output

**Acceptance Criteria:**

**Scenarios:**
- AC-903-01: Given an ado_sync block contains a story ID not in the PRD body, When dry-run runs, Then the output lists the orphan story ID
- AC-903-02: Given the orphan is reported, When the report is shown, Then it includes the ADO work item ID for manual review

**Quality Gates:**
- AC-903-03: Lint passes

**Validates:** Orphan detection surfaces stale frontmatter IDs in dry-run output

### US-903-02: Active story two
**As a** tester
**I want** the skill to not modify orphan items in ADO
**So that** orphaned work items are not automatically deleted

**Acceptance Criteria:**

**Rules:**
- AC-903-04: Orphan stories are reported but never closed or deleted by the skill
- AC-903-05: Orphan IDs remain in ado_sync frontmatter after dry-run (no mutation)

**Quality Gates:**
- AC-903-06: Lint passes

**Validates:** Orphan items remain untouched in ADO after dry-run
