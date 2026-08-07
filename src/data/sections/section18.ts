import { q } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section18: Section = {
  id: 's18',
  title_ur: 'شرکت پر شکریہ',
  title_en: 'Gratitude for Participating',
  icon: 'mail-question',
  accent_color: 'primary',
  questions: [
    q({
      id: 's18_q1',
      type: 'contact_dual',
      text_ur: 'فون نمبر / ای میل ایڈریس (اختیاری)',
      text_en: 'Phone number / email address (optional)',
      required: false,
      note_ur:
        'پاکستان میں یونیورسٹی طلباء میں anxiety اور depression جیسے مسائل بڑھ رہے ہیں، اور موزوں screening ٹولز کی کمی ہے۔ اس مطالعے کا مقصد ایسا ٹول تیار کرنا ہے۔ چند شرکاء کو ایک مختصر، رضاکارانہ اور خفیہ انٹرویو کے لیے مدعو کیا جا سکتا ہے۔ اگر آپ راضی ہیں تو نیچے رابطہ فراہم کریں۔\n\nآپ کے وقت اور تعاون کی قدردانی کے طور پر، اس مطالعے میں حصہ لینے والے شرکاء کو ایک lucky draw میں شامل کیا جائے گا جس میں ایک wearable fitness band جیتنے کا موقع ہوگا۔ lucky draw کے ذریعے ایک شریک کو انعام حاصل کرنے کے لیے منتخب کیا جائے گا۔',
      note_en:
        "Mental health issues such as anxiety and depression are rising among university students in Pakistan, and culturally-relevant screening tools are still limited. This study aims to build one. A small number of participants may be invited for a brief, voluntary, and confidential follow-up interview. If you're willing, please share your contact below.\n\nAs a token of appreciation for your time and contribution, participants who take part in this study will be entered into a lucky draw for a chance to win a wearable fitness band. One participant will be selected through the lucky draw to receive the prize.",
    }),
  ],
};
