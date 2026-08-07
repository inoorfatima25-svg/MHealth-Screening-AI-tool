'use client';

import { BilingualText } from '@/components/BilingualText';
import { getAccent, type Accent } from '@/components/accents';
import { getScaleOptions } from '@/data/scales';
import { useSurveyStore } from '@/store/surveyStore';
import type { Question } from '@/types/survey';

interface LikertGridProps {
  question: Question;
  value?: Record<string, number | string>;
  onChange: (value: Record<string, number | string>) => void;
  accent?: Accent;
}

/**
 * Matrix questions (PHQ-9, GAD-7 …). A sticky legend explains the scale once,
 * then every item is a card with a full-width segmented control — far easier
 * to hit on a phone than a true column grid, and it never overflows.
 */
export function LikertGrid({
  question,
  value = {},
  onChange,
  accent = getAccent(),
}: LikertGridProps) {
  const language = useSurveyStore((s) => s.language);
  const scale = question.grid_scale ?? getScaleOptions(question.scale_preset ?? 'gad7_phq9');
  const items = question.grid_items ?? [];

  const answered = items.filter((it) => value[it.id] !== undefined).length;

  const setItem = (itemId: string, score: string) => {
    onChange({ ...value, [itemId]: score });
  };

  return (
    <div className="space-y-3">
      {/* ── Sticky legend + completion count ── */}
      <div className="sticky top-0 z-10 -mx-1 rounded-card bg-surface-sunken/90 px-1 pb-2.5 pt-1 backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-mute">
            {language === 'ur' ? 'پیمانہ' : 'Scale'}
          </span>
          <span className="text-[11px] font-bold tabular-nums text-ink-soft">
            {answered}/{items.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {scale.map((col) => (
            <span
              key={col.value}
              className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-card px-2 py-1 text-[10.5px] text-ink-soft"
            >
              <span className="font-bold text-ink">{col.value}</span>
              <span className="max-w-[92px] truncate">
                {language === 'ur' ? col.label_ur : col.label_en}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Item cards ── */}
      {items.map((item, i) => {
        const isAnswered = value[item.id] !== undefined;

        return (
          <div
            key={item.id}
            style={{ animationDelay: `${60 + i * 45}ms` }}
            className={`tap animate-fade-up rounded-card border p-3.5 ${
              isAnswered ? `border-transparent ring-1 ring-inset ${accent.ring}` : 'border-line bg-card'
            }`}
          >
            <BilingualText
              ur={item.text_ur}
              en={item.text_en}
              variant="label"
              className="mb-3"
            />

            {/* Segmented control */}
            <div className="flex gap-1.5 rounded-chip bg-surface-sunken p-1">
              {scale.map((col) => {
                const selected = String(value[item.id]) === col.value;
                return (
                  <button
                    key={col.value}
                    type="button"
                    aria-label={`${item.text_en} — ${col.label_en}`}
                    aria-pressed={selected}
                    onClick={() => setItem(item.id, col.value)}
                    className={`tap flex h-9 flex-1 items-center justify-center rounded-chip text-sm font-bold
                      ${
                        selected
                          ? `${accent.bar} ${accent.glow} text-white`
                          : 'text-ink-mute hover:bg-card hover:text-ink-soft'
                      }`}
                  >
                    {col.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
