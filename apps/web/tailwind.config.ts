import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ember: '#f97316',
        steel: '#1f2937'
      }
    }
  },
  plugins: []
} satisfies Config;
