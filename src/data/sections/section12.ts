import { q, likert } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section12: Section = {
  id: 's12',
  title_ur: 'قومی اور بین الاقوامی معاملات',
  title_en: 'National and International Affairs',
  icon: 'globe',
  accent_color: 'primary',
  questions: [
    likert('s12_q1', 'کیا قومی معاشی حالات (مہنگائی، پٹرول، بے روزگاری) آپ کے روزمرہ دباؤ یا ذہنی بہبود پر اثر ڈالتے ہیں؟', 'Do national economic conditions (inflation, petrol prices, unemployment) affect your daily stress or mental well-being?', 'severity'),
    likert('s12_q2', 'خبروں یا social media پر سیاسی یا بین الاقوامی تنازعات کتنی بار آپ کو دباؤ یا بے چینی دیتے ہیں؟', 'How often do political or international conflicts on news or social media cause you stress or anxiety?', 'frequency'),
    q({ id: 's12_q3', type: 'yes_no_extent', text_ur: 'کیا مسلسل خبروں کی exposure کی وجہ سے آپ overwhelmed محسوس کرتے ہیں؟', text_en: 'Do you ever feel overwhelmed due to continuous exposure to news?', scale_preset: 'yes_no_extent' }),
    likert('s12_q4', 'پاکستان کے معاشی یا سیاسی مستقبل کی فکر آپ کے موڈ، حوصلے، یا پڑھائی پر اثر ڈالتی ہے؟', "Does concern about Pakistan's economic or political future affect your mood, motivation, or studies?", 'severity'),
    q({ id: 's12_q5', type: 'yes_no_extent', text_ur: 'کیا علاقائی تنازعات یا جنگ سے متعلق خبریں مستقبل کے بارے میں خوف یا غیر یقینی پیدا کرتی ہیں؟', text_en: 'Have regional conflicts or war-related news created fear or uncertainty about the future for you?', scale_preset: 'yes_no_extent' }),
  ],
};
