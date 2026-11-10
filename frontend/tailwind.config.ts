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
