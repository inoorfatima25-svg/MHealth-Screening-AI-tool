export type QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'likert_scale'
  | 'likert_grid'
  | 'text_short'
  | 'text_long'
  | 'number'
  | 'yes_no'
  | 'yes_no_extent'
  | 'contact_dual';

export type Language = 'ur' | 'en';

export interface Option {
  value: string;
  label_ur: string;
  label_en: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text_ur: string;
  text_en: string;
  options?: Option[];
  scale_preset?: string;
  required: boolean;
  note_ur?: string;
  note_en?: string;
  conditional_on?: {
    question_id: string;
    value: string | string[];
  };
  grid_items?: {
    id: string;
    text_ur: string;
    text_en: string;
  }[];
  grid_scale?: Option[];
  max_selections?: number;
  min?: number;
  max?: number;
  allow_decimal?: boolean;
}

export interface Subsection {
  id: string;
  title_ur: string;
  title_en: string;
  questions: Question[];
}

export interface Section {
  id: string;
  title_ur: string;
  title_en: string;
  icon: string;
  accent_color: string;
  questions?: Question[];
  subsections?: Subsection[];
}

export type AnswerValue = string | string[] | number | Record<string, string | number>;

export interface ConsentData {
  name: string;
  date: string;
  agreed: boolean;
}

export type SafetyFollowUpChoice =
  | 'connect_support'
  | 'already_receiving'
  | 'decline_appreciated';
