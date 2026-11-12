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
        // Official PayPal Light Theme Tokens
        pp: {
          canvas: '#F5F7FA',       // PayPal Light Gray / Off-white page canvas
          surface: '#FFFFFF',      // Pure white card and drawer backgrounds
          elevated: '#F9FAFB',     // Subtle elevated card sections
          border: '#E5E7EB',       // Clean 1px hairline border
          'border-subtle': '#F3F4F6',
          'border-focus': '#0070BA',
          text: '#111827',         // Primary dark charcoal text (ultra-readable)
          subtext: '#545D68',      // Slate secondary text
          muted: '#6B7280',        // Form labels and timestamps
          blue: '#0070BA',         // PayPal Classic Electric Blue
          'blue-hover': '#005EA6',
          'blue-tint': '#EBF5FF',  // Active nav pill background
          dark: '#003087',         // Dark PayPal Navy
          gold: '#FFC439',         // PayPal Yellow
          'gold-hover': '#F2BA36',
          green: '#047857',        // Success / Settlement green
          'green-tint': '#ECFDF5', // Success badge tint
          amber: '#B45309',        // Sandbox alert amber
          'amber-tint': '#FFFBEB', // Sandbox alert banner background
        },
        // Direct PayPal Shortcuts
        paypal: {
          DEFAULT: '#0070BA',
          blue: '#0070BA',
          'blue-hover': '#005EA6',
          dark: '#003087',
          cobalt: '#2563EB',
          gold: '#FFC439',
          cyan: '#0070BA',
        },
        // Multi-Agent Swarm Semantic Palette
        agent: {
          supervisor: '#4F46E5', // Indigo
          research: '#0891B2',   // Cyan
          analyst: '#7C3AED',    // Purple
          purchase: '#0070BA',   // PayPal Blue
          guardrail: '#059669',  // Emerald Mint
        },
      },
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1.125rem' }], // 13px
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px (lifted from 12px)
        'sm': ['1rem', { lineHeight: '1.5rem' }],         // 16px (lifted from 14px)
        'base': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px (lifted from 16px)
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px (lifted from 18px)
        'xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px (lifted from 20px)
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px (lifted from 24px)
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px (lifted from 30px)
        '4xl': ['2.75rem', { lineHeight: '1.1' }],        // 44px (lifted from 36px)
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'fintech-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'fintech-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'fintech-glow': '0 0 16px rgba(0, 112, 186, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
