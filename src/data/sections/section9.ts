import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section9: Section = {
  id: 's9',
  title_ur: 'رہائشی انتظامات',
  title_en: 'Living Arrangements',
  icon: 'building',
  accent_color: 'primary',
  questions: [
    q({
      id: 's9_q1', type: 'single_select',
      text_ur: 'آپ فی الوقت خاندان کے ساتھ، ہاسٹل میں، یا اکیلے رہتے ہیں؟',
      text_en: 'Do you currently live with family, in a hostel, or alone?',
      options: [opt('with_family', 'خاندان کے ساتھ', 'With family'), opt('hostel', 'ہاسٹل', 'Hostel'), opt('alone', 'اکیلے', 'Alone'), opt('other', 'دیگر', 'Other')],
    }),
    likert('s9_q2', 'آپ اپنے موجودہ رہائشی انتظام کو کتنا آرام دہ اور مددگار پاتے ہیں؟', 'How comfortable and supportive do you find your current living arrangement?', 'comfort'),
    q({ id: 's9_q3', type: 'yes_no_extent', text_ur: 'کیا آپ کو لگتا ہے کہ آپ کا رہائشی ماحول آپ کے موڈ یا روزمرہ کاموں پر اثر ڈالتا ہے؟', text_en: 'Do you think your living environment affects your mood or daily functioning?', scale_preset: 'yes_no_extent' }),
    likert('s9_q4', 'کیا آپ کو اپنے موجودہ رہائشی حالات میں اکیلا پن محسوس ہوتا ہے؟', 'Do you ever feel lonely in your current living situation?', 'frequency'),
    q({ id: 's9_q5', type: 'yes_no_extent', text_ur: 'کیا رہائش سے متعلق ذمہ داریاں یا حالات آپ کی تعلیمی یا روزمرہ کارکردگی پر اثر ڈالتے ہیں؟', text_en: 'Do housing-related responsibilities or conditions affect your academic or daily performance?', scale_preset: 'yes_no_extent' }),
    q({
      id: 's9_q6', type: 'yes_no_extent',
      text_ur: 'اگر آپ گھر سے دور رہتے ہیں، کیا ایڈجسٹ کرنے میں دشواری یا گھر کی یاد محسوس ہوئی؟',
      text_en: 'If you live away from home, did you face difficulty adjusting or experience homesickness?',
      scale_preset: 'yes_no_extent',
      conditional_on: { question_id: 's9_q1', value: ['hostel', 'alone', 'other'] },
    }),
  ],
};
