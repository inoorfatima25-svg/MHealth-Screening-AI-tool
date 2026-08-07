'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CompletionScreen } from '@/components/CompletionScreen';
import { LanguageToggle } from '@/components/LanguageToggle';
import { NavigationButtons } from '@/components/NavigationButtons';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionScreen } from '@/components/QuestionScreen';
import { SafetyFollowUp } from '@/components/SafetyFollowUp';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { TOTAL_SECTIONS } from '@/data/questions';
import {
  computeGad7Score,
  computePhq9Score,
  getPhq9Item9Score,
  getVisibleFlatQuestions,
  isAnswered,
} from '@/lib/survey-utils';
import type { AnswerValue } from '@/types/survey';
import { upsertResponse } from '@/lib/supabase';
import { useSurveyStore } from '@/store/surveyStore';

export function SurveyWizard() {
  const router = useRouter();
  const {
    phase,
    consent,
    answers,
    language,
    startedAt,
    responseId,
    safetyFollowUp,
    setAnswer,
    setPhase,
    setPosition,
    setResponseId,
  } = useSurveyStore();

  const [flatIndex, setFlatIndex] = useState(0);
  const [showSafety, setShowSafety] = useState(false);
  const [showSectionNav, setShowSectionNav] = useState(false);

  const isUrdu = language === 'ur';

  const visibleQuestions = useMemo(
    () => getVisibleFlatQuestions(answers),
    [answers]
  );

  // Clamp flatIndex if visible questions shrink (conditional logic)
  useEffect(() => {
    if (phase !== 'questions') return;
    const max = Math.max(0, visibleQuestions.length - 1);
    if (flatIndex > max) setFlatIndex(max);
  }, [visibleQuestions.length, flatIndex, phase]);

  const currentItem = visibleQuestions[flatIndex];

  const progress =
    visibleQuestions.length > 0
      ? ((flatIndex + 1) / visibleQuestions.length) * 100
      : 0;

  // Which question number within the current section (1-based)
  const questionNumberInSection = useMemo(() => {
    if (!currentItem) return 1;
    const sectionId = currentItem.section.id;
    let n = 0;
    for (let i = 0; i <= flatIndex; i++) {
      if (visibleQuestions[i]?.section.id === sectionId) n++;
    }
    return n;
  }, [currentItem, flatIndex, visibleQuestions]);

  // Build a list of unique sections that have at least one visible question
  const visibleSections = useMemo(() => {
    const seen = new Set<number>();
    const result: {
      sectionIndex: number;
      label_en: string;
      label_ur: string;
      firstFlatIndex: number;
    }[] = [];
    visibleQuestions.forEach((item, idx) => {
      if (!seen.has(item.sectionIndex)) {
        seen.add(item.sectionIndex);
        result.push({
          sectionIndex: item.sectionIndex,
          label_en: item.section.title_en,
          label_ur: item.section.title_ur,
          firstFlatIndex: idx,
        });
      }
    });
    return result;
  }, [visibleQuestions]);

  // Index of the current section in the visibleSections array
  const currentSectionNavIndex = useMemo(() => {
    if (!currentItem) return 0;
    return visibleSections.findIndex(
      (s) => s.sectionIndex === currentItem.sectionIndex
    );
  }, [currentItem, visibleSections]);

  // ── Save progress to Supabase (non-blocking, won't crash if no credentials) ──
  const saveSection = useCallback(
    async (sectionIndex: number) => {
      if (!consent) return;
      try {
        const id = await upsertResponse({
          id: responseId ?? undefined,
          consent,
          answers,
          lastSection: sectionIndex + 2,
          completionStatus: 'in_progress',
          deviceInfo:
            typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          durationSeconds: startedAt
            ? Math.floor((Date.now() - startedAt) / 1000)
            : undefined,
        });
        if (id) setResponseId(id);
      } catch (err) {
        // Supabase not configured — continue silently
        console.warn('saveSection skipped:', err);
      }
    },
    [answers, consent, responseId, setResponseId, startedAt]
  );

  const finalizeSubmit = useCallback(
    async (phq9Flag: boolean) => {
      if (!consent) return;
      try {
        const gad7 = computeGad7Score(answers);
        const phq9 = computePhq9Score(answers);
        await upsertResponse({
          id: responseId ?? undefined,
          consent,
          answers,
          lastSection: TOTAL_SECTIONS + 1,
          completionStatus: 'completed',
          gad7Score: gad7,
          phq9Score: phq9,
          phq9Item9Flag: phq9Flag,
          safetyFollowUp,
          durationSeconds: startedAt
            ? Math.floor((Date.now() - startedAt) / 1000)
            : undefined,
          deviceInfo:
            typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        });
      } catch (err) {
        console.warn('finalizeSubmit skipped:', err);
      }
      setPhase('complete');
      router.push('/survey/complete');
    },
    [answers, consent, responseId, router, safetyFollowUp, setPhase, startedAt]
  );

  // ── Go forward one question ──────────────────────────────────────────────
  const goNext = useCallback(async () => {
    if (!currentItem) return;

    const prevSectionIndex = currentItem.sectionIndex;
    const isLast = flatIndex >= visibleQuestions.length - 1;

    if (isLast) {
      const phq9Flag = getPhq9Item9Score(answers) >= 1;
      if (phq9Flag && !safetyFollowUp && !showSafety) {
        setShowSafety(true);
        return;
      }
      await finalizeSubmit(phq9Flag);
      return;
    }

    const newIndex = flatIndex + 1;
    const nextItem = visibleQuestions[newIndex];

    // Crossed a section boundary — save progress
    if (nextItem && nextItem.sectionIndex !== prevSectionIndex) {
      await saveSection(prevSectionIndex);
    }

    setFlatIndex(newIndex);
    setPosition(nextItem?.sectionIndex ?? prevSectionIndex, newIndex);
  }, [
    answers,
    currentItem,
    flatIndex,
    finalizeSubmit,
    safetyFollowUp,
    showSafety,
    visibleQuestions,
    saveSection,
    setPosition,
  ]);

  // ── Go back one question ─────────────────────────────────────────────────
  const goPrevious = useCallback(() => {
    if (showSafety) {
      setShowSafety(false);
      return;
    }
    if (flatIndex > 0) {
      const newIndex = flatIndex - 1;
      setFlatIndex(newIndex);
      const prevItem = visibleQuestions[newIndex];
      if (prevItem) setPosition(prevItem.sectionIndex, newIndex);
    }
  }, [flatIndex, showSafety, visibleQuestions, setPosition]);

  // ── Jump to a specific section (section nav) ─────────────────────────────
  const jumpToSection = useCallback(
    (firstFlatIndex: number) => {
      setFlatIndex(firstFlatIndex);
      const item = visibleQuestions[firstFlatIndex];
      if (item) setPosition(item.sectionIndex, firstFlatIndex);
      setShowSectionNav(false);
    },
    [visibleQuestions, setPosition]
  );

  // ── Jump to previous section ─────────────────────────────────────────────
  const goToPreviousSection = useCallback(() => {
    if (currentSectionNavIndex <= 0) return;
    const prev = visibleSections[currentSectionNavIndex - 1];
    if (prev) jumpToSection(prev.firstFlatIndex);
  }, [currentSectionNavIndex, visibleSections, jumpToSection]);

  // ── Jump to next section ─────────────────────────────────────────────────
  const goToNextSection = useCallback(() => {
    if (currentSectionNavIndex >= visibleSections.length - 1) return;
    const next = visibleSections[currentSectionNavIndex + 1];
    if (next) jumpToSection(next.firstFlatIndex);
  }, [currentSectionNavIndex, visibleSections, jumpToSection]);

  const canGoNext = currentItem
    ? !currentItem.question.required ||
      isAnswered(currentItem.question, answers[currentItem.question.id])
    : false;

  // ── Phases ───────────────────────────────────────────────────────────────
  if (phase === 'welcome') {
    return (
      <div className="survey-container">
        <WelcomeScreen />
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="survey-container">
        <CompletionScreen />
      </div>
    );
  }

  if (showSafety) {
    return (
      <div className="survey-container">
        <header className="flex shrink-0 items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Back"
            className="tap flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-surface-sunken"
          >
            <ArrowLeft className={`h-5 w-5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>
          <LanguageToggle />
        </header>
        <SafetyFollowUp
          onContinue={async () => {
            setShowSafety(false);
            await finalizeSubmit(true);
          }}
        />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="survey-container items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
          <p className="text-sm text-ink-mute">Loading…</p>
        </div>
      </div>
    );
  }

  const sectionLabel = `${currentItem.sectionIndex + 1} / ${TOTAL_SECTIONS}`;

  return (
    <div className="survey-container" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* ── Header ── */}
      <header className="relative z-30 shrink-0">
        <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
          {/* Back */}
          <button
            type="button"
            onClick={goPrevious}
            disabled={flatIndex === 0}
            aria-label="Previous question"
            className="tap flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-card disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowLeft className={`h-5 w-5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>

          {/* Section label — tap to open the navigator */}
          <button
            type="button"
            onClick={() => setShowSectionNav((v) => !v)}
            aria-expanded={showSectionNav}
            className={`tap flex min-h-[36px] items-center gap-1.5 rounded-chip px-3.5 text-[12px] font-semibold
              ${
                showSectionNav
                  ? 'bg-primary text-white shadow-glow'
                  : 'border border-line bg-card text-ink-soft shadow-soft hover:text-ink'
              }
              ${isUrdu ? 'font-urdu' : ''}`}
          >
            <span className="tabular-nums">
              {isUrdu ? `حصہ ${sectionLabel}` : `Section ${sectionLabel}`}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                showSectionNav ? 'rotate-180' : ''
              }`}
            />
          </button>

          <LanguageToggle />
        </div>

        {/* Single, survey-wide progress indicator */}
        <div className="flex items-center gap-2.5 px-5 pb-3">
          <ProgressBar value={progress} className="flex-1 rounded-chip" />
          <span className="w-9 shrink-0 text-end text-[10.5px] font-bold tabular-nums text-ink-mute">
            {Math.round(progress)}%
          </span>
        </div>
      </header>

      {/* ── Section navigator ── */}
      {showSectionNav && (
        <>
          <button
            type="button"
            aria-label="Close section navigator"
            onClick={() => setShowSectionNav(false)}
            className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[2px]"
          />

          <div className="absolute inset-x-3 top-[94px] z-30 animate-sheet-in overflow-hidden rounded-[20px] border border-line bg-card shadow-float">
            {/* Prev / next section */}
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <button
                type="button"
                onClick={goToPreviousSection}
                disabled={currentSectionNavIndex <= 0}
                className="tap flex items-center gap-1 rounded-chip px-2 py-1 text-[11px] font-medium text-ink-soft hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronLeft className={`h-3.5 w-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                {isUrdu ? 'پچھلا' : 'Prev'}
              </button>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-mute">
                {isUrdu ? 'حصے' : 'Sections'}
              </span>
              <button
                type="button"
                onClick={goToNextSection}
                disabled={currentSectionNavIndex >= visibleSections.length - 1}
                className="tap flex items-center gap-1 rounded-chip px-2 py-1 text-[11px] font-medium text-ink-soft hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-25"
              >
                {isUrdu ? 'اگلا' : 'Next'}
                <ChevronRight className={`h-3.5 w-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Section list */}
            <div className="scroll-soft max-h-[min(58vh,380px)] overflow-y-auto p-1.5">
              {visibleSections.map((sec, navIdx) => {
                const isCurrent = sec.sectionIndex === currentItem.sectionIndex;
                const isVisited = sec.firstFlatIndex <= flatIndex;

                return (
                  <button
                    key={sec.sectionIndex}
                    type="button"
                    onClick={() => jumpToSection(sec.firstFlatIndex)}
                    className={`tap flex w-full items-center gap-3 rounded-card px-2.5 py-2.5 text-start
                      ${isCurrent ? 'bg-primary-light' : 'hover:bg-surface-sunken'}`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold tabular-nums
                        ${
                          isCurrent
                            ? 'bg-primary text-white'
                            : isVisited
                              ? 'bg-primary-light text-primary'
                              : 'bg-surface-sunken text-ink-mute'
                        }`}
                    >
                      {isVisited && !isCurrent ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : (
                        navIdx + 1
                      )}
                    </span>

                    <p
                      className={`min-w-0 flex-1 truncate text-[13px] ${
                        isCurrent ? 'font-semibold text-primary-dark' : 'text-ink-soft'
                      } ${isUrdu ? 'font-urdu' : ''}`}
                    >
                      {isUrdu ? sec.label_ur : sec.label_en}
                    </p>

                    {isCurrent && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Question (keyed so each one animates in) ── */}
      <div key={flatIndex} className="flex min-h-0 flex-1 flex-col">
        <QuestionScreen
          item={currentItem}
          answers={answers}
          onAnswer={(id, value) => setAnswer(id, value as AnswerValue)}
          onAutoAdvance={goNext}
          questionNumberInSection={questionNumberInSection}
        />
      </div>

      {/* ── Footer ── */}
      <NavigationButtons
        onPrevious={goPrevious}
        onNext={goNext}
        canGoNext={canGoNext}
        canGoPrevious={flatIndex > 0}
        isLast={flatIndex >= visibleQuestions.length - 1}
      />
    </div>
  );
}
