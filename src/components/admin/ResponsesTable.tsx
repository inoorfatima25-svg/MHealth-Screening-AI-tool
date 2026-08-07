'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, Download, RotateCcw, Search, Trash2 } from 'lucide-react';
import { deleteResponse, restoreResponse } from '@/app/admin/actions';
import {
  CompletedBadge,
  SafetyIcon,
  ScoreCell,
  formatDate,
  formatDuration,
} from '@/components/admin/ui';
import { TOTAL_SECTIONS } from '@/data/questions-flat';
import type { ScoredResponse } from '@/lib/admin/types';

type SortKey = 'created' | 'sections' | 'phq9' | 'gad7';

const COLUMNS: { key: SortKey | null; label: string; className?: string }[] = [
  { key: null, label: 'ID' },
  { key: 'created', label: 'Started' },
  { key: 'sections', label: 'Sections' },
  { key: null, label: 'Status' },
  { key: null, label: 'Safety' },
  { key: 'phq9', label: 'PHQ-9' },
  { key: 'gad7', label: 'GAD-7' },
  { key: null, label: 'Duration' },
  { key: null, label: '' },
];

export function ResponsesTable({
  rows,
  showDeleted = false,
}: {
  rows: ScoredResponse[];
  showDeleted?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created');
  const [ascending, setAscending] = useState(false);
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // Two-step delete: the first click arms the row, the second commits. Avoids a
  // modal while still making an accidental single click harmless.
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const runAction = (id: string, action: typeof deleteResponse) => {
    setError(null);
    startTransition(async () => {
      const res = await action(id);
      if (!res.ok) setError(res.error);
      else router.refresh();
      setConfirmId(null);
    });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = rows.filter((r) => {
      if (onlyFlagged && !r.safetyFlag) return false;
      if (!q) return true;
      // Match on the uuid — full or the 8-char prefix shown in the table.
      return r.id.toLowerCase().includes(q);
    });

    const dir = ascending ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'sections':
          return (a.answeredSectionCount - b.answeredSectionCount) * dir;
        case 'phq9':
          return ((a.phq9?.score ?? -1) - (b.phq9?.score ?? -1)) * dir;
        case 'gad7':
          return ((a.gad7?.score ?? -1) - (b.gad7?.score ?? -1)) * dir;
        default: {
          const at = a.createdAt ? Date.parse(a.createdAt) : 0;
          const bt = b.createdAt ? Date.parse(b.createdAt) : 0;
          return (at - bt) * dir;
        }
      }
    });
  }, [rows, query, sortKey, ascending, onlyFlagged]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAscending((v) => !v);
    else {
      setSortKey(key);
      setAscending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">
            {showDeleted ? 'Deleted responses' : 'Responses'}
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            Showing {visible.length} of {rows.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={showDeleted ? '/admin/responses' : '/admin/responses?deleted=1'}
            className="tap flex items-center gap-1.5 rounded-card border border-line bg-card px-3.5 py-2 text-[13px] font-semibold text-ink-soft shadow-soft hover:text-ink"
          >
            {showDeleted ? <RotateCcw className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
            {showDeleted ? 'Back to active' : 'Deleted'}
          </Link>
          <a
            href="/api/admin/export"
            className="tap flex items-center gap-1.5 rounded-card border border-line bg-card px-3.5 py-2 text-[13px] font-semibold text-ink-soft shadow-soft hover:text-ink"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </a>
        </div>
      </div>

      {error && (
        <p className="rounded-card border border-[#E4B4AA] bg-[#FDF1EE] px-4 py-2.5 text-[12.5px] text-[#8C2F1B]">
          {error}
        </p>
      )}

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by response ID…"
            className="h-11 w-full rounded-card border border-line bg-card ps-10 pe-4 text-[13px] text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-primary focus:shadow-[0_0_0_4px_rgba(27,164,127,0.12)]"
          />
        </div>

        <label className="tap flex cursor-pointer items-center gap-2 rounded-card border border-line bg-card px-3.5 py-2.5 text-[12.5px] font-semibold text-ink-soft">
          <input
            type="checkbox"
            checked={onlyFlagged}
            onChange={(e) => setOnlyFlagged(e.target.checked)}
            className="h-4 w-4 accent-[#C2452A]"
          />
          Safety flagged only
        </label>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-[20px] border border-line bg-card shadow-soft">
        {visible.length === 0 ? (
          <p className="px-5 py-14 text-center text-[13px] text-ink-mute">
            {rows.length === 0
              ? showDeleted
                ? 'No deleted responses.'
                : 'No responses yet.'
              : 'No responses match this filter.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-sunken text-[10.5px] uppercase tracking-wider text-ink-mute">
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col.label} className="px-4 py-2.5 text-start font-bold">
                      {col.key ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key as SortKey)}
                          className="flex items-center gap-1 uppercase tracking-wider hover:text-ink"
                        >
                          {col.label}
                          <ArrowUpDown
                            className={`h-3 w-3 ${
                              sortKey === col.key ? 'text-primary' : 'text-ink-faint'
                            }`}
                          />
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/admin/responses/${r.id}`)}
                    className="cursor-pointer border-t border-line transition-colors hover:bg-surface-sunken"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/responses/${r.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-[12px] font-semibold text-primary hover:underline"
                      >
                        {r.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink-soft">
                      {r.answeredSectionCount}/{TOTAL_SECTIONS}
                    </td>
                    <td className="px-4 py-3">
                      <CompletedBadge status={r.completionStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <SafetyIcon flagged={r.safetyFlag} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreCell result={r.phq9} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreCell result={r.gad7} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-mute">
                      {formatDuration(r.durationSeconds)}
                    </td>
                    <td
                      className="whitespace-nowrap px-4 py-3 text-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {showDeleted ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => runAction(r.id, restoreResponse)}
                          className="tap inline-flex items-center gap-1.5 rounded-card border border-line px-2.5 py-1.5 text-[12px] font-semibold text-ink-soft hover:text-ink disabled:opacity-40"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Restore
                        </button>
                      ) : confirmId === r.id ? (
                        <span className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => runAction(r.id, deleteResponse)}
                            className="tap rounded-card bg-[#C2452A] px-2.5 py-1.5 text-[12px] font-bold text-white disabled:opacity-40"
                          >
                            {pending ? 'Deleting…' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="tap rounded-card border border-line px-2.5 py-1.5 text-[12px] font-semibold text-ink-soft hover:text-ink"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          aria-label="Delete response"
                          onClick={() => setConfirmId(r.id)}
                          className="tap rounded-card border border-transparent p-1.5 text-ink-faint hover:border-line hover:text-[#C2452A]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
