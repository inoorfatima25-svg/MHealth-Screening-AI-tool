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

**Flow:** Welcome → Sections 2–17 → SafetyFollowUp (if PHQ-9 item 9 ≥ 1) → Completion.

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

**Question shell:** back (RTL: points right) · `Section X of 16` · language toggle · 3px progress bar · section badge · question counter · bilingual text · input · sticky `پچھلا` / `اگلا` (Next disabled until valid).

| Screen | Key rules |
|--------|-----------|
| Welcome | Leaf 72px teal circle; consent card; pills (lock, 15–20 min, door); name + date + agree; CTA `شروع کریں — Begin` |
| SingleSelect | Card options; selected `primary-light` + `border-active`; radio on trailing edge (RTL); auto-advance 400ms |
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

### Section 1 — Consent
`WelcomeScreen` only (not in question flow).

---

### Section 2 — ذاتی معلومات · `user` · primary

```
s2_q1 | number | "آپ کی عمر کیا ہے؟" / "What is your age?"

s2_q2 | single_select | "آپ کی جنس کیا ہے؟" / "What is your gender?"
  options: Male/مرد, Female/عورت, Other/دیگر
  → if Other: s2_q2a, s2_q2b, s2_q2c

s2_q2a | text_short | "آپ اپنی جنس / شناخت کیسے بیان کریں گے؟" / "How do you describe your gender/identity?"
  conditional_on: s2_q2 = Other

s2_q2b | single_select | "کیا آپ کی جنس وہی ہے جو پیدائش کے وقت تفویض کی گئی تھی؟" / "Is your gender the same as the one assigned at birth?"
  options: Yes/ہاں, No/نہیں, Prefer not to say/کہنا نہیں چاہتا | conditional: s2_q2 = Other

s2_q2c | single_select | supportive ماحول / "Do you feel supported by people around you regarding this identity?"
  options: Yes, To some extent, No, Prefer not to say | conditional: s2_q2 = Other

s2_q3 | yes_no | psychologist/counsellor/psychiatrist visit → if Yes: s2_q3a

s2_q3a | text_short | "اگر ہاں، تو کس وجہ سے؟" / "If yes, for what reason?" | conditional: s2_q3 = Yes

s2_q4 | single_select | feeling right now: Calm, Okay, A little uneasy, Anxious, Low-sad, Other

s2_q5 | yes_no | mental health / wellbeing mobile app used
```

---

### Section 3 — تعلیمی کارکردگی · `graduation-cap` · primary

```
s3_q1 | single_select | year 1–4
s3_q2 | text_short | program/major
s3_q3 | likert_scale | performance: Excellent→Poor
s3_q4 | likert_scale | frequency (academic stress)
s3_q5 | likert_scale | severity (mental health/sleep)
s3_q6 | likert_scale | confidence (responsibilities)
s3_q7 | likert_scale | frequency (overwhelmed)
s3_q8 | likert_scale | frequency (exam nausea)
s3_q9 | likert_scale | frequency (headache/heartbeat/trembling)
s3_q10 | likert_scale | severity (concentration/daily functioning)
```
(Full bilingual text per research instrument — see project brief §3.)

---

### Section 4 — روزمرہ کے معمولات · `sun` · primary · 4 subsections

#### 4A Sleep
```
s4a_q1 sleep_quality | s4a_q2 number 0–24 decimal | s4a_q3 severity
s4a_q4 frequency | s4a_q5 refresh | s4a_q6 refresh (weekday schedule)
```

#### 4B Physical Activity
```
s4b_q1 days active (0/1-2/3-4/5+)
s4b_q2 multi: Walking, Sports, Gym, Yoga, None, Other
s4b_q3 Increased/Same/Decreased/Never active
s4b_q4 multi reasons | conditional: s4b_q3 = Decreased
s4b_q5 activity↔mood (4 options)
```

#### 4C Self-Care
```
s4c_q1 care routine frequency | s4c_q2 appearance change
s4c_q3 effort for daily tasks | s4c_q4 living space state
s4c_q5 multi contributing factors
```

#### 4D Physical Complaints
```
s4d_q1–q3 body/stomach/headache frequency
s4d_q4 increase during stress | s4d_q5 doctor consulted
```

---

### Section 5 — Screen / Social Media · `smartphone` · primary

```
s5_q1 hours bands (<1, 1-2, 3-4, 5+)
s5_q2–q3 likert frequency/severity
s5_q4–q5 yes_no_extent
```

---

### Section 6 — ٹال مٹول، خود اعتمادی، موازنہ، مقابلہ · `scale` · primary

#### 6A Procrastination — s6a_q1–q3 likert (frequency/severity/frequency)
#### 6B Self-Esteem — s6b_q1 confidence, q2 frequency, q3 satisfaction
#### 6C Comparison — s6c_q1–q3 frequency
#### 6D Competition
```
s6d_q1 | likert severity | pressure to compete with classmates
s6d_q2 | single_select | motivates / no effect / unease / significant stress
s6d_q3 | likert | competitive pressure level: Very little→Overwhelming
```

---

### Section 7 — سماجی سہارا · `users` · primary

```
s7_q1 someone to talk to (Yes/Extent/No)
s7_q2 multi who helps
s7_q3 emotional support (great deal→not at all)
s7_q4 comfort discussing feelings
s7_q5 close friends count
s7_q6 eat alone vs with others
s7_q7 multi leisure activities
s7_q8 isolation frequency (past month)
```

---

### Section 8 — خاندانی پس منظر · `home` · primary

```
s8_q1 family size (number) | s8_q2 siblings (number) | s8_q3 birth order (text)
s8_q4 family MH history (yes_no)
s8_q5 perceived family MH issues → s8_q5a relationship, s8_q5b text_long if Yes
s8_q6 relationship with family | s8_q7 who talk to when stressed
s8_q8 major loss (yes_no)
s8_q9 childhood emotional atmosphere: Warm/Neutral/Tense/Unpredictable/Prefer not to say
```

---

### Section 9 — رہائشی انتظامات · `building` · primary

```
s9_q1 | single_select
  "آپ فی الوقت خاندان کے ساتھ، ہاسٹل میں، یا اکیلے رہتے ہیں؟"
  "Do you currently live with family, in a hostel, or alone?"
  options: With family/خاندان کے ساتھ, Hostel/ہاسٹل, Alone/اکیلے, Other/دیگر

s9_q2 | likert_scale (comfort)
  "آپ اپنے موجودہ رہائشی انتظام کو کتنا آرام دہ اور مددگار پاتے ہیں؟"
  "How comfortable and supportive do you find your current living arrangement?"

s9_q3 | yes_no_extent
  "کیا آپ کو لگتا ہے کہ آپ کا رہائشی ماحول آپ کے موڈ یا روزمرہ کاموں پر اثر ڈالتا ہے؟"
  "Do you think your living environment affects your mood or daily functioning?"

s9_q4 | likert_scale (frequency)
  "کیا آپ کو اپنے موجودہ رہائشی حالات میں اکیلا پن محسوس ہوتا ہے؟"
  "Do you ever feel lonely in your current living situation?"

s9_q5 | yes_no_extent
  "کیا رہائش سے متعلق ذمہ داریاں یا حالات آپ کی تعلیمی یا روزمرہ کارکردگی پر اثر ڈالتے ہیں؟"
  "Do housing-related responsibilities or conditions affect your academic or daily performance?"

s9_q6 | yes_no_extent | conditional: s9_q1 ≠ With family
  "اگر آپ گھر سے دور رہتے ہیں، کیا ایڈجسٹ کرنے میں دشواری یا گھر کی یاد محسوس ہوئی؟"
  "If you live away from home, did you face difficulty adjusting or experience homesickness?"
```

---

### Section 10 — علاقائی اور ثقافتی ایڈجسٹمنٹ · `map-pin` · primary

```
s10_q1 | text_short
  "آپ پاکستان کے کس صوبے یا علاقے سے تعلق رکھتے ہیں؟"
  "Which province or region of Pakistan do you belong to?"

s10_q2 | yes_no_extent
  "کیا ثقافتی، لسانی، یا علاقائی فرقوں نے یونیورسٹی زندگی میں ایڈجسٹ ہونا مشکل بنایا؟"
  "Have cultural, language, or regional differences made it difficult to adjust to university life?"

s10_q3 | yes_no_extent
  "کیا آپ نے کبھی اپنے علاقائی یا ثقافتی پس منظر کی وجہ سے نظرانداز یا غلط سمجھے جانے کا احساس کیا؟"
  "Have you ever felt ignored or misunderstood due to your regional or cultural background?"

s10_q4 | likert_scale (comfort)
  "کیا آپ یونیورسٹی کے ماحول میں اپنی ثقافتی شناخت ظاہر کرنے میں آرام دہ محسوس کرتے ہیں؟"
  "Do you feel comfortable expressing your cultural identity in the university environment?"

s10_q5 | likert_scale (severity)
  "کیا اپنے آبائی شہر یا خاندان سے دور رہنے نے آپ کی ذہنی صحت یا دباؤ پر اثر ڈالا ہے؟"
  "Has being away from your hometown or family affected your mental health or stress levels?"
```

---

### Section 11 — معاشی حالات اور مالی دباؤ · `wallet` · primary

```
s11_q1 | text_short
  "آپ کے والد کی تعلیمی قابلیت اور پیشہ/پیشہ ورانہ کام کیا ہے؟"
  "What is your father's educational qualification and his occupation/profession?"

s11_q2 | text_short
  "آپ کی والدہ کی تعلیمی قابلیت کیا ہے، اور کیا وہ ملازمت کرتی ہیں یا گھریلو خاتون ہیں؟"
  "What is your mother's educational qualification, and is she employed or a homemaker?"

s11_q3 | single_select
  "کیا آپ کی موجودہ گھریلو آمدنی خاندانی اخراجات پورا کرنے کے لیے کافی ہے؟"
  "Is your current household income sufficient to meet family expenses comfortably?"
  options: Comfortably sufficient/آرام سے کافی, Just enough/بمشکل کافی, Not sufficient/کافی نہیں, Prefer not to say

s11_q4 | yes_no_extent
  "کیا بڑھتے اخراجات (فیس، ٹرانسپورٹ، پٹرول، کھانا) آپ کو مالی دباؤ دیتے ہیں؟"
  "Do increasing expenses (fees, transport, petrol, food, etc.) cause you financial stress?"

s11_q5 | yes_no_extent
  "کیا گھر میں مالی مشکلات روزمرہ زندگی یا ذہنی بہبود پر اثر ڈالتی ہیں؟"
  "Do financial difficulties at home affect your daily life or mental well-being?"

s11_q6 | yes_no_extent
  "کیا مالی دباؤ آپ کی پڑھائی یا توجہ پر اثر ڈالتا ہے؟"
  "Does financial stress affect your studies or concentration?"

s11_q7 | yes_no
  "کیا آپ نے کبھی مالی مسائل کی وجہ سے تعلیم جاری نہ رکھنے پر سنجیدگی سے غور کیا ہے؟"
  "Have you ever seriously considered discontinuing your education due to financial problems?"

s11_q8 | yes_no_extent
  "کیا graduation کے بعد روزگار یا job market کے بارے میں آپ فکرمند ہیں؟"
  "Are you worried about employment or the job market after graduation?"

s11_q9 | yes_no_extent
  "کیا آپ مستقبل میں مالی طور پر خودمختار ہونے یا خاندان کی مدد کا دباؤ محسوس کرتے ہیں؟"
  "Do you feel pressure to become financially independent or support your family in the future?"

s11_q10 | likert_scale (security)
  "اپنے مستقبل کے کیریئر اور مالی استحکام کے بارے میں آپ کتنا محفوظ محسوس کرتے ہیں؟"
  "How secure do you feel about your future career and financial stability?"
```

---

### Section 12 — قومی اور بین الاقوامی معاملات · `globe` · primary

```
s12_q1 | likert_scale (severity)
  "کیا قومی معاشی حالات (مہنگائی، پٹرول، بے روزگاری) آپ کے روزمرہ دباؤ یا ذہنی بہبود پر اثر ڈالتے ہیں؟"
  "Do national economic conditions (inflation, petrol prices, unemployment) affect your daily stress or mental well-being?"

s12_q2 | likert_scale (frequency)
  "خبروں یا social media پر سیاسی یا بین الاقوامی تنازعات کتنی بار آپ کو دباؤ یا بے چینی دیتے ہیں؟"
  "How often do political or international conflicts on news or social media cause you stress or anxiety?"

s12_q3 | yes_no_extent
  "کیا مسلسل خبروں کی exposure کی وجہ سے آپ overwhelmed محسوس کرتے ہیں؟"
  "Do you ever feel overwhelmed due to continuous exposure to news?"

s12_q4 | likert_scale (severity)
  "پاکستان کے معاشی یا سیاسی مستقبل کی فکر آپ کے موڈ، حوصلے، یا پڑھائی پر اثر ڈالتی ہے؟"
  "Does concern about Pakistan's economic or political future affect your mood, motivation, or studies?"

s12_q5 | yes_no_extent
  "کیا علاقائی تنازعات یا جنگ سے متعلق خبریں مستقبل کے بارے میں خوف یا غیر یقینی پیدا کرتی ہیں؟"
  "Have regional conflicts or war-related news created fear or uncertainty about the future for you?"
```

---

### Section 13 — بدمعاشی اور ہراسانی · `shield-alert` · coral

```
s13_q1 | yes_no
  "کیا آپ نے کبھی یونیورسٹی میں bullying، harassment، یا سماجی خارجی محسوس کی؟"
  "Have you ever experienced bullying, harassment, or social exclusion in university life?"

s13_q2 | likert_scale (frequency)
  "آپ کتنی بار academic یا سماجی ماحول میں نشانہ بنے، ذلیل یا توہین محسوس کی؟"
  "How often have you been targeted, humiliated, or insulted by others in academic or social settings?"

s13_q3 | yes_no
  "کیا آپ نے social media یا online platforms پر bullying کا سامنا کیا؟"
  "Have you ever experienced bullying on social media or online platforms?"

s13_q4 | yes_no_extent
  "کیا bullying یا منفی سماجی تجربات نے ذہنی صحت یا تعلیمی کارکردگی پر اثر ڈالا؟"
  "Do you think bullying or negative social experiences have affected your mental health or academic performance?"

s13_q5 | likert_scale (comfort)
  "کیا آپ یونیورسٹی کے ماحول میں محفوظ اور قابلِ احترام محسوس کرتے ہیں؟"
  "Do you feel safe and respected in your university environment?"
```

---

### Section 14 — مقابلے کے طریقے · `shield-heart` · purple

```
s14_q1 | multi_select | stressed coping (11 options + Other)
s14_q2 | single_select | Very/Somewhat/Not very effective / Don't know
s14_q3 | likert_grid | tea, unprescribed meds, smoking, eating, sleep, avoidance — Never→Often
s14_q4 | single_select | wanted professional support but couldn't access?
s14_q5 | multi_select barriers | conditional: s14_q4 = Yes
```

---

### Section 15 — GAD-7 · `activity` · blue · likert_grid

```
1. گھبراہٹ، بے چینی، یا کنارے پر ہونے کا احساس / Feeling nervous, anxious, or on edge
2. فکر کو روکنا یا قابو کرنا مشکل ہونا / Not being able to stop or control worrying
3. مختلف چیزوں کے بارے میں بہت زیادہ فکر کرنا / Worrying too much about different things
4. آرام کرنا مشکل ہونا / Trouble relaxing
5. اتنی بے چینی کہ بیٹھنا مشکل ہو / Being so restless that it is hard to sit still
6. آسانی سے چڑچڑا یا ناراض ہو جانا / Becoming easily annoyed or irritable
7. خوف محسوس کرنا، جیسے کچھ برا ہونے والا ہو / Feeling afraid, as if something awful might happen
```

---

### Section 16 — PHQ-9 · `heart-pulse` · blue · likert_grid

```
1. کاموں میں دلچسپی یا خوشی کم / Little interest or pleasure in doing things
2. اداسی، مایوسی، ناامیدی / Feeling down, depressed, or hopeless
3. نیند کی دشواری یا زیادہ سونا / Trouble sleeping or sleeping too much
4. توانائی کی کمی / Feeling tired or having little energy
5. بھوک کم یا زیادہ / Poor appetite or overeating
6. اپنے بارے میں برا محسوس کرنا / Feeling bad about yourself or a failure
7. توجہ مرکوز کرنا مشکل / Trouble concentrating
8. سستی یا بے چینی / Moving/speaking slowly or being fidgety/restless
9. مر جانا بہتر ہو یا خود کو نقصان / Thoughts of being better off dead or hurting yourself
```
→ triggers SafetyFollowUp if item 9 ≥ 1

---

### Section 17 — مجموعی کارکردگی · `clipboard-check` · primary

```
s17_q1 | single_select | problems affecting work/home/relationships: Not at all→Extremely difficult
s17_q2 | single_select | days missed class: None / 1-2 / 3-5 / More than 5
s17_q3 | single_select | wellbeing vs semester start: Better / Same / Somewhat worse / Much worse
```

---

## Welcome & completion copy

**Consent:** Research on university student mental health; voluntary; withdraw anytime; confidential.  
Signature: *By signing, you acknowledge you have read and understood the above, participate voluntarily, and may withdraw at any time.*

**Completion counselling (Urdu):** اگر آپ کو پیشہ ورانہ مدد کی ضرورت ہو تو اپنے یونیورسٹی کے counselling centre سے رابطہ کریں  
**Privacy footer:** آپ کے جوابات محفوظ اور خفیہ ہیں
