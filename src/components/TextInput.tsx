'use client';

import { Minus, Plus } from 'lucide-react';
import { useSurveyStore } from '@/store/surveyStore';

interface TextInputProps {
  type: 'text_short' | 'text_long' | 'number';
  value?: string | number;
  onChange: (value: string | number) => void;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  placeholderUr?: string;
}

const FIELD =
  'w-full rounded-card border border-line bg-card text-ink outline-none transition ' +
  'placeholder:text-ink-faint hover:border-line-strong ' +
  'focus:border-primary focus:shadow-[0_0_0_4px_rgba(27,164,127,0.12)]';

export function TextInput({
  type,
  value,
  onChange,
  min,
  max,
  allowDecimal,
  placeholderUr = 'یہاں لکھیں…',
}: TextInputProps) {
  const language = useSurveyStore((s) => s.language);
  const isUrdu = language === 'ur';
  const placeholder = isUrdu ? placeholderUr : 'Type here…';
  const script = isUrdu ? 'font-urdu' : 'font-sans';

  // ── Number: stepper with a large, tappable read-out ──────────────────────
  if (type === 'number') {
    const numValue = value === undefined || value === '' ? '' : String(value);
    const step = allowDecimal ? 0.5 : 1;

    const adjust = (delta: number) => {
      const current = typeof value === 'number' ? value : 0;
      let next = current + delta;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      onChange(next);
    };

    const atMin = typeof value === 'number' && min !== undefined && value <= min;
    const atMax = typeof value === 'number' && max !== undefined && value >= max;

    return (
      <div className="animate-fade-up flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => adjust(-step)}
            disabled={atMin}
            aria-label="Decrease"
            className="tap flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink-soft hover:border-line-strong hover:shadow-soft disabled:opacity-30"
          >
            <Minus className="h-5 w-5" />
          </button>

          <input
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={numValue}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '') return;
              onChange(Number(v));
            }}
            placeholder="—"
            className={`${FIELD} h-[68px] w-32 text-center text-3xl font-bold tabular-nums
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />

          <button
            type="button"
            onClick={() => adjust(step)}
            disabled={atMax}
            aria-label="Increase"
            className="tap flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink-soft hover:border-line-strong hover:shadow-soft disabled:opacity-30"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {(min !== undefined || max !== undefined) && (
          <p className="text-[11px] tabular-nums text-ink-mute">
            {min ?? 0} – {max ?? '∞'}
          </p>
        )}
      </div>
    );
  }

  // ── Long text ────────────────────────────────────────────────────────────
  if (type === 'text_long') {
    const strValue = typeof value === 'string' ? value : '';
    return (
      <div className="animate-fade-up">
        <textarea
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={isUrdu ? 'rtl' : 'ltr'}
          rows={5}
          className={`${FIELD} ${script} min-h-[132px] resize-y px-4 py-3.5 text-base leading-relaxed`}
        />
        <p className="mt-1.5 text-end text-[11px] tabular-nums text-ink-faint">
          {strValue.length}
        </p>
      </div>
    );
  }

  // ── Short text ───────────────────────────────────────────────────────────
  const strValue = typeof value === 'string' ? value : '';
  return (
    <input
      type="text"
      value={strValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      dir={isUrdu ? 'rtl' : 'ltr'}
      className={`${FIELD} ${script} animate-fade-up h-14 px-4 text-base`}
    />
  );
}
