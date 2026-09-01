import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section6: Section = {
  id: 's6',
  title_ur: 'ٹال مٹول، خود اعتمادی، موازنہ اور مقابلہ',
  title_en: 'Procrastination, Self-Esteem, Comparison & Competition',
  icon: 'scale',
  accent_color: 'primary',
  subsections: [
    {
      id: 's6a',
      title_ur: 'ٹال مٹول',
      title_en: 'Procrastination',
      questions: [
        likert('s6a_q1', 'آپ کتنی بار اسائنمنٹس یا پڑھائی کے کام آخری لمحے تک ٹالتے ہیں؟', 'How often do you delay assignments or study tasks until the last moment?', 'frequency'),
        likert('s6a_q2', 'کیا دباؤ یا بے چینی کی وجہ سے آپ کو پڑھائی کا کام شروع کرنا یا مکمل کرنا مشکل لگتا ہے؟', 'Does stress or anxiety make it difficult for you to start or complete academic tasks?', 'severity'),
        likert('s6a_q3', 'کام ٹالنے کے بعد کیا آپ خود کو گناہگار یا مایوس محسوس کرتے ہیں؟', 'Do you feel guilty or frustrated after procrastinating?', 'frequency'),
      ],
    },
    {
      id: 's6b',
      title_ur: 'خود اعتمادی',
      title_en: 'Self-Esteem',
      questions: [
        likert('s6b_q1', 'اپنی صلاحیتوں اور تعلیمی کارکردگی کے بارے میں آپ کتنا پراعتماد محسوس کرتے ہیں؟', 'How confident do you feel about your abilities and academic performance?', 'confidence'),
        likert('s6b_q2', 'کیا اچھی کارکردگی کے باوجود آپ اکثر خود پر شک کرتے ہیں؟', 'Do you often doubt yourself even when you perform well?', 'frequency'),
        likert('s6b_q3', 'آپ اپنی ذات اور اپنی کامیابیوں سے کتنے مطمئن ہیں؟', 'How satisfied are you with yourself and your achievements?', 'satisfaction'),
      ],
    },
    {
      id: 's6c',
      title_ur: 'موازنہ',
      title_en: 'Comparison',
      questions: [
        likert('s6c_q1', 'کیا آپ اکثر اپنی پڑھائی یا طرزِ زندگی کا دوسرے طلباء سے موازنہ کرتے ہیں؟', 'Do you often compare your studies or lifestyle with other students?', 'frequency'),
        likert('s6c_q2', 'کیا سوشل میڈیا یا کلاس کے ساتھی آپ کو خود کو کم کامیاب یا کم پراعتماد محسوس کراتے ہیں؟', 'Do social media or classmates make you feel less successful or less confident?', 'frequency'),
        likert('s6c_q3', 'دوسروں سے موازنہ آپ کے موڈ یا خود اعتمادی پر کتنی بار اثر ڈالتا ہے؟', 'How often does comparison with others affect your mood or self-esteem?', 'frequency'),
      ],
    },
    {
      id: 's6d',
      title_ur: 'مقابلہ',
      title_en: 'Competition',
      questions: [
        likert('s6d_q1', 'کیا آپ پر اپنے کلاس فیلوز سے تعلیمی مقابلہ کرنے کا دباؤ ہے؟', 'Do you feel pressure to compete academically with your classmates?', 'severity'),
        q({
          id: 's6d_q2', type: 'single_select',
          text_ur: 'تعلیمی مقابلے کا آپ پر کیا اثر ہوتا ہے؟',
          text_en: 'How does academic competition affect you?',
          options: [opt('motivates', 'مجھے حوصلہ ملتا ہے', 'It motivates me'), opt('no_effect', 'کوئی خاص اثر نہیں ہوتا', 'No noticeable effect'), opt('unease', 'تھوڑی بے چینی ہوتی ہے', 'It causes some unease'), opt('stress', 'کافی دباؤ محسوس ہوتا ہے', 'It causes significant stress')],
        }),
        q({
          id: 's6d_q3', type: 'single_select',
          text_ur: 'کیا آپ کو لگتا ہے کہ یونیورسٹی کی ثقافت دوسروں سے بہتر کارکردگی دکھانے کا غیر ضروری دباؤ پیدا کرتی ہے؟',
          text_en: 'Do you think university culture creates unnecessary pressure to outperform others?',
          options: [
            opt('strongly_disagree', 'سختی سے متفق نہیں', 'Strongly disagree'),
            opt('disagree', 'متفق نہیں', 'Disagree'),
            opt('neutral', 'غیر جانبدار', 'Neutral'),
            opt('agree', 'متفق', 'Agree'),
            opt('strongly_agree', 'سختی سے متفق', 'Strongly agree'),
          ],
        }),
      ],
    },
  ],
};
