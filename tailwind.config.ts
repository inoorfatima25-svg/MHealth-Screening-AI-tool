import type { Config } from 'tailwindcss';
import tailwindcssRtl from 'tailwindcss-rtl';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand ──────────────────────────────────────────────
        primary: {
          DEFAULT: '#12876A',
          bright: '#1BA47F',
          light: '#E7F5F0',
          dark: '#0A5C48',
          mid: '#0F6E56',
        },

        // ── Neutrals ───────────────────────────────────────────
        surface: {
          DEFAULT: '#EAEFED',
          // The page field cards sit on — deep enough that a white card reads
          // as raised without needing a heavy border.
          sunken: '#F1F5F4',
        },
        card: '#FFFFFF',
        line: {
          DEFAULT: '#E6EDEA',
          strong: '#D3DEDA',
        },
        // Kept as aliases so any stray `border-border` still resolves
        border: {
          DEFAULT: '#E6EDEA',
          active: '#12876A',
        },
        ink: {
          DEFAULT: '#131817',
          soft: '#5C6A65',
          mute: '#93A09B',
          faint: '#BFC9C5',
        },
        'text-primary': '#131817',
        'text-secondary': '#5C6A65',
        'text-tertiary': '#93A09B',

        // ── Section accents (matched lightness/chroma) ──────────
        danger: {
          DEFAULT: '#C2452A',
          light: '#FDEEEA',
        },
        purple: {
          DEFAULT: '#7B5BD6',
          light: '#F1EEFC',
        },
        blue: {
          DEFAULT: '#3A82CC',
          light: '#E8F1FD',
        },
        coral: {
          DEFAULT: '#DB6B45',
          light: '#FDEFEA',
        },
      },

      fontFamily: {
        urdu: ['var(--font-urdu)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },

      borderRadius: {
        card: '16px',
        chip: '999px',
      },

      maxWidth: {
        survey: '480px',
      },

      boxShadow: {
        soft: '0 1px 2px rgba(16,40,33,0.04), 0 4px 14px -6px rgba(16,40,33,0.08)',
        card: '0 2px 6px -2px rgba(16,40,33,0.06), 0 12px 30px -12px rgba(16,40,33,0.12)',
        float: '0 10px 30px -10px rgba(16,40,33,0.18), 0 30px 60px -24px rgba(16,40,33,0.14)',
        glow: '0 6px 20px -6px rgba(18,135,106,0.5)',
      },

      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.42s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.35s ease-out both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22,1,0.36,1) both',
        pop: 'pop 0.32s cubic-bezier(0.34,1.4,0.64,1) both',
        'sheet-in': 'sheet-in 0.24s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssRtl],
};

export default config;
