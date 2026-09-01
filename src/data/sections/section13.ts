import { q, likert } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section13: Section = {
  id: 's13',
  title_ur: 'بدمعاشی اور ہراسانی',
  title_en: 'Bullying & Harassment',
  icon: 'shield-alert',
  accent_color: 'coral',
  questions: [
    q({ id: 's13_q1', type: 'yes_no', text_ur: 'کیا آپ نے کبھی یونیورسٹی میں bullying، harassment، یا سماجی خارجی محسوس کی؟', text_en: 'Have you ever experienced bullying, harassment, or social exclusion in university life?', scale_preset: 'yes_no' }),
    likert('s13_q2', 'آپ کتنی بار academic یا سماجی ماحول میں نشانہ بنے، ذلیل یا توہین محسوس کی؟', 'How often have you been targeted, humiliated, or insulted by others in academic or social settings?', 'frequency'),
    q({ id: 's13_q3', type: 'yes_no', text_ur: 'کیا آپ نے social media یا online platforms پر bullying کا سامنا کیا؟', text_en: 'Have you ever experienced bullying on social media or online platforms?', scale_preset: 'yes_no' }),
    q({ id: 's13_q4', type: 'yes_no_extent', text_ur: 'کیا bullying یا منفی سماجی تجربات نے ذہنی صحت یا تعلیمی کارکردگی پر اثر ڈالا؟', text_en: 'Do you think bullying or negative social experiences have affected your mental health or academic performance?', scale_preset: 'yes_no_extent' }),
    likert('s13_q5', 'کیا آپ یونیورسٹی کے ماحول میں محفوظ اور قابلِ احترام محسوس کرتے ہیں؟', 'Do you feel safe and respected in your university environment?', 'comfort'),
  ],
};
