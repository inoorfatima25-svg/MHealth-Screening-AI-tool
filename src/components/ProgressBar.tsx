'use client';

interface ProgressBarProps {
  value: number;
  className?: string;
}

/**
 * The survey's single source of progress. A hairline track with a gradient
 * fill and a soft leading glow, so forward movement reads as motion rather
 * than a jump.
 */
export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-[3px] w-full overflow-hidden bg-line ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="relative h-full rounded-e-full bg-gradient-to-r from-primary to-primary-bright transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${clamped}%` }}
      >
        <span
          aria-hidden
          className="absolute end-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-bright opacity-70 blur-[3px]"
        />
      </div>
    </div>
  );
}
