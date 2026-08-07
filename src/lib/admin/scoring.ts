/**
 * Server-safe scoring for the admin panel.
 *
 * IMPORTANT — how answers are actually stored:
 * PHQ-9 and GAD-7 are `likert_grid` questions, so they are NOT flat keys like
 * `phq9_1`. Each is a single jsonb object:
 *
 *   answers.phq9_grid = { phq9_i1: "0", phq9_i2: "3", … phq9_i9: "1" }
 *   answers.gad7_grid = { gad7_i1: "2", … gad7_i7: "0" }
 *
 * Values are STRINGS ("0".."3") because the option `value` fields are strings,
 * so every read goes through Number().
 *
 * We recompute from `answers` rather than trusting the stored `phq9_score` /
 * `gad7_score` columns: those are only written on final submit, so partially
 * completed rows have them null.
 */
import { flattenedQuestions } from '@/data/questions-flat';
import type { ResponseRow, ScoreResult, ScoredResponse } from '@/lib/admin/types';

/** question id → 1-based section number, for answer-based section coverage. */
const SECTION_OF_QUESTION: Record<string, number> = Object.fromEntries(
  flattenedQuestions.filter((q) => !q.parentId).map((q) => [q.id, q.section])
);

export const PHQ9_GRID_ID = 'phq9_grid';
export const GAD7_GRID_ID = 'gad7_grid';
export const PHQ9_ITEM9_ID = 'phq9_i9';
/** Section 18's `contact_dual` question — stores { phone, email } */
export const CONTACT_QUESTION_ID = 's18_q1';

const PHQ9_ITEMS = Array.from({ length: 9 }, (_, i) => `phq9_i${i + 1}`);
const GAD7_ITEMS = Array.from({ length: 7 }, (_, i) => `gad7_i${i + 1}`);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** Reads one grid cell as a number; returns null when unanswered. */
function itemScore(grid: Record<string, unknown> | null, itemId: string): number | null {
  if (!grid) return null;
  const raw = grid[itemId];
  if (raw === undefined || raw === null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function sumGrid(
  answers: Record<string, unknown> | null,
  gridId: string,
  itemIds: string[]
): { score: number; answered: number; total: number } {
  const grid = asRecord(answers?.[gridId]);
  let score = 0;
  let answered = 0;
  for (const itemId of itemIds) {
    const n = itemScore(grid, itemId);
    if (n !== null) {
      score += n;
      answered += 1;
    }
  }
  return { score, answered, total: itemIds.length };
}

// ─── Severity bands (standard clinical cut-offs) ────────────────────────────
function phq9Severity(score: number): Pick<ScoreResult, 'severity' | 'band'> {
  if (score <= 4) return { severity: 'Minimal depression (0–4)', band: 'minimal' };
  if (score <= 9) return { severity: 'Mild depression (5–9)', band: 'mild' };
  if (score <= 14) return { severity: 'Moderate depression (10–14)', band: 'moderate' };
  if (score <= 19)
    return { severity: 'Moderately severe depression (15–19)', band: 'moderately-severe' };
  return { severity: 'Severe depression (20–27)', band: 'severe' };
}

function gad7Severity(score: number): Pick<ScoreResult, 'severity' | 'band'> {
  if (score <= 4) return { severity: 'Minimal anxiety (0–4)', band: 'minimal' };
  if (score <= 9) return { severity: 'Mild anxiety (5–9)', band: 'mild' };
  if (score <= 14) return { severity: 'Moderate anxiety (10–14)', band: 'moderate' };
  return { severity: 'Severe anxiety (15–21)', band: 'severe' };
}

export function computePHQ9(answers: Record<string, unknown> | null): ScoreResult | null {
  const { score, answered, total } = sumGrid(answers, PHQ9_GRID_ID, PHQ9_ITEMS);
  if (answered === 0) return null;
  return { score, answered, total, complete: answered === total, ...phq9Severity(score) };
}

export function computeGAD7(answers: Record<string, unknown> | null): ScoreResult | null {
  const { score, answered, total } = sumGrid(answers, GAD7_GRID_ID, GAD7_ITEMS);
  if (answered === 0) return null;
  return { score, answered, total, complete: answered === total, ...gad7Severity(score) };
}

/** PHQ-9 item 9 — the suicidal-ideation item. Returns null if unanswered. */
export function getPHQ9Item9(answers: Record<string, unknown> | null): number | null {
  return itemScore(asRecord(answers?.[PHQ9_GRID_ID]), PHQ9_ITEM9_ID);
}

/** Optional contact details from the section-18 `contact_dual` question. */
export function getContact(answers: Record<string, unknown> | null): {
  email: string | null;
  phone: string | null;
} {
  const contact = asRecord(answers?.[CONTACT_QUESTION_ID]);
  const read = (k: string) => {
    const v = contact?.[k];
    return typeof v === 'string' && v.trim() ? v.trim() : null;
  };
  return { email: read('email'), phone: read('phone') };
}

/**
 * `last_section` is written by the survey as `sectionIndex + 2` when crossing a
 * boundary, and `TOTAL_SECTIONS + 1` on submit. So the number of sections a
 * participant actually finished is `last_section - 1`.
 */
export function sectionsCompletedFrom(lastSection: number | null): number {
  if (lastSection === null || lastSection === undefined) return 0;
  return Math.max(0, lastSection - 1);
}

/**
 * Section numbers the participant actually answered at least one question in.
 *
 * `last_section` only tracks how far the wizard advanced — it is set to
 * TOTAL_SECTIONS + 1 on submit even if the participant skipped ahead via the
 * section navigator and left later sections blank. Counting real answers is the
 * honest basis for the attrition funnel.
 */
export function answeredSections(answers: Record<string, unknown> | null): number[] {
  const found = new Set<number>();
  if (!answers) return [];

  for (const [key, value] of Object.entries(answers)) {
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    // An empty grid / contact object is not an answer.
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (Object.values(value as Record<string, unknown>).every((v) => v === '' || v == null)) {
        continue;
      }
    }
    const section = SECTION_OF_QUESTION[key];
    if (section) found.add(section);
  }
  return Array.from(found).sort((a, b) => a - b);
}

/** Turns a raw DB row into everything the admin UI needs. */
export function scoreRow(row: ResponseRow): ScoredResponse {
  const answers = row.answers ?? null;
  const phq9Item9 = getPHQ9Item9(answers);
  const sectionsWithAnswers = answeredSections(answers);

  return {
    // Prefer the session id: it is stable across a participant's snapshots and
    // is what detail links resolve. Falls back to row id for pre-migration rows.
    id: row.session_id ?? row.id,
    createdAt: row.created_at,
    completionStatus: row.completion_status ?? 'in_progress',
    isCompleted: row.completion_status === 'completed',
    lastSection: row.last_section,
    sectionsCompleted: sectionsCompletedFrom(row.last_section),
    answeredSections: sectionsWithAnswers,
    answeredSectionCount: sectionsWithAnswers.length,
    answerCount: answers ? Object.keys(answers).length : 0,
    deviceInfo: row.device_info,
    durationSeconds: row.duration_seconds,
    phq9: computePHQ9(answers),
    gad7: computeGAD7(answers),
    // Trust the live answer first; fall back to the stored flag for old rows.
    safetyFlag: phq9Item9 !== null ? phq9Item9 > 0 : Boolean(row.phq9_item9_flag),
    phq9Item9,
    safetyFollowUp: row.safety_followup,
    contact: getContact(answers),
    deletedAt: row.deleted_at,
  };
}
