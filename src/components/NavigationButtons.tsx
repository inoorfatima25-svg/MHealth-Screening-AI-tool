'use client';

import { ArrowRight, Check } from 'lucide-react';
import { useSurveyStore } from '@/store/surveyStore';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious?: boolean;
  isLast?: boolean;
  submitBlockedReason?: string;
  onGoToIncomplete?: () => void;
}

/**
 * Footer actions. "Back" is deliberately quiet and "Next" carries all the
 * weight — one obvious forward path per screen.
 */
export function NavigationButtons({
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious = true,
  isLast = false,
  submitBlockedReason,
  onGoToIncomplete,
}: NavigationButtonsProps) {
  const language = useSurveyStore((s) => s.language);
  const isUrdu = language === 'ur';

  const prevLabel = isUrdu ? 'پچھلا' : 'Back';
  const nextLabel = isLast
    ? isUrdu
      ? 'جمع کرائیں'
      : 'Submit'
    : isUrdu
      ? 'اگلا'
      : 'Next';

  return (
    <div className="shrink-0 border-t border-line bg-card/85 px-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-5">
      {submitBlockedReason && (
        <div className="mb-2.5 rounded-card border border-coral/30 bg-coral-light px-3 py-2 text-center text-[12px] text-ink-soft">
          <p className={isUrdu ? 'font-urdu leading-relaxed' : ''}>{submitBlockedReason}</p>
          {onGoToIncomplete && (
            <button
              type="button"
              onClick={onGoToIncomplete}
              className={`tap mt-1.5 text-[12px] font-semibold text-primary ${isUrdu ? 'font-urdu' : ''}`}
            >
              {isUrdu ? 'نامکمل حصے پر جائیں' : 'Go to incomplete section'}
            </button>
          )}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`tap min-h-[52px] rounded-card px-5 text-sm font-semibold text-ink-soft
            hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-30
            ${isUrdu ? 'font-urdu' : ''}`}
        >
          {prevLabel}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`tap group relative flex min-h-[52px] flex-1 items-center justify-center gap-2
            overflow-hidden rounded-card bg-gradient-to-br from-primary to-primary-bright
            text-sm font-bold text-white shadow-glow
            disabled:pointer-events-none disabled:bg-none disabled:bg-line-strong disabled:text-white/70 disabled:shadow-none
            ${isUrdu ? 'font-urdu' : ''}`}
        >
          <span>{nextLabel}</span>
          {isLast ? (
            <Check className="h-4 w-4" strokeWidth={3} />
          ) : (
            <ArrowRight
              className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                isUrdu ? 'rotate-180 group-hover:-translate-x-0.5' : ''
              }`}
              strokeWidth={2.5}
            />
          )}
        </button>
      </div>
    </div>
  );
}
