'use client';

import { Check } from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { getAccent, type Accent } from '@/components/accents';
import type { Option } from '@/types/survey';

interface SingleSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  accent?: Accent;
  autoAdvance?: boolean;
  onAutoAdvance?: () => void;
}

export function SingleSelect({
  options,
  value,
  onChange,
  accent = getAccent(),
  autoAdvance = true,
  onAutoAdvance,
}: SingleSelectProps) {
  const handleSelect = (optValue: string) => {
    onChange(optValue);
    if (autoAdvance && onAutoAdvance) {
      setTimeout(onAutoAdvance, 420);
    }
  };

  return (
    <div className="space-y-2.5" role="radiogroup">
      {options.map((option, i) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => handleSelect(option.value)}
            style={{ animationDelay: `${60 + i * 45}ms` }}
            className={`tap animate-fade-up flex w-full items-center gap-3 rounded-card border px-4 py-3.5 text-start ring-inset
              ${
                selected
                  ? `${accent.tint} ${accent.ring} ${accent.glow} border-transparent ring-2`
                  : 'border-line bg-card hover:border-line-strong hover:shadow-soft'
              }`}
          >
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200
                ${selected ? `${accent.bar} border-transparent` : 'border-line-strong bg-card'}`}
            >
              {selected && <Check className="h-3.5 w-3.5 animate-pop text-white" strokeWidth={3} />}
            </span>
            <BilingualText
              ur={option.label_ur}
              en={option.label_en}
              variant="option"
              className="flex-1"
            />
          </button>
        );
      })}
    </div>
  );
}
