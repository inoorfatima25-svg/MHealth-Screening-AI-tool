import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section5: Section = {
  id: 's5',
  title_ur: 'Screen / Social Media کا استعمال',
  title_en: 'Screen / Social Media Use',
  icon: 'smartphone',
  accent_color: 'primary',
  questions: [
    q({
      id: 's5_q1', type: 'single_select',
      text_ur: 'پڑھائی کے وقت کے علاوہ آپ روزانہ social media یا screen پر تقریباً کتنے گھنٹے گزارتے ہیں؟',
      text_en: 'How many hours per day do you spend on social media or screens (excluding study time)?',
      options: [opt('<1', '1 گھنٹے سے کم', 'Less than 1 hour'), opt('1-2', '1-2 گھنٹے', '1-2 hours'), opt('3-4', '3-4 گھنٹے', '3-4 hours'), opt('5+', '5 یا زیادہ گھنٹے', '5+ hours')],
    }),
    likert('s5_q2', 'کیا آپ رات کو سونے سے پہلے social media یا mobile استعمال کرتے ہیں؟', 'Do you use social media or your mobile phone late at night before sleeping?', 'frequency'),
    likert('s5_q3', 'کیا آپ کو لگتا ہے کہ زیادہ screen یا social media کا استعمال آپ کے mood, stress یا نیند پر اثر ڈالتا ہے؟', 'Do you think excessive screen or social media use affects your mood, stress, or sleep?', 'severity'),
    q({ id: 's5_q4', type: 'yes_no_extent', text_ur: 'کیا stressed ہونے پر آپ social media یا digital devices پر زیادہ وقت گزارتے ہیں؟', text_en: 'During stressful periods, do you spend more time on social media or digital devices?', scale_preset: 'yes_no_extent' }),
    q({ id: 's5_q5', type: 'yes_no_extent', text_ur: 'کیا آپ نے کبھی social media کی وجہ سے جذباتی طور پر overwhelmed یا anxious محسوس کیا ہے؟', text_en: 'Have you ever felt emotionally overwhelmed or anxious due to social media?', scale_preset: 'yes_no_extent' }),
  ],
};
