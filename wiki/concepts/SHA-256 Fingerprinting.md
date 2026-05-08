---
title: SHA-256 Fingerprinting
type: concept
tags: [security, dedup, provenance]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [fingerprinting, content hash, dedup]
provenance: source-derived
---

# SHA-256 Fingerprinting

Content-based deduplication mechanism used during [[Ingest]]. Each source is hashed before processing to detect re-ingestion.

## How It Works

1. `wiki-tools.py fingerprint <source>` computes SHA-256 hash + file size
2. Hash checked against prior ingest entries in [[Log]]
3. If match found: warn user with previous ingest date, ask re-ingest or skip
4. Hash recorded in log entry for future dedup checks

## Used For

- Preventing duplicate ingestion of same source
- Provenance tracking — each wiki page traces back to source hashes
- Snapshot naming — `wiki/raw/sources/<sha256_prefix>-<filename>`

## Sources
- [[Source - Ingest SKILL]]
