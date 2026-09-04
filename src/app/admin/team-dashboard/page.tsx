import { StatCard } from '@/components/admin/ui';
import { ErrorPanel } from '@/components/admin/ui';
import { TOTAL_SECTIONS, sectionTitles } from '@/data/questions-flat';
import { scoreRow } from '@/lib/admin/scoring';
import { fetchAllResponses } from '@/lib/admin/supabase-admin';
import type { ScoreResult } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PHQ9_BANDS: { band: ScoreResult['band']; label: string }[] = [
  { band: 'minimal', label: 'Minimal (0–4)' },
  { band: 'mild', label: 'Mild (5–9)' },
  { band: 'moderate', label: 'Moderate (10–14)' },
  { band: 'moderately-severe', label: 'Mod. severe (15–19)' },
  { band: 'severe', label: 'Severe (20–27)' },
];

const GAD7_BANDS: { band: ScoreResult['band']; label: string }[] = [
  { band: 'minimal', label: 'Minimal (0–4)' },
  { band: 'mild', label: 'Mild (5–9)' },
  { band: 'moderate', label: 'Moderate (10–14)' },
  { band: 'severe', label: 'Severe (15–21)' },
];

function BandBar({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const pct = max ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 truncate text-[12px] text-ink-soft">{label}</span>
      <div className="h-5 flex-1 overflow-hidden rounded-chip bg-surface-sunken">
        <div
          className="h-full rounded-chip bg-gradient-to-r from-primary to-primary-bright"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-end text-[11.5px] font-bold tabular-nums text-ink">
        {count}
      </span>
    </div>
  );
}

/**
 * Team-facing dashboard: totals and trends only.
 *
 * Unlike /admin, this page never renders a participant id, timestamp,
 * device, contact detail, or link into an individual response. It exists so
 * this URL can be shared with the wider team (still behind the admin
 * password from middleware.ts) without anyone seeing a single person's
 * answers — only counts.
 */
export default async function TeamDashboard() {
  const result = await fetchAllResponses();
  if (!result.ok) return <ErrorPanel reason={result.reason} message={result.message} />;

  const rows = result.data.map(scoreRow);

  const total = rows.length;
  const completed = rows.filter((r) => r.isCompleted).length;
  const flagged = rows.filter((r) => r.safetyFlag).length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  const funnel = sectionTitles.map((s) => ({
    ...s,
    count: rows.filter((r) => r.answeredSections.includes(s.number)).length,
  }));

  const phq9Complete = rows.map((r) => r.phq9).filter((s): s is ScoreResult => !!s?.complete);
  const gad7Complete = rows.map((r) => r.gad7).filter((s): s is ScoreResult => !!s?.complete);

  const phq9Counts = PHQ9_BANDS.map((b) => ({
    ...b,
    count: phq9Complete.filter((s) => s.band === b.band).length,
  }));
  const gad7Counts = GAD7_BANDS.map((b) => ({
    ...b,
    count: gad7Complete.filter((s) => s.band === b.band).length,
  }));
  const phq9Max = Math.max(1, ...phq9Counts.map((b) => b.count));
  const gad7Max = Math.max(1, ...gad7Counts.map((b) => b.count));

  // Responses started per day, most recent 14 days that have any data.
  const dayCounts = new Map<string, number>();
  for (const r of rows) {
    if (!r.createdAt) continue;
    const day = r.createdAt.slice(0, 10); // YYYY-MM-DD
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }
  const days = Array.from(dayCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14);
  const dayMax = Math.max(1, ...days.map(([, c]) => c));

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Team dashboard</h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          Aggregate tracking only — no participant IDs, timestamps, or individual answers appear
          on this page.
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
          sublabel="PHQ-9 item 9 > 0 (count only)"
          tone={flagged > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* ── Responses over time ── */}
      {days.length > 0 && (
        <section className="rounded-[20px] border border-line bg-card p-5 shadow-soft">
          <h2 className="text-[15px] font-bold text-ink">Responses per day</h2>
          <p className="mt-1 text-[12px] text-ink-soft">Last {days.length} active day(s).</p>

          <div className="mt-4 flex h-32 items-end gap-1.5">
            {days.map(([day, count]) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-bright"
                    style={{ height: `${(count / dayMax) * 100}%` }}
                    title={`${day}: ${count}`}
                  />
                </div>
                <span className="text-[9px] font-medium text-ink-mute">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  <span className="ms-1 font-medium text-ink-mute">{Math.round(pct)}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Severity distributions ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[20px] border border-line bg-card p-5 shadow-soft">
          <h2 className="text-[15px] font-bold text-ink">PHQ-9 severity</h2>
          <p className="mt-1 text-[12px] text-ink-soft">
            {phq9Complete.length} fully-answered response{phq9Complete.length === 1 ? '' : 's'}.
          </p>
          <div className="mt-4 space-y-1.5">
            {phq9Counts.map((b) => (
              <BandBar key={b.band} label={b.label} count={b.count} max={phq9Max} />
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-line bg-card p-5 shadow-soft">
          <h2 className="text-[15px] font-bold text-ink">GAD-7 severity</h2>
          <p className="mt-1 text-[12px] text-ink-soft">
            {gad7Complete.length} fully-answered response{gad7Complete.length === 1 ? '' : 's'}.
          </p>
          <div className="mt-4 space-y-1.5">
            {gad7Counts.map((b) => (
              <BandBar key={b.band} label={b.label} count={b.count} max={gad7Max} />
            ))}
          </div>
        </section>
      </div>

      <p className="text-[11px] text-ink-faint">
        {TOTAL_SECTIONS} sections total. This page intentionally omits the per-response table —
        see <span className="font-mono">/admin/responses</span> for individual records
        (restricted to those who need clinical/safety follow-up access).
      </p>
    </div>
  );
}
