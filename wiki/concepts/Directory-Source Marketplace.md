---
title: Directory-Source Marketplace
type: concept
tags: [plugin, marketplace, development]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [local marketplace, directory marketplace]
provenance: synthesis
---

# Directory-Source Marketplace

A [[Marketplace]] that points to a local directory instead of a GitHub repository. Configured via `extraKnownMarketplaces` in settings:

```json
{
  "extraKnownMarketplaces": {
    "jodex-plugins": {
      "source": {
        "source": "directory",
        "path": "/absolute/path/to/repo"
      }
    }
  }
}
```

## Use Case

Develop and test marketplace plugins locally without publishing to GitHub. The directory must contain a valid `marketplace.json` at `.claude-plugin/marketplace.json`.

## Important: Settings Placement

Because `path` is an absolute path, this config must live in `.claude/settings.local.json` (gitignored), **not** `.claude/settings.json` (committed). See [[Settings Portability]].

## Contrast with Other Approaches

| Approach | Scope | Persistence |
|----------|-------|-------------|
| `--plugin-dir` | Single plugin, session only | None — must pass flag each launch |
| Directory-source marketplace | Entire marketplace, persistent | In settings until removed |
| GitHub marketplace | Entire marketplace, persistent | In plugin registry |

See [[Local Plugin Development]] for `--plugin-dir` approach.

## Related

- [[Marketplace]] — parent concept
- [[Plugin Architecture]] — format loaded from directory
- [[Settings Portability]] — why this must be in `.local` settings
- [[Three-Surface Plugin Ecosystem]] — directory source works across all three surfaces

## Sources
- (synthesis — observed in project settings configuration, 2026-05-08)
