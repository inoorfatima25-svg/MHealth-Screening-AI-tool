import { q } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section15: Section = {
  id: 's15',
  title_ur: 'GAD-7 — بے چینی کی علامات',
  title_en: 'GAD-7 — Anxiety Symptoms',
  icon: 'activity',
  accent_color: 'blue',
  questions: [
    q({
      id: 'gad7_grid',
      type: 'likert_grid',
      text_ur: 'پچھلے دو ہفتوں میں، آپ کو درج ذیل مسائل کتنی بار پریشان کرتے رہے؟',
      text_en: 'Over the last two weeks, how often have you been bothered by the following problems?',
      scale_preset: 'gad7_phq9',
      grid_items: [
        { id: 'gad7_i1', text_ur: 'گھبراہٹ، بے چینی، یا کنارے پر ہونے کا احساس', text_en: 'Feeling nervous, anxious, or on edge' },
        { id: 'gad7_i2', text_ur: 'فکر کو روکنا یا قابو کرنا مشکل ہونا', text_en: 'Not being able to stop or control worrying' },
        { id: 'gad7_i3', text_ur: 'مختلف چیزوں کے بارے میں بہت زیادہ فکر کرنا', text_en: 'Worrying too much about different things' },
        { id: 'gad7_i4', text_ur: 'آرام کرنا مشکل ہونا', text_en: 'Trouble relaxing' },
        { id: 'gad7_i5', text_ur: 'اتنی بے چینی کہ بیٹھنا مشکل ہو', text_en: 'Being so restless that it is hard to sit still' },
        { id: 'gad7_i6', text_ur: 'آسانی سے چڑچڑا یا ناراض ہو جانا', text_en: 'Becoming easily annoyed or irritable' },
        { id: 'gad7_i7', text_ur: 'خوف محسوس کرنا، جیسے کچھ برا ہونے والا ہو', text_en: 'Feeling afraid, as if something awful might happen' },
      ],
    }),
  ],
};
