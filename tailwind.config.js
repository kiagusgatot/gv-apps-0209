/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#1B6B3A',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#1B6B3A',
          900: '#0C3E1E',
          950: '#061A0D',
        },
        surface: {
          50:  '#FAFBF9',
          100: '#F3F5F1',
          200: '#E8EBE5',
          300: '#D4D8D0',
          400: '#9CA39A',
          500: '#6B7269',
          600: '#4A514A',
          700: '#333933',
          800: '#1E231E',
          900: '#0F1A13',
        },
        ink: {
          DEFAULT: '#0F1A13',
          secondary: '#4A514A',
          muted: '#6B7269',
          faint: '#9CA39A',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      letterSpacing: {
        'display': '-0.035em',
        'heading': '-0.025em',
        'tight-sm': '-0.015em',
      },
      boxShadow: {
        'brand-xs': '0 1px 2px rgba(27,107,58,0.05)',
        'brand-sm': '0 1px 3px rgba(27,107,58,0.06), 0 1px 2px rgba(27,107,58,0.04)',
        'brand':    '0 2px 8px rgba(27,107,58,0.08), 0 1px 3px rgba(27,107,58,0.05)',
        'brand-md': '0 4px 16px rgba(27,107,58,0.10), 0 2px 4px rgba(27,107,58,0.06)',
        'brand-lg': '0 8px 24px rgba(27,107,58,0.12), 0 4px 8px rgba(27,107,58,0.07)',
        'brand-xl': '0 16px 48px rgba(27,107,58,0.16), 0 6px 12px rgba(27,107,58,0.08)',
        'up-sm':    '0 -1px 3px rgba(27,107,58,0.04), 0 -2px 8px rgba(27,107,58,0.03)',
        'up':       '0 -2px 8px rgba(27,107,58,0.06), 0 -4px 16px rgba(27,107,58,0.04)',
        'glass':    '0 4px 24px rgba(27,107,58,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease-out',
        'slide-up':    'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-down':  'slideDown 0.35s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':    'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        'float':       'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp:   { '0%': { opacity:'0', transform:'translateY(16px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        slideDown: { '0%': { opacity:'0', transform:'translateY(-16px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        scaleIn:   { '0%': { opacity:'0', transform:'scale(0.95)' }, '100%': { opacity:'1', transform:'scale(1)' } },
        float:     { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-6px)' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
