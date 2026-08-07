import { AlertTriangle, ShieldAlert } from 'lucide-react';
import type { ScoreResult } from '@/lib/admin/types';

/** Panel shown when Supabase can't be reached or isn't configured. */
export function ErrorPanel({ reason, message }: { reason: string; message: string }) {
  const unconfigured = reason === 'unconfigured';

  return (
    <div className="rounded-[20px] border border-danger/25 bg-danger-light p-6">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
        <h2 className="text-[15px] font-bold text-ink">
          {unconfigured ? 'Admin panel not configured' : 'Could not load responses'}
        </h2>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">{message}</p>

      {unconfigured && (
        <pre className="mt-4 overflow-x-auto rounded-card border border-line bg-card p-3.5 text-[12px] leading-relaxed text-ink-soft">
{`# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key from
  Supabase dashboard → Project Settings → API>`}
        </pre>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sublabel,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  tone?: 'default' | 'primary' | 'danger';
}) {
  const tones = {
    default: 'border-line bg-card',
    primary: 'border-transparent bg-gradient-to-br from-primary to-primary-bright text-white',
    danger: 'border-danger/25 bg-danger-light',
  } as const;

  const labelTone = tone === 'primary' ? 'text-white/80' : 'text-ink-mute';
  const valueTone = tone === 'primary' ? 'text-white' : tone === 'danger' ? 'text-danger' : 'text-ink';
  const subTone = tone === 'primary' ? 'text-white/75' : 'text-ink-mute';

  return (
    <div className={`rounded-[20px] border p-4 shadow-soft ${tones[tone]}`}>
      <p className={`text-[10.5px] font-bold uppercase tracking-wider ${labelTone}`}>{label}</p>
      <p className={`mt-1.5 text-[28px] font-bold leading-none tabular-nums ${valueTone}`}>
        {value}
      </p>
      {sublabel && <p className={`mt-1.5 text-[11.5px] ${subTone}`}>{sublabel}</p>}
    </div>
  );
}

export function CompletedBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-primary-light text-primary-dark',
    in_progress: 'bg-blue-light text-blue',
    abandoned: 'bg-surface-sunken text-ink-mute',
  };
  const label: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In progress',
    abandoned: 'Abandoned',
  };

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-chip px-2 py-0.5 text-[11px] font-bold ${
        map[status] ?? 'bg-surface-sunken text-ink-mute'
      }`}
    >
      {label[status] ?? status}
    </span>
  );
}

export function SafetyIcon({ flagged }: { flagged: boolean }) {
  if (!flagged) return <span className="text-ink-faint">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-danger" title="PHQ-9 item 9 endorsed">
      <ShieldAlert className="h-4 w-4" />
      <span className="text-[11px] font-bold">Flag</span>
    </span>
  );
}

const BAND_TONE: Record<ScoreResult['band'], string> = {
  minimal: 'text-ink-soft',
  mild: 'text-blue',
  moderate: 'text-coral',
  'moderately-severe': 'text-danger',
  severe: 'text-danger',
};

/** Renders a score, marking partial ones — a partial sum is not a valid score. */
export function ScoreCell({ result }: { result: ScoreResult | null }) {
  if (!result) return <span className="text-ink-faint">—</span>;
  return (
    <span className={`font-bold tabular-nums ${BAND_TONE[result.band]}`}>
      {result.score}
      {!result.complete && (
        <span
          className="ms-1 text-[10px] font-medium text-ink-mute"
          title={`Only ${result.answered} of ${result.total} items answered`}
        >
          ({result.answered}/{result.total})
        </span>
      )}
    </span>
  );
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
