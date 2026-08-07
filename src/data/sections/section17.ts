import { q, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section17: Section = {
  id: 's17',
  title_ur: 'مجموعی کارکردگی',
  title_en: 'Overall Functioning',
  icon: 'clipboard-check',
  accent_color: 'primary',
  questions: [
    q({
      id: 's17_q1', type: 'single_select',
      text_ur: 'اگر آپ نے اوپر کسی مسئلے کی نشاندہی کی ہے تو ان مسائل نے آپ کے کام، گھریلو ذمہ داریوں، یا لوگوں کے ساتھ تعلقات کو کتنا مشکل بنایا ہے؟',
      text_en: 'If you indicated problems above, how much have they made work, home responsibilities, or relationships difficult?',
      options: [
        opt('not_difficult', 'بالکل مشکل نہیں', 'Not difficult at all'),
        opt('somewhat', 'کسی حد تک مشکل', 'Somewhat difficult'),
        opt('very', 'بہت مشکل', 'Very difficult'),
        opt('extremely', 'انتہائی مشکل', 'Extremely difficult'),
      ],
    }),
    q({
      id: 's17_q2', type: 'single_select',
      text_ur: 'پچھلے دو ہفتوں میں آپ جذباتی یا جسمانی طور پر کیسا محسوس کر رہے تھے اس وجہ سے کتنے دن کلاسز میں نہیں جا سکے؟',
      text_en: 'In the past two weeks, how many days did you miss class because of how you were feeling?',
      options: [opt('none', 'کوئی نہیں', 'None'), opt('1-2', '1-2 دن', '1-2 days'), opt('3-5', '3-5 دن', '3-5 days'), opt('5+', '5 سے زیادہ', 'More than 5 days')],
    }),
    q({
      id: 's17_q3', type: 'single_select',
      text_ur: 'اس سمسٹر کے آغاز کے مقابلے میں آپ کی مجموعی جذباتی خیریت کیسی ہے؟',
      text_en: 'Compared to the start of this semester, how is your overall emotional well-being?',
      options: [
        opt('better', 'بہتر', 'Better'),
        opt('same', 'تقریباً ایک جیسی', 'About the same'),
        opt('somewhat_worse', 'کچھ خراب', 'Somewhat worse'),
        opt('much_worse', 'بہت خراب', 'Much worse'),
      ],
    }),
  ],
};
