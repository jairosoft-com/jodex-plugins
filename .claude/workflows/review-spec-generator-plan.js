export const meta = {
  name: 'review-spec-generator-plan',
  description: 'Adversarially review the jx-qa spec-generator plan via Codex; if blocking, propose plan fixes; else recommend presenting for approval',
  phases: [
    { title: 'Adversarial Review', detail: 'Run /codex:adversarial-review over the committed plan diff (--base 6fe218d)' },
    { title: 'Address Findings', detail: 'If blocking, propose concrete plan edits to resolve each finding (no file writes)' },
  ],
}

const COMPANION = '/Users/jairo/.claude/plugins/marketplaces/openai-codex/plugins/codex/scripts/codex-companion.mjs'
const REPO = '/Users/jairo/Projects/jodex-qa-ai'
const PLAN = '.agent/plans/jx-qa-spec-generator-agent.md'
const BASE = '6fe218d'

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    status: { type: 'string', enum: ['approve', 'needs-attention', 'error'] },
    blocking: { type: 'boolean' },
    summary: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          file: { type: 'string' },
          line_start: { type: 'number' },
          line_end: { type: 'number' },
          confidence: { type: 'number' },
          what: { type: 'string' },
          why: { type: 'string' },
          impact: { type: 'string' },
          recommendation: { type: 'string' },
        },
        required: ['title', 'recommendation'],
      },
    },
    error: { type: 'string' },
  },
  required: ['status', 'blocking', 'summary', 'findings'],
}

const PROPOSAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    addressed: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          finding: { type: 'string' },
          plan_section: { type: 'string' },
          proposed_change: { type: 'string' },
        },
        required: ['finding', 'proposed_change'],
      },
    },
    residual: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
  required: ['addressed', 'summary'],
}

phase('Adversarial Review')
const review = await agent(
  `You are running an adversarial Codex review of an implementation PLAN and returning a structured verdict.

STEP 1 — Run this exact command from the repo root and capture ALL stdout+stderr (it may take several minutes; do not abort early):
cd ${REPO} && node "${COMPANION}" adversarial-review "--wait --base ${BASE} Focus on the implementation plan at ${PLAN}. It is the design/implementation plan for a new jx-qa 'spec-generator' subagent (a Claude Code plugin agent that turns an approved xlsx test plan into verified Playwright specs). Adversarially challenge whether its locked decisions, security posture (a broad Bash grant governed only by session permissions), and overall approach are sound enough to BEGIN IMPLEMENTATION. Treat unresolved risks that would make implementation premature as blocking."

The command reviews the committed diff ${BASE}..HEAD (the plan plus its supporting wiki-idea edits) and prints Codex's adversarial review.

STEP 2 — Interpret the output and return the structured object:
- If the command failed to run, errored, reported Codex not authenticated / runtime not ready, or produced no usable review → status='error', put the cause in 'error', blocking=false, findings=[].
- Else if Codex concludes there is material risk worth blocking on (a 'needs-attention' verdict / no-ship assessment / one or more material findings) → status='needs-attention', blocking=true.
- Else (Codex finds no substantive adversarial issue / 'approve' / ship) → status='approve', blocking=false.

STEP 3 — Extract each material finding into 'findings' (title, file, line_start, line_end, confidence 0-1, what/why/impact, recommendation). For a plan doc the file is typically ${PLAN}.
STEP 4 — 'summary' = a terse proceed / do-not-proceed-to-implementation assessment in your own words (1-3 sentences).

Do NOT fix anything. Return ONLY the structured object.`,
  { schema: REVIEW_SCHEMA, label: 'codex-adversarial-review', phase: 'Adversarial Review' }
)

if (!review || review.status === 'error') {
  log(`Review did not complete: ${review ? review.error : 'agent returned null'}`)
  return { outcome: 'review_failed', review: review || null }
}

if (!review.blocking) {
  log(`Review verdict: APPROVE — not blocking. ${review.summary}`)
  return { outcome: 'approved', review }
}

log(`Review verdict: NEEDS-ATTENTION — ${review.findings.length} finding(s). Proposing plan fixes.`)
phase('Address Findings')
const proposed = await agent(
  `The adversarial review BLOCKED implementation of the plan at ${PLAN}. Read that file in full (absolute path: ${REPO}/${PLAN}).

For each blocking finding below, propose a concrete, MINIMAL edit to the plan that ADDRESSES it (e.g., add a mitigation, tighten a locked decision, add a step or risk, narrow scope). Do NOT edit any files — only return proposed changes so a human can apply them.

Blocking findings:
${JSON.stringify(review.findings, null, 2)}

For each: name the finding, the plan section to change, and the exact proposed new/updated text. Put any finding you cannot responsibly address into 'residual' with the reason. Return ONLY the structured object.`,
  { schema: PROPOSAL_SCHEMA, label: 'propose-plan-fixes', phase: 'Address Findings' }
)

return { outcome: 'needs_changes', review, proposed }