import { q, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section8: Section = {
  id: 's8',
  title_ur: 'خاندانی پس منظر',
  title_en: 'Family Background',
  icon: 'home',
  accent_color: 'primary',
  questions: [
    q({ id: 's8_q1', type: 'number', text_ur: 'آپ کے خاندان میں کتنے افراد ہیں؟', text_en: 'How many members are there in your family?', min: 1 }),
    q({ id: 's8_q2', type: 'number', text_ur: 'آپ کے کتنے بہن بھائی ہیں؟', text_en: 'How many siblings do you have?', min: 0 }),
    q({ id: 's8_q3', type: 'text_short', text_ur: 'بہن بھائیوں میں آپ کا نمبر کون سا ہے؟', text_en: 'What is your birth order among your siblings?' }),
    q({ id: 's8_q4', type: 'yes_no', text_ur: 'کیا خاندان کے کسی فرد نے کبھی psychologist سے ملاقات کی ہے، یا anxiety یا depression کی تشخیص ہوئی ہے؟', text_en: 'Has any family member ever visited a psychologist or been diagnosed with anxiety or depression?', scale_preset: 'yes_no' }),
    q({ id: 's8_q5', type: 'single_select', text_ur: 'کیا آپ کو لگتا ہے کہ خاندان کے کسی فرد یا قریبی رشتے دار کو ذہنی صحت کے مسائل رہے ہیں؟', text_en: 'Do you think any family member or close relative has had mental health issues?', options: [opt('yes', 'ہاں', 'Yes'), opt('no', 'نہیں', 'No'), opt('dont_know', 'معلوم نہیں', "Don't know")] }),
    q({ id: 's8_q5a', type: 'text_short', text_ur: 'اگر ہاں، تو آپ کا ان سے کیا رشتہ ہے؟', text_en: 'If yes, what is your relationship with them?', conditional_on: { question_id: 's8_q5', value: 'yes' } }),
    q({ id: 's8_q5b', type: 'text_long', text_ur: 'آپ کو ایسا کیوں لگا؟ (سلوک، علامات، واقعات)', text_en: 'What made you think they had such issues? (e.g., behavior, symptoms, or incidents)', conditional_on: { question_id: 's8_q5', value: 'yes' } }),
    q({ id: 's8_q6', type: 'text_short', text_ur: 'اپنے خاندان کے ساتھ اپنے تعلق کو کیسے بیان کریں گے؟', text_en: 'How would you describe your relationship with your family?' }),
    q({ id: 's8_q7', type: 'text_short', text_ur: 'stressed یا پریشان ہونے پر آپ عموماً کس سے بات کرتے ہیں؟', text_en: 'Who do you usually talk to when you feel stressed or upset?' }),
    q({ id: 's8_q8', type: 'yes_no', text_ur: 'کیا آپ نے کبھی کسی بڑے ذاتی نقصان یا صدمہ خیز واقعے کا سامنا کیا ہے؟ (مثلاً والد یا والدہ، بہن یا بھائی کی وفات، والدین کی علیحدگی/طلاق، یا چھوڑ دیے جانے کا تجربہ)', text_en: 'Have you ever experienced a major personal loss or traumatic life event (e.g., the death of a parent or sibling, parental separation/divorce, or abandonment)?', scale_preset: 'yes_no' }),
  ],
};
