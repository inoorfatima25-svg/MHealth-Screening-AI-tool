'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CompletionScreen } from '@/components/CompletionScreen';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProgressBar } from '@/components/ProgressBar';
import { SectionScreen, type SectionQuestion } from '@/components/SectionScreen';
import { ContactPage } from '@/components/ContactPage';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { MANDATORY_SECTION_COUNT, sections, TOTAL_SECTIONS } from '@/data/questions';
import { areMandatorySectionsComplete, computeGad7Score, computePhq9Score, getPhq9Item9Score, isAnswered, shouldShowQuestion } from '@/lib/survey-utils';
import type { AnswerValue, Question } from '@/types/survey';
import { upsertResponse } from '@/lib/supabase';
import { useSurveyStore } from '@/store/surveyStore';

const QUESTIONS_PER_PAGE = 6;

function getSectionQuestions(sectionIndex: number, answers: Record<string, AnswerValue>): SectionQuestion[] {
  const section = sections[sectionIndex];
  if (!section) return [];
  const list: SectionQuestion[] = [];
  const add = (question: Question) => {
    if (shouldShowQuestion(question, answers)) list.push({ question, number: list.length + 1 });
  };
  section.questions?.forEach(add);
  section.subsections?.forEach((sub) => sub.questions.forEach(add));
  return list;
}

function splitIntoPages<T>(items: T[]): T[][] {
  if (items.length <= QUESTIONS_PER_PAGE) return [items];
  const firstCount = Math.ceil(items.length / 2);
  return [items.slice(0, firstCount), items.slice(firstCount)];
}

export function SurveyWizard() {
  const {
    phase, consent, answers, language, startedAt, responseId,
    currentSectionIndex, currentQuestionIndex, setAnswer, setPhase, setPosition,
    setResponseId,
  } = useSurveyStore();
  const [showSectionNav, setShowSectionNav] = useState(false);
  const isUrdu = language === 'ur';

  const sectionIndex = Math.min(Math.max(currentSectionIndex, 0), TOTAL_SECTIONS - 1);
  const isContactPage = sections[sectionIndex]?.id === 'contact';
  const allSectionQuestions = useMemo(() => getSectionQuestions(sectionIndex, answers), [sectionIndex, answers]);
  const pages = useMemo(() => splitIntoPages(allSectionQuestions), [allSectionQuestions]);
  const pageIndex = Math.min(Math.max(currentQuestionIndex, 0), Math.max(pages.length - 1, 0));
  const currentPage = pages[pageIndex] ?? [];

  useEffect(() => {
    if (phase !== 'questions') return;
    if (currentSectionIndex !== sectionIndex || currentQuestionIndex !== pageIndex) {
      setPosition(sectionIndex, pageIndex);
    }
  }, [phase, currentSectionIndex, currentQuestionIndex, pageIndex, sectionIndex, setPosition]);

  const completedSections = useMemo(() => sections.map((section, idx) => {
    const qs = getSectionQuestions(idx, answers);
    return qs.every(({ question }) => !question.required || isAnswered(question, answers[question.id]));
  }), [answers]);

  const surveyProgress = ((sectionIndex + pageIndex / Math.max(pages.length, 1)) / TOTAL_SECTIONS) * 100;

  const saveSection = useCallback(async (idx: number) => {
    if (!consent) return;
    try {
      const id = await upsertResponse({
        id: responseId ?? undefined,
        consent,
        answers,
        lastSection: idx + 1,
        completionStatus: 'in_progress',
        deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        durationSeconds: startedAt ? Math.floor((Date.now() - startedAt) / 1000) : undefined,
      });
      if (id) setResponseId(id);
    } catch (err) {
      console.warn('saveSection skipped:', err);
    }
  }, [answers, consent, responseId, setResponseId, startedAt]);

  const finalizeSubmit = useCallback(async () => {
    if (!consent || !areMandatorySectionsComplete(answers)) return;
    try {
      await upsertResponse({
        id: responseId ?? undefined,
        consent,
        answers,
        lastSection: TOTAL_SECTIONS,
        completionStatus: 'completed',
        gad7Score: computeGad7Score(answers),
        phq9Score: computePhq9Score(answers),
        phq9Item9Flag: getPhq9Item9Score(answers) >= 1,
        durationSeconds: startedAt ? Math.floor((Date.now() - startedAt) / 1000) : undefined,
        deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });
    } catch (err) {
      console.warn('finalizeSubmit skipped:', err);
    }
    setPhase('complete');
  }, [answers, consent, responseId, setPhase, startedAt]);

  const validatePage = useCallback(() => currentPage.every(({ question }) => !question.required || isAnswered(question, answers[question.id])), [answers, currentPage]);
  const validateSection = useCallback(() => allSectionQuestions.every(({ question }) => !question.required || isAnswered(question, answers[question.id])), [allSectionQuestions, answers]);

  const goBack = useCallback(() => {
    if (pageIndex > 0) {
      setPosition(sectionIndex, pageIndex - 1);
      return;
    }
    if (sectionIndex > 0) {
      const previousQs = getSectionQuestions(sectionIndex - 1, answers);
      const previousPages = splitIntoPages(previousQs);
      setPosition(sectionIndex - 1, previousPages.length - 1);
    }
  }, [answers, pageIndex, sectionIndex, setPosition]);

  const goForward = useCallback(async () => {
    if (!validatePage()) return;
    if (pageIndex < pages.length - 1) {
      setPosition(sectionIndex, pageIndex + 1);
      return;
    }
    if (!validateSection()) return;

    await saveSection(sectionIndex);

    if (sectionIndex >= TOTAL_SECTIONS - 1) {
      await finalizeSubmit();
      return;
    }
    setPosition(sectionIndex + 1, 0);
  }, [answers, finalizeSubmit, pageIndex, pages.length, saveSection, sectionIndex, setPosition, validatePage, validateSection]);

  const jumpToSection = useCallback((idx: number) => {
    // Allow review of completed/current sections, but don't let a participant
    // skip ahead of an unanswered required section.
    const firstIncomplete = completedSections.findIndex((done, i) => i < MANDATORY_SECTION_COUNT && !done);
    if (idx > sectionIndex && firstIncomplete !== -1 && idx > firstIncomplete) return;
    setPosition(idx, 0);
    setShowSectionNav(false);
  }, [completedSections, sectionIndex, setPosition]);

  if (phase === 'welcome') return <div className="survey-container"><WelcomeScreen /></div>;
  if (phase === 'complete') return <div className="survey-container"><CompletionScreen /></div>;

  const section = sections[sectionIndex];
  const sectionLabel = isContactPage
    ? (isUrdu ? 'رابطے کی معلومات (اختیاری)' : 'Contact Information (Optional)')
    : (isUrdu ? `حصہ ${sectionIndex + 1} از ${TOTAL_SECTIONS}` : `Section ${sectionIndex + 1} of ${TOTAL_SECTIONS}`);
  const isLastPage = pageIndex === pages.length - 1;
  const canAdvance = validatePage() && (!isLastPage || validateSection());
  const firstIncomplete = completedSections.findIndex((done, i) => i < MANDATORY_SECTION_COUNT && !done);

  return (
    <div className="survey-container" dir={isUrdu ? 'rtl' : 'ltr'}>
      <header className="relative z-30 shrink-0 border-b border-line bg-card/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
          <button type="button" onClick={goBack} disabled={sectionIndex === 0 && pageIndex === 0} aria-label={isUrdu ? 'واپس' : 'Back'} className="tap flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-surface-sunken disabled:opacity-25">
            <ArrowLeft className={`h-5 w-5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>
          <button type="button" onClick={() => setShowSectionNav((v) => !v)} aria-expanded={showSectionNav} className={`tap flex min-h-[38px] items-center gap-1.5 rounded-chip border px-3 text-[12px] font-semibold ${showSectionNav ? 'border-primary bg-primary text-white' : 'border-line bg-card text-ink-soft'} ${isUrdu ? 'font-urdu' : ''}`}>
            {sectionLabel}<ChevronDown className={`h-3.5 w-3.5 ${showSectionNav ? 'rotate-180' : ''}`} />
          </button>
          <LanguageToggle />
        </div>
        <div className="flex items-center gap-2.5 px-5 pb-3">
          <ProgressBar value={Math.min(100, surveyProgress)} className="flex-1 rounded-chip" />
          <span className="w-9 shrink-0 text-end text-[10.5px] font-bold tabular-nums text-ink-mute">{Math.round(surveyProgress)}%</span>
        </div>
      </header>

      {showSectionNav && (
        <>
          <button type="button" aria-label="Close section navigator" onClick={() => setShowSectionNav(false)} className="absolute inset-0 z-20 bg-ink/20" />
          <div className="absolute inset-x-3 top-[94px] z-30 overflow-hidden rounded-[20px] border border-line bg-card shadow-float">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <button type="button" onClick={() => jumpToSection(Math.max(0, sectionIndex - 1))} disabled={sectionIndex === 0} className="tap flex items-center gap-1 rounded-chip px-2 py-1 text-[11px] text-ink-soft disabled:opacity-25"><ChevronLeft className="h-3.5 w-3.5" />{isUrdu ? 'پچھلا' : 'Prev'}</button>
              <span className={`text-[10.5px] font-bold uppercase tracking-wider text-ink-mute ${isUrdu ? 'font-urdu' : ''}`}>{isUrdu ? 'حصے' : 'Sections'}</span>
              <button type="button" onClick={() => jumpToSection(Math.min(TOTAL_SECTIONS - 1, sectionIndex + 1))} disabled={sectionIndex === TOTAL_SECTIONS - 1 || (firstIncomplete !== -1 && sectionIndex + 1 > firstIncomplete)} className="tap flex items-center gap-1 rounded-chip px-2 py-1 text-[11px] text-ink-soft disabled:opacity-25">{isUrdu ? 'اگلا' : 'Next'}<ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="scroll-soft max-h-[58vh] overflow-y-auto p-1.5">
              {sections.map((sec, idx) => {
                if (sec.id === 'contact') return null;
                const done = completedSections[idx];
                const locked = idx > sectionIndex && firstIncomplete !== -1 && idx > firstIncomplete;
                return <button key={sec.id} type="button" disabled={locked} onClick={() => jumpToSection(idx)} className={`tap flex w-full items-center gap-3 rounded-card px-2.5 py-2.5 text-start ${idx === sectionIndex ? 'bg-primary-light' : 'hover:bg-surface-sunken'} ${locked ? 'opacity-35' : ''}`}>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold ${idx === sectionIndex ? 'bg-primary text-white' : done ? 'bg-primary-light text-primary' : 'bg-surface-sunken text-ink-mute'}`}>{done && idx !== sectionIndex ? <Check className="h-3 w-3" /> : idx + 1}</span>
                  <span className={`min-w-0 flex-1 truncate text-[12px] ${idx === sectionIndex ? 'font-semibold text-primary-dark' : 'text-ink-soft'} ${isUrdu ? 'font-urdu' : ''}`}>{isUrdu ? sec.title_ur : sec.title_en}</span>
                  {idx === TOTAL_SECTIONS - 1 && <span className={`text-[9px] text-ink-mute ${isUrdu ? 'font-urdu' : ''}`}>{isUrdu ? 'اختیاری' : 'Optional'}</span>}
                </button>;
              })}
            </div>
          </div>
        </>
      )}

      {isContactPage ? (
        <ContactPage />
      ) : (
        <SectionScreen section={section} questions={currentPage} answers={answers} onAnswer={(id, value) => setAnswer(id, value)} page={pageIndex + 1} totalPages={pages.length} />
      )}

      <footer className="shrink-0 border-t border-line bg-card/90 px-4 py-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-5">
        {!canAdvance && <p className={`mb-2 text-center text-[11px] text-ink-mute ${isUrdu ? 'font-urdu' : ''}`}>{isUrdu ? 'براہِ کرم اس صفحے کے تمام ضروری سوالات مکمل کریں۔' : 'Please answer all required questions on this page to continue.'}</p>}
        <div className="flex items-center gap-3">
          <button type="button" onClick={goBack} disabled={sectionIndex === 0 && pageIndex === 0} className={`tap min-h-[52px] rounded-card px-5 text-sm font-semibold text-ink-soft hover:bg-surface-sunken disabled:opacity-25 ${isUrdu ? 'font-urdu' : ''}`}>{isUrdu ? 'پچھلا' : 'Back'}</button>
          <button type="button" onClick={goForward} disabled={!canAdvance} className={`tap flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-card bg-gradient-to-br from-primary to-primary-bright text-sm font-bold text-white shadow-glow disabled:bg-line disabled:bg-none disabled:text-white/70 disabled:shadow-none ${isUrdu ? 'font-urdu' : ''}`}>
            <span>{isContactPage ? (isUrdu ? 'آگے بڑھیں' : 'Continue') : isLastPage && sectionIndex === TOTAL_SECTIONS - 1 ? (isUrdu ? 'جمع کرائیں' : 'Submit') : isLastPage ? (isUrdu ? 'اگلے حصے پر جائیں' : 'Next section') : (isUrdu ? 'اگلا صفحہ' : 'Next page')}</span>
            {isLastPage && sectionIndex === TOTAL_SECTIONS - 1 ? <Check className="h-4 w-4" /> : <ChevronRight className={`h-4 w-4 ${isUrdu ? 'rotate-180' : ''}`} />}
          </button>
        </div>
      </footer>
    </div>
  );
}
