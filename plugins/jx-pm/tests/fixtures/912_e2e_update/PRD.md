## Document Metadata
- **Feature ID**: 912
- **Feature Name**: test_e2e_update_mode
- **Document Type**: PRD
- **Generated Date**: 2026-05-22
- Quality Gates:
  - Lint passes

## Overview

Feature 912 is the E2E fixture for update mode. The test's before-each creates Feature 912 and all stories in ADO, injects those IDs into a temp copy of this file, then runs the skill. The skill must update title, description, and ACs while preserving Story Points and State.

## User Stories

### US-912-01: Export report to PDF
**As a** manager
**I want** to export any report to PDF
**So that** I can share it with stakeholders who do not have system access

**Acceptance Criteria:**

**Scenarios:**
- AC-912-01: Given a manager views a report, When they click Export PDF, Then a PDF is generated and downloaded within 5 seconds
- AC-912-02: Given a PDF is exported, When it opens, Then all charts and tables are rendered correctly without truncation

**Quality Gates:**
- AC-912-03: Lint passes

**Validates:** Managers can export and share reports as PDFs

### US-912-02: Schedule automated report delivery
**As a** manager
**I want** to schedule reports to be emailed automatically
**So that** stakeholders receive updates without manual intervention

**Acceptance Criteria:**

**Rules:**
- AC-912-04: Reports can be scheduled daily, weekly, or monthly
- AC-912-05: Each schedule sends to a configurable list of email recipients
- AC-912-06: A confirmation email is sent to the scheduler when delivery succeeds

**Quality Gates:**
- AC-912-07: Lint passes

**Validates:** Scheduled report delivery reduces manual reporting effort
