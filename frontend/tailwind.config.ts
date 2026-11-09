import type { Config } from 'tailwindcss';
import path from 'path';

const config: Config = {
  content: [
    path.join(__dirname, './src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Navy & Slate Palette
        navy: {
          DEFAULT: '#080C15',
          canvas: '#080C15',
          surface: '#0F172A',
          elevated: '#1E293B',
          card: '#0D1424',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': '#1E293B',
        },
        // PayPal Brand & Financial Trust Rails
        paypal: {
          DEFAULT: '#0070BA',
          blue: '#0070BA',
          'blue-hover': '#005EA6',
          dark: '#003087',
          cobalt: '#2563EB',
          gold: '#FFC439',
          'gold-hover': '#F2BA36',
          cyan: '#00CFDE',
        },
        // Specialized Agent Swarm Palette
        agent: {
          supervisor: '#6366F1', // Indigo
          research: '#06B6D4',   // Cyan
          analyst: '#8B5CF6',    // Purple
          purchase: '#0070BA',   // PayPal Blue
          guardrail: '#10B981',  // Emerald Mint
        },
        // Muted & Meta Typography
        slate: {
          950: '#080C15',
          900: '#0F172A',
          850: '#131D31',
          800: '#1E293B',
          700: '#334155',
          400: '#94A3B8',
          300: '#CBD5E1',
          100: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'fintech-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'fintech-glow': '0 0 25px -5px rgba(0, 112, 186, 0.35)',
        'fintech-gold-glow': '0 0 25px -5px rgba(255, 196, 57, 0.35)',
        'fintech-modal': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
