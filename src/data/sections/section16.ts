import { q } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section16: Section = {
  id: 's16',
  title_ur: 'PHQ-9 — ڈپریشن کی علامات',
  title_en: 'PHQ-9 — Depression Symptoms',
  icon: 'heart-pulse',
  accent_color: 'blue',
  questions: [
    q({
      id: 'phq9_grid',
      type: 'likert_grid',
      text_ur: 'پچھلے دو ہفتوں میں، آپ کو درج ذیل مسائل کتنی بار پریشان کرتے رہے؟',
      text_en: 'Over the last two weeks, how often have you been bothered by the following problems?',
      scale_preset: 'gad7_phq9',
      grid_items: [
        { id: 'phq9_i1', text_ur: 'کاموں میں دلچسپی یا خوشی کم محسوس ہونا', text_en: 'Little interest or pleasure in doing things' },
        { id: 'phq9_i2', text_ur: 'اداسی، مایوسی، یا ناامیدی محسوس کرنا', text_en: 'Feeling down, depressed, or hopeless' },
        { id: 'phq9_i3', text_ur: 'نیند آنے یا برقرار رکھنے میں دشواری، یا بہت زیادہ سونا', text_en: 'Trouble falling or staying asleep, or sleeping too much' },
        { id: 'phq9_i4', text_ur: 'توانائی کی کمی یا تھکاوٹ محسوس کرنا', text_en: 'Feeling tired or having little energy' },
        { id: 'phq9_i5', text_ur: 'بھوک کم لگنا یا زیادہ کھانا', text_en: 'Poor appetite or overeating' },
        { id: 'phq9_i6', text_ur: 'اپنے بارے میں برا محسوس کرنا — یا یہ کہ آپ ناکام ہیں', text_en: 'Feeling bad about yourself — or that you are a failure' },
        { id: 'phq9_i7', text_ur: 'پڑھنے یا TV دیکھنے جیسی چیزوں پر توجہ مرکوز کرنا مشکل ہونا', text_en: 'Trouble concentrating on things' },
        { id: 'phq9_i8', text_ur: 'اتنی سستی سے بولنا یا حرکت کرنا کہ دوسرے نوٹس کریں — یا بہت زیادہ بے چینی', text_en: 'Moving or speaking slowly — or being very fidgety or restless' },
        { id: 'phq9_i9', text_ur: 'یہ خیال آنا کہ مر جانا بہتر ہو، یا خود کو نقصان پہنچانے کے خیالات', text_en: 'Thoughts that you would be better off dead, or of hurting yourself' },
      ],
    }),
  ],
};
