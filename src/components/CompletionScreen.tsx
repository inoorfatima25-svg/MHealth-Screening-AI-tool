'use client';

import { Check, HeartHandshake } from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { useSurveyStore } from '@/store/surveyStore';

export function CompletionScreen() {
  const language = useSurveyStore((s) => s.language);
  const isUrdu = language === 'ur';

  return (
    <div
      className="scroll-soft flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-8"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-1 flex-col items-center text-center">
        {/* ── Success mark ── */}
        <div className="relative mb-6">
          <span
            aria-hidden
            className="absolute inset-0 -m-4 rounded-full bg-primary/15 blur-2xl"
          />
          <div className="animate-scale-in relative flex h-[84px] w-[84px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-bright shadow-glow">
            <Check className="h-10 w-10 animate-pop text-white" strokeWidth={3} />
          </div>
        </div>

        <h1
          className="animate-fade-up font-urdu text-[28px] font-bold leading-[1.9] text-ink"
          dir="rtl"
        >
          شکریہ
        </h1>
        <p
          className="animate-fade-up text-[13px] font-medium tracking-wide text-ink-mute"
          style={{ animationDelay: '80ms' }}
        >
          Thank you
        </p>

        {/* ── Message ── */}
        <div
          className="animate-fade-up mt-6 w-full rounded-[20px] border border-line bg-card p-4 text-start shadow-soft"
          style={{ animationDelay: '160ms' }}
        >
          <BilingualText
            ur="اس سوالنامے کو مکمل کرنے کا شکریہ۔ ہم سمجھتے ہیں کہ یہ سوالات ذاتی ہو سکتے ہیں۔ آپ کے جوابات اس تحقیق کے لیے بہت اہم ہیں۔"
            en="Thank you for completing this questionnaire. We understand these questions can be personal. Your responses are truly appreciated and very important for this research. Take care of yourself."
            variant="question"
          />
        </div>

        {/* ── Support callout ── */}
        <div
          className="animate-fade-up mt-3 w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-primary to-primary-bright p-4 text-start text-white shadow-glow"
          style={{ animationDelay: '240ms' }}
        >
          <div className="mb-2 flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 shrink-0 opacity-90" />
            <span className="text-[10.5px] font-bold uppercase tracking-wider opacity-90">
              {isUrdu ? 'مدد' : 'Support'}
            </span>
          </div>
          <p className="font-urdu text-[15px] leading-[2.1]" dir="rtl">
            اگر آپ کو پیشہ ورانہ مدد کی ضرورت ہو تو اپنے یونیورسٹی کے counselling centre سے رابطہ کریں
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed opacity-90">
            If you need professional help, please contact your university counselling centre.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <PrivacyBadge />
      </div>
    </div>
  );
}
