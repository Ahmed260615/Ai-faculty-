const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
/** Design tokens for AstroHealth. Body text is 18px+, nothing below 15px. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), surface2: v('surface2'),
        sidebar: v('sidebar'), 'sidebar-2': v('sidebar-2'),
        primary: { DEFAULT: v('primary'), dark: v('primary-dark'), light: v('primary-light') },
        secondary: v('secondary'), accent: v('accent'),
        ink: v('ink'), muted: v('muted'), line: v('line'),
        violet: { DEFAULT: v('violet'), text: v('violet-text') },
        ok: { DEFAULT: v('ok'), dark: v('ok-dark'), bg: v('ok-bg') },
        warn: { DEFAULT: v('warn'), dark: v('warn-dark'), bg: v('warn-bg') },
        crit: { DEFAULT: v('crit'), dark: v('crit-dark'), bg: v('crit-bg'), solid: v('crit-solid') },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'Segoe UI', 'Tahoma', 'sans-serif'],
        display: ['"29LT Bukra"', 'Cairo', 'system-ui', 'sans-serif'],
        mono: ['"29LT Bukra"', 'Cairo', 'system-ui', 'sans-serif'], // numerals: Bukra, tabular
      },
      fontSize: {
        xs: ['0.9375rem', '1.4rem'],
        sm: ['1rem', '1.5rem'],
        base: ['1.125rem', '1.7rem'],
        lg: ['1.25rem', '1.8rem'],
        xl: ['1.5rem', '2rem'],
        '2xl': ['1.75rem', '2.2rem'],
        '3xl': ['2.125rem', '2.6rem'],
        '4xl': ['2.75rem', '3.1rem'],
        '5xl': ['3.5rem', '1'],
      },
      spacing: { touch: '3rem' },
      boxShadow: { card: '0 1px 0 rgba(20,37,54,.03), 0 8px 24px -12px rgba(20,37,54,.10)' },
      borderRadius: { xl: '14px', '2xl': '22px', '3xl': '32px' },
    },
  },
  plugins: [],
};
