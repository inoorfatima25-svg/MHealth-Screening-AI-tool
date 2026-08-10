import { SCALES } from '@/data/scales';
import { MANDATORY_SECTION_COUNT, sections } from '@/data/questions';
import type { AnswerValue, Question, Section, Subsection } from '@/types/survey';

export interface FlatQuestion {
  section: Section;
  subsection?: Subsection;
  question: Question;
  sectionIndex: number;
  questionIndexInSection: number;
  globalIndex: number;
}

export function getAllQuestionsFlat(): FlatQuestion[] {
  const flat: FlatQuestion[] = [];
  let globalIndex = 0;

  sections.forEach((section, sectionIndex) => {
    const items: { subsection?: Subsection; question: Question }[] = [];

    if (section.questions) {
      section.questions.forEach((question) => items.push({ question }));
    }
    if (section.subsections) {
      section.subsections.forEach((subsection) => {
        subsection.questions.forEach((question) =>
          items.push({ subsection, question })
        );
      });
    }

    items.forEach((item, questionIndexInSection) => {
      flat.push({
        section,
        subsection: item.subsection,
        question: item.question,
        sectionIndex,
        questionIndexInSection,
        globalIndex,
      });
      globalIndex += 1;
    });
  });

  return flat;
}

export function getQuestionOptions(question: Question) {
  if (question.options) return question.options;
  if (question.scale_preset) return SCALES[question.scale_preset] ?? [];
  return [];
}

export function isAnswered(question: Question, value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;

  switch (question.type) {
    case 'multi_select':
      return Array.isArray(value) && value.length > 0;
    case 'text_short':
    case 'text_long':
      return typeof value === 'string' && value.trim().length > 0;
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);
    case 'likert_grid':
      if (typeof value !== 'object' || Array.isArray(value)) return false;
      return (question.grid_items ?? []).every(
        (item) => value[item.id] !== undefined && value[item.id] !== ''
      );
    case 'contact_dual':
      if (typeof value !== 'object' || Array.isArray(value)) return false;
      return Boolean(value.phone || value.email);
    default:
      return value !== '';
  }
}

export function shouldShowQuestion(
  question: Question,
  answers: Record<string, AnswerValue>
): boolean {
  if (!question.conditional_on) return true;
  const parent = answers[question.conditional_on.question_id];
  const expected = question.conditional_on.value;
  if (Array.isArray(expected)) {
    return expected.includes(String(parent));
  }
  return String(parent) === expected;
}

export function getVisibleFlatQuestions(
  answers: Record<string, AnswerValue>
): FlatQuestion[] {
  return getAllQuestionsFlat().filter((item) =>
    shouldShowQuestion(item.question, answers)
  );
}

export function computeGad7Score(answers: Record<string, AnswerValue>): number {
  const grid = answers['gad7_grid'];
  if (!grid || typeof grid !== 'object' || Array.isArray(grid)) return 0;
  return Object.values(grid as Record<string, number>).reduce(
    (sum, v) => sum + Number(v || 0),
    0
  );
}

export function computePhq9Score(answers: Record<string, AnswerValue>): number {
  const grid = answers['phq9_grid'];
  if (!grid || typeof grid !== 'object' || Array.isArray(grid)) return 0;
  return Object.values(grid as Record<string, number>).reduce(
    (sum, v) => sum + Number(v || 0),
    0
  );
}

export function getPhq9Item9Score(answers: Record<string, AnswerValue>): number {
  const grid = answers['phq9_grid'];
  if (!grid || typeof grid !== 'object' || Array.isArray(grid)) return 0;
  return Number((grid as Record<string, number>)['phq9_i9'] ?? 0);
}

export function countQuestionsInSection(
  section: Section,
  answers: Record<string, AnswerValue>
): number {
  let count = 0;
  const all = section.questions ?? [];
  const subs = section.subsections?.flatMap((s) => s.questions) ?? [];
  [...all, ...subs].forEach((question) => {
    if (shouldShowQuestion(question, answers)) count += 1;
  });
  return count;
}

export { MANDATORY_SECTION_COUNT };

export function isSectionComplete(
  sectionIndex: number,
  answers: Record<string, AnswerValue>
): boolean {
  return getAllQuestionsFlat()
    .filter(
      (item) =>
        item.sectionIndex === sectionIndex &&
        shouldShowQuestion(item.question, answers)
    )
    .every(
      (item) =>
        !item.question.required ||
        isAnswered(item.question, answers[item.question.id])
    );
}

export function areMandatorySectionsComplete(
  answers: Record<string, AnswerValue>
): boolean {
  for (let i = 0; i < MANDATORY_SECTION_COUNT; i++) {
    if (!isSectionComplete(i, answers)) return false;
  }
  return true;
}

export function findFirstIncompleteMandatoryFlatIndex(
  answers: Record<string, AnswerValue>
): number | null {
  const visible = getVisibleFlatQuestions(answers);
  for (let idx = 0; idx < visible.length; idx++) {
    const item = visible[idx];
    if (item.sectionIndex >= MANDATORY_SECTION_COUNT) break;
    if (
      item.question.required &&
      !isAnswered(item.question, answers[item.question.id])
    ) {
      return idx;
    }
  }
  return null;
}
