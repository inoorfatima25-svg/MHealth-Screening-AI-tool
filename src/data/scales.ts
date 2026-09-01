import type { Option } from '@/types/survey';

export const SCALES: Record<string, Option[]> = {
  frequency: [
    { value: 'never', label_ur: 'کبھی نہیں', label_en: 'Never' },
    { value: 'rarely', label_ur: 'شاذ و نادر', label_en: 'Rarely' },
    { value: 'sometimes', label_ur: 'کبھی کبھی', label_en: 'Sometimes' },
    { value: 'often', label_ur: 'اکثر', label_en: 'Often' },
    { value: 'almost_always', label_ur: 'تقریباً ہمیشہ', label_en: 'Almost always' },
  ],
  severity: [
    { value: 'not_at_all', label_ur: 'بالکل نہیں', label_en: 'Not at all' },
    { value: 'slightly', label_ur: 'تھوڑا سا', label_en: 'Slightly' },
    { value: 'moderately', label_ur: 'کسی حد تک', label_en: 'Moderately' },
    { value: 'significantly', label_ur: 'کافی حد تک', label_en: 'Significantly' },
    { value: 'severely', label_ur: 'بہت زیادہ', label_en: 'Severely' },
  ],
  confidence: [
    { value: 'very_confident', label_ur: 'بہت پراعتماد', label_en: 'Very confident' },
    { value: 'fairly_confident', label_ur: 'کافی پراعتماد', label_en: 'Fairly confident' },
    { value: 'uncertain', label_ur: 'غیر یقینی', label_en: 'Uncertain' },
    { value: 'not_very_confident', label_ur: 'زیادہ پراعتماد نہیں', label_en: 'Not very confident' },
    { value: 'not_at_all_confident', label_ur: 'بالکل پراعتماد نہیں', label_en: 'Not confident at all' },
  ],
  satisfaction: [
    { value: 'very_satisfied', label_ur: 'بہت مطمئن', label_en: 'Very satisfied' },
    { value: 'satisfied', label_ur: 'مطمئن', label_en: 'Satisfied' },
    { value: 'neutral', label_ur: 'غیر جانبدار', label_en: 'Neutral' },
    { value: 'dissatisfied', label_ur: 'غیر مطمئن', label_en: 'Dissatisfied' },
    { value: 'very_dissatisfied', label_ur: 'بہت غیر مطمئن', label_en: 'Very dissatisfied' },
  ],
  comfort: [
    { value: 'very_comfortable', label_ur: 'بہت آرام دہ', label_en: 'Very comfortable' },
    { value: 'fairly_comfortable', label_ur: 'کافی حد تک آرام دہ', label_en: 'Fairly comfortable' },
    { value: 'somewhat_uncomfortable', label_ur: 'تھوڑا غیر آرام دہ', label_en: 'Somewhat uncomfortable' },
    { value: 'not_comfortable', label_ur: 'بالکل آرام دہ نہیں', label_en: 'Not comfortable at all' },
  ],
  sleep_quality: [
    { value: 'very_good', label_ur: 'بہت اچھا', label_en: 'Very good' },
    { value: 'good', label_ur: 'اچھا', label_en: 'Good' },
    { value: 'average', label_ur: 'اوسط', label_en: 'Average' },
    { value: 'poor', label_ur: 'خراب', label_en: 'Poor' },
    { value: 'very_poor', label_ur: 'بہت خراب', label_en: 'Very poor' },
  ],
  refresh: [
    { value: 'always', label_ur: 'ہمیشہ', label_en: 'Always' },
    { value: 'usually', label_ur: 'عموماً', label_en: 'Usually' },
    { value: 'sometimes', label_ur: 'کبھی کبھی', label_en: 'Sometimes' },
    { value: 'rarely', label_ur: 'شاذ و نادر', label_en: 'Rarely' },
    { value: 'never', label_ur: 'کبھی نہیں', label_en: 'Never' },
  ],
  performance: [
    { value: 'excellent', label_ur: 'بہت اچھی', label_en: 'Excellent' },
    { value: 'good', label_ur: 'اچھی', label_en: 'Good' },
    { value: 'average', label_ur: 'اوسط', label_en: 'Average' },
    { value: 'below_average', label_ur: 'اوسط سے کم', label_en: 'Below average' },
    { value: 'poor', label_ur: 'خراب', label_en: 'Poor' },
  ],
  security: [
    { value: 'very_secure', label_ur: 'بہت محفوظ', label_en: 'Very secure' },
    { value: 'fairly_secure', label_ur: 'کافی محفوظ', label_en: 'Fairly secure' },
    { value: 'uncertain', label_ur: 'غیر یقینی', label_en: 'Uncertain' },
    { value: 'insecure', label_ur: 'غیر محفوظ', label_en: 'Insecure' },
    { value: 'very_insecure', label_ur: 'بہت غیر محفوظ', label_en: 'Very insecure' },
  ],
  competitive_pressure: [
    { value: 'very_little', label_ur: 'بہت کم یا کوئی نہیں', label_en: 'Very little or none' },
    { value: 'manageable', label_ur: 'قابلِ انتظام', label_en: 'Manageable' },
    { value: 'moderate', label_ur: 'درمیانہ', label_en: 'Moderate' },
    { value: 'high', label_ur: 'زیادہ', label_en: 'High' },
    { value: 'overwhelming', label_ur: 'حد سے زیادہ', label_en: 'Overwhelming' },
  ],
  yes_no_extent: [
    { value: 'yes', label_ur: 'ہاں', label_en: 'Yes' },
    { value: 'to_some_extent', label_ur: 'کسی حد تک', label_en: 'To some extent' },
    { value: 'no', label_ur: 'نہیں', label_en: 'No' },
  ],
  yes_no: [
    { value: 'yes', label_ur: 'ہاں', label_en: 'Yes' },
    { value: 'no', label_ur: 'نہیں', label_en: 'No' },
  ],
  gad7_phq9: [
    { value: '0', label_ur: 'بالکل نہیں', label_en: 'Not at all' },
    { value: '1', label_ur: 'کچھ دن', label_en: 'Several days' },
    { value: '2', label_ur: 'آدھے سے زیادہ دن', label_en: 'More than half the days' },
    { value: '3', label_ur: 'تقریباً ہر روز', label_en: 'Nearly every day' },
  ],
  coping_frequency: [
    { value: 'never', label_ur: 'کبھی نہیں', label_en: 'Never' },
    { value: 'rarely', label_ur: 'شاذ و نادر', label_en: 'Rarely' },
    { value: 'sometimes', label_ur: 'کبھی کبھی', label_en: 'Sometimes' },
    { value: 'often', label_ur: 'اکثر', label_en: 'Often' },
  ],
};

export function getScaleOptions(preset: string): Option[] {
  return SCALES[preset] ?? [];
}
export function getQuestionOptions(question: {
  type: string;
  options?: Option[];
  scale_preset?: string;
}): Option[] {
  if (question.options && question.options.length > 0) {
    return question.options;
  }
  if (question.scale_preset) {
    return SCALES[question.scale_preset] ?? [];
  }
  if (question.type === 'yes_no') return SCALES.yes_no;
  if (question.type === 'yes_no_extent') return SCALES.yes_no_extent;
  if (question.type === 'likert_scale') return SCALES.frequency;
  return [];
}