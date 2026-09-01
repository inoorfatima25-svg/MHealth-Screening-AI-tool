# Mental Health Screening Instrument — Web App

> Source files: `Screening_Instrument.pdf` + this spec.  
> Implement every question below in `src/data/questions.ts`.

---

## Project overview

Build a bilingual (Urdu/English) **mobile-first** web app for a mental health screening questionnaire targeting Pakistani university students. Administered on campus — students complete it on their phones.

**Tone:** Calm, trustworthy wellness tool — not a clinical hospital form.  
**Aesthetic:** Soft, organic; Headspace meets university research. Rounded corners, generous whitespace, nature-inspired teal/green.

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 + `tailwindcss-rtl`
- **State:** Zustand + `persist` (localStorage) — answers, section, question index, language
- **Database:** Supabase (Postgres) — one `responses` table, JSONB answers
- **Deployment:** Vercel
- **Fonts:** `Noto Nastaliq Urdu` (Urdu), `DM Sans` (English)
- **Icons:** Lucide React

---

## Design tokens

### Colors
```
primary: #1D9E75    primary-light: #E1F5EE    primary-dark: #085041    primary-mid: #0F6E56
surface: #FAFBFA    card: #FFFFFF             border: #E8EDEB           border-active: #1D9E75
text-primary: #1A1D1B    text-secondary: #6B7570    text-tertiary: #9CA5A0
danger: #D4380D     danger-light: #FFF1F0
purple: #534AB7     purple-light: #EEEDFE
blue: #185FA5       blue-light: #E6F1FB
coral: #D85A30     (bullying section)
```

### Typography
- **Urdu:** Noto Nastaliq Urdu, RTL, right-aligned. Questions 16px/600/lh 2.0; options 14px/400.
- **English:** DM Sans, LTR. Translations 13px/400 `text-secondary`; buttons 14px/500.

### Spacing & radius
Page 20×16px · question→options 24px · option gap 10px · cards/buttons 12px · chips 24px · progress 2px

### Motion
Slide 300ms · option press scale(0.98) 150ms · progress 500ms · chip bounce 200ms · single-select auto-advance 400ms · respect `prefers-reduced-motion`

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 → redirect /survey
│   └── survey/
│       ├── page.tsx
│       └── complete/page.tsx
├── components/
│   ├── WelcomeScreen.tsx
│   ├── QuestionScreen.tsx
│   ├── SingleSelect.tsx
│   ├── MultiSelect.tsx
│   ├── LikertGrid.tsx
│   ├── TextInput.tsx
│   ├── ScaleSelect.tsx
│   ├── ProgressBar.tsx
│   ├── NavigationButtons.tsx
│   ├── LanguageToggle.tsx
│   ├── PrivacyBadge.tsx
│   ├── SafetyFollowUp.tsx
│   └── CompletionScreen.tsx
├── data/
│   ├── questions.ts
│   └── scales.ts
├── store/surveyStore.ts
├── lib/supabase.ts
└── types/survey.ts
```

**Flow:** Welcome → Sections 1–18 from the PDF. Each section uses one page when practical and never more than two pages; all questions on the current page are visible together. PHQ-9 safety check appears after the PHQ-9 section when item 9 ≥ 1 → Completion.

---

## TypeScript types

```typescript
type QuestionType =
  | 'single_select' | 'multi_select' | 'likert_scale' | 'likert_grid'
  | 'text_short' | 'text_long' | 'number' | 'yes_no' | 'yes_no_extent'

interface Option { value: string; label_ur: string; label_en: string }

interface Question {
  id: string
  type: QuestionType
  text_ur: string
  text_en: string
  options?: Option[]
  scale_preset?: string
  required: boolean
  note_ur?: string
  note_en?: string
  conditional_on?: { question_id: string; value: string | string[] }
  grid_items?: { id: string; text_ur: string; text_en: string }[]
  grid_scale?: Option[]
  max_selections?: number
  min?: number; max?: number; allow_decimal?: boolean
}

interface Subsection { id: string; title_ur: string; title_en: string; questions: Question[] }

interface Section {
  id: string; title_ur: string; title_en: string
  icon: string; accent_color: string
  questions?: Question[]
  subsections?: Subsection[]
}
```

Use `conditional_on` only (no separate `conditional` question type). Reusable scales in `scales.ts`: `frequency`, `severity`, `confidence`, `satisfaction`, `comfort`, `sleep_quality`, `refresh`, `security`.

---

## Global UX (screens, mobile, language, a11y)

**Mobile-first** — target 375px, max-width 480px centered; desktop shows phone column on `surface` bg.

**Section shell:** back (RTL: points right) · `Section X of 18` · language toggle · progress bar · section title · page indicator when split · all questions for the current section page · sticky `پچھلا` / `اگلا` navigation. **Never auto-advance.**

| Screen | Key rules |
|--------|-----------|
| Welcome | Leaf 72px teal circle; consent card; pills (lock, 15–20 min, door); name + date + agree; CTA `شروع کریں — Begin` |
| SingleSelect | Card options; selected `primary-light` + `border-active`; radio on trailing edge (RTL); selection stays on the same page until the participant taps Next |
| MultiSelect | Chips; helper `تمام متعلقہ پر نشان لگائیں — Select all that apply`; min 1 |
| LikertGrid | Sticky 0–3 header; 32px circles; scrollable 7/9 items |
| Text/Number | Short 48px / long textarea min 120px / centered number + steppers |
| Completion | 100% bar; check icon; thank-you + counselling card + privacy footer |

**Language:** default Urdu; toggle in header; active = primary text; persists Zustand + localStorage.

**A11y:** 44px tap targets · focus-visible · aria-labels · linked labels · `role="radiogroup"` · WCAG AA.

**Edge cases:** browser back → prev question · refresh → Zustand/Supabase resume · offline queue section saves · skip conditionals/empty sections · Urdu wraps, never truncates.

---

## Clinical instruments & safety

**GAD-7 / PHQ-9 scale:** 0 بالکل نہیں / Not at all · 1 کچھ دن / Several days · 2 آدھے سے زیادہ دن / More than half the days · 3 تقریباً ہر روز / Nearly every day

**Severity bands — log only, never show participant:**  
GAD-7: 0–4 Minimal · 5–9 Mild · 10–14 Moderate · 15–21 Severe  
PHQ-9: 0–4 Minimal · 5–9 Mild · 10–14 Moderate · 15–19 Mod. severe · 20–27 Severe

**Safety (PHQ-9 item 9 ≥ 1):** `SafetyFollowUp` after PHQ-9, non-blocking, log `safety_followup`, set `phq9_item9_flag`.  
Urdu: اگر آپ نے خود کو نقصان پہنچانے کے خیالات کا ذکر کیا ہے تو مدد دستیاب ہے۔  
English: If you indicated any thoughts of being better off dead or hurting yourself, please know that support is available.  
Options: Yes connect me to support · Already receiving support · No but I appreciate being asked

---

## Data storage

```sql
create table responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  consent_name text not null,
  consent_date date not null,
  answers jsonb not null,
  gad7_score int, phq9_score int,
  phq9_item9_flag boolean default false,
  safety_followup text,
  completion_status text default 'in_progress',
  last_section int, device_info text, duration_seconds int
);
```

- Every answer → Zustand + persist
- End of each **section** → Supabase upsert
- On load → offer resume · On submit → compute scores, `completed`

---

## Question inventory

The questionnaire content implemented in the app is aligned to the uploaded `Mental_Health_Screening_Bilingual(1).pdf`: 18 sections, beginning with GAD-7 and PHQ-9 and ending with Additional / Optional Questions. The authoritative implementation is `src/data/questions.ts`.

The UI intentionally groups questions by section rather than presenting one question per screen. Sections with more than six top-level questions are split into two pages; shorter sections remain on one page. No answer selection automatically advances the participant.
