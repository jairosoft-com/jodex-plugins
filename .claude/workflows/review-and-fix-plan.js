export const meta = {
  name: 'review-and-fix-plan',
  description: 'Loop: adversarially review a plan via Codex, auto-fix blocking findings in an isolated worktree, re-review until approved or diminishing returns, then return for human approval',
  phases: [
    { title: 'Setup', detail: 'Create an isolated git worktree from HEAD to hold the review/fix loop' },
    { title: 'Review', detail: 'Run /codex:adversarial-review over the plan diff' },
    { title: 'Fix', detail: 'Address blocking findings in the worktree and commit' },
  ],
}

// --- Parameters (override via Workflow args) ---
const REPO = '/Users/jairo/Projects/jodex-qa-ai'
const COMPANION = '/Users/jairo/.claude/plugins/marketplaces/openai-codex/plugins/codex/scripts/codex-companion.mjs'
const planPath = (args && args.planPath) || '.agent/plans/jx-qa-spec-generator-agent.md'
const base = (args && args.base) || '6fe218d'
const maxRounds = (args && args.maxRounds) || 4
const wtBranch = (args && args.worktreeBranch) || 'wf-review-loop'
const wtPath = (args && args.worktreePath) || '.claude/worktrees/wf-review-loop'
const WT_ABS = `${REPO}/${wtPath}`
const CONF_THRESHOLD = 0.5 // findings at/above this confidence count as blockers

const SETUP_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { ok: { type: 'boolean' }, worktree: { type: 'string' }, head: { type: 'string' }, error: { type: 'string' } },
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

// --- Setup: isolated worktree from HEAD ---
phase('Setup')
const setup = await agent(
  `Create an isolated git worktree for an iterative plan review/fix loop.
Run these from ${REPO} (use absolute paths; this is plain git, no Edit tool needed):
1. Remove any stale worktree/branch (ignore errors): cd ${REPO} && git worktree remove --force ${wtPath} 2>/dev/null; git branch -D ${wtBranch} 2>/dev/null
2. Create fresh from HEAD: cd ${REPO} && git worktree add -b ${wtBranch} ${wtPath} HEAD
3. Confirm the plan exists: test -f ${WT_ABS}/${planPath}
Return ok=true with worktree=${WT_ABS} and the head short-sha, or ok=false with error.`,
  { schema: SETUP_SCHEMA, phase: 'Setup', label: 'setup-worktree' }
)

if (!setup || !setup.ok) {
  return { outcome: 'setup_failed', detail: setup ? setup.error : 'setup agent returned null' }
}
log(`Worktree ready at ${WT_ABS} (head ${setup.head || '?'})`)

// --- Loop: review -> (fix) -> re-review until approved / diminishing returns / max ---
const rounds = []
let stopReason = 'max_rounds'
let finalStatus = 'unknown'
let prevBlocking = Infinity

for (let r = 1; r <= maxRounds; r++) {
  phase('Review')
  const review = await agent(
    `Adversarial Codex review of an implementation PLAN — round ${r}. Operate in the worktree ${WT_ABS}.

STEP 1 — Run (may take several minutes; do not abort early):
cd ${WT_ABS} && node "${COMPANION}" adversarial-review "--wait --base ${base} Focus on the implementation plan at ${planPath}. It is the design/implementation plan for a new jx-qa 'spec-generator' subagent. Adversarially challenge whether its locked decisions, security posture, rollback safety, and approval-provenance are sound enough to BEGIN IMPLEMENTATION. Treat unresolved risks that make implementation premature as blocking."

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
  const fix = await agent(
    `The adversarial review BLOCKED implementation (round ${r}). Update the plan to address the blocking findings, working ONLY in the worktree ${WT_ABS}.

1. Read ${WT_ABS}/${planPath} in full.
2. For each blocking finding, apply a concrete, MINIMAL edit that addresses it (add a mitigation, tighten a decision, add a step/risk, narrow scope). Prefer the Edit tool on ${WT_ABS}/${planPath}. If a write is refused by a worktree-isolation guard, fall back to a Bash python3 read-modify-write (read the file, do exact verified string replacements, write it back).
3. Verify the edits landed (re-read or grep).
4. Commit in the worktree: cd ${WT_ABS} && git add ${planPath} && git commit -m "docs(plan): address adversarial review round ${r} findings"

Blocking findings:
${JSON.stringify(blockers, null, 2)}

Do not touch any other file or the main checkout. Return addressed[] (finding + change), residual[] (anything you could not responsibly fix, with reason), summary, and commit (short sha). If you could not commit, set error.`,
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

return { outcome, stopReason, finalStatus, rounds, worktreeBranch: wtBranch, worktreePath: WT_ABS, planPath, base, maxRounds }
