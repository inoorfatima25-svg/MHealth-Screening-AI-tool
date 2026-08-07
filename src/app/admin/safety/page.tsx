import Link from 'next/link';
import { Mail, Phone, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  CompletedBadge,
  ErrorPanel,
  ScoreCell,
  formatDate,
} from '@/components/admin/ui';
import { scoreRow } from '@/lib/admin/scoring';
import { fetchAllResponses } from '@/lib/admin/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FOLLOW_UP_LABELS: Record<string, string> = {
  connect_support: 'Wants to be connected to support',
  already_receiving: 'Already receiving support',
  decline_appreciated: 'Declined, appreciated being asked',
};

/**
 * Safety overview — only participants who endorsed PHQ-9 item 9
 * ("thoughts that you would be better off dead, or of hurting yourself").
 * Contact details are surfaced here so researchers can follow up quickly.
 */
export default async function SafetyPage() {
  const result = await fetchAllResponses();
  if (!result.ok) return <ErrorPanel reason={result.reason} message={result.message} />;

  const flagged = result.data
    .map(scoreRow)
    .filter((r) => r.safetyFlag)
    // Most severe item-9 endorsement first, then most recent.
    .sort((a, b) => {
      const byItem = (b.phq9Item9 ?? 0) - (a.phq9Item9 ?? 0);
      if (byItem !== 0) return byItem;
      return Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '');
    });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-[22px] font-bold tracking-tight text-ink">
          <ShieldAlert className="h-5 w-5 text-danger" />
          Safety overview
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          Participants who scored above 0 on PHQ-9 item 9.
        </p>
      </div>

      {flagged.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-card p-10 text-center shadow-soft">
          <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-[14px] font-semibold text-ink">No safety flags</p>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            No participant has endorsed PHQ-9 item 9.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-danger/25 bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-danger-light text-[10.5px] uppercase tracking-wider text-danger">
                <tr>
                  <th className="px-4 py-2.5 text-start font-bold">ID</th>
                  <th className="px-4 py-2.5 text-start font-bold">Started</th>
                  <th className="px-4 py-2.5 text-start font-bold">Item 9</th>
                  <th className="px-4 py-2.5 text-start font-bold">PHQ-9</th>
                  <th className="px-4 py-2.5 text-start font-bold">GAD-7</th>
                  <th className="px-4 py-2.5 text-start font-bold">Status</th>
                  <th className="px-4 py-2.5 text-start font-bold">Follow-up choice</th>
                  <th className="px-4 py-2.5 text-start font-bold">Contact</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((r) => (
                  <tr key={r.id} className="border-t border-line align-top hover:bg-surface-sunken">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/responses/${r.id}`}
                        className="font-mono text-[12px] font-semibold text-primary hover:underline"
                      >
                        {r.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-chip bg-danger-light px-2 py-0.5 font-bold tabular-nums text-danger">
                        {r.phq9Item9}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreCell result={r.phq9} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreCell result={r.gad7} />
                    </td>
                    <td className="px-4 py-3">
                      <CompletedBadge status={r.completionStatus} />
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-soft">
                      {r.safetyFollowUp
                        ? (FOLLOW_UP_LABELS[r.safetyFollowUp] ?? r.safetyFollowUp)
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {r.contact.email || r.contact.phone ? (
                        <div className="flex flex-col gap-1 text-[12px]">
                          {r.contact.email && (
                            <a
                              href={`mailto:${r.contact.email}`}
                              className="flex items-center gap-1.5 font-semibold text-primary hover:underline"
                            >
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              {r.contact.email}
                            </a>
                          )}
                          {r.contact.phone && (
                            <a
                              href={`tel:${r.contact.phone}`}
                              className="flex items-center gap-1.5 font-semibold text-primary hover:underline"
                            >
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {r.contact.phone}
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-ink-faint">Not provided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
