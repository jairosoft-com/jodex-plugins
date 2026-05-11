---
title: Gemma 4 for Playwright Script Generation
type: idea
tags: [jx-qa, gemma, code-generation, playwright, local-llm]
created: 2026-05-10
updated: 2026-05-10
source_count: 0
aliases: [gemma playwright, gemma spec generation]
provenance: synthesis
status: raw
---

# Gemma 4 for Playwright Script Generation

Use Google's Gemma 4 model to generate `.spec.ts` / [[Playwright]] scripts as part of the [[QA Testing Plugin|jx-qa]] pipeline.

## Motivation

- Local/open-weight model — no API cost per generation
- Could replace or augment current `/jx-qa:generate` skill's Claude-driven spec output
- Gemma 4 reportedly strong at code generation tasks

## Open Questions

- Run locally (Ollama, llama.cpp) or via API?
- Replace Claude in generate skill entirely, or use as draft → Claude refines?
- Benchmark quality: Gemma 4 specs vs Claude specs on same xlsx input
- Context window limits — can Gemma 4 handle full xlsx + page context?
- Integration point: new skill, flag on existing generate, or separate pipeline?

## Related

- [[QA Testing Plugin|jx-qa]] — target plugin
- [[Test Code Generation]] — existing concept for auto-generating specs
- [[Source - Generate SKILL]] — current generate workflow
