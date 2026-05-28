---
title: "Source - Pipeline SKILL"
type: source
tags: [skill, jx-pm, pipeline, orchestration]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/pipeline/SKILL.md
provenance: source-derived
---

# Source - Pipeline SKILL

## Metadata
- **Original path**: plugins/jx-pm/skills/pipeline/SKILL.md
- **SHA-256**: b9742092bb8cea7cd665ec5e9e59a663603e2b7df54e2db254b65e8922230be6
- **Size**: 1583 bytes

## Summary

The Pipeline skill is a convenience wrapper that runs the full PM pipeline in sequence: PRD → Tech Spec → Task JSON → Azure sync. It prompts for the folder path once and passes it to all subsequent skills. Supports `--skip-ado` to stop after task.json generation.

## Key Concepts
- [[Skill Chaining]] — orchestrates four skills in fixed order (prd → techspec → task → ado)
- [[Mode Flag Pattern]] — passes `--mode` to the PRD skill
- [[Configurable Default Chain]] — passes `--docs-root` to all skills
- Idempotent re-invocation — if any skill halts, user resolves and re-invokes
- Each skill remains independently invocable outside the pipeline

## Pages Created
None
