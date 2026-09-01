import { q, likert, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section4: Section = {
  id: 's4',
  title_ur: 'روزمرہ کے معمولات',
  title_en: 'Daily Routines',
  icon: 'sun',
  accent_color: 'primary',
  subsections: [
    {
      id: 's4a',
      title_ur: 'نیند',
      title_en: 'Sleep',
      questions: [
        likert('s4a_q1', 'پچھلے مہینے میں آپ اپنی نیند کے مجموعی معیار کو کیسا rate کریں گے؟', 'How would you rate your overall sleep quality in the past month?', 'sleep_quality'),
        q({ id: 's4a_q2', type: 'number', text_ur: 'اوسطاً آپ ہر رات کتنے گھنٹے سوتے ہیں؟', text_en: 'On average, how many hours do you sleep per night?', min: 0, max: 24, allow_decimal: true }),
        likert('s4a_q3', 'کیا stress, anxiety یا پڑھائی کا دباؤ آپ کی نیند پر اثر ڈالتا ہے؟', 'Does stress, anxiety, or academic pressure affect your sleep?', 'severity'),
        likert('s4a_q4', 'کیا آپ کو نیند آنے یا برقرار رکھنے میں کتنی بار دشواری ہوتی ہے؟', 'How often do you have difficulty falling or staying asleep?', 'frequency'),
        likert('s4a_q5', 'کیا اٹھنے کے بعد آپ خود کو تروتازہ اور آرام دہ محسوس کرتے ہیں؟', 'Do you feel refreshed and well-rested after waking up?', 'refresh'),
        likert('s4a_q6', 'پچھلے مہینے میں، آپ نے ہفتے کے دنوں میں کتنی بار تقریباً ایک ہی وقت پر سو کر اور جاگ کر اٹھے ہیں؟', 'In the past month, how often have you gone to bed and woken up at roughly the same times on weekdays?', 'refresh'),
      ],
    },
    {
      id: 's4b',
      title_ur: 'جسمانی سرگرمی اور ورزش',
      title_en: 'Physical Activity & Exercise',
      questions: [
        q({
          id: 's4b_q1', type: 'single_select',
          text_ur: 'ایک عام ہفتے میں، آپ کتنے دن کم از کم 30 منٹ ایسی جسمانی سرگرمی کرتے ہیں جس سے آپ کی سانس معمول سے زیادہ تیز ہو؟',
          text_en: 'In a typical week, on how many days do you do at least 30 minutes of physical activity that makes you breathe harder than normal?',
          options: [opt('0', '0 دن', '0 days'), opt('1-2', '1-2 دن', '1-2 days'), opt('3-4', '3-4 دن', '3-4 days'), opt('5+', '5 یا زیادہ دن', '5 or more days')],
        }),
        q({
          id: 's4b_q2', type: 'multi_select',
          text_ur: 'آپ عام طور پر کس قسم کی جسمانی سرگرمی کرتے ہیں، اگر کوئی ہے؟',
          text_en: 'What types of physical activity, if any, do you usually engage in?',
          options: [opt('walking', 'پیدل چلنا', 'Walking'), opt('sports', 'کھیل', 'Sports / games'), opt('gym', 'جم', 'Gym / weight training'), opt('yoga', 'یوگا', 'Yoga / stretching'), opt('none', 'کوئی نہیں', 'None'), opt('other', 'دیگر', 'Other')],
        }),
        q({
          id: 's4b_q3', type: 'single_select',
          text_ur: 'کیا پچھلے چند مہینوں میں آپ کی جسمانی سرگرمی کی سطح پہلے کے مقابلے میں بدلی ہے؟',
          text_en: 'Has your level of physical activity changed in the past few months compared to before?',
          options: [opt('increased', 'بڑھ گئی ہے', 'Increased'), opt('same', 'تقریباً ایک جیسی رہی', 'Stayed about the same'), opt('decreased', 'کم ہو گئی ہے', 'Decreased'), opt('never_active', 'میں کبھی بہت متحرک نہیں تھا', 'I was never very active')],
        }),
        q({
          id: 's4b_q4', type: 'multi_select',
          text_ur: 'اگر آپ کی جسمانی سرگرمی کم ہوئی ہے تو آپ کے خیال میں اس کی بنیادی وجوہات کیا ہیں؟',
          text_en: 'If your physical activity has decreased, what would you say are the main reasons?',
          conditional_on: { question_id: 's4b_q3', value: 'decreased' },
          options: [opt('time', 'وقت کی کمی', 'Lack of time'), opt('motivation', 'حوصلے یا توانائی کی کمی', 'Lack of motivation or energy'), opt('facilities', 'سہولیات تک رسائی نہیں', 'No access to facilities'), opt('health', 'جسمانی صحت کا مسئلہ', 'Physical health issue'), opt('low_stress', 'اداسی یا دباؤ', 'Feeling low or stressed'), opt('na', 'لاگو نہیں', 'Not applicable')],
        }),
        q({
          id: 's4b_q5', type: 'single_select',
          text_ur: 'آپ جسمانی سرگرمی اور اپنے مزاج کے درمیان تعلق کو کیسے بیان کریں گے؟',
          text_en: 'How would you describe the connection between physical activity and your mood?',
          options: [
            opt('better', 'جن دنوں میں متحرک ہوتا ہوں عام طور پر بہتر محسوس کرتا ہوں', 'I generally feel better on days I am active'),
            opt('no_diff', 'مجھے کوئی فرق نظر نہیں آتا', "I don't notice a difference"),
            opt('too_tired', 'میں اتنا تھکا ہوا یا اداس محسوس کرتا ہوں کہ متحرک نہیں ہو پاتا', 'I feel too tired or low to be active'),
            opt('unsure', 'مجھے یقین نہیں ہے', "I'm not sure"),
          ],
        }),
      ],
    },
    {
      id: 's4c',
      title_ur: 'ذاتی حفظانِ صحت اور نگہداشت',
      title_en: 'Personal Hygiene & Self-Care',
      questions: [
        q({ id: 's4c_q1', type: 'single_select', text_ur: 'پچھلے دو ہفتوں میں، آپ کتنی بار اپنا معمول کا ذاتی نگہداشت کا معمول برقرار رکھ سکے ہیں؟', text_en: 'Over the past two weeks, how often have you been able to maintain your usual personal care routine?', options: [opt('every_day', 'ہر روز معمول کے مطابق', 'Every day, as usual'), opt('most', 'اکثر دن', 'Most days'), opt('some', 'کچھ دن', 'Some days'), opt('rarely', 'شاذ و نادر', 'Rarely')] }),
        q({ id: 's4c_q2', type: 'single_select', text_ur: 'کیا آپ نے حال ہی میں اپنی ظاہری شکل و صورت یا سنوار پر دی جانے والی توجہ میں کوئی تبدیلی محسوس کی ہے؟', text_en: 'Have you noticed any change in how much attention you give to your personal appearance or grooming recently?', options: [opt('no_change', 'کوئی تبدیلی نہیں', 'No change'), opt('slightly_less', 'معمول سے تھوڑی کم', 'Slightly less than usual'), opt('noticeably_less', 'نمایاں طور پر کم', 'Noticeably less than usual'), opt('not_paying', 'میں نے اس پر توجہ نہیں دی', "I haven't been paying attention to it")] }),
        q({ id: 's4c_q3', type: 'single_select', text_ur: 'پچھلے دو ہفتوں میں، آپ نے کتنی بار محسوس کیا کہ روزمرہ کے معمول کے کام معمول سے زیادہ محنت طلب ہیں؟', text_en: 'In the past two weeks, how often have you felt that routine daily tasks required more effort than usual?', options: [opt('not_at_all', 'بالکل نہیں', 'Not at all'), opt('few', 'چند بار', 'A few times'), opt('often', 'اکثر', 'Often'), opt('almost_daily', 'تقریباً ہر روز', 'Almost every day')] }),
        q({ id: 's4c_q4', type: 'single_select', text_ur: 'آپ اپنی رہائشی جگہ (کمرہ، میز، سامان) کی موجودہ حالت کو کیسے بیان کریں گے؟', text_en: 'How would you describe the current state of your living space?', options: [opt('tidy', 'عام طور پر صاف ستھری', 'Generally tidy'), opt('bit_messy', 'تھوڑی بکھری لیکن قابلِ انتظام', 'A bit messy but manageable'), opt('more_disorg', 'معمول سے زیادہ بے ترتیب', 'More disorganised than usual'), opt('very_disorg', 'بہت زیادہ بے ترتیب', 'Very disorganised')] }),
        q({ id: 's4c_q5', type: 'multi_select', text_ur: 'اگر آپ نے اپنی ذاتی نگہداشت کی عادات میں تبدیلی محسوس کی ہے تو آپ کے خیال میں اس کی وجہ کیا ہے؟', text_en: 'If you have noticed changes in your self-care habits, what do you think contributes to this?', options: [opt('busy', 'مصروف شیڈول', 'Busy schedule'), opt('low', 'اداسی تھکاوٹ یا حوصلے کی کمی', 'Feeling low, tired, or unmotivated'), opt('no_space', 'نجی جگہ کا نہ ہونا', 'Not having a private space'), opt('no_change', 'مجھے کوئی تبدیلی نظر نہیں آئی', "I haven't noticed any changes"), opt('other', 'دیگر', 'Other')] }),
      ],
    },
    {
      id: 's4d',
      title_ur: 'جسمانی شکایات',
      title_en: 'Physical Health Complaints',
      questions: [
        q({ id: 's4d_q1', type: 'single_select', text_ur: 'پچھلے دو ہفتوں میں، آپ نے کتنی بار جسم میں درد محسوس کیا ہے جس کی کوئی واضح وجہ نہ ہو؟', text_en: 'In the past two weeks, how often have you experienced body aches or pains without a clear physical cause?', options: [opt('not_at_all', 'بالکل نہیں', 'Not at all'), opt('few', 'چند بار', 'A few times'), opt('often', 'اکثر', 'Often'), opt('almost_daily', 'تقریباً ہر روز', 'Almost every day')] }),
        q({ id: 's4d_q2', type: 'single_select', text_ur: 'پچھلے دو ہفتوں میں، آپ نے کتنی بار پیٹ میں درد، معدے میں جلن، یا بدہضمی محسوس کی ہے؟', text_en: 'In the past two weeks, how often have you experienced stomach aches, burning, or indigestion?', options: [opt('not_at_all', 'بالکل نہیں', 'Not at all'), opt('few', 'چند بار', 'A few times'), opt('often', 'اکثر', 'Often'), opt('almost_daily', 'تقریباً ہر روز', 'Almost every day')] }),
        q({ id: 's4d_q3', type: 'single_select', text_ur: 'پچھلے دو ہفتوں میں، آپ نے کتنی بار سر درد محسوس کیا ہے جو بغیر کسی خاص وجہ کے ہو؟', text_en: 'In the past two weeks, how often have you experienced headaches without an obvious cause?', options: [opt('not_at_all', 'بالکل نہیں', 'Not at all'), opt('few', 'چند بار', 'A few times'), opt('often', 'اکثر', 'Often'), opt('almost_daily', 'تقریباً ہر روز', 'Almost every day')] }),
        q({ id: 's4d_q4', type: 'single_select', text_ur: 'کیا آپ نے محسوس کیا ہے کہ یہ جسمانی شکایات امتحانات، تعلیمی دباؤ، یا پریشانی کے دوران بڑھ جاتی ہیں؟', text_en: 'Have you noticed that these physical complaints tend to increase during exams, academic pressure, or periods of worry?', options: [opt('yes', 'ہاں واضح طور پر', 'Yes, noticeably'), opt('some', 'کسی حد تک', 'To some extent'), opt('no', 'نہیں', 'No'), opt('unsure', 'مجھے یقین نہیں ہے', "I'm not sure")] }),
        q({ id: 's4d_q5', type: 'single_select', text_ur: 'کیا آپ نے ان جسمانی شکایات کے لیے کسی ڈاکٹر سے ملاقات کی ہے؟', text_en: 'Have you consulted a doctor for any of these physical complaints?', options: [opt('yes_cause', 'ہاں اور کوئی وجہ معلوم ہوئی', 'Yes, and a cause was found'), opt('yes_no_cause', 'ہاں لیکن کوئی وجہ نہیں ملی', 'Yes, but no cause was found'), opt('no', 'نہیں', 'No'), opt('na', 'لاگو نہیں', 'Not applicable')] }),
      ],
    },
  ],
};
