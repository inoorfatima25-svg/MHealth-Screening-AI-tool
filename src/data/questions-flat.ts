/**
 * Server-safe flattened question index.
 *
 * `src/data/**` is pure data (no 'use client', no browser APIs), so it can be
 * imported from server components and route handlers. This module flattens the
 * nested section → subsection → question tree into a lookup the admin panel
 * uses to label raw answer keys.
 *
 * Grid questions (PHQ-9, GAD-7) are expanded one level further: each grid ITEM
 * gets its own entry keyed `<gridId>.<itemId>` (e.g. `phq9_grid.phq9_i9`), which
 * is the same dotted path the CSV exporter emits.
 */
import { sections } from '@/data/questions';
import type { Question } from '@/types/survey';

export interface FlatQuestionMeta {
  /** Answer key — question id, or `<gridId>.<itemId>` for grid rows */
  id: string;
  /** 1-based section number as shown in the UI */
  section: number;
  sectionId: string;
  sectionTitleEn: string;
  sectionTitleUr: string;
  subsectionTitleEn?: string;
  /** English label */
  text: string;
  textUr: string;
  type: Question['type'];
  /** Set on grid item rows so callers can find the parent answer object */
  parentId?: string;
}

function buildIndex(): FlatQuestionMeta[] {
  const flat: FlatQuestionMeta[] = [];

  sections.forEach((section, sectionIndex) => {
    const items: { subsectionTitleEn?: string; question: Question }[] = [];

    section.questions?.forEach((question) => items.push({ question }));
    section.subsections?.forEach((sub) =>
      sub.questions.forEach((question) =>
        items.push({ subsectionTitleEn: sub.title_en, question })
      )
    );

    items.forEach(({ subsectionTitleEn, question }) => {
      const base = {
        section: sectionIndex + 1,
        sectionId: section.id,
        sectionTitleEn: section.title_en,
        sectionTitleUr: section.title_ur,
        subsectionTitleEn,
        type: question.type,
      };

      flat.push({
        ...base,
        id: question.id,
        text: question.text_en,
        textUr: question.text_ur,
      });

      // Expand grid items so each scored row is individually labelled
      question.grid_items?.forEach((item) => {
        flat.push({
          ...base,
          id: `${question.id}.${item.id}`,
          text: item.text_en,
          textUr: item.text_ur,
          parentId: question.id,
        });
      });
    });
  });

  return flat;
}

export const flattenedQuestions: FlatQuestionMeta[] = buildIndex();

export const questionsById: Record<string, FlatQuestionMeta> = Object.fromEntries(
  flattenedQuestions.map((q) => [q.id, q])
);

/** Section number → title, for grouping the detail page */
export const sectionTitles: { number: number; id: string; titleEn: string; titleUr: string }[] =
  sections.map((s, i) => ({
    number: i + 1,
    id: s.id,
    titleEn: s.title_en,
    titleUr: s.title_ur,
  }));

export const TOTAL_SECTIONS = sections.length;
