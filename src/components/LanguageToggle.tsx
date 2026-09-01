'use client';

import { useSurveyStore } from '@/store/surveyStore';

const OPTIONS = [
  { code: 'ur' as const, label: 'اردو' },
  { code: 'en' as const, label: 'EN' },
];

/**
 * Segmented toggle. The active pill is a single sliding element rather than a
 * per-button background, so switching languages animates instead of blinking.
 */
export function LanguageToggle() {
  const { language, setLanguage } = useSurveyStore();
  const activeIndex = language === 'ur' ? 0 : 1;

  return (
    // dir is pinned so the pill always slides the same physical direction,
    // regardless of the survey's RTL/LTR mode.
    <div
      dir="ltr"
      className="relative flex rounded-chip border border-line bg-card p-0.5 text-xs font-semibold shadow-soft"
    >
      {/* Sliding indicator */}
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-chip bg-primary shadow-glow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLanguage(opt.code)}
          aria-pressed={language === opt.code}
          className={`relative z-10 min-h-[34px] w-[46px] rounded-chip transition-colors duration-200 ${
            language === opt.code ? 'text-white' : 'text-ink-mute hover:text-ink-soft'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
