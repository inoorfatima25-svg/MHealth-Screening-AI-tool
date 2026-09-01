'use server';

import { revalidatePath } from 'next/cache';
import { setSessionDeleted } from '@/lib/admin/supabase-admin';

/**
 * Server actions for the admin panel.
 *
 * These run on the server only, so the service-role key stays out of the client
 * bundle. Deletes are SOFT — they set `deleted_at` on every snapshot in the
 * session and can be undone via restoreResponse().
 *
 * Note there is no auth here, matching the rest of the open admin panel. Anyone
 * who can reach /admin can delete responses. Add a check here first if this is
 * ever exposed beyond localhost.
 */

export type ActionResult = { ok: true; affected: number } | { ok: false; error: string };

function revalidateAdmin() {
  revalidatePath('/admin');
  revalidatePath('/admin/responses');
  revalidatePath('/admin/safety');
}

export async function deleteResponse(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing response id' };

  const result = await setSessionDeleted(id, true);
  if (!result.ok) return { ok: false, error: result.message };

  revalidateAdmin();
  return { ok: true, affected: result.data };
}

export async function restoreResponse(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing response id' };

  const result = await setSessionDeleted(id, false);
  if (!result.ok) return { ok: false, error: result.message };

  revalidateAdmin();
  return { ok: true, affected: result.data };
}
