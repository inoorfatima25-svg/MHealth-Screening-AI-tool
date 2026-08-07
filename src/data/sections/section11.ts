import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section11: Section = {
  id: 's11',
  title_ur: 'معاشی حالات اور مالی دباؤ',
  title_en: 'Economic Conditions and Financial Stress',
  icon: 'wallet',
  accent_color: 'primary',
  questions: [
    q({ id: 's11_q1', type: 'text_short', text_ur: 'آپ کے والد کی تعلیمی قابلیت اور پیشہ/پیشہ ورانہ کام کیا ہے؟', text_en: "What is your father's educational qualification and his occupation/profession?" }),
    q({ id: 's11_q2', type: 'text_short', text_ur: 'آپ کی والدہ کی تعلیمی قابلیت کیا ہے، اور کیا وہ ملازمت کرتی ہیں یا گھریلو خاتون ہیں؟', text_en: "What is your mother's educational qualification, and is she employed or a homemaker?" }),
    q({
      id: 's11_q3', type: 'single_select',
      text_ur: 'کیا آپ کی موجودہ گھریلو آمدنی خاندانی اخراجات پورا کرنے کے لیے کافی ہے؟',
      text_en: 'Is your current household income sufficient to meet family expenses comfortably?',
      options: [opt('comfortable', 'آرام سے کافی', 'Comfortably sufficient'), opt('just_enough', 'بمشکل کافی', 'Just enough'), opt('not_sufficient', 'کافی نہیں', 'Not sufficient'), opt('prefer_not', 'کہنا نہیں چاہتا', 'Prefer not to say')],
    }),
    q({ id: 's11_q4', type: 'yes_no_extent', text_ur: 'کیا بڑھتے اخراجات (فیس، ٹرانسپورٹ، پٹرول، کھانا) آپ کو مالی دباؤ دیتے ہیں؟', text_en: 'Do increasing expenses (fees, transport, petrol, food, etc.) cause you financial stress?', scale_preset: 'yes_no_extent' }),
    q({ id: 's11_q5', type: 'yes_no_extent', text_ur: 'کیا گھر میں مالی مشکلات روزمرہ زندگی یا ذہنی بہبود پر اثر ڈالتی ہیں؟', text_en: 'Do financial difficulties at home affect your daily life or mental well-being?', scale_preset: 'yes_no_extent' }),
    q({ id: 's11_q6', type: 'yes_no_extent', text_ur: 'کیا مالی دباؤ آپ کی پڑھائی یا توجہ پر اثر ڈالتا ہے؟', text_en: 'Does financial stress affect your studies or concentration?', scale_preset: 'yes_no_extent' }),
    q({ id: 's11_q7', type: 'yes_no', text_ur: 'کیا آپ نے کبھی مالی مسائل کی وجہ سے تعلیم جاری نہ رکھنے پر سنجیدگی سے غور کیا ہے؟', text_en: 'Have you ever seriously considered discontinuing your education due to financial problems?', scale_preset: 'yes_no' }),
    q({ id: 's11_q8', type: 'yes_no_extent', text_ur: 'کیا graduation کے بعد روزگار یا job market کے بارے میں آپ فکرمند ہیں؟', text_en: 'Are you worried about employment or the job market after graduation?', scale_preset: 'yes_no_extent' }),
    q({ id: 's11_q9', type: 'yes_no_extent', text_ur: 'کیا آپ مستقبل میں مالی طور پر خودمختار ہونے یا خاندان کی مدد کا دباؤ محسوس کرتے ہیں؟', text_en: 'Do you feel pressure to become financially independent or support your family in the future?', scale_preset: 'yes_no_extent' }),
    likert('s11_q10', 'اپنے مستقبل کے کیریئر اور مالی استحکام کے بارے میں آپ کتنا محفوظ محسوس کرتے ہیں؟', 'How secure do you feel about your future career and financial stability?', 'security'),
  ],
};
