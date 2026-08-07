import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section2: Section = {
  id: 's2',
  title_ur: 'ذاتی معلومات',
  title_en: 'Personal Information',
  icon: 'user',
  accent_color: 'primary',
  questions: [
    q({
      id: 's2_q1',
      type: 'number',
      text_ur: 'آپ کی عمر کیا ہے؟',
      text_en: 'What is your age?',
      min: 1,
      max: 120,
    }),
    q({
      id: 's2_q2',
      type: 'single_select',
      text_ur: 'آپ کی جنس کیا ہے؟',
      text_en: 'What is your gender?',
      options: [
        opt('male', 'مرد', 'Male'),
        opt('female', 'عورت', 'Female'),
        opt('other', 'دیگر', 'Other (please specify)'),
      ],
    }),
    q({
      id: 's2_q2a',
      type: 'text_short',
      text_ur: 'آپ اپنی جنس / شناخت کیسے بیان کریں گے؟',
      text_en: 'How do you describe your gender/identity?',
      conditional_on: { question_id: 's2_q2', value: 'other' },
    }),
    q({
      id: 's2_q2b',
      type: 'single_select',
      text_ur: 'کیا آپ کی جنس وہی ہے جو پیدائش کے وقت تفویض کی گئی تھی؟',
      text_en: 'Is your gender the same as the one assigned at birth?',
      options: [
        opt('yes', 'ہاں', 'Yes'),
        opt('no', 'نہیں', 'No'),
        opt('prefer_not', 'کہنا نہیں چاہتا', 'Prefer not to say'),
      ],
      conditional_on: { question_id: 's2_q2', value: 'other' },
    }),
    q({
      id: 's2_q2c',
      type: 'single_select',
      text_ur: 'کیا آپ کو اپنی شناخت کے حوالے سے اپنے اردگرد کے لوگوں سے supportive ماحول ملتا ہے؟',
      text_en: 'Do you feel supported by people around you regarding this identity?',
      options: [
        opt('yes', 'ہاں', 'Yes'),
        opt('to_some_extent', 'کسی حد تک', 'To some extent'),
        opt('no', 'نہیں', 'No'),
        opt('prefer_not', 'کہنا نہیں چاہتا', 'Prefer not to say'),
      ],
      conditional_on: { question_id: 's2_q2', value: 'other' },
    }),
    q({
      id: 's2_q3',
      type: 'yes_no',
      text_ur: 'کیا آپ کبھی کسی psychologist، counsellor یا psychiatrist کے پاس گئے ہیں؟',
      text_en: 'Have you ever visited a psychologist, counsellor, or psychiatrist?',
      scale_preset: 'yes_no',
    }),
    q({
      id: 's2_q3a',
      type: 'text_short',
      text_ur: 'اگر ہاں، تو کس وجہ سے؟',
      text_en: 'If yes, for what reason?',
      conditional_on: { question_id: 's2_q3', value: 'yes' },
    }),
    q({
      id: 's2_q4',
      type: 'single_select',
      text_ur: 'اس وقت آپ کیسا محسوس کر رہے ہیں؟',
      text_en: 'How are you feeling right now?',
      options: [
        opt('calm', 'پُرسکون', 'Calm'),
        opt('okay', 'ٹھیک ہوں', 'Okay'),
        opt('uneasy', 'تھوڑا بے چین', 'A little uneasy'),
        opt('anxious', 'پریشان', 'Anxious'),
        opt('low', 'اداس', 'Low / sad'),
        opt('other', 'دیگر', 'Other'),
      ],
    }),
    q({
      id: 's2_q5',
      type: 'yes_no',
      text_ur: 'کیا آپ نے کبھی mental health یا wellbeing سے متعلق کوئی mobile app استعمال کی ہے؟',
      text_en: 'Have you ever used any mobile app related to mental health or wellbeing?',
      scale_preset: 'yes_no',
    }),
  ],
};
