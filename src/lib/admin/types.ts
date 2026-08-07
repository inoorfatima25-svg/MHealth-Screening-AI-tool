/**
 * Shape of a row in the `responses` table, as actually defined in
 * supabase/schema.sql and written by src/lib/supabase.ts.
 */
export interface ResponseRow {
  id: string;
  /**
   * Groups the append-only snapshots belonging to one participant. Null on rows
   * written before the append-only migration — those are treated as standalone.
   */
  session_id: string | null;
  created_at: string | null;
  consent_name: string | null;
  consent_date: string | null;
  /** All survey answers, keyed by question id */
  answers: Record<string, unknown> | null;
  gad7_score: number | null;
  phq9_score: number | null;
  phq9_item9_flag: boolean | null;
  safety_followup: string | null;
  completion_status: 'in_progress' | 'completed' | 'abandoned' | string | null;
  last_section: number | null;
  device_info: string | null;
  duration_seconds: number | null;
  /** Soft-delete marker. Null means active. */
  deleted_at: string | null;
}

/** A row plus everything the admin UI derives from it. */
export interface ScoredResponse {
  id: string;
  createdAt: string | null;
  completionStatus: string;
  isCompleted: boolean;
  lastSection: number | null;
  /** How far the wizard advanced (see scoring.ts) — not proof of answers */
  sectionsCompleted: number;
  /**
   * Section numbers with at least one real answer — the honest coverage.
   * A plain array, not a Set: this crosses the server→client boundary as props.
   */
  answeredSections: number[];
  /** Count of sections actually answered */
  answeredSectionCount: number;
  /** Total answered questions */
  answerCount: number;
  deviceInfo: string | null;
  durationSeconds: number | null;
  phq9: ScoreResult | null;
  gad7: ScoreResult | null;
  safetyFlag: boolean;
  phq9Item9: number | null;
  safetyFollowUp: string | null;
  contact: { email: string | null; phone: string | null };
  /** ISO timestamp when soft-deleted, or null if active */
  deletedAt: string | null;
}

export interface ScoreResult {
  score: number;
  /** Items answered out of the total the instrument expects */
  answered: number;
  total: number;
  /** True when every item was answered — a partial sum is not a valid score */
  complete: boolean;
  severity: string;
  band: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
}
