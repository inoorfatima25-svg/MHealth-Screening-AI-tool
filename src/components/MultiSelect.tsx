'use client';

import { Check, Info } from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { getAccent, type Accent } from '@/components/accents';
import { useSurveyStore } from '@/store/surveyStore';
import type { Option } from '@/types/survey';

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  accent?: Accent;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  maxSelections,
  accent = getAccent(),
}: MultiSelectProps) {
  const language = useSurveyStore((s) => s.language);
  const atLimit = maxSelections !== undefined && value.length >= maxSelections;

  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
      return;
    }
    if (atLimit) return;
    onChange([...value, optValue]);
  };

  return (
    <div>
      {/* Hint bar — instruction on one side, live count on the other */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-card border border-line bg-card px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-[11.5px] text-ink-soft">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>{language === 'ur' ? 'تمام متعلقہ منتخب کریں' : 'Select all that apply'}</span>
        </div>
        {maxSelections !== undefined && (
          <span
            className={`shrink-0 rounded-chip px-2 py-0.5 text-[11px] font-bold tabular-nums transition-colors ${
              atLimit ? accent.pill : 'bg-surface-sunken text-ink-mute'
            }`}
          >
            {value.length}/{maxSelections}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => {
          const selected = value.includes(option.value);
          const locked = atLimit && !selected;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => toggle(option.value)}
              style={{ animationDelay: `${60 + i * 35}ms` }}
              className={`tap animate-fade-up inline-flex items-center gap-2 rounded-chip border px-3.5 py-2.5 ring-inset
                ${
                  selected
                    ? `${accent.tint} ${accent.ring} ${accent.glow} border-transparent ring-2`
                    : 'border-line bg-card hover:border-line-strong hover:shadow-soft'
                }
                ${locked ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              {selected && (
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${accent.bar}`}
                >
                  <Check className="h-2.5 w-2.5 animate-pop text-white" strokeWidth={3.5} />
                </span>
              )}
              <BilingualText ur={option.label_ur} en={option.label_en} variant="label" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
