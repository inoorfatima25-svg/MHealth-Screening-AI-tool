import type { Question } from '@/types/survey';

type QPartial = Partial<Question> & Pick<Question, 'id' | 'type' | 'text_ur' | 'text_en'>;

export function q(p: QPartial): Question {
  return { required: true, ...p };
}

export function likert(
  id: string,
  text_ur: string,
  text_en: string,
  preset: string,
  extra?: Partial<Question>
): Question {
  return q({ id, type: 'likert_scale', text_ur, text_en, scale_preset: preset, ...extra });
}

export function opt(value: string, label_ur: string, label_en: string) {
  return { value, label_ur, label_en };
}
