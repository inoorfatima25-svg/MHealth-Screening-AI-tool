import type { Section } from '@/types/survey';
import { section2 } from './sections/section2';
import { section3 } from './sections/section3';
import { section4 } from './sections/section4';
import { section5 } from './sections/section5';
import { section6 } from './sections/section6';
import { section7 } from './sections/section7';
import { section8 } from './sections/section8';
import { section9 } from './sections/section9';
import { section10 } from './sections/section10';
import { section11 } from './sections/section11';
import { section12 } from './sections/section12';
import { section13 } from './sections/section13';
import { section14 } from './sections/section14';
import { sectionCaffeine } from './sections/sectionCaffeine';
import { section15 } from './sections/section15';
import { section16 } from './sections/section16';
import { section17 } from './sections/section17';
import { section18 } from './sections/section18';

export const sections: Section[] = [
  section2,
  section3,
  section4,
  section5,
  section6,
  section7,
  section8,
  section9,
  section10,
  section11,
  section12,
  section13,
  section14,
  sectionCaffeine,
  section15,
  section16,
  section17,
  section18,
];

export const TOTAL_SECTIONS = sections.length;

/** UI sections 1–17; section 18 (contact / gratitude) is optional. */
export const MANDATORY_SECTION_COUNT = TOTAL_SECTIONS - 1;
