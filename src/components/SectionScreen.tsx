'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  Activity, ClipboardCheck, Coffee, Globe, GraduationCap, HeartPulse,
  Home, MapPin, Scale, ShieldAlert, ShieldPlus, Smartphone, Sun, User, Users, Wallet,
  type LucideIcon,
} from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { LikertGrid } from '@/components/LikertGrid';
import { MultiSelect } from '@/components/MultiSelect';
import { ScaleSelect } from '@/components/ScaleSelect';
import { SingleSelect } from '@/components/SingleSelect';
import { TextInput } from '@/components/TextInput';
import { getAccent } from '@/components/accents';
import { getQuestionOptions } from '@/data/scales';
import { useSurveyStore } from '@/store/surveyStore';
import type { AnswerValue, Question, Section } from '@/types/survey';

const ICONS: Record<string, LucideIcon> = {
  user: User, 'graduation-cap': GraduationCap, sun: Sun, smartphone: Smartphone,
  scale: Scale, users: Users, home: Home, 'map-pin': MapPin, wallet: Wallet,
  globe: Globe, 'shield-alert': ShieldAlert, 'shield-heart': ShieldPlus,
  activity: Activity, 'heart-pulse': HeartPulse, 'clipboard-check': ClipboardCheck,
  coffee: Coffee,
};

export interface SectionQuestion {
  question: Question;
  number: number;
}

interface SectionScreenProps {
  section: Section;
  questions: SectionQuestion[];
  answers: Record<string, AnswerValue>;
  onAnswer: (id: string, value: AnswerValue) => void;
  page: number;
  totalPages: number;
}

function QuestionInput({ question, value, onAnswer, accent }: {
  question: Question;
  value: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
  accent: ReturnType<typeof getAccent>;
}) {
  const options = getQuestionOptions(question);
  switch (question.type) {
    case 'single_select':
    case 'yes_no':
    case 'yes_no_extent':
      return <SingleSelect options={options} value={typeof value === 'string' ? value : undefined} onChange={onAnswer} accent={accent} />;
    case 'likert_scale':
      return <ScaleSelect options={options} value={typeof value === 'string' ? value : undefined} onChange={(v) => onAnswer(v)} accent={accent} />;
    case 'multi_select':
      return <MultiSelect options={options} value={Array.isArray(value) ? value : []} onChange={onAnswer} maxSelections={question.max_selections} accent={accent} />;
    case 'likert_grid':
      return <LikertGrid question={question} value={value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, string | number> : {}} onChange={onAnswer} accent={accent} />;
    case 'text_short':
    case 'text_long':
      return <TextInput type={question.type} value={typeof value === 'string' ? value : ''} onChange={onAnswer} />;
    case 'number':
      return <TextInput type="number" value={typeof value === 'number' ? value : ''} onChange={onAnswer} min={question.min} max={question.max} allowDecimal={question.allow_decimal} />;
    default:
      return null;
  }
}

export function SectionScreen({ section, questions, answers, onAnswer, page, totalPages }: SectionScreenProps) {
  const language = useSurveyStore((s) => s.language);
  const isUrdu = language === 'ur';
  const Icon = ICONS[section.icon] ?? ClipboardCheck;
  const accent = getAccent(section.accent_color);
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Always start a new section/page at the top so participants never
    // land halfway down the previous section.
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [section.id, page]);

  const completion = useMemo(() => {
    let done = 0;
    questions.forEach(({ question }) => {
      const value = answers[question.id];
      if (question.type === 'likert_grid' && value && typeof value === 'object' && !Array.isArray(value)) {
        const items = question.grid_items ?? [];
        if (items.length && items.every((i) => value[i.id] !== undefined && value[i.id] !== '')) done++;
      } else if (value !== undefined && value !== '') {
        if (Array.isArray(value) ? value.length > 0 : typeof value === 'string' ? value.trim().length > 0 : true) done++;
      }
    });
    return done;
  }, [answers, questions]);

  return (
    <main ref={scrollRef} className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-5" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="mx-auto w-full max-w-2xl py-3">
        <section className="mb-4 rounded-2xl border border-line bg-card p-4 shadow-soft sm:p-5">
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent.chip} ${accent.icon}`}>
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={`text-[17px] font-bold leading-snug text-ink ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? section.title_ur : section.title_en}
              </h1>
              <p className={`mt-1 text-[12px] leading-relaxed text-ink-mute ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? section.title_en : section.title_ur}
              </p>
            </div>
            <span className={`shrink-0 rounded-chip px-2.5 py-1 text-[11px] font-bold ${accent.pill}`}>
              {isUrdu ? `صفحہ ${page}/${totalPages}` : `Page ${page}/${totalPages}`}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-ink-mute">
            <span className={isUrdu ? 'font-urdu' : ''}>{isUrdu ? `${completion}/${questions.length} مکمل` : `${completion}/${questions.length} answered`}</span>
            <span className={isUrdu ? 'font-urdu' : ''}>{isUrdu ? 'جوابات محفوظ رہیں گے' : 'Your answers are saved as you go'}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className={`h-full rounded-full ${accent.bar} transition-all duration-300`} style={{ width: `${questions.length ? (completion / questions.length) * 100 : 0}%` }} />
          </div>
        </section>

        <div className="space-y-3">
          {questions.map(({ question, number }) => {
            const value = answers[question.id];
            return (
              <article key={question.id} className="rounded-2xl border border-line bg-card p-4 shadow-soft sm:p-5">
                <div className="mb-4 flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${accent.pill}`}>{number}</span>
                  <div className="min-w-0 flex-1">
                    <BilingualText ur={question.text_ur} en={question.text_en} variant="question" />
                    {(question.note_en || question.note_ur) && (
                      <div className={`mt-2 rounded-xl px-3 py-2 ${accent.tint}`}>
                        {question.note_ur && <p className="font-urdu text-[12px] leading-7 text-ink-soft" dir="rtl">{question.note_ur}</p>}
                        {question.note_en && <p className="mt-1 text-[11.5px] leading-relaxed text-ink-mute">{question.note_en}</p>}
                      </div>
                    )}
                  </div>
                </div>
                <QuestionInput question={question} value={value} onAnswer={(v) => onAnswer(question.id, v)} accent={accent} />
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
