# Smoke Fixture BRD — /jx-qa:coverage

Purpose-built for the runtime smoke (plan step 4b). Four requirements, one of each kind.

## Acceptance Criteria
- **AC-001:** A user who submits valid credentials on the login page lands on the dashboard, which displays their name. *(COVERED by the plan's one test case.)*
- **AC-002:** A user who submits the login form with empty fields sees an inline validation error and is not navigated away. *(UNCOVERED — no test case exercises the empty-field/error branch.)*
- **AC-003:** Lint passes in CI on every pull request. *(Non-E2E: a CI/build check, not a browser-observable behavior → legitimately N/A.)*

## Non-Functional Requirements
- **NFR-001:** The dashboard renders within 2 seconds and is visibly usable to the user on first load. *(E2E-testable: a user-visible, browser-observable behavior — it must NOT be marked N/A; here it is UNCOVERED.)*
