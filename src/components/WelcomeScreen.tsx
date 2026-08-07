'use client';

import { useState } from 'react';
import { ArrowRight, Clock, DoorOpen, Leaf, Lock } from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useSurveyStore } from '@/store/surveyStore';

const ASSURANCES = [
  { icon: Lock, ur: 'مکمل رازداری', en: 'Fully confidential' },
  { icon: Clock, ur: '15–20 منٹ', en: '15–20 minutes' },
  { icon: DoorOpen, ur: 'کسی بھی وقت چھوڑ سکتے ہیں', en: 'Leave anytime' },
];

export function WelcomeScreen() {
  const { language, setConsent } = useSurveyStore();
  const [agreed, setAgreed] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const isUrdu = language === 'ur';

  return (
    <div className="flex min-h-0 flex-1 flex-col" dir={isUrdu ? 'rtl' : 'ltr'}>
      <header className="flex shrink-0 justify-end px-4 pt-3">
        <LanguageToggle />
      </header>

      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        {/* ── Hero ── */}
        <div className="flex flex-col items-center pt-4 text-center">
          <div className="relative mb-5">
            <span
              aria-hidden
              className="absolute inset-0 -m-3 animate-pulse rounded-full bg-primary/15 blur-xl"
            />
            <div className="animate-scale-in relative flex h-[76px] w-[76px] items-center justify-center rounded-[26px] bg-gradient-to-br from-primary to-primary-bright shadow-glow">
              <Leaf className="h-9 w-9 text-white" strokeWidth={1.75} />
            </div>
          </div>

          <h1
            className="animate-fade-up font-urdu text-[26px] font-bold leading-[1.9] text-ink"
            dir="rtl"
          >
            ذہنی صحت سکریننگ
          </h1>
          <p
            className="animate-fade-up text-[13px] font-medium tracking-wide text-ink-mute"
            style={{ animationDelay: '80ms' }}
          >
            Mental Health Screening
          </p>
        </div>

        {/* ── Assurances ── */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {ASSURANCES.map(({ icon: Icon, ur, en }, i) => (
            <div
              key={ur}
              style={{ animationDelay: `${120 + i * 70}ms` }}
              className="animate-fade-up flex flex-col items-center gap-2 rounded-card border border-line bg-card px-2 py-3.5 text-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <span
                className={`text-[11px] font-medium leading-snug text-ink-soft ${
                  isUrdu ? 'font-urdu leading-relaxed' : ''
                }`}
              >
                {isUrdu ? ur : en}
              </span>
            </div>
          ))}
        </div>

        {/* ── Consent text ── */}
        <div
          className="animate-fade-up mt-4 rounded-[20px] border border-line bg-card p-4 shadow-soft"
          style={{ animationDelay: '320ms' }}
        >
          <BilingualText
            className="whitespace-pre-line"
            ur={
              'محترم Participant،\n\n' +
              'یہ سوالنامہ یونیورسٹی طلباء کی ذہنی صحت پر تحقیق کے لیے تیار کیا گیا ہے۔ آپ کی شرکت مکمل طور پر رضاکارانہ ہے، اور آپ کسی بھی وقت بغیر کسی نقصان یا منفی نتائج کے اس تحقیق سے دستبردار ہو سکتے ہیں۔\n\n' +
              'یہ مطالعہ مکمل طور پر گمنام (anonymous) انداز میں ترتیب دیا گیا ہے۔ ہم آپ سے آپ کا نام، ای میل ایڈریس، طالب علم نمبر، یا کوئی ایسی معلومات طلب نہیں کریں گے جن سے آپ کی براہِ راست شناخت ہو سکے۔ آپ کے تمام جوابات گمنام رہیں گے اور انہیں کسی بھی صورت میں آپ کی شناخت سے منسلک نہیں کیا جا سکے گا۔\n\n' +
              'آپ کی فراہم کردہ تمام معلومات انتہائی رازداری سے محفوظ رکھی جائیں گی اور صرف تحقیقی مقاصد کے لیے استعمال ہوں گی۔'
            }
            en={
              'Dear Participant,\n\n' +
              'This questionnaire has been designed for research on the mental health of university students. Your participation is completely voluntary, and you may withdraw from the study at any time without any penalty or negative consequences.\n\n' +
              'This study has been designed to be anonymous. We will not ask for your name, email address, student number, or any other directly identifying information. Your responses are anonymous and cannot be linked back to you.\n\n' +
              'All information you provide will be kept confidential and will be used solely for research purposes.'
            }
            variant="question"
          />
        </div>

        <p
          className={`animate-fade-up mt-3 text-[11.5px] leading-relaxed text-ink-mute ${
            isUrdu ? 'font-urdu text-right leading-[1.9]' : ''
          }`}
          style={{ animationDelay: '380ms' }}
        >
          {isUrdu
            ? 'متفق ہو کر، آپ تصدیق کرتے ہیں کہ آپ نے معلومات پڑھ لی ہے، رضاکارانہ شرکت کر رہے ہیں، اور کسی بھی وقت دستبردار ہو سکتے ہیں۔'
            : 'By agreeing, you acknowledge you have read and understood the above, participate voluntarily, and may withdraw at any time.'}
        </p>

        {/* ── Consent checkbox ── */}
        <label
          className={`tap mt-4 flex cursor-pointer items-center gap-3 rounded-card border p-4 ring-inset
            ${
              agreed
                ? 'border-transparent bg-primary-light ring-2 ring-primary/40'
                : 'border-line bg-card hover:border-line-strong'
            }`}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-200
              ${agreed ? 'border-transparent bg-primary' : 'border-line-strong bg-card'}`}
          >
            {agreed && (
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 animate-pop text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </span>
          <span
            className={`text-sm font-semibold text-ink ${isUrdu ? 'font-urdu' : ''}`}
          >
            {isUrdu ? 'میں متفق ہوں' : 'I accept'}
          </span>
        </label>
      </div>

      {/* ── CTA ── */}
      <div className="shrink-0 border-t border-line bg-card/85 px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <button
          type="button"
          disabled={!agreed}
          onClick={() => setConsent({ name: '', date: today, agreed })}
          className="tap group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-card bg-gradient-to-br from-primary to-primary-bright text-sm font-bold text-white shadow-glow
            disabled:pointer-events-none disabled:bg-none disabled:bg-line-strong disabled:text-white/70 disabled:shadow-none"
        >
          <span className="font-urdu">شروع کریں</span>
          <span className="opacity-50">·</span>
          <span>Begin</span>
          <ArrowRight
            className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
              isUrdu ? 'rotate-180 group-hover:-translate-x-0.5' : ''
            }`}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
