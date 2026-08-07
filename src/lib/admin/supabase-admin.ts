import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ResponseRow } from '@/lib/admin/types';

/**
 * Service-role Supabase client. SERVER ONLY.
 *
 * The `server-only` import above makes the build fail loudly if this module is
 * ever pulled into a client component, so the service key cannot leak into the
 * browser bundle.
 *
 * The service role bypasses RLS — which is required here, because
 * supabase/schema.sql grants `anon` insert + update but NO select policy. The
 * anon key genuinely cannot read responses back.
 */
let cached: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'unconfigured' | 'error'; message: string };

/**
 * Collapses append-only snapshots to one row per participant.
 *
 * The survey INSERTs a fresh snapshot on every save (see lib/supabase.ts), so a
 * single participant produces several rows sharing a `session_id`. The newest
 * row in each group is the complete, current answer set — earlier ones are
 * strict prefixes of it. Rows with a null session_id predate this scheme and
 * are kept as-is.
 *
 * Input must already be sorted newest-first.
 */
function collapseSessions(rows: ResponseRow[]): ResponseRow[] {
  const seen = new Set<string>();
  const out: ResponseRow[] = [];

  for (const row of rows) {
    if (!row.session_id) {
      out.push(row);
      continue;
    }
    if (seen.has(row.session_id)) continue;
    seen.add(row.session_id);
    out.push(row);
  }
  return out;
}

/**
 * Fetches every response, newest first, one row per participant.
 *
 * Soft-deleted sessions are excluded unless `includeDeleted` is set. Filtering
 * happens BEFORE collapsing, so a deleted session never occupies the slot of an
 * active one.
 */
export async function fetchAllResponses(
  { includeDeleted = false }: { includeDeleted?: boolean } = {}
): Promise<FetchResult<ResponseRow[]>> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return {
      ok: false,
      reason: 'unconfigured',
      message:
        'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local and restart the dev server.',
    };
  }

  let query = supabase.from('responses').select('*');
  if (!includeDeleted) query = query.is('deleted_at', null);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) return { ok: false, reason: 'error', message: error.message };
  return { ok: true, data: collapseSessions((data ?? []) as ResponseRow[]) };
}

/**
 * Soft-deletes or restores every snapshot in a session.
 *
 * Marks rows rather than removing them, so the action is always reversible.
 * Matches on session_id OR row id, since pre-migration rows have no session_id.
 * Runs with the service role — `anon` has INSERT only and cannot reach this.
 */
export async function setSessionDeleted(
  id: string,
  deleted: boolean
): Promise<FetchResult<number>> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return {
      ok: false,
      reason: 'unconfigured',
      message: 'SUPABASE_SERVICE_ROLE_KEY is not set.',
    };
  }

  const { data, error } = await supabase
    .from('responses')
    .update({ deleted_at: deleted ? new Date().toISOString() : null })
    .or(`session_id.eq.${id},id.eq.${id}`)
    .select('id');

  if (error) return { ok: false, reason: 'error', message: error.message };
  return { ok: true, data: (data ?? []).length };
}

/**
 * Fetches a single response. `id` may be either a session_id or a row id — the
 * admin list links by session_id, but older rows have none and link by row id.
 * Returns the newest snapshot in either case.
 */
export async function fetchResponseById(id: string): Promise<FetchResult<ResponseRow | null>> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return {
      ok: false,
      reason: 'unconfigured',
      message:
        'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local and restart the dev server.',
    };
  }

  // Newest snapshot for this session, falling back to a direct row-id match.
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .or(`session_id.eq.${id},id.eq.${id}`)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return { ok: false, reason: 'error', message: error.message };
  return { ok: true, data: ((data ?? [])[0] as ResponseRow | undefined) ?? null };
}
