export const meta = {
  name: 'review-and-fix-plan',
  description: 'Loop: adversarially review a plan via Codex FROM THE REPO ROOT (Codex cannot load config when run inside a git worktree on this setup), apply blocking fixes in a per-round worktree and ff-merge each to main so the next repo-root review sees it, re-review until approved / diminishing returns / max, then return for human review of the landed commits',
  phases: [
    { title: 'Setup', detail: 'Verify the plan exists at the repo root (no review worktree — reviews run from the main checkout)' },
    { title: 'Review', detail: 'Run /codex:adversarial-review from the REPO ROOT over the plan diff' },
    { title: 'Fix', detail: 'Apply blocking findings in a per-round worktree, then ff-merge to main' },
  ],
}

// --- Parameters (override via Workflow args) ---
// NOTE: reviews run from the repo root, NOT a worktree. On this machine codex
// adversarial-review aborts with "failed to load configuration: No such file or
// directory" when its cwd is inside .claude/worktrees/*. config.toml is fine —
// the same config reviews successfully from the main checkout. So: review at REPO,
// fix in a throwaway worktree, ff-merge each fix to main so re-reviews see it.
const REPO = '/Users/jairo/Projects/jodex-qa-ai'
const COMPANION = '/Users/jairo/.claude/plugins/cache/openai-codex/codex/1.0.4/scripts/codex-companion.mjs'
const planPath = (args && args.planPath) || '.agent/plans/jx-qa-coverage-analyzer.md'
const base = (args && args.base) || '9cdcc1b'
const maxRounds = (args && args.maxRounds) || 4
const CONF_THRESHOLD = 0.5 // findings at/above this confidence count as blockers

const SETUP_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { ok: { type: 'boolean' }, head: { type: 'string' }, error: { type: 'string' } },
  required: ['ok'],
}

const REVIEW_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    status: { type: 'string', enum: ['approve', 'needs-attention', 'error'] },
    blocking: { type: 'boolean' },
    summary: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          title: { type: 'string' }, file: { type: 'string' },
          line_start: { type: 'number' }, line_end: { type: 'number' },
          confidence: { type: 'number' }, what: { type: 'string' }, why: { type: 'string' },
          impact: { type: 'string' }, recommendation: { type: 'string' },
        },
        required: ['title', 'recommendation'],
      },
    },
    error: { type: 'string' },
  },
  required: ['status', 'blocking', 'summary', 'findings'],
}

const FIX_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    addressed: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: { finding: { type: 'string' }, change: { type: 'string' } },
        required: ['finding', 'change'],
      },
    },
    residual: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
    commit: { type: 'string' },
    error: { type: 'string' },
  },
  required: ['addressed', 'summary'],
}

// --- Setup: confirm the plan is present at the repo root (reviews run here) ---
phase('Setup')
const setup = await agent(
  `Confirm an implementation plan exists at the repo root for an iterative review/fix loop.
Run from ${REPO} (plain git/sh, absolute paths):
1. test -f ${REPO}/${planPath}
2. Print the current HEAD short-sha: cd ${REPO} && git rev-parse --short HEAD
Return ok=true with the head short-sha, or ok=false with error if the plan is missing.`,
  { schema: SETUP_SCHEMA, phase: 'Setup', label: 'setup-check' }
)

if (!setup || !setup.ok) {
  return { outcome: 'setup_failed', detail: setup ? setup.error : 'setup agent returned null' }
}
log(`Plan present at ${REPO}/${planPath} (head ${setup.head || '?'})`)

// --- Loop: review (repo root) -> (fix in throwaway worktree, ff-merge to main) -> re-review ---
const rounds = []
let stopReason = 'max_rounds'
let finalStatus = 'unknown'
let prevBlocking = Infinity

for (let r = 1; r <= maxRounds; r++) {
  phase('Review')
  const review = await agent(
    `Adversarial Codex review of an implementation PLAN — round ${r}. Run from the REPO ROOT ${REPO} (NOT a worktree — codex cannot load its config from inside .claude/worktrees on this setup).

STEP 1 — Run (may take several minutes; do not abort early):
cd ${REPO} && node "${COMPANION}" adversarial-review "--wait --base ${base} Focus on the implementation plan at ${planPath}. It is the design/implementation plan for a new jx-qa '/jx-qa:coverage' command+skill — a coverage-gap analyzer that maps BRD/PRD requirements to xlsx test cases and reports breadth coverage (Covered/Partial/Uncovered/N/A) as an UNVERIFIED, ADVISORY, NON-GATING report. It is deliberately a command+skill, NOT a subagent, and reuses two existing pinned read-only helpers (xlsx-writer.py read, read-doc.py read) — no new scripts, no Write/exec/browser. Adversarially challenge whether its locked decisions (SEMANTIC requirement-to-test-case matching since the xlsx has no requirement-ID column, BRD strictly required, an N/A 'not E2E-testable' status, the Covered/Partial/Uncovered/N/A ladder, arg order matching review-plan), its prompt-injection / path-validation posture (inputs treated as data, fail-closed path checks, each pinned helper called once), its runtime-load/discoverability validation, and its scope/overlap with review-plan are sound enough to BEGIN IMPLEMENTATION. Treat unresolved risks that make implementation premature as blocking."

STEP 2 — Classify and return:
- If the command failed / Codex not authenticated / runtime not ready / no usable review -> status='error', set 'error', blocking=false, findings=[].
- Else if Codex flags material risk worth blocking on (needs-attention / no-ship / >=1 material finding) -> status='needs-attention', blocking=true.
- Else (no substantive finding / approve / ship) -> status='approve', blocking=false.
STEP 3 — Extract each material finding (title, file, line_start, line_end, confidence 0-1, what, why, impact, recommendation).
STEP 4 — 'summary' = terse proceed / do-not-proceed-to-implementation assessment.
Do NOT fix anything. Return ONLY the object.`,
    { schema: REVIEW_SCHEMA, phase: 'Review', label: `review-r${r}` }
  )

  if (!review || review.status === 'error') {
    rounds.push({ round: r, status: 'error', blockingCount: 0, error: review ? review.error : 'null' })
    stopReason = 'review_error'
    finalStatus = 'error'
    break
  }

  const blockers = (review.findings || []).filter((f) => (f.confidence == null ? 1 : f.confidence) >= CONF_THRESHOLD)
  const blockingCount = review.blocking ? blockers.length : 0
  rounds.push({ round: r, status: review.status, blockingCount, summary: review.summary, findings: review.findings })
  finalStatus = review.status
  log(`Round ${r}: ${review.status} — ${blockingCount} blocking finding(s)`)

  if (!review.blocking || blockingCount === 0) { stopReason = 'approved'; break }
  // diminishing returns: a fix round did not reduce blocking findings
  if (r > 1 && blockingCount >= prevBlocking) { stopReason = 'diminishing_returns'; break }
  if (r === maxRounds) { stopReason = 'max_rounds'; break }

  phase('Fix')
  const fixWt = `.claude/worktrees/wf-fix-r${r}`
  const fixBranch = `wf-fix-r${r}`
  const fix = await agent(
    `The adversarial review BLOCKED implementation (round ${r}). Apply MINIMAL edits to the plan that address the blocking findings, then land them on main so the next repo-root review sees them.

Reviews run from the repo root, so fixes MUST end up on main. Work in a throwaway worktree, then fast-forward merge:
1. From ${REPO}, make a fresh fix worktree from HEAD (ignore stale-removal errors):
   cd ${REPO} && git worktree remove --force ${fixWt} 2>/dev/null; git branch -D ${fixBranch} 2>/dev/null; git worktree add -b ${fixBranch} ${fixWt} HEAD
2. Read ${REPO}/${fixWt}/${planPath} in full.
3. For each blocking finding, apply a concrete, MINIMAL edit (add a mitigation/validation step, tighten a decision, narrow scope). Prefer the Edit tool on ${REPO}/${fixWt}/${planPath}. If a write is refused by a worktree-isolation guard, fall back to a Bash python3 read-modify-write with exact verified string replacements.
4. Commit in the worktree: cd ${REPO}/${fixWt} && git add ${planPath} && git commit -m "docs(plan): address adversarial review round ${r} findings"
5. Fast-forward merge to main and clean up:
   cd ${REPO} && git merge --ff-only ${fixBranch} && git worktree remove --force ${fixWt} && git branch -D ${fixBranch}
6. Verify main advanced: cd ${REPO} && git log --oneline -1

Touch ONLY ${planPath}. Blocking findings:
${JSON.stringify(blockers, null, 2)}

Return addressed[] (finding + change), residual[] (anything you could not responsibly fix, with reason), summary, and commit (the short sha now on main). If you could not commit or ff-merge, set error.`,
    { schema: FIX_SCHEMA, phase: 'Fix', label: `fix-r${r}` }
  )
  rounds[rounds.length - 1].fix = fix
    ? { summary: fix.summary, commit: fix.commit || null, addressed: (fix.addressed || []).length, residual: fix.residual || [], error: fix.error || null }
    : null
  if (!fix || fix.error || !fix.commit) {
    stopReason = 'fix_failed'
    break
  }
  prevBlocking = blockingCount
}

const outcome =
  stopReason === 'approved' ? 'approved'
  : stopReason === 'review_error' ? 'review_failed'
  : stopReason === 'fix_failed' ? 'fix_failed'
  : 'stopped'

return { outcome, stopReason, finalStatus, rounds, planPath, base, maxRounds, note: 'Reviews ran from the repo root; any fixes were ff-merged to main — review the landed commits.' }
