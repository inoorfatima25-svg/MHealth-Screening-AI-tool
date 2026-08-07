import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const sectionCaffeine: Section = {
  id: 's_caff',
  title_ur: 'کیفین اور نشہ آور اشیاء کا استعمال',
  title_en: 'Caffeine and Substance Use',
  icon: 'coffee',
  accent_color: 'primary',
  subsections: [
    {
      id: 's_caff_a',
      title_ur: 'کیفین کا استعمال',
      title_en: 'Caffeine Intake',
      questions: [
        q({
          id: 's_caff_a_q1', type: 'single_select',
          text_ur: 'آپ روزانہ کتنے کپ چائے پیتے ہیں؟',
          text_en: 'On average, how many cups of tea do you drink per day?',
          options: [
            opt('none', 'بالکل نہیں', 'None'),
            opt('1-2', '1--2 کپ', '1--2 cups'),
            opt('3-4', '3--4 کپ', '3--4 cups'),
            opt('5+', '5 یا زیادہ', '5 or more cups'),
          ],
        }),
        q({
          id: 's_caff_a_q2', type: 'single_select',
          text_ur: 'آپ روزانہ کتنے کپ کافی پیتے ہیں؟',
          text_en: 'On average, how many cups of coffee do you drink per day?',
          options: [
            opt('none', 'بالکل نہیں', 'None'),
            opt('1', '1 کپ', '1 cup'),
            opt('2-3', '2--3 کپ', '2--3 cups'),
            opt('4+', '4 یا زیادہ', '4 or more cups'),
          ],
        }),
        q({
          id: 's_caff_a_q3', type: 'single_select',
          text_ur: 'آپ انرجی ڈرنکس (مثلاً Red Bull, Sting, Monster) کتنی بار استعمال کرتے ہیں؟',
          text_en: 'How often do you consume energy drinks (e.g., Red Bull, Sting, Monster)?',
          options: [
            opt('never', 'کبھی نہیں', 'Never'),
            opt('less_than_weekly', 'مہینے میں کبھی کبھار', 'Less than once a week'),
            opt('1-3_weekly', 'ہفتے میں 1--3 بار', '1--3 times per week'),
            opt('almost_daily', 'تقریباً روزانہ', 'Almost daily'),
            opt('daily', 'روزانہ', 'Daily'),
          ],
        }),
        likert(
          's_caff_a_q4',
          'کیا آپ پڑھائی یا امتحانات کے دوران جاگنے کے لیے کیفین (چائے، کافی یا انرجی ڈرنکس) کا استعمال بڑھا دیتے ہیں؟',
          'Do you increase your caffeine intake to stay awake while studying or during examinations?',
          'frequency'
        ),
      ],
    },
    {
      id: 's_caff_b',
      title_ur: 'تمباکو اور دیگر نشہ آور اشیاء',
      title_en: 'Tobacco and Other Substance Use',
      questions: [
        q({
          id: 's_caff_b_q1', type: 'single_select',
          text_ur: 'کیا آپ سگریٹ یا دیگر تمباکو کی مصنوعات (مثلاً ویپ، شیشہ، نسوار) استعمال کرتے ہیں؟',
          text_en: 'Do you use cigarettes or other tobacco products (e.g., vape, shisha, smokeless tobacco)?',
          options: [
            opt('never', 'کبھی نہیں', 'Never'),
            opt('former', 'پہلے استعمال کرتا/کرتی تھی مگر اب نہیں', 'Former user'),
            opt('occasionally', 'کبھی کبھار', 'Occasionally'),
            opt('daily', 'روزانہ', 'Daily'),
          ],
        }),
        q({
          id: 's_caff_b_q2', type: 'single_select',
          text_ur: 'اگر آپ سگریٹ پیتے ہیں، تو اوسطاً روزانہ کتنے سگریٹ پیتے ہیں؟',
          text_en: 'If you smoke cigarettes, how many cigarettes do you smoke per day on average?',
          conditional_on: { question_id: 's_caff_b_q1', value: ['occasionally', 'daily'] },
          options: [
            opt('na', 'لاگو نہیں', 'Not applicable'),
            opt('1-5', '1--5', '1--5'),
            opt('6-10', '6--10', '6--10'),
            opt('11-20', '11--20', '11--20'),
            opt('20+', '20 سے زیادہ', 'More than 20'),
          ],
        }),
        likert(
          's_caff_b_q3',
          'کیا آپ نے گزشتہ 12 ماہ میں دباؤ، بے چینی یا اداسی کم کرنے کے لیے کسی نشہ آور شے کا استعمال کیا ہے؟',
          'During the past 12 months, have you used tobacco, alcohol, or another substance to cope with stress, anxiety, or low mood?',
          'frequency'
        ),
      ],
    },
  ],
};
