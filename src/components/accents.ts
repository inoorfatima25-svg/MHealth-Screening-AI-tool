/**
 * Section accent palette.
 *
 * One calibrated set of four hues at matched lightness/chroma, so switching
 * sections changes the mood without changing the perceived contrast. Every
 * value is a literal Tailwind class string (not built at runtime) so the JIT
 * compiler can see and generate them.
 */
export interface Accent {
  /** Icon badge background */
  chip: string;
  /** Icon / accent foreground */
  icon: string;
  /** Selected row background */
  tint: string;
  /** Selected row ring */
  ring: string;
  /** Progress + filled indicator background */
  bar: string;
  /** Small counter pill */
  pill: string;
  /** Soft glow under a selected row */
  glow: string;
}

export const ACCENTS: Record<string, Accent> = {
  primary: {
    chip: 'bg-[#D2EDE3]',
    icon: 'text-[#0E7A60]',
    tint: 'bg-[#E7F5F0]',
    ring: 'ring-[#12876A]/45',
    bar: 'bg-[#12876A]',
    pill: 'bg-[#D2EDE3] text-[#0E7A60]',
    glow: 'shadow-[0_4px_14px_-6px_rgba(18,135,106,0.45)]',
  },
  purple: {
    chip: 'bg-[#E2DAFA]',
    icon: 'text-[#6A4BC4]',
    tint: 'bg-[#F1EEFC]',
    ring: 'ring-[#7B5BD6]/45',
    bar: 'bg-[#7B5BD6]',
    pill: 'bg-[#E2DAFA] text-[#6A4BC4]',
    glow: 'shadow-[0_4px_14px_-6px_rgba(123,91,214,0.45)]',
  },
  blue: {
    chip: 'bg-[#D4E6FA]',
    icon: 'text-[#2A6BB5]',
    tint: 'bg-[#E8F1FD]',
    ring: 'ring-[#3A82CC]/45',
    bar: 'bg-[#3A82CC]',
    pill: 'bg-[#D4E6FA] text-[#2A6BB5]',
    glow: 'shadow-[0_4px_14px_-6px_rgba(58,130,204,0.45)]',
  },
  coral: {
    chip: 'bg-[#FADFD3]',
    icon: 'text-[#C25534]',
    tint: 'bg-[#FDEFEA]',
    ring: 'ring-[#DB6B45]/45',
    bar: 'bg-[#DB6B45]',
    pill: 'bg-[#FADFD3] text-[#C25534]',
    glow: 'shadow-[0_4px_14px_-6px_rgba(219,107,69,0.45)]',
  },
};

export const getAccent = (name?: string): Accent =>
  (name && ACCENTS[name]) || ACCENTS.primary;
