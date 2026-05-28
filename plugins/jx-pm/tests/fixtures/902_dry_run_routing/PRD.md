## Document Metadata
- **Feature ID**: 902
- **Feature Name**: test_ac_format_routing
- **Document Type**: PRD
- **Generated Date**: 2026-05-22
- Quality Gates:
  - Lint passes
  - Typecheck passes

## Overview

Feature 902 is a test fixture for AC format routing. It contains stories with Scenarios (pass-through), Rules (synthesize Gherkin), and Quality Gates (excluded from AC field). Used to verify the AC routing logic in dry-run mode.

## User Stories

### US-902-01: Story with Scenarios routing
**As a** tester
**I want** Scenario-format ACs to pass through unchanged
**So that** Gherkin scenarios are preserved in the AC field

**Acceptance Criteria:**

**Scenarios:**
- AC-902-01: Given a PRD has Scenarios sub-header ACs, When the skill routes, Then ACs pass through as-is without Gherkin synthesis
- AC-902-02: Given multiple Scenario ACs, When routed, Then all appear in the AC field ordered list

**Quality Gates:**
- AC-902-03: Lint passes
- AC-902-04: Typecheck passes

**Validates:** Scenarios routing produces pass-through AC content

### US-902-02: Story with Rules routing
**As a** tester
**I want** Rules-format ACs to be routed correctly
**So that** behavioral rules trigger Gherkin synthesis

**Acceptance Criteria:**

**Rules:**
- AC-902-05: Each saved rule persists across sessions
- AC-902-06: Rule validation occurs before save
- AC-902-07: Conflicting rules display a resolution prompt

**Quality Gates:**
- AC-902-08: Lint passes
- AC-902-09: Typecheck passes

**Validates:** Rules routing triggers Gherkin synthesis path

### US-902-03: Story with Quality Gates only
**As a** tester
**I want** Quality Gate ACs to be excluded from the AC field
**So that** quality gates do not appear in Azure Boards acceptance criteria

**Acceptance Criteria:**

**Quality Gates:**
- AC-902-10: Lint passes
- AC-902-11: Typecheck passes
- AC-902-12: Unit tests pass

**Validates:** Quality gate exclusion leaves AC field empty for QG-only stories
