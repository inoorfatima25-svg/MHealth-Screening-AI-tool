import { q, likert } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section10: Section = {
  id: 's10',
  title_ur: 'علاقائی اور ثقافتی ایڈجسٹمنٹ',
  title_en: 'Regional and Cultural Adjustment',
  icon: 'map-pin',
  accent_color: 'primary',
  questions: [
    q({ id: 's10_q1', type: 'text_short', text_ur: 'آپ پاکستان کے کس صوبے یا علاقے سے تعلق رکھتے ہیں؟', text_en: 'Which province or region of Pakistan do you belong to?' }),
    q({ id: 's10_q2', type: 'yes_no_extent', text_ur: 'کیا ثقافتی، لسانی، یا علاقائی فرقوں نے یونیورسٹی زندگی میں ایڈجسٹ ہونا مشکل بنایا؟', text_en: 'Have cultural, language, or regional differences made it difficult for you to adjust to university life?', scale_preset: 'yes_no_extent' }),
    q({ id: 's10_q3', type: 'yes_no_extent', text_ur: 'کیا آپ نے کبھی اپنے علاقائی یا ثقافتی پس منظر کی وجہ سے نظرانداز یا غلط سمجھے جانے کا احساس کیا؟', text_en: 'Have you ever felt ignored or misunderstood due to your regional or cultural background?', scale_preset: 'yes_no_extent' }),
    likert('s10_q4', 'کیا آپ یونیورسٹی کے ماحول میں اپنی ثقافتی شناخت ظاہر کرنے میں آرام دہ محسوس کرتے ہیں؟', 'Do you feel comfortable expressing your cultural identity in the university environment?', 'comfort'),
    likert('s10_q5', 'کیا اپنے آبائی شہر یا خاندان سے دور رہنے نے آپ کی ذہنی صحت یا دباؤ پر اثر ڈالا ہے؟', 'Has being away from your hometown or family affected your mental health or stress levels?', 'severity'),
  ],
};
