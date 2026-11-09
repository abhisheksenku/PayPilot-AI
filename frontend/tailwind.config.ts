import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paypilot: {
          black: '#111111',
          surface: '#1A1A1A',
          card: '#222222',
          border: '#333333',
          red: {
            DEFAULT: '#E53935',
            hover: '#C62828',
            light: '#FFEBEE',
            glow: 'rgba(229, 57, 53, 0.25)',
          },
          white: '#FFFFFF',
          muted: '#888888',
          success: '#16A34A',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
