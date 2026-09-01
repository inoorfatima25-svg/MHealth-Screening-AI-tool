import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone, ShieldAlert } from 'lucide-react';
import {
  CompletedBadge,
  ErrorPanel,
  formatDate,
  formatDuration,
} from '@/components/admin/ui';
import { TOTAL_SECTIONS, questionsById, sectionTitles } from '@/data/questions-flat';
import { PHQ9_GRID_ID, PHQ9_ITEM9_ID, scoreRow } from '@/lib/admin/scoring';
import { fetchResponseById } from '@/lib/admin/supabase-admin';
import { flattenAnswers } from '@/lib/admin/csv';
import type { ScoreResult } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Renders a single answer value in a readable way. */
function renderValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function ScorePanel({ title, result }: { title: string; result: ScoreResult | null }) {
  if (!result) {
    return (
      <div className="rounded-[20px] border border-line bg-card p-4 shadow-soft">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-mute">{title}</p>
        <p className="mt-2 text-[13px] text-ink-mute">Not answered</p>
      </div>
    );
  }

  const tone =
    result.band === 'severe' || result.band === 'moderately-severe'
      ? 'text-danger'
      : result.band === 'moderate'
        ? 'text-coral'
        : 'text-ink';

  return (
    <div className="rounded-[20px] border border-line bg-card p-4 shadow-soft">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-mute">{title}</p>
      <p className={`mt-1.5 text-[28px] font-bold leading-none tabular-nums ${tone}`}>
        {result.score}
      </p>
      <p className="mt-1.5 text-[12px] font-medium text-ink-soft">{result.severity}</p>
      {!result.complete && (
        <p className="mt-1.5 text-[11px] font-semibold text-coral">
          Partial — {result.answered}/{result.total} items answered; not a valid total.
        </p>
      )}
    </div>
  );
}

/**
 * Response detail.
 *
 * Data flow: fetch one row by uuid → scoreRow() for the header metrics →
 * flattenAnswers() turns nested grids into dotted paths (`phq9_grid.phq9_i9`)
 * which are then labelled via `questionsById` and grouped by section number.
 */
export default async function ResponseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await fetchResponseById(params.id);
  if (!result.ok) return <ErrorPanel reason={result.reason} message={result.message} />;
  if (!result.data) notFound();

  const row = result.data;
  const scored = scoreRow(row);

  // Flatten to dotted paths, then attach the question metadata for each key.
  const flat = flattenAnswers(row.answers ?? null);
  const entries = Object.entries(flat).map(([key, value]) => {
    const meta = questionsById[key];
    return {
      key,
      value,
      section: meta?.section ?? 0,
      label: meta?.text ?? key,
      labelUr: meta?.textUr ?? null,
      known: Boolean(meta),
    };
  });

  // Group by section number; unknown keys land in a trailing "Unmapped" group.
  const grouped = sectionTitles
    .map((s) => ({
      number: s.number,
      title: s.titleEn,
      titleUr: s.titleUr,
      items: entries.filter((e) => e.section === s.number),
    }))
    .filter((g) => g.items.length > 0);

  const unmapped = entries.filter((e) => !e.known);

  const { email, phone } = scored.contact;
  const hasContact = Boolean(email || phone);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/responses"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to list
      </Link>

      {/* ── Metadata ── */}
      <div className="rounded-[20px] border border-line bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-[19px] font-bold tracking-tight text-ink">{row.id}</h1>
          <CompletedBadge status={scored.completionStatus} />
          {scored.safetyFlag && (
            <span className="inline-flex items-center gap-1.5 rounded-chip bg-danger-light px-2.5 py-1 text-[11.5px] font-bold text-danger">
              <ShieldAlert className="h-3.5 w-3.5" />
              Safety flag
            </span>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[12.5px] lg:grid-cols-4">
          {[
            ['Started', formatDate(scored.createdAt)],
            ['Sections answered', `${scored.answeredSectionCount} / ${TOTAL_SECTIONS}`],
            ['Questions answered', String(scored.answerCount)],
            ['Duration', formatDuration(scored.durationSeconds)],
            ['Safety follow-up', scored.safetyFollowUp ?? '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10.5px] font-bold uppercase tracking-wider text-ink-mute">
                {k}
              </dt>
              <dd className="mt-0.5 font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        {scored.deviceInfo && (
          <p className="mt-4 break-all border-t border-line pt-3 text-[11px] leading-relaxed text-ink-mute">
            <span className="font-bold uppercase tracking-wider">Device</span>{' '}
            {scored.deviceInfo}
          </p>
        )}
      </div>

      {/* ── Scores ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <ScorePanel title="PHQ-9 (Depression)" result={scored.phq9} />
        <ScorePanel title="GAD-7 (Anxiety)" result={scored.gad7} />
      </div>

      {/* ── Contact (only when the participant opted in) ── */}
      {hasContact && (
        <div className="rounded-[20px] border border-primary/25 bg-primary-light p-5">
          <h2 className="text-[15px] font-bold text-primary-dark">Contact information</h2>
          <p className="mt-1 text-[12px] text-ink-soft">
            Voluntarily provided in section 18 for follow-up.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 font-semibold text-primary-dark hover:underline"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 font-semibold text-primary-dark hover:underline"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Answers by section ── */}
      {grouped.map((group) => (
        <section
          key={group.number}
          className="overflow-hidden rounded-[20px] border border-line bg-card shadow-soft"
        >
          <div className="flex items-baseline gap-2.5 border-b border-line bg-surface-sunken px-5 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10.5px] font-bold text-white">
              {group.number}
            </span>
            <h2 className="text-[14px] font-bold text-ink">{group.title}</h2>
            <span className="font-urdu text-[12px] text-ink-mute" dir="rtl">
              {group.titleUr}
            </span>
          </div>

          <div className="divide-y divide-line">
            {group.items.map((item) => {
              // Highlight PHQ-9 item 9 when endorsed.
              const isItem9 = item.key === `${PHQ9_GRID_ID}.${PHQ9_ITEM9_ID}`;
              const endorsed = isItem9 && Number(item.value) > 0;

              return (
                <div
                  key={item.key}
                  className={`grid gap-1 px-5 py-3 sm:grid-cols-[1fr_160px] sm:gap-4 ${
                    endorsed ? 'bg-danger-light' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] leading-snug ${
                        endorsed ? 'font-semibold text-danger' : 'text-ink'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[10.5px] text-ink-faint">{item.key}</p>
                  </div>
                  <p
                    className={`text-[13px] font-semibold sm:text-end ${
                      endorsed ? 'text-danger' : 'text-ink-soft'
                    }`}
                  >
                    {renderValue(item.value)}
                    {endorsed && (
                      <span className="ms-2 inline-flex items-center gap-1 text-[11px] font-bold">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Risk
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Keys with no matching question definition — surfaced rather than hidden */}
      {unmapped.length > 0 && (
        <section className="overflow-hidden rounded-[20px] border border-line bg-card shadow-soft">
          <div className="border-b border-line bg-surface-sunken px-5 py-3">
            <h2 className="text-[14px] font-bold text-ink">Unmapped answers</h2>
            <p className="mt-0.5 text-[11.5px] text-ink-mute">
              Stored keys with no matching question definition.
            </p>
          </div>
          <div className="divide-y divide-line">
            {unmapped.map((item) => (
              <div key={item.key} className="grid gap-1 px-5 py-3 sm:grid-cols-[1fr_160px] sm:gap-4">
                <p className="font-mono text-[12px] text-ink-soft">{item.key}</p>
                <p className="text-[13px] font-semibold text-ink-soft sm:text-end">
                  {renderValue(item.value)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
