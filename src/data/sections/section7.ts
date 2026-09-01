import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section7: Section = {
  id: 's7',
  title_ur: 'سماجی سہارا',
  title_en: 'Social Support',
  icon: 'users',
  accent_color: 'primary',
  questions: [
    q({ id: 's7_q1', type: 'single_select', text_ur: 'کیا آپ کی زندگی میں کوئی ایسا شخص ہے جس سے آپ stress یا پریشانی کے وقت بات کر سکتے ہیں؟', text_en: 'Do you have someone in your life you can talk to during stress or difficult times?', options: [opt('yes', 'ہاں', 'Yes'), opt('to_some_extent', 'کسی حد تک', 'To some extent'), opt('no', 'نہیں', 'No')] }),
    q({ id: 's7_q2', type: 'multi_select', text_ur: 'مشکل وقت میں آپ عموماً کس سے مدد یا مشورہ لیتے ہیں؟', text_en: 'Who do you usually seek help or advice from during difficult times?', options: [opt('parents', 'والدین', 'Parents'), opt('siblings', 'بہن بھائی', 'Siblings'), opt('friends', 'دوست', 'Friends'), opt('teacher', 'استاد / mentor', 'Teacher / mentor'), opt('counsellor', 'Counsellor / psychologist', 'Counsellor / psychologist'), opt('no_one', 'کوئی نہیں', 'No one'), opt('other', 'دیگر', 'Other')] }),
    q({ id: 's7_q3', type: 'single_select', text_ur: 'کیا آپ کو اپنے گھر والوں یا دوستوں کی طرف سے جذباتی (emotional) مدد محسوس ہوتی ہے؟', text_en: 'Do you feel emotional support from your family or friends?', options: [opt('great_deal', 'ہاں کافی حد تک', 'Yes, a great deal'), opt('to_some_extent', 'کسی حد تک', 'To some extent'), opt('very_little', 'بہت کم', 'Very little'), opt('not_at_all', 'بالکل نہیں', 'Not at all')] }),
    likert('s7_q4', 'اپنی ذاتی یا جذباتی پریشانیوں کے بارے میں دوسروں سے بات کرنے میں آپ کتنا comfortable محسوس کرتے ہیں؟', 'How comfortable are you talking to others about your personal or emotional concerns?', 'comfort'),
    q({ id: 's7_q5', type: 'single_select', text_ur: 'آپ کے کتنے قریبی دوست ہیں؟', text_en: 'How many close friends do you have?', options: [opt('none', 'کوئی نہیں', 'None'), opt('1-2', '1-2', '1-2'), opt('3-5', '3-5', '3-5'), opt('6+', '6 یا زیادہ', '6 or more')] }),
    q({ id: 's7_q6', type: 'single_select', text_ur: 'آپ عام طور پر اپنا کھانا کس کے ساتھ کرتے ہیں — اکیلے یا دوسروں کے ساتھ؟', text_en: 'Do you usually eat your meals alone or with others?', options: [opt('mostly_others', 'زیادہ تر دوسروں کے ساتھ', 'Mostly with others'), opt('half', 'آدھا آدھا', 'About half and half'), opt('mostly_alone', 'زیادہ تر اکیلے', 'Mostly alone'), opt('always_alone', 'تقریباً ہمیشہ اکیلے', 'Almost always alone')] }),
    q({ id: 's7_q7', type: 'multi_select', text_ur: 'آپ اپنا فارغ وقت عموماً کیسے گزارتے ہیں؟', text_en: 'How do you usually spend your free time?', options: [opt('socialising', 'دوستوں کے ساتھ ملنا', 'Socialising with friends'), opt('family', 'خاندان کے ساتھ وقت', 'Time with family'), opt('screen', 'سوشل میڈیا / اسکرین', 'Social media / screen time'), opt('sports', 'کھیل / ورزش', 'Sports / exercise'), opt('religious', 'مذہبی سرگرمیاں', 'Religious activities'), opt('alone', 'اکیلے وقت گزارنا', 'Spending time alone'), opt('other', 'دیگر', 'Other')] }),
  ],
};
