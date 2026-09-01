import type { Option, Question, Section } from '@/types/survey';

const opt = (value: string, ur: string, en: string): Option => ({ value, label_ur: ur, label_en: en });
const q = (x: Omit<Question, 'required'> & { required?: boolean }): Question => ({ required: true, ...x });

const gadPhqScale = [
  opt('0', 'بالکل نہیں', 'Not at all'),
  opt('1', 'کچھ دن', 'Several days'),
  opt('2', 'آدھے سے زیادہ دن', 'More than half the days'),
  opt('3', 'تقریباً ہر روز', 'Nearly every day'),
];

const frequency = [
  opt('never', 'کبھی نہیں', 'Never'),
  opt('rarely', 'شاذ و نادر', 'Rarely'),
  opt('sometimes', 'کبھی کبھی', 'Sometimes'),
  opt('often', 'اکثر', 'Often'),
  opt('almost_always', 'تقریباً ہمیشہ', 'Almost always'),
];

const severity = [
  opt('not_at_all', 'بالکل نہیں', 'Not at all'),
  opt('slightly', 'تھوڑا سا', 'Slightly'),
  opt('moderately', 'درمیانہ', 'Moderately'),
  opt('significantly', 'کافی حد تک', 'Significantly'),
  opt('severely', 'بہت زیادہ', 'Severely'),
];

const comfort = [
  opt('very_comfortable', 'بہت آرام دہ', 'Very comfortable'),
  opt('comfortable', 'آرام دہ', 'Comfortable'),
  opt('neutral', 'غیر جانبدار', 'Neutral'),
  opt('uncomfortable', 'غیر آرام دہ', 'Uncomfortable'),
  opt('not_comfortable', 'بالکل آرام دہ نہیں', 'Not comfortable at all'),
];

const performance = [
  opt('excellent', 'بہترین', 'Excellent'),
  opt('good', 'اچھی', 'Good'),
  opt('average', 'اوسط', 'Average'),
  opt('below_average', 'اوسط سے کم', 'Below average'),
  opt('poor', 'خراب', 'Poor'),
];

const refresh = [
  opt('always', 'ہمیشہ', 'Always'),
  opt('usually', 'عموماً', 'Usually'),
  opt('sometimes', 'کبھی کبھی', 'Sometimes'),
  opt('rarely', 'شاذ و نادر', 'Rarely'),
  opt('never', 'کبھی نہیں', 'Never'),
];

const yesNo = [opt('yes', 'ہاں', 'Yes'), opt('no', 'نہیں', 'No')];
const yesNoExtent = [
  opt('yes', 'ہاں', 'Yes'),
  opt('to_some_extent', 'کسی حد تک', 'To some extent'),
  opt('no', 'نہیں', 'No'),
];

const sections: Section[] = [
  {
    id: 's1', title_en: 'GAD-7 — Anxiety Symptoms', title_ur: 'GAD-7 — اضطراب کی علامات', icon: 'heart-pulse', accent_color: 'primary',
    questions: [{
      id: 'gad7_grid', type: 'likert_grid', required: true,
      text_en: 'Over the last two weeks, how often have you been bothered by the following problems?',
      text_ur: 'گزشتہ دو ہفتوں کے دوران، درج ذیل مسائل نے آپ کو کتنی بار پریشان کیا؟',
      grid_scale: gadPhqScale,
      grid_items: [
        ['gad7_i1','گھبراہٹ، بے چینی، یا بے قراری محسوس ہونا','Feeling nervous, anxious, or on edge'],
        ['gad7_i2','فکر کو روکنا یا قابو کرنا مشکل ہونا','Not being able to stop or control worrying'],
        ['gad7_i3','مختلف چیزوں کے بارے میں بہت زیادہ فکر کرنا','Worrying too much about different things'],
        ['gad7_i4','آرام کرنے میں دشواری ہونا','Trouble relaxing'],
        ['gad7_i5','اتنی بے چینی ہونا کہ بیٹھنا مشکل ہو','Being so restless that it is hard to sit still'],
        ['gad7_i6','آسانی سے چڑچڑا یا جھنجھلایا ہوا محسوس کرنا','Becoming easily annoyed or irritable'],
        ['gad7_i7','خوف محسوس کرنا، جیسے کوئی بری چیز ہونے والی ہو','Feeling afraid, as if something awful might happen'],
      ].map(([id, ur, en]) => ({ id, text_ur: ur, text_en: en })),
    }],
  },
  {
    id: 's2', title_en: 'PHQ-9 — Depression Symptoms', title_ur: 'PHQ-9 — ڈپریشن کی علامات', icon: 'heart-pulse', accent_color: 'purple',
    questions: [{
      id: 'phq9_grid', type: 'likert_grid', required: true,
      text_en: 'Over the last two weeks, how often have you been bothered by the following problems?',
      text_ur: 'گزشتہ دو ہفتوں کے دوران، درج ذیل مسائل نے آپ کو کتنی بار پریشان کیا؟',
      grid_scale: gadPhqScale,
      grid_items: [
        ['phq9_i1','کاموں میں دلچسپی یا خوشی کم محسوس ہونا','Little interest or pleasure in doing things'],
        ['phq9_i2','اداس، مایوس، یا ناامید محسوس کرنا','Feeling down, depressed, or hopeless'],
        ['phq9_i3','نیند آنے یا برقرار رکھنے میں دشواری، یا بہت زیادہ سونا','Trouble falling or staying asleep, or sleeping too much'],
        ['phq9_i4','تھکاوٹ یا توانائی کی کمی محسوس ہونا','Feeling tired or having little energy'],
        ['phq9_i5','بھوک کم لگنا یا بہت زیادہ کھانا','Poor appetite or overeating'],
        ['phq9_i6','اپنے بارے میں برا محسوس کرنا — یا خود کو ناکام سمجھنا','Feeling bad about yourself — or that you are a failure'],
        ['phq9_i7','چیزوں پر توجہ مرکوز کرنے میں دشواری، مثلاً پڑھنا یا ٹی وی دیکھنا','Trouble concentrating on things, such as reading or watching TV'],
        ['phq9_i8','آہستہ حرکت یا بات کرنا — یا بہت زیادہ بے چین ہونا','Moving or speaking slowly — or being very fidgety or restless'],
        ['phq9_i9','یہ خیال آنا کہ مر جانا بہتر ہے، یا خود کو نقصان پہنچانے کے خیالات','Thoughts that you would be better off dead, or of hurting yourself'],
      ].map(([id, ur, en]) => ({ id, text_ur: ur, text_en: en })),
    }],
  },
  {
    id: 's3', title_en: 'Personal Information', title_ur: 'ذاتی معلومات', icon: 'user', accent_color: 'primary',
    questions: [
      q({ id: 's3_q1', type: 'number', text_ur: 'آپ کی عمر کیا ہے؟', text_en: 'What is your age?', min: 1, max: 120 }),
      q({ id: 's3_q2', type: 'single_select', text_ur: 'آپ کی جنس کیا ہے؟', text_en: 'What is your gender?', options: [opt('male','مرد','Male'), opt('female','عورت','Female'), opt('other','دیگر','Other (please specify)')] }),
      q({ id: 's3_q3', type: 'yes_no', text_ur: 'کیا آپ کبھی psychologist، counsellor، یا psychiatrist سے ملے ہیں؟', text_en: 'Have you ever visited a psychologist, counsellor, or psychiatrist?', options: yesNo }),
      q({ id: 's3_q4', type: 'single_select', text_ur: 'آپ اس وقت کیسا محسوس کر رہے ہیں؟', text_en: 'How are you feeling right now?', options: [opt('calm','پُرسکون','Calm'), opt('okay','ٹھیک','Okay'), opt('uneasy','تھوڑی بے چینی','A little uneasy'), opt('anxious','پریشان','Anxious'), opt('low_sad','اداس یا کم حوصلہ','Low or sad'), opt('other','دیگر','Other')] }),
    ],
  },
  {
    id: 's4', title_en: 'Academic Performance and Stress', title_ur: 'تعلیمی کارکردگی اور دباؤ', icon: 'graduation-cap', accent_color: 'primary',
    questions: [
      q({ id: 's4_q1', type: 'yes_no', text_ur: 'کیا آپ اس وقت یونیورسٹی کے طالب علم ہیں؟', text_en: 'Are you currently enrolled as a university student?', options: yesNo }),
      q({ id: 's4_q2', type: 'single_select', text_ur: 'آپ کس سال میں زیرِ تعلیم ہیں؟', text_en: 'What is your year of study?', options: [1,2,3,4].map(n => opt(String(n), `${n} سال`, `${n}${n===1?'st':n===2?'nd':n===3?'rd':'th'} year`)) }),
      q({ id: 's4_q3', type: 'text_short', text_ur: 'آپ کون سا پروگرام یا مضمون پڑھ رہے ہیں؟', text_en: 'What program or major are you studying?' }),
      q({ id: 's4_q4', type: 'likert_scale', text_ur: 'تعلیمی کام یا امتحانات کی وجہ سے آپ کتنی بار دباؤ محسوس کرتے ہیں؟', text_en: 'How often do you feel stressed due to academic workload or exams?', options: frequency }),
      q({ id: 's4_q5', type: 'likert_scale', text_ur: 'کیا تعلیمی دباؤ آپ کی ذہنی صحت یا نیند پر منفی اثر ڈالتا ہے؟', text_en: 'Does academic stress negatively affect your mental health or sleep?', options: severity }),
      q({ id: 's4_q6', type: 'likert_scale', text_ur: 'کیا آپ assignments، deadlines، یا exams کی وجہ سے کبھی overwhelmed محسوس کرتے ہیں؟', text_en: 'Do you ever feel overwhelmed by assignments, deadlines, or exams?', options: frequency }),
      q({ id: 's4_q7', type: 'likert_scale', text_ur: 'امتحانات یا تعلیمی دباؤ کے دوران کیا آپ کو سر درد، دل کی تیز دھڑکن، یا ہاتھوں میں کپکپاہٹ ہوتی ہے؟', text_en: 'During exams or academic pressure, do you experience headaches, rapid heartbeat, or trembling hands?', options: frequency }),
      q({ id: 's4_q8', type: 'likert_scale', text_ur: 'کیا تعلیمی دباؤ آپ کی توجہ یا روزمرہ کام کرنے کی صلاحیت کو متاثر کرتا ہے؟', text_en: 'Do you think academic stress affects your concentration or daily functioning?', options: severity }),
      q({ id: 's4_q9', type: 'single_select', text_ur: 'آپ اپنی موجودہ تعلیمی کارکردگی کو کیسے بیان کریں گے؟', text_en: 'How would you describe your current academic performance?', options: performance }),
    ],
  },
  {
    id: 's5', title_en: 'Daily Routines', title_ur: 'روزمرہ معمولات', icon: 'sun', accent_color: 'blue',
    questions: [
      q({ id: 's5_q1', type: 'single_select', text_ur: 'گزشتہ ماہ آپ اپنی مجموعی نیند کے معیار کو کیسے درجہ دیں گے؟', text_en: 'How would you rate your overall sleep quality in the past month?', options: [opt('very_good','بہت اچھی','Very good'),opt('good','اچھی','Good'),opt('average','اوسط','Average'),opt('poor','خراب','Poor'),opt('very_poor','بہت خراب','Very poor')] }),
      q({ id: 's5_q2', type: 'likert_scale', text_ur: 'کیا stress، anxiety، یا academic pressure آپ کی نیند کو متاثر کرتے ہیں؟', text_en: 'Does stress, anxiety, or academic pressure affect your sleep?', options: severity }),
      q({ id: 's5_q3', type: 'single_select', text_ur: 'کیا جاگنے کے بعد آپ خود کو تازہ دم اور آرام یافتہ محسوس کرتے ہیں؟', text_en: 'Do you feel refreshed and well-rested after waking up?', options: refresh }),
      q({ id: 's5_q4', type: 'single_select', text_ur: 'گزشتہ ماہ، کیا آپ ہفتے کے دنوں میں تقریباً ایک ہی وقت پر سوتے اور جاگتے تھے؟', text_en: 'In the past month, did you go to bed/wake at roughly the same time on weekdays?', options: refresh }),
      q({ id: 's5_q5', type: 'single_select', text_ur: 'ایک عام ہفتے میں آپ کتنے دن 30 یا اس سے زیادہ منٹ جسمانی سرگرمی کرتے ہیں؟', text_en: 'In a typical week, on how many days do you get 30+ minutes of physical activity?', options: [opt('0','0','0'),opt('1_2','1–2','1–2'),opt('3_4','3–4','3–4'),opt('5_plus','5+','5+ days')] }),
      q({ id: 's5_q6', type: 'single_select', text_ur: 'گزشتہ چند ماہ میں آپ کی جسمانی سرگرمی کی سطح میں کیا تبدیلی آئی ہے؟', text_en: 'Has your level of physical activity changed in the past few months?', options: [opt('increased','بڑھی ہے','Increased'),opt('same','وہی رہی ہے','Stayed the same'),opt('decreased','کم ہوئی ہے','Decreased'),opt('never_active','میں کبھی زیادہ فعال نہیں تھا/تھی','I was never very active')] }),
      q({ id: 's5_q7', type: 'single_select', text_ur: 'گزشتہ دو ہفتوں میں آپ کتنی بار اپنا معمول کا ذاتی خیال رکھنے کا routine برقرار رکھ سکے؟', text_en: 'Over the past two weeks, how often could you maintain your usual personal-care routine?', options: [opt('every_day','ہر روز','Every day'),opt('most_days','زیادہ تر دن','Most days'),opt('some_days','کچھ دن','Some days'),opt('rarely','شاذ و نادر','Rarely')] }),
      q({ id: 's5_q8', type: 'single_select', text_ur: 'گزشتہ دو ہفتوں میں کتنی بار روزمرہ کے معمول کے کام معمول سے زیادہ محنت طلب محسوس ہوئے؟', text_en: 'In the past two weeks, how often did routine daily tasks feel like they needed more effort than usual?', options: [opt('not_at_all','بالکل نہیں','Not at all'),opt('few','چند بار','A few times'),opt('often','اکثر','Often'),opt('almost_daily','تقریباً ہر روز','Almost every day')] }),
      q({ id: 's5_q9', type: 'single_select', text_ur: 'گزشتہ دو ہفتوں میں بغیر واضح وجہ کے جسم میں درد کتنی بار ہوا؟', text_en: 'In the past two weeks, how often have you had body aches/pains with no clear cause?', options: [opt('not_at_all','بالکل نہیں','Not at all'),opt('few','چند بار','A few times'),opt('often','اکثر','Often'),opt('almost_daily','تقریباً ہر روز','Almost every day')] }),
      q({ id: 's5_q10', type: 'single_select', text_ur: 'گزشتہ دو ہفتوں میں بغیر واضح وجہ کے سر درد کتنی بار ہوا؟', text_en: 'In the past two weeks, how often have you had headaches without an obvious cause?', options: [opt('not_at_all','بالکل نہیں','Not at all'),opt('few','چند بار','A few times'),opt('often','اکثر','Often'),opt('almost_daily','تقریباً ہر روز','Almost every day')] }),
      q({ id: 's5_q11', type: 'number', text_ur: 'اوسطاً آپ ہر رات کتنے گھنٹے سوتے ہیں؟', text_en: 'On average, how many hours do you sleep per night?', min: 0, max: 24, allow_decimal: true }),
      q({ id: 's5_q12', type: 'single_select', text_ur: 'آپ کو نیند آنے یا نیند برقرار رکھنے میں کتنی بار دشواری ہوتی ہے؟', text_en: 'How often do you have difficulty falling or staying asleep?', options: frequency }),
    ],
  },
  {
    id: 's6', title_en: 'Screen / Social Media Use', title_ur: 'اسکرین / سوشل میڈیا کا استعمال', icon: 'smartphone', accent_color: 'purple',
    questions: [
      q({ id: 's6_q1', type: 'likert_scale', text_ur: 'کیا ضرورت سے زیادہ screen یا social media کا استعمال آپ کے mood، stress، یا sleep کو متاثر کرتا ہے؟', text_en: 'Do you think excessive screen or social media use affects your mood, stress, or sleep?', options: severity }),
      q({ id: 's6_q2', type: 'single_select', text_ur: 'کیا آپ نے کبھی social media کی وجہ سے جذباتی طور پر overwhelmed یا anxious محسوس کیا ہے؟', text_en: 'Have you ever felt emotionally overwhelmed or anxious due to social media?', options: [opt('yes','ہاں','Yes'),opt('some','کسی حد تک','To some extent'),opt('no','نہیں','No')] }),
      q({ id: 's6_q3', type: 'single_select', text_ur: 'تعلیمی وقت کے علاوہ آپ روزانہ social media/screens پر کتنے گھنٹے گزارتے ہیں؟', text_en: 'How many hours per day do you spend on social media/screens (excluding study time)?', options: [opt('lt1','1 گھنٹے سے کم','<1 hour'),opt('1_2','1–2 گھنٹے','1–2 hours'),opt('3_4','3–4 گھنٹے','3–4 hours'),opt('5_plus','5+ گھنٹے','5+ hours')] }),
    ],
  },
  {
    id: 's7', title_en: 'Procrastination, Self-Esteem, Comparison & Competition', title_ur: 'کام ٹالنا، خود اعتمادی، موازنہ اور مقابلہ', icon: 'scale', accent_color: 'coral',
    questions: [
      q({ id: 's7_q1', type: 'likert_scale', text_ur: 'کیا stress یا anxiety کی وجہ سے academic tasks شروع یا مکمل کرنا مشکل ہو جاتا ہے؟', text_en: 'Does stress or anxiety make it difficult to start or complete academic tasks?', options: frequency }),
      q({ id: 's7_q2', type: 'likert_scale', text_ur: 'کیا کام ٹالنے کے بعد آپ کو guilt یا frustration محسوس ہوتی ہے؟', text_en: 'Do you feel guilty or frustrated after procrastinating?', options: frequency }),
      q({ id: 's7_q3', type: 'single_select', text_ur: 'آپ اپنی صلاحیتوں اور تعلیمی کارکردگی کے بارے میں کتنے پراعتماد ہیں؟', text_en: 'How confident do you feel about your abilities and academic performance?', options: [opt('very','بہت پراعتماد','Very confident'),opt('confident','پراعتماد','Confident'),opt('neutral','غیر جانبدار','Neutral'),opt('not_very','زیادہ پراعتماد نہیں','Not very confident'),opt('not_at_all','بالکل پراعتماد نہیں','Not confident at all')] }),
      q({ id: 's7_q4', type: 'likert_scale', text_ur: 'کیا آپ اچھی کارکردگی کے باوجود اکثر اپنے آپ پر شک کرتے ہیں؟', text_en: 'Do you often doubt yourself even when you perform well?', options: frequency }),
      q({ id: 's7_q5', type: 'likert_scale', text_ur: 'کیا آپ اکثر اپنی پڑھائی یا lifestyle کا دوسرے طلبہ سے موازنہ کرتے ہیں؟', text_en: 'Do you often compare your studies or lifestyle with other students?', options: frequency }),
      q({ id: 's7_q6', type: 'likert_scale', text_ur: 'کیا social media یا classmates آپ کو کم کامیاب یا کم پراعتماد محسوس کرواتے ہیں؟', text_en: 'Do social media or classmates make you feel less successful or less confident?', options: frequency }),
      q({ id: 's7_q7', type: 'likert_scale', text_ur: 'کیا آپ classmates کے ساتھ academic competition کرنے کا دباؤ محسوس کرتے ہیں؟', text_en: 'Do you feel pressure to compete academically with your classmates?', options: severity }),
      q({ id: 's7_q8', type: 'single_select', text_ur: 'دوسروں سے موازنہ آپ کے mood یا self-esteem کو کتنی بار متاثر کرتا ہے؟', text_en: 'How often does comparison with others affect your mood or self-esteem?', options: frequency }),
    ],
  },
  {
    id: 's8', title_en: 'Social Support', title_ur: 'سماجی مدد', icon: 'users', accent_color: 'primary',
    questions: [
      q({ id: 's8_q1', type: 'single_select', text_ur: 'کیا stress یا مشکل وقت میں آپ کے پاس بات کرنے کے لیے کوئی شخص ہے؟', text_en: 'Do you have someone you can talk to during stress or difficult times?', options: [opt('yes','ہاں','Yes'),opt('some','کسی حد تک','To some extent'),opt('no','نہیں','No')] }),
      q({ id: 's8_q2', type: 'single_select', text_ur: 'کیا آپ کو اپنے خاندان یا دوستوں کی طرف سے جذباتی مدد ملتی ہے؟', text_en: 'Do you feel emotional support from your family or friends?', options: [opt('great_deal','بہت زیادہ','Yes, a great deal'),opt('some','کسی حد تک','To some extent'),opt('little','بہت کم','Very little'),opt('none','بالکل نہیں','Not at all')] }),
      q({ id: 's8_q3', type: 'single_select', text_ur: 'آپ اپنی ذاتی یا جذباتی پریشانیوں کے بارے میں دوسروں سے بات کرنے میں کتنے آرام دہ ہیں؟', text_en: 'How comfortable are you talking to others about your personal or emotional concerns?', options: comfort }),
    ],
  },
  {
    id: 's9', title_en: 'Family Background', title_ur: 'خاندانی پس منظر', icon: 'users', accent_color: 'blue',
    questions: [
      q({ id: 's9_q1', type: 'yes_no', text_ur: 'کیا خاندان کے کسی فرد نے کبھی psychologist سے ملاقات کی ہے یا anxiety/depression کی تشخیص ہوئی ہے؟', text_en: 'Has any family member ever visited a psychologist or been diagnosed with anxiety or depression?', options: yesNo }),
      q({ id: 's9_q2', type: 'single_select', text_ur: 'کیا آپ کو لگتا ہے کہ خاندان کے کسی فرد یا قریبی رشتہ دار کو ذہنی صحت کے مسائل رہے ہیں؟', text_en: 'Do you think any family member or close relative has had mental health issues?', options: [opt('yes','ہاں','Yes'),opt('no','نہیں','No'),opt('dont_know','معلوم نہیں','Don’t know')] }),
      q({ id: 's9_q3', type: 'yes_no', text_ur: 'کیا آپ نے کبھی کسی بڑے ذاتی نقصان یا صدمہ خیز زندگی کے واقعے کا سامنا کیا ہے؟ مثلاً والدین/بہن بھائی کی وفات، والدین کی علیحدگی، یا چھوڑ دیے جانے کا تجربہ۔', text_en: 'Have you ever experienced a major personal loss or traumatic life event (e.g. death of a parent/sibling, parental separation, abandonment)?', options: yesNo }),
      q({ id: 's9_q4', type: 'text_long', text_ur: 'آپ اپنے خاندان کے ساتھ اپنے تعلق کو کیسے بیان کریں گے؟', text_en: 'How would you describe your relationship with your family?' }),
    ],
  },
  {
    id: 's10', title_en: 'Living Arrangements', title_ur: 'رہائشی انتظامات', icon: 'home', accent_color: 'primary',
    questions: [
      q({ id: 's10_q1', type: 'single_select', text_ur: 'آپ اس وقت خاندان کے ساتھ، hostel میں، یا اکیلے رہتے ہیں؟', text_en: 'Do you currently live with family, in a hostel, or alone?', options: [opt('family','خاندان کے ساتھ','With family'),opt('hostel','ہاسٹل','Hostel'),opt('alone','اکیلے','Alone'),opt('other','دیگر','Other')] }),
      q({ id: 's10_q2', type: 'single_select', text_ur: 'کیا آپ اپنی موجودہ رہائش میں کبھی تنہائی محسوس کرتے ہیں؟', text_en: 'Do you ever feel lonely in your current living situation?', options: frequency }),
      q({ id: 's10_q3', type: 'single_select', text_ur: 'کیا رہائش سے متعلق ذمہ داریاں یا حالات آپ کی تعلیمی یا روزمرہ کارکردگی پر اثر ڈالتے ہیں؟', text_en: 'Do housing-related responsibilities or conditions affect your academic or daily performance?', options: yesNoExtent }),
      q({ id: 's10_q4', type: 'single_select', text_ur: 'آپ اپنے موجودہ رہائشی انتظام کو کتنا آرام دہ اور مددگار سمجھتے ہیں؟', text_en: 'How comfortable and supportive do you find your current living arrangement?', options: comfort }),
    ],
  },
  {
    id: 's11', title_en: 'Regional and Cultural Adjustment', title_ur: 'علاقائی اور ثقافتی مطابقت', icon: 'map-pin', accent_color: 'purple',
    questions: [
      q({ id: 's11_q1', type: 'single_select', text_ur: 'کیا آپ یونیورسٹی کے ماحول میں اپنی ثقافتی شناخت کا اظہار کرنے میں آرام دہ محسوس کرتے ہیں؟', text_en: 'Do you feel comfortable expressing your cultural identity in the university environment?', options: comfort }),
      q({ id: 's11_q2', type: 'likert_scale', text_ur: 'کیا اپنے آبائی شہر یا خاندان سے دور رہنے نے آپ کی ذہنی صحت یا stress کی سطح کو متاثر کیا ہے؟', text_en: 'Has being away from your hometown or family affected your mental health or stress levels?', options: severity }),
    ],
  },
  {
    id: 's12', title_en: 'Economic Conditions and Financial Stress', title_ur: 'معاشی حالات اور مالی دباؤ', icon: 'wallet', accent_color: 'blue',
    questions: [
      q({ id: 's12_q1', type: 'single_select', text_ur: 'کیا بڑھتے ہوئے اخراجات (فیس، ٹرانسپورٹ، پٹرول، کھانا وغیرہ) آپ کو مالی دباؤ دیتے ہیں؟', text_en: 'Do increasing expenses (fees, transport, petrol, food, etc.) cause you financial stress?', options: yesNoExtent }),
      q({ id: 's12_q2', type: 'single_select', text_ur: 'کیا گھر میں مالی مشکلات آپ کی روزمرہ زندگی یا ذہنی بہبود کو متاثر کرتی ہیں؟', text_en: 'Do financial difficulties at home affect your daily life or mental well-being?', options: yesNoExtent }),
      q({ id: 's12_q3', type: 'single_select', text_ur: 'کیا مالی دباؤ آپ کی پڑھائی یا concentration کو متاثر کرتا ہے؟', text_en: 'Does financial stress affect your studies or concentration?', options: yesNoExtent }),
      q({ id: 's12_q4', type: 'yes_no', text_ur: 'کیا آپ نے کبھی مالی مسائل کی وجہ سے اپنی تعلیم چھوڑنے پر سنجیدگی سے غور کیا ہے؟', text_en: 'Have you ever seriously considered discontinuing your education due to financial problems?', options: yesNo }),
      q({ id: 's12_q5', type: 'single_select', text_ur: 'کیا آپ مستقبل میں مالی طور پر خودمختار ہونے یا اپنے خاندان کی مدد کرنے کا دباؤ محسوس کرتے ہیں؟', text_en: 'Do you feel pressure to become financially independent or support your family in future?', options: yesNoExtent }),
      q({ id: 's12_q6', type: 'single_select', text_ur: 'کیا آپ graduation کے بعد employment یا job market کے بارے میں فکرمند ہیں؟', text_en: 'Are you worried about employment or the job market after graduation?', options: yesNoExtent }),
    ],
  },
  {
    id: 's13', title_en: 'National and International Affairs', title_ur: 'قومی اور بین الاقوامی معاملات', icon: 'globe', accent_color: 'purple',
    questions: [
      q({ id: 's13_q1', type: 'likert_scale', text_ur: 'خبروں یا social media میں سیاسی یا بین الاقوامی تنازعات آپ کو کتنی بار stress یا anxiety دیتے ہیں؟', text_en: 'How often do political or international conflicts on news/social media cause you stress or anxiety?', options: frequency }),
      q({ id: 's13_q2', type: 'likert_scale', text_ur: 'کیا پاکستان کے معاشی یا سیاسی مستقبل کے بارے میں تشویش آپ کے mood، motivation، یا studies کو متاثر کرتی ہے؟', text_en: 'Does concern about Pakistan’s economic or political future affect your mood, motivation, or studies?', options: severity }),
    ],
  },
  {
    id: 's14', title_en: 'Bullying & Harassment', title_ur: 'Bullying اور ہراسانی', icon: 'shield-alert', accent_color: 'coral',
    questions: [
      q({ id: 's14_q1', type: 'yes_no', text_ur: 'کیا آپ نے یونیورسٹی کی زندگی میں کبھی bullying، harassment، یا social exclusion کا سامنا کیا ہے؟', text_en: 'Have you ever experienced bullying, harassment, or social exclusion in university life?', options: yesNo }),
      q({ id: 's14_q2', type: 'single_select', text_ur: 'کیا آپ سمجھتے ہیں کہ bullying یا منفی سماجی تجربات نے آپ کی ذہنی صحت یا academic performance کو متاثر کیا ہے؟', text_en: 'Do you think bullying or negative social experiences have affected your mental health or academic performance?', options: yesNoExtent }),
      q({ id: 's14_q3', type: 'single_select', text_ur: 'کیا آپ اپنی یونیورسٹی کے ماحول میں خود کو محفوظ اور باعزت محسوس کرتے ہیں؟', text_en: 'Do you feel safe and respected in your university environment?', options: comfort }),
    ],
  },
  {
    id: 's15', title_en: 'Coping Mechanisms', title_ur: 'مقابلہ کرنے کے طریقے', icon: 'shield-heart', accent_color: 'primary',
    questions: [
      q({ id: 's15_q1', type: 'likert_grid', text_ur: 'گزشتہ دو ہفتوں میں stress سے نمٹنے کے لیے آپ نے درج ذیل میں سے ہر طریقہ کتنی بار استعمال کیا؟', text_en: 'In the past two weeks, how often have you used the following to cope: painkillers/medication not prescribed to you; overeaten or skipped meals; smoked/vaped; used caffeine to stay alert; stayed up very late or slept excessively; avoided people or responsibilities?', grid_scale: [opt('never','کبھی نہیں','Never'),opt('rarely','شاذ و نادر','Rarely'),opt('sometimes','کبھی کبھی','Sometimes'),opt('often','اکثر','Often')], grid_items: [
        ['s15_i1','بغیر نسخے کے painkillers/دوائیں','Painkillers/medication not prescribed to you'],
        ['s15_i2','زیادہ کھانا یا کھانا چھوڑ دینا','Overeating or skipping meals'],
        ['s15_i3','سگریٹ نوشی یا vaping','Smoked/vaped'],
        ['s15_i4','چوکس رہنے کے لیے caffeine استعمال کرنا','Used caffeine to stay alert'],
        ['s15_i5','بہت دیر تک جاگنا یا بہت زیادہ سونا','Stayed up very late or slept excessively'],
        ['s15_i6','لوگوں یا ذمہ داریوں سے گریز کرنا','Avoided people or responsibilities'],
      ].map(([id, ur, en]) => ({ id, text_ur: ur, text_en: en })) }),
      q({ id: 's15_q2', type: 'single_select', text_ur: 'کیا آپ نے کبھی professional support چاہی لیکن اسے حاصل کرنا ممکن نہیں سمجھا؟', text_en: 'Have you ever wanted professional support but felt unable to access it?', options: [opt('yes','ہاں','Yes'),opt('no','نہیں','No'),opt('never_needed','مجھے کبھی ضرورت محسوس نہیں ہوئی','I’ve never felt the need')] }),
      q({ id: 's15_q3', type: 'multi_select', text_ur: 'جب آپ stress یا upset محسوس کرتے ہیں تو عموماً کیا کرتے ہیں؟', text_en: 'What do you usually do when you feel stressed or upset?', options: [
        opt('talk','کسی سے بات کرنا','Talk to someone'), opt('music','موسیقی سننا','Music'), opt('exercise','ورزش','Exercise'), opt('pray','دعا کرنا','Pray'), opt('sleep','سونا','Sleep'), opt('tv_social','TV / social media','TV-social media'), opt('eat','زیادہ یا کم کھانا','Eat more or less'), opt('withdraw','لوگوں سے الگ رہنا','Withdraw'), opt('cry','رونا','Cry'), opt('work','کام میں خود کو مصروف رکھنا','Distract with work'), opt('other','دیگر','Other')
      ] }),
    ],
  },
  {
    id: 's16', title_en: 'Caffeine and Substance Use', title_ur: 'کیفین اور دیگر مادّوں کا استعمال', icon: 'coffee', accent_color: 'blue',
    questions: [
      q({ id: 's16_q1', type: 'single_select', text_ur: 'کیا پڑھائی یا exams کے دوران جاگنے کے لیے آپ caffeine کی مقدار بڑھا دیتے ہیں؟', text_en: 'Do you increase your caffeine intake to stay awake while studying or during exams?', options: frequency }),
      q({ id: 's16_q2', type: 'single_select', text_ur: 'گزشتہ 12 ماہ میں کیا آپ نے stress، anxiety، یا low mood سے نمٹنے کے لیے tobacco، alcohol، یا کسی اور substance کا استعمال کیا؟', text_en: 'During the past 12 months, have you used tobacco, alcohol, or another substance to cope with stress, anxiety, or low mood?', options: frequency }),
    ],
  },
  {
    id: 'contact', title_en: 'Contact Information (Optional)', title_ur: 'رابطے کی معلومات (اختیاری)', icon: 'user', accent_color: 'purple',
    questions: [],
  },
  {
    id: 's18', title_en: 'Additional / Optional Questions', title_ur: 'اضافی / اختیاری سوالات', icon: 'clipboard-check', accent_color: 'purple',
    questions: [
      q({ required: false, id: 's18_q1', type: 'yes_no', text_ur: 'کیا آپ نے ذہنی صحت یا wellbeing سے متعلق کوئی mobile app استعمال کی ہے؟', text_en: 'Have you used a mobile app for mental health or wellbeing?', options: yesNo }),
      q({ required: false, id: 's18_q2', type: 'text_short', text_ur: 'آپ کس شہر سے ہیں؟', text_en: 'Which city are you from?' }),
      q({ required: false, id: 's18_q3', type: 'single_select', text_ur: 'اپنی تعلیمی ذمہ داریاں سنبھالنے میں آپ کتنا پراعتماد ہیں؟', text_en: 'How confident are you in managing your academic responsibilities?', options: [opt('very','بہت پراعتماد','Very confident'),opt('confident','پراعتماد','Confident'),opt('neutral','درمیانہ','Neutral'),opt('not_very','زیادہ پراعتماد نہیں','Not very confident'),opt('not_at_all','بالکل نہیں','Not confident at all')] }),
      q({ required: false, id: 's18_q4', type: 'likert_scale', text_ur: 'کیا امتحان سے پہلے متلی، قے یا معدے کی خرابی ہوتی ہے؟', text_en: 'Do you have nausea, vomiting, or an upset stomach before an exam?', options: frequency }),
      q({ required: false, id: 's18_q5', type: 'single_select', text_ur: 'آپ کی physical activity اور mood کے درمیان تعلق کیسا ہے؟', text_en: 'How would you describe the link between physical activity and your mood?', options: [opt('positive','مثبت','Mostly positive'),opt('no_link','کوئی خاص تعلق نہیں','No clear link'),opt('negative','منفی','Mostly negative'),opt('unsure','یقین نہیں','Not sure')] }),
      q({ required: false, id: 's18_q6', type: 'single_select', text_ur: 'کیا آپ نے حال ہی میں اپنی appearance/grooming پر توجہ میں تبدیلی محسوس کی ہے؟', text_en: 'Have you noticed a recent change in attention to your appearance or grooming?', options: [opt('no_change','کوئی تبدیلی نہیں','No change'),opt('less','کم توجہ','Less attention'),opt('more','زیادہ توجہ','More attention'),opt('unsure','یقین نہیں','Not sure')] }),
      q({ required: false, id: 's18_q7', type: 'single_select', text_ur: 'آپ کی رہائشی جگہ کی موجودہ حالت کیسی ہے؟', text_en: 'How would you describe your current living space?', options: [opt('tidy','صاف ستھری','Generally tidy'),opt('manageable','تھوڑی بکھری مگر قابلِ انتظام','A bit messy but manageable'),opt('disorganised','زیادہ بے ترتیب','More disorganised than usual'),opt('very_disorganised','بہت بے ترتیب','Very disorganised')] }),
      q({ required: false, id: 's18_q8', type: 'multi_select', text_ur: 'آپ کی self-care عادات میں تبدیلی کی اہم وجوہات کیا ہیں؟', text_en: 'What contributes to changes in your self-care habits?', options: [opt('busy','مصروف شیڈول','Busy schedule'),opt('low','اداسی/تھکن/حوصلے کی کمی','Feeling low, tired, or unmotivated'),opt('space','نجی جگہ کی کمی','Lack of private space'),opt('none','کوئی تبدیلی نہیں','No change'),opt('other','دیگر','Other')] }),
      q({ required: false, id: 's18_q9', type: 'likert_scale', text_ur: 'کیا آپ سونے سے پہلے social media یا phone استعمال کرتے ہیں؟', text_en: 'Do you use social media or your phone late at night before sleeping?', options: frequency }),
      q({ required: false, id: 's18_q10', type: 'yes_no_extent', text_ur: 'stress کے دوران کیا آپ social media یا digital devices پر زیادہ وقت گزارتے ہیں؟', text_en: 'During stressful periods, do you spend more time on social media or digital devices?', options: yesNoExtent }),
      q({ required: false, id: 's18_q11', type: 'likert_scale', text_ur: 'آپ assignments یا study tasks کتنی بار آخری وقت تک ٹالتے ہیں؟', text_en: 'How often do you delay assignments or study tasks until the last moment?', options: frequency }),
      q({ required: false, id: 's18_q12', type: 'single_select', text_ur: 'آپ اپنی ذات اور اپنی کامیابیوں سے کتنے مطمئن ہیں؟', text_en: 'How satisfied are you with yourself and your achievements?', options: [opt('very','بہت مطمئن','Very satisfied'),opt('satisfied','مطمئن','Satisfied'),opt('neutral','درمیانہ','Neutral'),opt('dissatisfied','غیر مطمئن','Dissatisfied'),opt('very_dissatisfied','بہت غیر مطمئن','Very dissatisfied')] }),
      q({ required: false, id: 's18_q13', type: 'single_select', text_ur: 'تعلیمی مقابلہ آپ پر کیا اثر ڈالتا ہے؟', text_en: 'How does academic competition affect you?', options: [opt('motivates','حوصلہ دیتا ہے','It motivates me'),opt('none','کوئی خاص اثر نہیں','No noticeable effect'),opt('unease','کچھ بے چینی','Some unease'),opt('stress','نمایاں دباؤ','Significant stress')] }),
      q({ required: false, id: 's18_q14', type: 'single_select', text_ur: 'کیا university culture دوسروں سے بہتر کرنے کا غیر ضروری دباؤ پیدا کرتا ہے؟', text_en: 'Does university culture create unnecessary pressure to outperform others?', options: [opt('strongly_disagree','سختی سے اختلاف','Strongly disagree'),opt('disagree','اختلاف','Disagree'),opt('neutral','غیر جانبدار','Neutral'),opt('agree','اتفاق','Agree'),opt('strongly_agree','سختی سے اتفاق','Strongly agree')] }),
      q({ required: false, id: 's18_q15', type: 'multi_select', text_ur: 'آپ مشکل وقت میں عموماً کس سے مدد یا مشورہ لیتے ہیں؟', text_en: 'Who do you usually seek help or advice from?', options: [opt('parents','والدین','Parents'),opt('siblings','بہن بھائی','Siblings'),opt('friends','دوست','Friends'),opt('teacher','استاد/mentor','Teacher/mentor'),opt('professional','Counsellor/psychologist','Counsellor/psychologist'),opt('no_one','کسی سے نہیں','No one'),opt('other','دیگر','Other')] }),
      q({ required: false, id: 's18_q16', type: 'single_select', text_ur: 'آپ کے کتنے قریبی دوست ہیں؟', text_en: 'How many close friends do you have?', options: [opt('none','کوئی نہیں','None'),opt('1_2','1–2','1–2'),opt('3_5','3–5','3–5'),opt('6_plus','6 یا زیادہ','6 or more')] }),
      q({ required: false, id: 's18_q17', type: 'single_select', text_ur: 'آپ عموماً کھانا اکیلے کھاتے ہیں یا دوسروں کے ساتھ؟', text_en: 'Do you usually eat your meals alone or with others?', options: [opt('others','زیادہ تر دوسروں کے ساتھ','Mostly with others'),opt('half','دونوں تقریباً برابر','About half and half'),opt('alone','زیادہ تر اکیلے','Mostly alone'),opt('always_alone','تقریباً ہمیشہ اکیلے','Almost always alone')] }),
      q({ required: false, id: 's18_q18', type: 'multi_select', text_ur: 'آپ اپنا فارغ وقت عموماً کیسے گزارتے ہیں؟', text_en: 'How do you usually spend your free time?', options: [opt('friends','دوستوں کے ساتھ','Friends'),opt('family','خاندان کے ساتھ','Family'),opt('screen','سوشل میڈیا/اسکرین','Social media/screen'),opt('sports','کھیل/ورزش','Sports/exercise'),opt('religious','مذہبی سرگرمیاں','Religious activities'),opt('alone','اکیلے','Alone time'),opt('other','دیگر','Other')] }),
      q({ required: false, id: 's18_q19', type: 'number', text_ur: 'آپ کے خاندان میں کتنے افراد ہیں؟', text_en: 'How many members are in your family?', min: 1, max: 50 }),
      q({ required: false, id: 's18_q20', type: 'number', text_ur: 'آپ کے کتنے بہن بھائی ہیں؟', text_en: 'How many siblings do you have?', min: 0, max: 30 }),
      q({ required: false, id: 's18_q21', type: 'number', text_ur: 'بہن بھائیوں میں آپ کا نمبر کون سا ہے؟', text_en: 'What is your birth order among your siblings?', min: 1, max: 30 }),
      q({ required: false, id: 's18_q22', type: 'text_short', text_ur: 'stress یا پریشانی میں آپ عموماً کس سے بات کرتے ہیں؟', text_en: 'Who do you usually talk to when you feel stressed or upset?' }),
      q({ required: false, id: 's18_q23', type: 'yes_no_extent', text_ur: 'کیا cultural, language یا regional differences نے university میں adjustment مشکل بنایا؟', text_en: 'Have cultural, language, or regional differences made university adjustment difficult?', options: yesNoExtent }),
      q({ required: false, id: 's18_q24', type: 'text_short', text_ur: 'آپ کے والد کی تعلیم اور پیشہ کیا ہے؟', text_en: "What is your father's education and occupation?" }),
      q({ required: false, id: 's18_q25', type: 'text_short', text_ur: 'آپ کی والدہ کی تعلیم کیا ہے، اور کیا وہ ملازمت کرتی ہیں یا گھر سنبھالتی ہیں؟', text_en: "What is your mother's education, and is she employed or a homemaker?" }),
      q({ required: false, id: 's18_q26', type: 'single_select', text_ur: 'کیا گھر کی آمدنی خاندان کے اخراجات کے لیے کافی ہے؟', text_en: 'Is your household income sufficient for family expenses?', options: [opt('comfortable','آرام سے کافی','Comfortably sufficient'),opt('just_enough','بمشکل کافی','Just enough'),opt('not_sufficient','کافی نہیں','Not sufficient'),opt('prefer_not','بتانا نہیں چاہتا','Prefer not to say')] }),
      q({ required: false, id: 's18_q27', type: 'yes_no_extent', text_ur: 'کیا مسلسل خبریں دیکھنے سے آپ overwhelmed محسوس کرتے ہیں؟', text_en: 'Do you feel overwhelmed by continuous exposure to news?', options: yesNoExtent }),
      q({ required: false, id: 's18_q28', type: 'yes_no_extent', text_ur: 'کیا regional conflicts یا war-related news مستقبل کے بارے میں خوف یا غیر یقینی پیدا کرتی ہیں؟', text_en: 'Do regional conflicts or war-related news create fear or uncertainty about the future?', options: yesNoExtent }),
      q({ required: false, id: 's18_q29', type: 'likert_scale', text_ur: 'آپ کو academic یا social settings میں کتنی بار نشانہ، ذلیل یا insult کیا گیا؟', text_en: 'How often have you been targeted, humiliated, or insulted in academic or social settings?', options: frequency }),
      q({ required: false, id: 's18_q30', type: 'yes_no', text_ur: 'کیا آپ نے social media یا online platforms پر bullying کا سامنا کیا ہے؟', text_en: 'Have you experienced bullying on social media or online platforms?', options: yesNo }),
      q({ required: false, id: 's18_q31', type: 'single_select', text_ur: 'آپ کے coping strategies کتنے مؤثر ہیں؟', text_en: 'How effective are your coping strategies?', options: [opt('very','بہت مؤثر','Very effective'),opt('somewhat','کسی حد تک','Somewhat effective'),opt('not_very','زیادہ مؤثر نہیں','Not very effective'),opt('dont_know','معلوم نہیں','I don’t know')] }),
      q({ required: false, id: 's18_q32', type: 'multi_select', text_ur: 'اگر professional help لینے میں ہچکچاہٹ ہوئی تو اہم وجہ کیا تھی؟', text_en: 'If you hesitated to seek professional help, what were the main reasons?', options: [opt('stigma','شرمندگی/stigma','Stigma/embarrassment'),opt('dont_know','کہاں جانا ہے معلوم نہیں','Didn’t know where to go'),opt('cost','اخراجات','Cost/affordability'),opt('wont_help','فائدہ نہیں ہوگا','Didn’t think it would help'),opt('family','خاندان کی مخالفت','Family disapproval'),opt('time','وقت کی کمی','No time'),opt('none','لاگو نہیں','Not applicable')] }),
      q({ required: false, id: 's18_q33', type: 'single_select', text_ur: 'آپ روزانہ کتنے کپ چائے پیتے ہیں؟', text_en: 'How many cups of tea do you drink per day?', options: [opt('none','کوئی نہیں','None'),opt('1_2','1–2','1–2'),opt('3_4','3–4','3–4'),opt('5_plus','5 یا زیادہ','5 or more')] }),
      q({ required: false, id: 's18_q34', type: 'single_select', text_ur: 'آپ روزانہ کتنے کپ کافی پیتے ہیں؟', text_en: 'How many cups of coffee do you drink per day?', options: [opt('none','کوئی نہیں','None'),opt('1','1','1'),opt('2_3','2–3','2–3'),opt('4_plus','4 یا زیادہ','4 or more')] }),
      q({ required: false, id: 's18_q35', type: 'single_select', text_ur: 'آپ energy drinks کتنی بار استعمال کرتے ہیں؟', text_en: 'How often do you consume energy drinks?', options: [opt('never','کبھی نہیں','Never'),opt('less_weekly','ہفتے سے کم','Less than weekly'),opt('1_3_weekly','ہفتے میں 1–3 بار','1–3 times/week'),opt('almost_daily','تقریباً روزانہ','Almost daily'),opt('daily','روزانہ','Daily')] }),
      q({ required: false, id: 's18_q36', type: 'single_select', text_ur: 'کیا آپ سگریٹ یا دیگر tobacco products (vape, shisha, نسوار) استعمال کرتے ہیں؟', text_en: 'Do you use cigarettes or other tobacco products (vape, shisha, smokeless tobacco)?', options: [opt('never','کبھی نہیں','Never'),opt('former','پہلے استعمال کیا','Former user'),opt('occasionally','کبھی کبھار','Occasionally'),opt('daily','روزانہ','Daily')] }),
    ],
  },
];

export { sections };
export const TOTAL_SECTIONS = sections.length;
export const MANDATORY_SECTION_COUNT = TOTAL_SECTIONS - 1;
