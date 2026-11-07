/** Design tokens for AstroHealth. Body text is 18px+, nothing below 15px. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F6F9',
        sidebar: '#142536',
        'sidebar-2': '#1d3348',
        primary: { DEFAULT: '#3C7896', dark: '#2B5B74', light: '#E3EEF3' },
        secondary: '#7FA9B9',
        accent: '#8CA9A1',
        ink: '#203040',
        muted: '#566778', // darkened from #667788 for AA contrast on white
        line: '#D5DEE6',
        ok: { DEFAULT: '#2E9D78', dark: '#1F7357', bg: '#E4F4EE' },
        warn: { DEFAULT: '#D9A441', dark: '#8A6212', bg: '#FBF2DE' },
        crit: { DEFAULT: '#D75C5C', dark: '#A33A3A', bg: '#FBE8E8' },
      },
      fontFamily: {
        sans: ['Manrope', '"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'system-ui', 'Segoe UI', 'Tahoma', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
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
