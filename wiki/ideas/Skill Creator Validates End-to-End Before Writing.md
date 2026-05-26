---
title: Skill Creator Validates End-to-End Before Writing
type: idea
tags: [jx-skill, validation, scaffolding, design-pattern]
created: 2026-05-25
updated: 2026-05-25
source_count: 0
aliases: []
provenance: synthesis
status: raw
---

# Skill Creator Validates End-to-End Before Writing

The `/jx-skill:create` workflow runs four sequential validations (name format, plugin existence, name collision, trigger conflict) before presenting a confirmation gate, then scaffolds atomically. This "validate-all-then-confirm-then-write" pattern prevented partial artifacts and caught problems before any files were created.

This is an instance of the [[User Confirmation Gate]] and [[Multi-Phase Skill]] patterns working together. Other scaffolding or generation skills (e.g., `/jx-skill:create-plugin`, `/jx-pm:prd`) could adopt the same strict sequencing if they haven't already.

## Sources
- Session observation, 2026-05-25
