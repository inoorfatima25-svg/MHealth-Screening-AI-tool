'use client';

import {
  Activity,
  Building2,
  ClipboardCheck,
  Coffee,
  Globe,
  GraduationCap,
  HeartPulse,
  Home,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldPlus,
  Smartphone,
  Sun,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { BilingualText } from '@/components/BilingualText';
import { ContactFields } from '@/components/ContactFields';
import { LikertGrid } from '@/components/LikertGrid';
import { MultiSelect } from '@/components/MultiSelect';
import { ScaleSelect } from '@/components/ScaleSelect';
import { SingleSelect } from '@/components/SingleSelect';
import { TextInput } from '@/components/TextInput';
import { getAccent, type Accent } from '@/components/accents';
import { getQuestionOptions } from '@/data/scales';
import { countQuestionsInSection } from '@/lib/survey-utils';
import type { FlatQuestion } from '@/lib/survey-utils';
import { useSurveyStore } from '@/store/surveyStore';
import type { AnswerValue, Question } from '@/types/survey';

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICONS: Record<string, LucideIcon> = {
  user: User,
  'graduation-cap': GraduationCap,
  sun: Sun,
  smartphone: Smartphone,
  scale: Scale,
  users: Users,
  home: Home,
  building: Building2,
  'map-pin': MapPin,
  wallet: Wallet,
  globe: Globe,
  'shield-alert': ShieldAlert,
  'shield-heart': ShieldPlus,
  activity: Activity,
  'heart-pulse': HeartPulse,
  'clipboard-check': ClipboardCheck,
  coffee: Coffee,
};

interface QuestionScreenProps {
  item: FlatQuestion;
  answers: Record<string, AnswerValue>;
  onAnswer: (questionId: string, value: AnswerValue) => void;
  onAutoAdvance: () => void;
  questionNumberInSection: number;
}

// ─── Input renderer ──────────────────────────────────────────────────────────
function renderInput(
  question: Question,
  value: AnswerValue | undefined,
  onAnswer: (v: AnswerValue) => void,
  onAutoAdvance: () => void,
  accent: Accent
) {
  const options = getQuestionOptions(question);

  switch (question.type) {
    case 'single_select':
    case 'yes_no':
    case 'yes_no_extent':
      return (
        <SingleSelect
          options={options}
          value={typeof value === 'string' ? value : undefined}
          onChange={onAnswer}
          accent={accent}
          onAutoAdvance={onAutoAdvance}
        />
      );

    case 'likert_scale':
      return (
        <ScaleSelect
          options={options}
          value={typeof value === 'string' ? value : undefined}
          onChange={onAnswer}
          accent={accent}
        />
      );

    case 'multi_select':
      return (
        <MultiSelect
          options={options}
          value={Array.isArray(value) ? value : []}
          onChange={onAnswer}
          maxSelections={question.max_selections}
          accent={accent}
        />
      );

    case 'likert_grid':
      return (
        <LikertGrid
          question={question}
          value={value && typeof value === 'object' && !Array.isArray(value) ? value : {}}
          onChange={onAnswer}
          accent={accent}
        />
      );

    case 'text_short':
    case 'text_long':
      return (
        <TextInput
          type={question.type}
          value={typeof value === 'string' ? value : ''}
          onChange={onAnswer}
        />
      );

    case 'contact_dual':
      return (
        <ContactFields
          value={
            value && typeof value === 'object' && !Array.isArray(value)
              ? (value as Record<string, string | number>)
              : undefined
          }
          onChange={onAnswer}
        />
      );

    case 'number':
      return (
        <TextInput
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={onAnswer}
          min={question.min}
          max={question.max}
          allowDecimal={question.allow_decimal}
        />
      );

    default:
      return null;
  }
}

// ─── Main component ──────────────────────────────────────────────────────────
export function QuestionScreen({
  item,
  answers,
  onAnswer,
  onAutoAdvance,
  questionNumberInSection,
}: QuestionScreenProps) {
  const language = useSurveyStore((s) => s.language);
  const isUrdu = language === 'ur';

  const { section, subsection, question } = item;
  const Icon = ICONS[section.icon] ?? User;
  const accent = getAccent(section.accent_color);
  const total = countQuestionsInSection(section, answers);
  const value = answers[question.id];
  const sectionProgress = Math.round((questionNumberInSection / Math.max(total, 1)) * 100);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ── Section identity ── */}
      <div className="shrink-0 px-5 pb-4 pt-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent.chip} ${accent.icon}`}
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-[clamp(13px,3.5vw,15px)] font-semibold leading-snug text-ink ${
                isUrdu ? 'font-urdu' : 'font-sans'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {isUrdu ? section.title_ur : section.title_en}
            </p>
            <p className="truncate text-[11.5px] text-ink-mute">
              {subsection
                ? isUrdu
                  ? subsection.title_ur
                  : subsection.title_en
                : isUrdu
                  ? section.title_en
                  : section.title_ur}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-chip px-2.5 py-1 text-[11px] font-bold tabular-nums ${accent.pill}`}
          >
            {questionNumberInSection}/{total}
          </span>
        </div>

        {/* Section-level progress — distinct from the survey-wide bar up top */}
        <div className="mt-3 h-1 overflow-hidden rounded-chip bg-line">
          <div
            className={`h-full rounded-chip transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${accent.bar}`}
            style={{ width: `${sectionProgress}%` }}
          />
        </div>
      </div>

      {/* ── Question + answer ── */}
      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <div className="animate-fade-up pb-6 pt-1">
          <BilingualText ur={question.text_ur} en={question.text_en} variant="question" />

          {(question.note_en || question.note_ur) && (
            <div className={`mt-3 rounded-card px-3.5 py-2.5 ${accent.tint}`}>
              {question.note_ur && (
                <p
                  className="whitespace-pre-line font-urdu text-[12px] leading-[1.9] text-ink-soft"
                  dir="rtl"
                >
                  {question.note_ur}
                </p>
              )}
              {question.note_en && (
                <p className="mt-1 whitespace-pre-line text-[11.5px] leading-relaxed text-ink-mute">
                  {question.note_en}
                </p>
              )}
            </div>
          )}
        </div>

        {renderInput(question, value, (v) => onAnswer(question.id, v), onAutoAdvance, accent)}
      </div>
    </div>
  );
}
