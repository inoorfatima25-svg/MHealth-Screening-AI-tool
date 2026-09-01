'use client';

import { useEffect, useRef } from 'react';
import { Gift, ShieldCheck } from 'lucide-react';
import { useSurveyStore } from '@/store/surveyStore';
import { ContactFields } from '@/components/ContactFields';

export function ContactPage() {
  const language = useSurveyStore((s) => s.language);
  const answers = useSurveyStore((s) => s.answers);
  const setAnswer = useSurveyStore((s) => s.setAnswer);
  const isUrdu = language === 'ur';
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  const value = answers.s18_contact && typeof answers.s18_contact === 'object' && !Array.isArray(answers.s18_contact)
    ? answers.s18_contact as Record<string, string | number>
    : {};

  return (
    <main ref={scrollRef} className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-5" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex min-h-full w-full max-w-2xl items-center py-6">
        <section className="w-full rounded-3xl border border-line bg-card p-5 shadow-soft sm:p-7">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Gift className="h-6 w-6" />
            </div>
            <h1 className={`mt-4 text-xl font-bold text-ink ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'رابطے کی معلومات' : 'Contact Information'}
            </h1>
            <p className={`mt-1 text-sm font-medium text-ink-soft ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'اختیاری' : 'Optional'}
            </p>
            <p className={`mt-4 text-[13px] leading-6 text-ink-mute ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu
                ? 'اگر آپ follow-up interview یا lucky draw کے لیے رابطہ کرنا چاہتے ہیں تو اپنا فون نمبر یا ای میل دے سکتے ہیں۔ دونوں دینا ضروری نہیں۔'
                : 'If you would like to be contacted for a follow-up interview or the lucky draw, you may provide your phone number or email. You do not need to provide both.'}
            </p>
          </div>

          <div className="mx-auto mt-7 max-w-lg rounded-2xl border border-line bg-surface-sunken/40 p-4 sm:p-5">
            <ContactFields
              value={value}
              onChange={(next) => setAnswer('s18_contact', next)}
            />
          </div>

          <div className={`mx-auto mt-5 flex max-w-lg items-start gap-2.5 rounded-2xl bg-primary-light px-4 py-3 text-[11.5px] leading-5 text-ink-soft ${isUrdu ? 'font-urdu' : ''}`}>
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              {isUrdu
                ? 'یہ معلومات اختیاری ہیں۔ اگر آپ انہیں فراہم نہیں کرنا چاہتے تو خالی چھوڑ کر آگے بڑھ سکتے ہیں۔'
                : 'This information is optional. If you prefer not to provide it, simply leave the fields blank and continue.'}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
