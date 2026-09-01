import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AnswerValue,
  ConsentData,
  Language,
  SafetyFollowUpChoice,
} from '@/types/survey';

export type SurveyPhase =
  | 'welcome'
  | 'questions'
  | 'safety'
  | 'complete';

interface SurveyState {
  phase: SurveyPhase;
  language: Language;
  consent: ConsentData | null;
  answers: Record<string, AnswerValue>;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  startedAt: number | null;
  responseId: string | null;
  safetyFollowUp: SafetyFollowUpChoice | null;
  setLanguage: (lang: Language) => void;
  setConsent: (consent: ConsentData) => void;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  setPhase: (phase: SurveyPhase) => void;
  setPosition: (sectionIndex: number, questionIndex: number) => void;
  setResponseId: (id: string | null) => void;
  setSafetyFollowUp: (choice: SafetyFollowUpChoice) => void;
  reset: () => void;
}

const initialState = {
  phase: 'welcome' as SurveyPhase,
  language: 'ur' as Language,
  consent: null,
  answers: {},
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  startedAt: null as number | null,
  responseId: null as string | null,
  safetyFollowUp: null as SafetyFollowUpChoice | null,
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      ...initialState,
      setLanguage: (language) => set({ language }),
      setConsent: (consent) =>
        set({ consent, startedAt: Date.now(), phase: 'questions' }),
      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),
      setPhase: (phase) => set({ phase }),
      setPosition: (currentSectionIndex, currentQuestionIndex) =>
        set({ currentSectionIndex, currentQuestionIndex }),
      setResponseId: (responseId) => set({ responseId }),
      setSafetyFollowUp: (safetyFollowUp) => set({ safetyFollowUp }),
      reset: () => set(initialState),
    }),
    {
      name: 'mh-screening-survey',
      partialize: (state) => ({
        phase: state.phase,
        language: state.language,
        consent: state.consent,
        answers: state.answers,
        currentSectionIndex: state.currentSectionIndex,
        currentQuestionIndex: state.currentQuestionIndex,
        startedAt: state.startedAt,
        responseId: state.responseId,
        safetyFollowUp: state.safetyFollowUp,
      }),
    }
  )
);
