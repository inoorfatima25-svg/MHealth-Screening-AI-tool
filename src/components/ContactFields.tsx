'use client';

import { Mail, Phone } from 'lucide-react';
import { useSurveyStore } from '@/store/surveyStore';

interface ContactFieldsProps {
  value?: Record<string, string | number>;
  onChange: (value: Record<string, string>) => void;
}

export function ContactFields({ value, onChange }: ContactFieldsProps) {
  const language = useSurveyStore((s) => s.language);
  const isUrdu = language === 'ur';

  const phone = typeof value?.phone === 'string' ? value.phone : '';
  const email = typeof value?.email === 'string' ? value.email : '';

  const fields = [
    {
      key: 'phone',
      icon: Phone,
      type: 'tel' as const,
      label: isUrdu ? 'فون نمبر (اختیاری)' : 'Phone number (optional)',
      placeholder: '03xx-xxxxxxx',
      value: phone,
      commit: (v: string) => onChange({ phone: v, email }),
    },
    {
      key: 'email',
      icon: Mail,
      type: 'email' as const,
      label: isUrdu ? 'ای میل ایڈریس (اختیاری)' : 'Email address (optional)',
      placeholder: 'name@example.com',
      value: email,
      commit: (v: string) => onChange({ phone, email: v }),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {fields.map((f, i) => (
        <div key={f.key} className="animate-fade-up" style={{ animationDelay: `${60 + i * 60}ms` }}>
          <label
            htmlFor={`contact-${f.key}`}
            className={`mb-1.5 block text-[11.5px] font-medium text-ink-soft ${
              isUrdu ? 'font-urdu text-right' : ''
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {f.label}
          </label>
          <div className="relative">
            <f.icon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              id={`contact-${f.key}`}
              type={f.type}
              dir="ltr"
              value={f.value}
              onChange={(e) => f.commit(e.target.value)}
              placeholder={f.placeholder}
              className="h-14 w-full rounded-card border border-line bg-card ps-11 pe-4 text-base text-ink outline-none transition
                placeholder:text-ink-faint hover:border-line-strong
                focus:border-primary focus:shadow-[0_0_0_4px_rgba(27,164,127,0.12)]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
