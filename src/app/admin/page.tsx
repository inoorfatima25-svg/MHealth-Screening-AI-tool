import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  CompletedBadge,
  ErrorPanel,
  SafetyIcon,
  StatCard,
  formatDate,
} from '@/components/admin/ui';
import { TOTAL_SECTIONS, sectionTitles } from '@/data/questions-flat';
import { scoreRow } from '@/lib/admin/scoring';
import { fetchAllResponses } from '@/lib/admin/supabase-admin';

// Always read live data — never statically prerender at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Dashboard.
 *
 * Data flow: server component → service-role Supabase → scoreRow() derives
 * PHQ-9/GAD-7/safety per row → aggregates rendered inline. Nothing here ships
 * to the client, so the service key stays on the server.
 */
export default async function AdminDashboard() {
  const result = await fetchAllResponses();
  if (!result.ok) return <ErrorPanel reason={result.reason} message={result.message} />;

  const rows = result.data.map(scoreRow);

  const total = rows.length;
  const completed = rows.filter((r) => r.isCompleted).length;
  const flagged = rows.filter((r) => r.safetyFlag).length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  // Attrition funnel: how many participants actually answered something in each
  // section. Based on stored answers, not the wizard's last_section counter —
  // skipping ahead must not read as 100% coverage.
  const funnel = sectionTitles.map((s) => ({
    ...s,
    count: rows.filter((r) => r.answeredSections.includes(s.number)).length,
  }));

  const recent = rows.slice(0, 10);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          {total} response{total === 1 ? '' : 's'} across {TOTAL_SECTIONS} sections
        </p>
      </div>

      {/* ── Summary ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total responses" value={total} />
        <StatCard label="Completed" value={completed} sublabel={`${completionRate}% completion`} />
        <StatCard label="In progress" value={total - completed} />
        <StatCard
          label="Safety flags"
          value={flagged}
          sublabel="PHQ-9 item 9 > 0"
          tone={flagged > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* ── Attrition funnel ── */}
      <section className="rounded-[20px] border border-line bg-card p-5 shadow-soft">
        <h2 className="text-[15px] font-bold text-ink">Attrition funnel</h2>
        <p className="mt-1 text-[12px] text-ink-soft">
          Participants with at least one answer in each section.
        </p>

        <div className="mt-4 space-y-1.5">
          {funnel.map((s) => {
            const pct = total ? (s.count / total) * 100 : 0;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <span className="w-6 shrink-0 text-end text-[11px] font-bold tabular-nums text-ink-mute">
                  {s.number}
                </span>
                <span className="hidden w-52 shrink-0 truncate text-[12px] text-ink-soft sm:block">
                  {s.titleEn}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded-chip bg-surface-sunken">
                  <div
                    className="h-full rounded-chip bg-gradient-to-r from-primary to-primary-bright"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-end text-[11.5px] font-bold tabular-nums text-ink">
                  {s.count}
                  <span className="ms-1 font-medium text-ink-mute">
                    {Math.round(pct)}%
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Recent ── */}
      <section className="overflow-hidden rounded-[20px] border border-line bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-[15px] font-bold text-ink">Recent responses</h2>
          <Link
            href="/admin/responses"
            className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-ink-mute">No responses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-sunken text-[10.5px] uppercase tracking-wider text-ink-mute">
                <tr>
                  <th className="px-5 py-2.5 text-start font-bold">ID</th>
                  <th className="px-3 py-2.5 text-start font-bold">Started</th>
                  <th className="px-3 py-2.5 text-start font-bold">Sections</th>
                  <th className="px-3 py-2.5 text-start font-bold">Status</th>
                  <th className="px-5 py-2.5 text-start font-bold">Safety</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-line hover:bg-surface-sunken">
                    <td className="px-5 py-2.5">
                      <Link
                        href={`/admin/responses/${r.id}`}
                        className="font-mono text-[12px] font-semibold text-primary hover:underline"
                      >
                        {r.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-ink-soft">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-ink-soft">
                      {r.answeredSectionCount}/{TOTAL_SECTIONS}
                    </td>
                    <td className="px-3 py-2.5">
                      <CompletedBadge status={r.completionStatus} />
                    </td>
                    <td className="px-5 py-2.5">
                      <SafetyIcon flagged={r.safetyFlag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
