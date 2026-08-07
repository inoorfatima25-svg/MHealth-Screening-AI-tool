'use client';

import { BilingualText } from '@/components/BilingualText';
import { getAccent, type Accent } from '@/components/accents';
import type { Option } from '@/types/survey';

interface ScaleSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  accent?: Accent;
}

/**
 * Ordered scale. The numeric leader doubles as an intensity read-out: the
 * filled track behind each row grows with the option's rank, so the scale is
 * legible at a glance rather than as a flat list.
 */
export function ScaleSelect({
  options,
  value,
  onChange,
  accent = getAccent(),
}: ScaleSelectProps) {
  return (
    <div className="space-y-2" role="radiogroup">
      {options.map((option, index) => {
        const selected = value === option.value;
        const fill = ((index + 1) / options.length) * 100;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            style={{ animationDelay: `${60 + index * 45}ms` }}
            className={`tap animate-fade-up relative flex w-full items-center gap-3 overflow-hidden rounded-card border px-4 py-3 ring-inset
              ${
                selected
                  ? `${accent.ring} ${accent.glow} border-transparent ring-2`
                  : 'border-line bg-card hover:border-line-strong hover:shadow-soft'
              }`}
          >
            {/* Intensity track — sits behind the content */}
            <span
              aria-hidden
              className={`absolute inset-y-0 start-0 transition-all duration-500 ${accent.tint} ${
                selected ? 'opacity-100' : 'opacity-40'
              }`}
              style={{ width: `${fill}%` }}
            />

            <span
              className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200
                ${selected ? `${accent.bar} text-white` : 'bg-surface-sunken text-ink-mute'}`}
            >
              {index + 1}
            </span>

            <BilingualText
              ur={option.label_ur}
              en={option.label_en}
              variant="option"
              className="relative flex-1"
            />
          </button>
        );
      })}
    </div>
  );
}
