'use client';

import { ChevronRight, LifeBuoy } from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { useSurveyStore } from '@/store/surveyStore';
import type { SafetyFollowUpChoice } from '@/types/survey';

const OPTIONS: { value: SafetyFollowUpChoice; ur: string; en: string }[] = [
  {
    value: 'connect_support',
    ur: 'ہاں، مجھے مدد سے جوڑا جائے',
    en: 'Yes, I would like to be connected to support',
  },
  {
    value: 'already_receiving',
    ur: 'میں پہلے سے مدد حاصل کر رہا/رہی ہوں',
    en: 'I am already receiving support',
  },
  {
    value: 'decline_appreciated',
    ur: 'نہیں، لیکن پوچھنے کا شکریہ',
    en: 'No, but I appreciate being asked',
  },
];

interface SafetyFollowUpProps {
  onContinue: () => void;
}

/**
 * Shown when PHQ-9 item 9 is endorsed. Deliberately warm rather than alarming
 * — soft coral, no red alerts — so it reads as care, not as a flag.
 */
export function SafetyFollowUp({ onContinue }: SafetyFollowUpProps) {
  const { language, setSafetyFollowUp } = useSurveyStore();
  const isUrdu = language === 'ur';

  const handleSelect = (choice: SafetyFollowUpChoice) => {
    setSafetyFollowUp(choice);
    onContinue();
  };

  return (
    <div
      className="scroll-soft min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-2"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="animate-scale-in mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FADFD3] text-[#C25534]">
        <LifeBuoy className="h-6 w-6" strokeWidth={2} />
      </div>

      <div className="animate-fade-up mb-6 rounded-[20px] bg-[#FDEFEA] p-4">
        <BilingualText
          ur="اگر آپ نے خود کو نقصان پہنچانے کے خیالات کا ذکر کیا ہے تو مدد دستیاب ہے۔"
          en="If you indicated any thoughts of being better off dead or hurting yourself, please know that support is available."
          variant="question"
        />
      </div>

      <div className="space-y-2.5">
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            style={{ animationDelay: `${100 + i * 60}ms` }}
            className="tap animate-fade-up flex w-full items-center gap-3 rounded-card border border-line bg-card p-4 text-start hover:border-[#DB6B45]/40 hover:shadow-soft"
          >
            <BilingualText ur={opt.ur} en={opt.en} variant="option" className="flex-1" />
            <ChevronRight
              className={`h-4 w-4 shrink-0 text-ink-faint ${isUrdu ? 'rotate-180' : ''}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
