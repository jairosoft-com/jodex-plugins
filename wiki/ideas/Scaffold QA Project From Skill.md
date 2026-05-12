---
title: Scaffold QA Project From Skill
type: idea
tags: [jx-qa, scaffolding, project-init, developer-experience]
created: 2026-05-10
updated: 2026-05-10
source_count: 0
aliases: [qa project scaffold, jx-qa init, qa project generator]
provenance: synthesis
status: backlogged
---

# Scaffold QA Project From Skill

Add a skill to [[QA Testing Plugin|jx-qa]] that scaffolds a complete QA project structure — directories, config files, dependencies, and boilerplate — so new users can go from zero to running tests with one command.

## Motivation

- Currently users must manually set up Playwright config, test-plans dir, folder structure
- New users hit friction before writing first test
- Standardized structure ensures jx-qa skills (extract, generate, browser, test) work out of the box

## Possible Output

```
my-qa-project/
├── test-plans/              # xlsx test plans land here
├── tests/
│   ├── specs/               # generated .spec.ts files
│   └── fixtures/            # shared test fixtures
├── playwright.config.ts     # pre-configured for jx-qa
├── package.json             # playwright + deps
├── tsconfig.json
└── .gitignore
```

## Open Questions

- New skill (`/jx-qa:init`) or subcommand of existing skill?
- Interactive prompts (project name, base URL, browser targets) or opinionated defaults?
- Include sample BRD/xlsx for demo run?
- Should it run `npm install` + `npx playwright install` automatically?
- Relationship to `/jx-kb:init` pattern — reuse same scaffold philosophy?

## Related

- [[QA Testing Plugin|jx-qa]] — target plugin
- [[Multi-Phase Skill]] — scaffold could follow same pattern
- [[Idempotent Operation]] — safe to re-run on existing project
