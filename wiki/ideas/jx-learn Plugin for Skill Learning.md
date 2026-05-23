---
title: jx-learn Plugin for Skill Learning
type: idea
tags: [jx-learn, plugin, learning, skills, prompts, onboarding, dx]
created: 2026-05-22
updated: 2026-05-22
source_count: 0
aliases: [geodex learning plugin, jx-learn, learn plugin]
provenance: synthesis
status: backlogged
---

# jx-learn Plugin for Skill Learning

New plugin `jx-learn` that teaches users how to use and build within the Geodex/Jodex ecosystem — interactive learning experiences delivered as skills.

## Initial Skills

- `/jx-learn:write-prompt` — teaches effective prompt writing for Claude; covers structure, tone, context, and iteration patterns
- `/jx-learn:write-skill` — teaches how to author SKILL.md files; covers frontmatter, trigger design, phase structure, allowed-tools, and conventions from `jx-core/_shared/`

## Why

- Onboarding friction is high without structured guidance
- Skills and prompts are the core extension points; learning them unlocks the full platform
- Existing docs are reference material, not learning experiences

## Open Questions

- Format: guided walkthrough vs Q&A vs example-critique?
- Does `/jx-learn:write-skill` use `jx-skill:create` under the hood as a live exercise?
- Output artifact: does the learner produce a real skill by the end?
- Where does `jx-learn` live in the marketplace?

## Related

- [[jx-skill]] — scaffolding plugin that could serve as the hands-on exercise for `write-skill`
- [[Skill]] — concept being taught
- [[Automate Plugin Creation Like Skill Creation]] — related DX initiative
- [[Claude CLI Training Course]] — adjacent onboarding idea

## Sources
