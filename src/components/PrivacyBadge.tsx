'use client';

import { ShieldCheck } from 'lucide-react';
import { useSurveyStore } from '@/store/surveyStore';

export function PrivacyBadge() {
  const language = useSurveyStore((s) => s.language);

  return (
    <div className="inline-flex items-center gap-2 rounded-chip border border-line bg-card px-3.5 py-2 text-[11.5px] text-ink-soft">
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
      <span>
        {language === 'ur'
          ? 'آپ کے جوابات محفوظ اور خفیہ ہیں'
          : 'Your responses are secure and confidential'}
      </span>
    </div>
  );
}
