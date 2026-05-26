---
title: Background Session MCP Limitation
type: idea
tags: [mcp, background-session, tooling, workaround]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: []
provenance: source-derived
status: raw
---

# Background Session MCP Limitation

Background worktree sessions may not inherit all globally-configured [[MCP Server]]s. Observed: `mail-mcp` configured in `~/.claude.json`, process running, but `mcp__mail__*` tools absent from the deferred tool list in a background job session.

## Workaround

Direct API calls via Python using the same OAuth2 credentials the MCP server uses. Functionally equivalent to the MCP tool call — same endpoint, same auth, same result.

## Open Question

Is this by design (background sessions get a subset of MCP servers) or a connection race condition? Needs investigation to determine if skills that depend on specific MCP servers should document "requires interactive session" as a prerequisite.

## Related

- [[MCP Server]]
- [[MCP Tool]]
- [[Product Management Skills Plugin]] — meet-email skill hit this limitation

## Sources

- [[Source - FEAT-006 Session Insights]]
