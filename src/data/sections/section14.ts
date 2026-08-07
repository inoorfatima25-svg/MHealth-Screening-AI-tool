import { q, opt } from '@/data/helpers';
import type { Section } from '@/types/survey';

export const section14: Section = {
  id: 's14',
  title_ur: 'مقابلے کے طریقے',
  title_en: 'Coping Mechanisms',
  icon: 'shield-heart',
  accent_color: 'purple',
  questions: [
    q({
      id: 's14_q1', type: 'multi_select',
      text_ur: 'جب آپ stressed یا پریشان ہوں تو آپ عام طور پر کیا کرتے ہیں؟',
      text_en: 'What do you usually do when you feel stressed or upset?',
      options: [
        opt('talk', 'کسی سے بات', 'Talk to someone'),
        opt('music', 'موسیقی سننا', 'Listen to music'),
        opt('exercise', 'ورزش / چہل قدمی', 'Exercise / walk'),
        opt('pray', 'نماز / عبادت', 'Pray / spiritual practice'),
        opt('sleep', 'سو جانا', 'Sleep'),
        opt('social_media', 'سوشل میڈیا دیکھنا', 'Watch TV / scroll social media'),
        opt('eat', 'کھانے میں تبدیلی', 'Eat more or less than usual'),
        opt('withdraw', 'اکیلے رہنا', 'Withdraw / stay alone'),
        opt('cry', 'رونا', 'Cry'),
        opt('work', 'کام میں مصروف ہو جانا', 'Distract with work'),
        opt('other', 'دیگر', 'Other'),
      ],
    }),
    q({
      id: 's14_q2', type: 'single_select',
      text_ur: 'آپ کے خیال میں یہ طریقے کتنے مؤثر ہیں؟',
      text_en: 'How effective do you feel these coping strategies are?',
      options: [
        opt('very', 'بہت مؤثر', 'Very effective'),
        opt('somewhat', 'کسی حد تک مؤثر', 'Somewhat effective'),
        opt('not_very', 'زیادہ مؤثر نہیں', 'Not very effective'),
        opt('dont_know', 'مجھے نہیں معلوم', "I don't know"),
      ],
    }),
    q({
      id: 's14_q3', type: 'likert_grid',
      text_ur: 'پچھلے دو ہفتوں میں، آپ نے کتنی بار یہ کام کیے؟',
      text_en: 'In the past two weeks, how often have you done the following?',
      scale_preset: 'coping_frequency',
      grid_items: [
        { id: 's14_i1', text_ur: 'چائے/کافی/انرجی ڈرنکس', text_en: 'Tea / coffee / energy drinks to stay alert' },
        { id: 's14_i2', text_ur: 'بغیر نسخے کے دوائیں', text_en: 'Painkillers or medications not prescribed to you' },
        { id: 's14_i3', text_ur: 'سگریٹ یا vaping', text_en: 'Smoking or vaping' },
        { id: 's14_i4', text_ur: 'زیادہ کھانا یا کھانا چھوڑنا', text_en: 'Overeating or skipping meals to cope' },
        { id: 's14_i5', text_ur: 'بہت دیر تک جاگنا یا زیادہ سونا', text_en: 'Staying up very late or sleeping excessively' },
        { id: 's14_i6', text_ur: 'لوگوں یا ذمہ داریوں سے بچنا', text_en: 'Avoiding people or responsibilities' },
      ],
    }),
    q({
      id: 's14_q4', type: 'single_select',
      text_ur: 'کیا آپ نے کبھی پیشہ ورانہ مدد چاہی مگر حاصل نہ کر سکے؟',
      text_en: 'Have you ever wanted professional support but felt unable to access it?',
      options: [
        opt('yes', 'ہاں', 'Yes'),
        opt('no', 'نہیں', 'No'),
        opt('never_needed', 'مجھے ضرورت محسوس نہیں ہوئی', "I've never felt the need"),
      ],
    }),
    q({
      id: 's14_q5', type: 'multi_select',
      text_ur: 'اگر آپ نے پیشہ ورانہ مدد حاصل کرنے میں ہچکچاہٹ محسوس کی تو وجوہات کیا تھیں؟',
      text_en: 'If you have hesitated to seek professional help, what were the main reasons?',
      conditional_on: { question_id: 's14_q4', value: 'yes' },
      options: [
        opt('stigma', 'شرمندگی / stigma', 'Stigma / embarrassment'),
        opt('dont_know', 'پتہ نہیں کہاں جانا ہے', "Don't know where to go"),
        opt('cost', 'لاگت / affordability', 'Cost / affordability'),
        opt('wont_help', 'فائدہ نہیں ہوگا', "Don't think it would help"),
        opt('family', 'خاندان ناراض ہوں گے', 'Family would disapprove'),
        opt('time', 'وقت نہیں', 'No time'),
        opt('na', 'لاگو نہیں', 'Not applicable'),
      ],
    }),
  ],
};
