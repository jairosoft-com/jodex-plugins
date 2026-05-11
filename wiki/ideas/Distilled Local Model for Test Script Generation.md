---
title: Distilled Local Model for Test Script Generation
type: idea
tags: [jx-qa, local-llm, distillation, code-generation, playwright]
created: 2026-05-10
updated: 2026-05-10
source_count: 0
aliases: [distilled model test gen, local distilled playwright]
provenance: synthesis
status: raw
---

# Distilled Local Model for Test Script Generation

Use a distilled (smaller, fine-tuned) local model to generate test scripts in the [[QA Testing Plugin|jx-qa]] pipeline. Distinct from [[Gemma 4 for Playwright Script Generation]] — this focuses on distillation as the strategy rather than a specific base model.

## Motivation

- Distilled models optimized for narrow task = higher quality per parameter
- Fully offline — no API cost, no latency, no data leaving machine
- Could fine-tune on existing generated `.spec.ts` output as training data
- Faster inference than full-size models for repetitive generation tasks

## Open Questions

- Base model to distill from? (Claude output → fine-tune smaller model)
- Training data: use existing jx-qa generated specs as gold set?
- Target size: 7B, 13B, or smaller quantized?
- Runtime: Ollama, llama.cpp, vLLM?
- Quality bar: how to benchmark distilled output vs Claude output?
- Relationship to [[Gemma 4 for Playwright Script Generation]] — complementary or competing approach?

## Related

- [[QA Testing Plugin|jx-qa]] — target plugin
- [[Test Code Generation]] — existing concept
- [[Gemma 4 for Playwright Script Generation]] — related idea (specific model vs distillation strategy)
