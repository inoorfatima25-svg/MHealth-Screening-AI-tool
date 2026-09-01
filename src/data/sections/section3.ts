import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section3: Section = {
  id: 's3',
  title_ur: 'تعلیمی کارکردگی اور دباؤ',
  title_en: 'Academic Performance and Stress',
  icon: 'graduation-cap',
  accent_color: 'primary',
  questions: [
    q({
      id: 's3_q0a',
      type: 'text_short',
      text_ur: 'آپ کس شہر سے ہیں؟',
      text_en: 'Which city are you from?',
    }),
    q({
      id: 's3_q0b',
      type: 'yes_no',
      text_ur: 'کیا آپ فی الوقت یونیورسٹی طالب علم کے طور پر داخل ہیں؟',
      text_en: 'Are you currently enrolled as a university student?',
      scale_preset: 'yes_no',
    }),
    q({
      id: 's3_q0c',
      type: 'text_short',
      text_ur: 'اگر ہاں، تو براہ کرم اپنی یونیورسٹی کا نام بتائیں۔',
      text_en: 'If yes, please specify the name of your university.',
      conditional_on: { question_id: 's3_q0b', value: 'yes' },
    }),
    q({
      id: 's3_q1',
      type: 'single_select',
      text_ur: 'آپ کون سے سالِ تعلیم میں ہیں؟',
      text_en: 'What is your year of study?',
      options: [
        opt('1', 'پہلا سال', '1st year'),
        opt('2', 'دوسرا سال', '2nd year'),
        opt('3', 'تیسرا سال', '3rd year'),
        opt('4', 'چوتھا سال', '4th year'),
      ],
    }),
    q({
      id: 's3_q2',
      type: 'text_short',
      text_ur: 'آپ کون سا پروگرام یا میجر پڑھ رہے ہیں؟',
      text_en: 'What program or major are you studying?',
    }),
    likert(
      's3_q3',
      'آپ اپنی موجودہ تعلیمی کارکردگی کو کیسا بیان کریں گے؟',
      'How would you describe your current academic performance?',
      'performance'
    ),
    likert(
      's3_q4',
      'پڑھائی کے بوجھ یا امتحانات کی وجہ سے آپ کتنی بار دباؤ محسوس کرتے ہیں؟',
      'How often do you feel stressed due to academic workload or exams?',
      'frequency'
    ),
    likert(
      's3_q5',
      'کیا تعلیمی دباؤ کا منفی اثر آپ کی ذہنی صحت یا نیند پر پڑتا ہے؟',
      'Does academic stress negatively affect your mental health or sleep?',
      'severity'
    ),
    likert(
      's3_q6',
      'اپنی تعلیمی ذمہ داریوں کو سنبھالنے میں آپ کتنا پراعتماد محسوس کرتے ہیں؟',
      'How confident do you feel in managing your academic responsibilities?',
      'confidence'
    ),
    likert(
      's3_q7',
      'کیا آپ کبھی اسائنمنٹس، ڈیڈ لائنز یا امتحانات کی وجہ سے خود کو حد سے زیادہ دباؤ میں محسوس کرتے ہیں؟',
      'Do you ever feel overwhelmed by assignments, deadlines, or exams?',
      'frequency'
    ),
    likert(
      's3_q8',
      'کیا آپ کو امتحان کی صبح یا امتحان سے پہلے متلی آتی ہے، قے ہوتی ہے، یا پیٹ خراب ہوتا ہے؟',
      'Do you experience nausea, vomiting, or an upset stomach on the morning of an exam or before an exam?',
      'frequency'
    ),
    likert(
      's3_q9',
      'کیا امتحان یا تعلیمی دباؤ کے دوران آپ کو سر درد، دل کی دھڑکن تیز ہونا، یا ہاتھوں میں کانپنا محسوس ہوتا ہے؟',
      'During exams or periods of academic pressure, do you experience headaches, rapid heartbeat, or trembling in your hands?',
      'frequency'
    ),
    likert(
      's3_q10',
      'کیا آپ کو لگتا ہے کہ تعلیمی دباؤ آپ کی توجہ یا روزمرہ کاموں پر اثر ڈالتا ہے؟',
      'Do you think academic stress affects your concentration or daily functioning?',
      'severity'
    ),
  ],
};
