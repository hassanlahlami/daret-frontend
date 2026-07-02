import type { Config } from 'tailwindcss';

// Design system. RTL-clean via logical properties (ms-*, me-*, ps-*, pe-*, start/end).
// Palette: brand teal/emerald (trust) + warm amber accent (Moroccan warmth).
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effcf6',
          100: '#d3f5e5',
          200: '#aaeacd',
          300: '#72d9ae',
          400: '#39c08a',
          500: '#14a06f',
          600: '#0f766e',
          700: '#0d5f5a',
          800: '#0f4c49',
          900: '#0f3e3d',
          DEFAULT: '#0f766e'
        },
        accent: {
          50: '#fff8eb',
          100: '#feecc7',
          200: '#fdd88a',
          300: '#fbbf4d',
          400: '#f9a825',
          500: '#e08a0b',
          600: '#c26907',
          700: '#a1490b',
          800: '#833910',
          900: '#6d2f11',
          DEFAULT: '#f9a825'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
        glow: '0 0 0 1px rgba(15,118,110,0.1), 0 12px 40px -12px rgba(15,118,110,0.35)'
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(60% 60% at 50% 0%, rgba(20,160,111,0.14) 0%, rgba(255,255,255,0) 70%)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both'
      }
    }
  },
  plugins: []
};

export default config;
