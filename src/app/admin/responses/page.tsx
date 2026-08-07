import { ResponsesTable } from '@/components/admin/ResponsesTable';
import { ErrorPanel } from '@/components/admin/ui';
import { scoreRow } from '@/lib/admin/scoring';
import { fetchAllResponses } from '@/lib/admin/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Response list.
 *
 * Data flow: this server component fetches + scores every row (service key
 * never leaves the server), then hands plain serialisable objects to the
 * <ResponsesTable> client component, which owns search and sort state.
 */
export default async function ResponsesPage({
  searchParams,
}: {
  searchParams: { deleted?: string };
}) {
  // ?deleted=1 shows the soft-deleted sessions so they can be restored.
  const showDeleted = searchParams.deleted === '1';

  const result = await fetchAllResponses({ includeDeleted: showDeleted });
  if (!result.ok) return <ErrorPanel reason={result.reason} message={result.message} />;

  const all = result.data.map(scoreRow);
  const rows = showDeleted ? all.filter((r) => r.deletedAt) : all;

  return <ResponsesTable rows={rows} showDeleted={showDeleted} />;
}
