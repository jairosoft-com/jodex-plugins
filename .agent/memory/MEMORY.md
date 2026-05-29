# Agent Memory

## GitHub / Git Workflow
- **PR Creation (User Preferred Workflow):** Always use `gh` (GitHub CLI) to create and push PRs. Do NOT use the browser or MCP GitHub tools. It is the explicit preference of the user to use `gh pr create` with `--title` and `--body` flags.
- **PR Formatting:**
  - Provide a clear `--title` (e.g., `feat: ...`, `chore: ...`).
  - Provide a `--body` that includes at minimum a `## Description` and `## Summary`.

## Workflow Rules
- [Wiki vs code changes](feedback_wiki_vs_code.md) — Wiki filings proceed immediately; code changes require a plan first
- [Adversarial review workflow](feedback_adversarial_review_workflow.md) — Run iteratively, expect multiple rounds until clean
- [Discuss findings individually](feedback_discuss_findings.md) — Present findings one-by-one, not batch multi-select
- [Repo-local memory preference](feedback_repo_local_memory.md) — Save reusable project memory in `.agent/memory/` as repo-local artifacts
- [Succinct ideas](feedback_succinct_ideas.md) — Wiki ideas must be brief; no over-grooming or verbose sections
- [Plans directory](feedback_plans_directory.md) — Use .agent/plans/ from settings.local.json, not ~/.claude/plans/
- [Plan vs execute boundary](feedback_plan_vs_execute.md) — Plan approval is not implementation approval; stop after planning unless explicitly told to implement
- [Read skill spec first](feedback_read_skill_spec_first.md) — Before executing ANY jx-* skill, read its SKILL.md completely; don't improvise
- [ADO sync format](feedback_ado_sync_format.md) — Specific instance: follow jx-core/_shared/ado.md for ADO work item formats
- [Workflow save location](feedback_workflow_save_location.md) — Always copy the workflow.js into .claude/workflows/ (tracked, invocable by name), not just the auto-saved session copy

## NotebookLM
- [Associated notebooks](reference_notebooklm.md) — Plugin Marketplace Architecture + Mastering Skill.MD + Building Product Management Skills

## Confidence threshold
- [Advisor confidence threshold](feedback_advisor_threshold.md) — Call advisor when confidence <=96%

## Projects
- [jx-pm plugin](project_jx_pm_plugin.md) — Built, committed, ready for dogfooding. 5 skills at plugins/jx-pm/
- [Extract skill BRD path](project_extract_brd_path.md) — Remove hardcoded path; prompt user or pull from memory
- [Wiki lint fixes pending](project_wiki_lint_fixes.md) — Post-plugin-split lint score 78/100, 5 errors + 5 warnings

## References
- [ADO project binding](reference_ado_project.md) — Org: jairo, Project: Jodex (dev.azure.com/jairo/Jodex)
- [CasaColina source skills](reference_casacolina_source_skills.md) — Original cc-gen-* skills that jx-pm was ported from
