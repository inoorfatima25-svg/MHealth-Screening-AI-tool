import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AnswerValue, ConsentData, SafetyFollowUpChoice } from '@/types/survey';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

export interface SaveResponsePayload {
  /**
   * Stable id for this participant's session. Reused across every save so the
   * admin panel can collapse the append-only rows back into one response.
   */
  id?: string;
  consent: ConsentData;
  answers: Record<string, AnswerValue>;
  lastSection: number;
  completionStatus: 'in_progress' | 'completed' | 'abandoned';
  gad7Score?: number;
  phq9Score?: number;
  phq9Item9Flag?: boolean;
  safetyFollowUp?: SafetyFollowUpChoice | null;
  durationSeconds?: number;
  deviceInfo?: string;
}

/** Generates a client-side uuid (session id / row id). */
function newResponseId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older browsers / insecure origins where randomUUID is absent.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Appends a snapshot of the current answers.
 *
 * RLS model: `anon` has INSERT only — no SELECT, no UPDATE. Participants can
 * write but can never read anyone's data, and the anon key ships in the browser
 * bundle so that matters. Three consequences shape this function:
 *
 *   1. No `Prefer: return=representation` — returning the row needs SELECT.
 *   2. No `.upsert()` — ON CONFLICT must look up the existing row, needs SELECT.
 *   3. No `.update()` — the WHERE clause must find the row, needs SELECT. This
 *      one fails *silently*: PostgREST returns 204 with 0 rows affected.
 *
 * So every save INSERTs a fresh row carrying the same `session_id`. Each row is
 * a complete snapshot of all answers so far, and the admin panel keeps only the
 * newest row per session. Returns the session id for the caller to reuse.
 */
export async function upsertResponse(payload: SaveResponsePayload): Promise<string | null> {
  const supabase = getSupabase();
  const sessionId = payload.id ?? newResponseId();

  if (!supabase) return sessionId;

  const row = {
    // Fresh primary key per snapshot; session_id is what ties them together.
    id: newResponseId(),
    session_id: sessionId,
    consent_name: payload.consent.name,
    consent_date: payload.consent.date,
    answers: payload.answers,
    last_section: payload.lastSection,
    completion_status: payload.completionStatus,
    gad7_score: payload.gad7Score ?? null,
    phq9_score: payload.phq9Score ?? null,
    phq9_item9_flag: payload.phq9Item9Flag ?? false,
    safety_followup: payload.safetyFollowUp ?? null,
    duration_seconds: payload.durationSeconds ?? null,
    device_info: payload.deviceInfo ?? null,
  };

  // No .select() chained — supabase-js v2 defaults to Prefer: return=minimal,
  // so nothing is read back and no SELECT policy is required.
  const { error } = await supabase.from('responses').insert(row);

  if (error) {
    console.error('Supabase save error:', error.message);
    return sessionId;
  }

  return sessionId;
}
