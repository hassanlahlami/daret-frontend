import type { Config } from 'tailwindcss';

// RTL-clean by default: use Tailwind logical properties (ms-*, me-*, ps-*, pe-*,
// start-*, end-*, text-start/text-end) rather than left/right so Arabic flips
// automatically from the <html dir> set in the locale layout.
const config: Config = {
  content: [
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f766e',
          dark: '#115e59'
        }
      }
    }
  },
  plugins: []
};

export default config;
