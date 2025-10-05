import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/styles/**/*.{css}',
    './tests/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'light',
      'dark',
      {
        datedash: {
          primary: '#F97316',
          'primary-content': '#1F1300',
          secondary: '#6366F1',
          accent: '#22D3EE',
          neutral: '#1E293B',
          'neutral-content': '#F8FAFC',
          'base-100': '#FFFFFF',
          'base-200': '#F1F5F9',
          'base-300': '#E2E8F0',
          info: '#38BDF8',
          success: '#34D399',
          warning: '#FACC15',
          error: '#F87171'
        }
      }
    ]
  }
};

export default config;
