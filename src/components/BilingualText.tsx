'use client';

import { useSurveyStore } from '@/store/surveyStore';

interface BilingualTextProps {
  ur: string;
  en: string;
  variant?: 'question' | 'option' | 'label' | 'subtitle';
  className?: string;
}

/**
 * Renders both languages with a clear hierarchy: the active language leads at
 * full weight, the other follows as a lighter translation line. Nastaliq needs
 * far more line-height than Latin, so each variant sets its own leading.
 */
export function BilingualText({
  ur,
  en,
  variant = 'question',
  className = '',
}: BilingualTextProps) {
  const language = useSurveyStore((s) => s.language);
  const isUrduPrimary = language === 'ur';

  const primary = isUrduPrimary ? ur : en;
  const secondary = isUrduPrimary ? en : ur;

  const primaryFont = isUrduPrimary ? 'font-urdu' : 'font-sans';
  const secondaryFont = isUrduPrimary ? 'font-sans' : 'font-urdu';

  const primarySize = {
    question: isUrduPrimary
      ? 'text-[19px] font-semibold leading-[2.15] tracking-normal'
      : 'text-[17px] font-semibold leading-snug tracking-[-0.01em]',
    option: isUrduPrimary
      ? 'text-[15px] font-medium leading-[1.95]'
      : 'text-[15px] font-medium leading-snug',
    label: isUrduPrimary
      ? 'text-[14px] font-medium leading-[1.9]'
      : 'text-[14px] font-medium leading-snug',
    subtitle: 'text-sm font-normal leading-relaxed',
  }[variant];

  const secondarySize = {
    question: isUrduPrimary
      ? 'text-[13.5px] leading-relaxed'
      : 'text-[15px] leading-[2]',
    option: isUrduPrimary ? 'text-[11.5px] leading-relaxed' : 'text-[12.5px] leading-[1.9]',
    label: isUrduPrimary ? 'text-[11px] leading-relaxed' : 'text-[12px] leading-[1.85]',
    subtitle: 'text-xs leading-relaxed',
  }[variant];

  return (
    <div className={`space-y-1 ${className}`}>
      <p
        dir={isUrduPrimary ? 'rtl' : 'ltr'}
        className={`${primaryFont} ${primarySize} text-ink ${
          isUrduPrimary ? 'text-right' : 'text-left'
        }`}
      >
        {primary}
      </p>
      <p
        dir={isUrduPrimary ? 'ltr' : 'rtl'}
        className={`${secondaryFont} ${secondarySize} text-ink-mute ${
          isUrduPrimary ? 'text-left' : 'text-right'
        }`}
      >
        {secondary}
      </p>
    </div>
  );
}
